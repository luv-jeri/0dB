import { componentURL, getReport, setStatus } from "./reports"
import { boundedBody, HttpError, verifyWebhook } from "./security"
import { now, type Env, type ReportRow, type AttachmentRow } from "./types"
import { redact } from '../../../lib/reporting/contracts'

export async function verifyLiveComponent(env:Env,value:unknown) {
  const url=componentURL(value,env)
  if(env.LOCAL_MODE==="true") return url
  try {
    const response=await fetch(url,{method:"HEAD",redirect:"manual",signal:AbortSignal.timeout(10000)})
    if(response.status!==200 || !(response.headers.get("Content-Type")??"").includes("text/html")) throw new Error()
    return url
  } catch { throw new HttpError(422,"That component page is not live yet. Publish it before notifying requesters."); }
}
export async function webhook(request:Request,env:Env) {
  const bytes=await boundedBody(request,262144);await verifyWebhook(request,env,bytes)
  const eventId=request.headers.get("X-GitHub-Delivery")??""
  if(!/^[a-f0-9-]{20,50}$/i.test(eventId)) throw new HttpError(400,"Missing webhook delivery ID.")
  if(await env.DB.prepare("SELECT id FROM webhook_events WHERE id=?").bind(eventId).first()) return {ok:true,duplicate:true}
  let body: {action?:string;repository?:{full_name?:string};issue?:{number?:number;state?:string;state_reason?:string;body?:string;updated_at?:string;labels?:{name:string}[]}}
  try { body=JSON.parse(new TextDecoder().decode(bytes)); } catch { throw new HttpError(400,"Invalid webhook body."); }
  if(request.headers.get("X-GitHub-Event")!=="issues" || body.repository?.full_name!==env.GITHUB_REPOSITORY) return {ok:true,ignored:true}
  const issue=body.issue
  if(!issue?.number || !["closed","labeled","edited"].includes(body.action??"") || issue.state!=="closed" || issue.state_reason!=="completed" || !issue.labels?.some(l=>l.name==="feedback:released")) return {ok:true,ignored:true}
  const row=await env.DB.prepare("SELECT * FROM reports WHERE issue_number=?").bind(issue.number).first<ReportRow>()
  if(!row) return {ok:true,ignored:true}
  const updated=Date.parse(issue.updated_at??"")
  if(!Number.isFinite(updated) || updated<row.updated_at-1000) return {ok:true,ignored:true}
  let url: string|null=null
  if(row.kind==="request") {
    const match=issue.body?.match(/^Component:\s*(https:\/\/\S+)\s*$/m)
    if(!match) throw new HttpError(422,"Add a Component: URL before releasing a component request.")
    url=await verifyLiveComponent(env,match[1])
  }
  await setStatus(env,row,"resolved",url)
  await env.DB.prepare("INSERT OR IGNORE INTO webhook_events(id,created_at) VALUES(?,?)").bind(eventId,now()).run()
  return {ok:true}
}
export async function cleanup(env:Env) {
  const technicalCutoff=now()-30*86400000
  const old=await env.DB.prepare("SELECT id FROM reports WHERE created_at<? AND technical_purged=0 LIMIT 100").bind(technicalCutoff).all<{id:string}>()
  for(const {id} of old.results) {
    const files=await env.DB.prepare("SELECT object_key FROM attachments WHERE report_id=?").bind(id).all<AttachmentRow>()
    for(const file of files.results) await env.MEDIA.delete(file.object_key)
    await env.DB.batch([env.DB.prepare("UPDATE reports SET diagnostics_json=NULL,pins_json='[]',technical_purged=1 WHERE id=?").bind(id),env.DB.prepare("DELETE FROM attachments WHERE report_id=?").bind(id)])
  }
  await env.DB.batch([
    env.DB.prepare("UPDATE outbox SET state='needs_review',last_error='Private contact details expired.' WHERE state='pending' AND report_id IN (SELECT id FROM reports WHERE created_at<?)").bind(now()-180*86400000),
    env.DB.prepare("UPDATE outbox SET payload_json=NULL WHERE report_id IN (SELECT id FROM reports WHERE created_at<?)").bind(now()-180*86400000),
    env.DB.prepare("UPDATE topics SET title='[Expired request]',title_key='retired:'||id WHERE created_at<?").bind(now()-180*86400000),
    env.DB.prepare("UPDATE reports SET email='',title='[Expired report]',description='[Expired after 180 days]',references_json='[]',private_purged=1 WHERE private_purged=0 AND created_at<?").bind(now()-180*86400000),
    env.DB.prepare("DELETE FROM rate_limits WHERE expires_at<?").bind(now()),
    env.DB.prepare("DELETE FROM webhook_events WHERE created_at<?").bind(now()-30*86400000)
  ])
  return {purged:old.results.length}
}
export async function updateFromAdmin(env:Env,id:string,raw:unknown) {
  if(!raw||typeof raw!=="object") throw new HttpError(422,"A status is required.")
  const body=raw as {status?:unknown;componentUrl?:unknown;publicTitle?:unknown};const row=await getReport(env,id)
  if(body.publicTitle!==undefined) {
    if(!row.topic_id||typeof body.publicTitle!=='string'||body.publicTitle.trim().length<3||body.publicTitle.length>120||redact(body.publicTitle)!==body.publicTitle) throw new HttpError(422,'Choose a safe public component title.')
    await env.DB.prepare('UPDATE topics SET public_title=?,updated_at=? WHERE id=?').bind(body.publicTitle.trim(),now(),row.topic_id).run()
    if(body.status===undefined) return {ok:true}
  }
  const url=body.status==="resolved" && row.kind==="request"?await verifyLiveComponent(env,body.componentUrl ?? row.component_url):null
  await setStatus(env,row,body.status,url)
  return {ok:true}
}
