import { boundedBody, equalSecret, HttpError } from './security'
import { now, type Env, type Delivery } from './types'
import { DeliveryFailure } from './delivery'

const DAY=86400000
const ceiling=(value:string|undefined,max:number)=>value===undefined?max:/^\d+$/.test(value)?Math.min(max,Number(value)):0
export function emailLimits(env:Env) {return {daily:ceiling(env.EMAIL_DAILY_LIMIT,env.ENVIRONMENT==='beta'?5:100),monthly:ceiling(env.EMAIL_MONTHLY_LIMIT,3000)};}
export function testerAllowed(env:Env,email:string) {return env.ENVIRONMENT!=='beta'||(env.BETA_TESTER_EMAILS??'tester@example.com').split(',').map(v=>v.trim().toLowerCase()).includes(email.toLowerCase());}

export async function sendResend(env:Env,job:Delivery,payload:string,send=fetch) {
  // Store the exact body before contacting the provider. A later template/config edit
  // must never pair a different payload with the same provider idempotency key.
  await env.DB.prepare('UPDATE outbox SET payload_json=? WHERE id=? AND payload_json IS NULL').bind(payload,job.id).run()
  const saved=await env.DB.prepare('SELECT * FROM outbox WHERE id=?').bind(job.id).first<Delivery>()
  if(!saved||saved.payload_json!==payload) throw new DeliveryFailure('Email payload changed; provider reconciliation required.',false,true)
  if(saved.first_attempt_at!==null&&now()-saved.first_attempt_at>=DAY) throw new DeliveryFailure('Email idempotency window expired; provider reconciliation required.',false,true)
  if(saved.provider_id) return saved.provider_id
  const time=now(),date=new Date(time),day=Math.floor(time/DAY)*DAY,month=Date.UTC(date.getUTCFullYear(),date.getUTCMonth(),1),limits=emailLimits(env)
  // One atomic SQLite statement reserves both UTC ceilings, including concurrent drains.
  // Count attempts conservatively, including rejected or uncertain provider requests.
  const reservation=await env.DB.prepare(`INSERT INTO email_attempts(id,job_id,attempted_at) SELECT ?,?,? WHERE
    (SELECT COUNT(*) FROM email_attempts WHERE attempted_at>=?)<? AND
    (SELECT COUNT(*) FROM email_attempts WHERE attempted_at>=?)<? RETURNING id`).bind(crypto.randomUUID(),job.id,time,day,limits.daily,month,limits.monthly).first()
  if(!reservation) throw new DeliveryFailure('Email quota exhausted; job retained.',false,false,true)
  await env.DB.prepare("UPDATE outbox SET first_attempt_at=COALESCE(first_attempt_at,?),delivery_status='sending' WHERE id=?").bind(time,job.id).run()
  let response:Response
  try {response=await send('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${env.RESEND_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':`0db/${job.id}`},body:saved.payload_json,signal:AbortSignal.timeout(15000)});}
  catch {throw new DeliveryFailure('Email response unavailable; check provider before retrying.',true);}
  if(response.status===429) throw new DeliveryFailure('Email provider quota exhausted; job retained.',false,false,true)
  if(response.status===409) throw new DeliveryFailure('Email idempotency conflict; provider reconciliation required.',false,true)
  if(!response.ok) throw new DeliveryFailure('Email provider rejected the request.',response.status>=500,response.status<500)
  let id:unknown
  try {id=(JSON.parse(new TextDecoder().decode(await boundedBody(response,16384))) as {id?:unknown}).id;} catch {throw new DeliveryFailure('Email acceptance could not be confirmed.',true);}
  if(typeof id!=='string'||!id||id.length>200) throw new DeliveryFailure('Email acceptance could not be confirmed.',true)
  await env.DB.prepare("UPDATE outbox SET provider_id=?,delivery_status='accepted' WHERE id=?").bind(id,job.id).run()
  await reconcileEmail(env,id)
  return id
}

export async function reconcileEmail(env:Env,providerId:string) {
  // Failure beats delivered, delivered beats acceptance; event arrival order cannot
  // turn a bounced email back into a success. Events can arrive before the API reply.
  await env.DB.prepare(`UPDATE outbox SET delivery_status=(SELECT status FROM email_events WHERE provider_id=?
    ORDER BY CASE status WHEN 'bounced' THEN 4 WHEN 'failed' THEN 3 WHEN 'delivered' THEN 2 ELSE 1 END DESC,event_at DESC LIMIT 1)
    WHERE provider_id=? AND kind LIKE 'email_%' AND EXISTS(SELECT 1 FROM email_events WHERE provider_id=?)`).bind(providerId,providerId,providerId).run()
}

export async function resendWebhook(request:Request,env:Env) {
  const invalid=()=>new HttpError(401,'Webhook not accepted.')
  const raw=new TextDecoder().decode(await boundedBody(request,262144))
  const id=request.headers.get('svix-id')??'',timestamp=request.headers.get('svix-timestamp')??'',signatures=request.headers.get('svix-signature')??''
  if(!env.RESEND_WEBHOOK_SECRET?.startsWith('whsec_')||!/^[-\w]{1,200}$/.test(id)||!/^\d{10}$/.test(timestamp)||Math.abs(now()/1000-Number(timestamp))>300||signatures.length>4096) throw invalid()
  let verified=false
  try {
    const key=await crypto.subtle.importKey('raw',Uint8Array.from(atob(env.RESEND_WEBHOOK_SECRET.slice(6)),c=>c.charCodeAt(0)),{name:'HMAC',hash:'SHA-256'},false,['sign'])
    const digest=new Uint8Array(await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(`${id}.${timestamp}.${raw}`)))
    const expected=btoa(String.fromCharCode(...digest))
    for(const signature of signatures.split(' ')) if(signature.startsWith('v1,')&&await equalSecret(signature.slice(3),expected)) verified=true
  } catch {throw invalid();}
  if(!verified) throw invalid()
  let body:{type?:string;created_at?:string;data?:{email_id?:string}}
  try {body=JSON.parse(raw);if(!body||typeof body!=='object'||Array.isArray(body)) throw new Error();} catch {throw new HttpError(400,'Webhook not accepted.');}
  const statuses:Record<string,string>={'email.sent':'accepted','email.delivered':'delivered','email.bounced':'bounced','email.failed':'failed','email.complained':'failed','email.suppressed':'failed'}
  const status=statuses[body.type??''],providerId=body.data?.email_id,eventAt=Date.parse(body.created_at??'')
  if(!status) return {ok:true}
  if(typeof providerId!=='string'||!providerId||providerId.length>200||!Number.isFinite(eventAt)) throw new HttpError(400,'Webhook not accepted.')
  await env.DB.prepare('INSERT OR IGNORE INTO email_events(id,provider_id,status,event_at,received_at) VALUES(?,?,?,?,?)').bind(id,providerId,status,eventAt,now()).run()
  await reconcileEmail(env,providerId)
  return {ok:true}
}
