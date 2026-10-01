import { SITE_URL } from "../../../lib/site/config.mjs"
import { isUUID, LIMITS, matchesMedia, redact, validateReport, type Receipt, type ReportStatus } from "../../../lib/reporting/contracts"
import { boundedBody, checkAbuse, digest, equalSecret, HttpError, keyedDigest, readJSON } from "./security"
import { emailEnabled, githubEnabled, now, type Env, type ReportRow, type AttachmentRow, type Delivery } from "./types"
import { testerAllowed } from './resend'

export async function getReport(env: Env, id: string) {
  if(!isUUID(id)) throw new HttpError(404,"Report not found.")
  const row=await env.DB.prepare("SELECT * FROM reports WHERE id=?").bind(id).first<ReportRow>()
  if(!row) throw new HttpError(404,"Report not found."); return row
}
export async function authorizeReceipt(request: Request, env: Env, id: string) {
  const row=await getReport(env,id); const token=(request.headers.get("Authorization")??"").replace(/^Bearer /,"")
  if(!/^[a-f0-9]{64}$/.test(token) || !await equalSecret(await digest(token),row.token_hash)) throw new HttpError(404,"Report not found.")
  return {row,token}
}
export async function receipt(env: Env, row: ReportRow, token: string): Promise<Receipt & {emailDelivery:string}> {
  const [files,jobs]=await Promise.all([env.DB.prepare("SELECT id,state FROM attachments WHERE report_id=?").bind(row.id).all<{id:string;state:string}>(),env.DB.prepare("SELECT kind,state,delivery_status FROM outbox WHERE report_id=?").bind(row.id).all<Delivery>()])
  const email=jobs.results.find(j=>j.kind==="email_received"); const github=jobs.results.find(j=>j.kind==="github")
  return {id:row.id,token,status:row.status,topicId:row.topic_id,...(row.kind==="request"&&row.status==="resolved"&&row.component_url?{componentUrl:row.component_url}:{}),
    emailDelivery:email?.state==='held'?'held':email?.delivery_status??'queued',
    email:email?.delivery_status==='delivered'?"sent":email?.state==="needs_review"||['failed','bounced'].includes(email?.delivery_status??'')?"needs_review":!emailEnabled(env)?"setup_required":"pending",
    issue:row.issue_number?"created":github?.state==="needs_review"?"needs_review":!githubEnabled(env)?"setup_required":"pending",
    // The legacy enum collapses held into pending. Carry the job's own state so the receipt can say which it is; a missing job claims nothing.
    issueDelivery:github?.state,attachments:files.results}
}
export async function accept(request: Request, env: Env): Promise<{receipt:Receipt;fresh:boolean}> {
  const raw=await readJSON(request) as {report?:unknown;token?:unknown;turnstileToken?:unknown}
  if(!raw || typeof raw!=="object" || typeof raw.token!=="string" || !/^[a-f0-9]{64}$/.test(raw.token)) throw new HttpError(422,"A valid private receipt token is required.")
  let report; try { report=validateReport(raw.report); } catch(error) { throw new HttpError(422,error instanceof Error?error.message:"Invalid report."); }
  if(!testerAllowed(env,report.email)) throw new HttpError(403,'Reporting access is limited to invited beta testers.')
  if(report.kind==="request" && redact(report.title)!==report.title) throw new HttpError(422,"Keep email addresses, links and secrets out of the public request title.")
  const tokenHash=await digest(raw.token); const payloadHash=await digest(JSON.stringify(report))
  const existing=await env.DB.prepare("SELECT * FROM reports WHERE id=?").bind(report.id).first<ReportRow>()
  if(existing) {
    if(!await equalSecret(tokenHash,existing.token_hash)) throw new HttpError(409,"This report ID is already in use. Start a new report.")
    if(existing.payload_hash!==payloadHash) throw new HttpError(409,"This report was already saved with different details. Start a new report to add new details.")
    return {receipt:await receipt(env,existing,raw.token),fresh:false}
  }
  await checkAbuse(request,env,raw.turnstileToken,report.id)
  // Retain only a keyed identity for distinct demand after the contact expires.
  const contactHash=await keyedDigest(env.IP_HASH_SECRET??"local-only",`report-contact:${report.email}`)
  const timestamp=now()
  let topicId:string|null=null, topicKey:string|null=null
  if(report.kind==="request") {
    if(report.topicId) {
      const topic=await env.DB.prepare("SELECT id FROM topics WHERE id=?").bind(report.topicId).first<{id:string}>()
      if(!topic) throw new HttpError(422,"That request no longer exists. Start a new request.");topicId=topic.id
    } else topicKey=report.title.normalize("NFKC").toLowerCase().replace(/[^\p{L}\p{N}]+/gu," ").trim()
  }
  const statements=[]
  if(topicKey!==null) statements.push(env.DB.prepare("INSERT OR IGNORE INTO topics(id,title,title_key,created_at,updated_at) VALUES(?,?,?,?,?)").bind(report.id,report.title,topicKey,timestamp,timestamp))
  statements.push(env.DB.prepare(`INSERT INTO reports(id,token_hash,payload_hash,kind,title,description,email,contact_hash,references_json,diagnostics_json,pins_json,topic_id,status,component_url,created_at,updated_at)
    VALUES(?,?,?,?,?,?,?,?,?,?,?,COALESCE(?,(SELECT id FROM topics WHERE title_key=?)),COALESCE((SELECT status FROM topics WHERE id=COALESCE(?,(SELECT id FROM topics WHERE title_key=?))),'received'),(SELECT component_url FROM topics WHERE id=COALESCE(?,(SELECT id FROM topics WHERE title_key=?))),?,?)`)
    .bind(report.id,tokenHash,payloadHash,report.kind,report.title,report.description,report.email,contactHash,JSON.stringify(report.references),report.diagnostics?JSON.stringify(report.diagnostics):null,JSON.stringify(report.pins),topicId,topicKey,topicId,topicKey,topicId,topicKey,timestamp,timestamp))
  for(const file of report.attachments) statements.push(env.DB.prepare("INSERT INTO attachments(id,report_id,name,type,size,sha256,object_key) VALUES(?,?,?,?,?,?,?)").bind(file.id,report.id,file.name,file.type,file.size,file.sha256,`${report.id}/${file.id}`))
  for(const kind of ["github","email_received"]) statements.push(env.DB.prepare("INSERT INTO outbox(id,report_id,kind,due_at,created_at) VALUES(?,?,?,?,?)").bind(`${report.id}:${kind}`,report.id,kind,timestamp,timestamp))
  try { await env.DB.batch(statements); }
  catch(error) {
    // A simultaneous retry may have won the unique ID race. Never manufacture a second record.
    const saved=await env.DB.prepare("SELECT * FROM reports WHERE id=?").bind(report.id).first<ReportRow>()
    if(saved && saved.token_hash===tokenHash && saved.payload_hash===payloadHash) return {receipt:await receipt(env,saved,raw.token),fresh:false}
    throw error
  }
  return {receipt:await receipt(env,await getReport(env,report.id),raw.token),fresh:true}
}
export async function upload(request: Request, env: Env, reportId: string, fileId: string) {
  const {row}=await authorizeReceipt(request,env,reportId)
  if(row.technical_purged || now()-row.created_at>30*86400000) throw new HttpError(410,"This report's attachment window has expired. Its text is still saved.")
  const file=await env.DB.prepare("SELECT * FROM attachments WHERE report_id=? AND id=?").bind(reportId,fileId).first<AttachmentRow>()
  if(!file) throw new HttpError(404,"Attachment slot not found.")
  if(request.headers.get("Content-Type")!==file.type) throw new HttpError(422,"The file type does not match the saved attachment.")
  const bytes=await boundedBody(request,Math.min(file.size,LIMITS.fileBytes))
  if(bytes.byteLength!==file.size || await digest(bytes)!==file.sha256 || !matchesMedia(new Uint8Array(bytes),file.type)) throw new HttpError(422,"The attachment changed or is not a supported image or video. The text report is already saved.")
  await env.MEDIA.put(file.object_key,bytes,{httpMetadata:{contentType:file.type},customMetadata:{sha256:file.sha256}})
  let saved
  try {
    // Cleanup may delete the slot while a slow upload is writing R2. Finalize
    // only while the report is eligible, or remove the object just written.
    saved=await env.DB.prepare("UPDATE attachments SET state='uploaded' WHERE report_id=? AND id=? AND EXISTS (SELECT 1 FROM reports WHERE id=? AND technical_purged=0 AND created_at>=?) RETURNING id")
      .bind(reportId,fileId,reportId,now()-30*86400000).first<{id:string}>()
  } catch(error) {
    // A transient finalization error must not erase eligible media from a
    // previously successful upload. Immutable report age proves expiry.
    if(now()-row.created_at>30*86400000) await env.MEDIA.delete(file.object_key)
    throw error
  }
  if(!saved) {
    await env.MEDIA.delete(file.object_key)
    throw new HttpError(410,"This report's attachment window has expired. Its text is still saved.")
  }
  return {ok:true}
}
export async function listRequests(env: Env, url: URL) {
  const offset=Math.max(0,Math.min(100000,Number.parseInt(url.searchParams.get("offset")??"0")||0))
  const q=(url.searchParams.get("q")??"").slice(0,120).replace(/[\\%_]/g,"\\$&")
  const rows=await env.DB.prepare(`SELECT t.id,COALESCE(t.public_title,'Component request '||substr(t.id,1,8)) AS title,t.status,t.component_url AS componentUrl,t.created_at AS createdAt,t.updated_at AS updatedAt,COUNT(DISTINCT r.contact_hash) AS demand FROM topics t LEFT JOIN reports r ON r.topic_id=t.id WHERE COALESCE(t.public_title,'Component request '||substr(t.id,1,8)) LIKE ? ESCAPE '\\' GROUP BY t.id ORDER BY t.created_at DESC,t.id LIMIT 21 OFFSET ?`).bind(`%${q}%`,offset).all()
  return {requests:rows.results.slice(0,20),hasMore:rows.results.length>20}
}
export function componentURL(value: unknown, env: Env): string {
  try {
    const url=new URL(String(value)),site=new URL(env.SITE_URL)
    const docsPath=site.pathname.replace(/\/$/, "")+"/docs/"
    const slug=url.pathname.startsWith(docsPath)?url.pathname.slice(docsPath.length):""
    const localHTTP=env.LOCAL_MODE==="true"&&url.origin==="http://localhost:3000"&&site.origin===url.origin
    if((site.href.replace(/\/$/, "")!==SITE_URL&&!localHTTP) || url.origin!==site.origin || !/^[a-z][a-z0-9-]{0,60}\/?$/.test(slug) || url.username || url.password || url.search || url.hash) throw new Error()
    return url.href
  }
  catch { throw new HttpError(422,"Choose a live component URL under this library's /docs/ path."); }
}
export async function setStatus(env: Env, row: ReportRow, status: unknown, link: unknown) {
  if(!["received","planned","in_progress","resolved","declined"].includes(String(status))) throw new HttpError(422,"Choose a valid report status.")
  const resolved=status==="resolved"
  const url=resolved && row.kind==="request"?componentURL(link ?? row.component_url,env):null
  if(row.status===status && row.component_url===url) return
  const timestamp=now();const statements=[]
  const condition=row.topic_id?"topic_id=?":"id=?";const scope=row.topic_id ?? row.id
  if(row.topic_id) statements.push(env.DB.prepare("UPDATE topics SET status=?,component_url=?,updated_at=? WHERE id=?").bind(status,url,timestamp,row.topic_id))
  statements.push(env.DB.prepare(`UPDATE reports SET status=?,component_url=?,updated_at=? WHERE ${condition}`).bind(status,url,timestamp,scope))
  if(resolved) statements.push(env.DB.prepare(`INSERT OR IGNORE INTO outbox(id,report_id,kind,due_at,created_at) SELECT id||':email_resolved',id,'email_resolved',?,? FROM reports WHERE ${condition} AND email<>''`).bind(timestamp,timestamp,scope))
  await env.DB.batch(statements)
}
export async function privateDetail(env: Env,id:string) {
  const row=await getReport(env,id)
  const {token_hash: _token, payload_hash:_payload, contact_hash:_contact, ...report}=row; void _token; void _payload; void _contact
  const [files,jobs]=await Promise.all([env.DB.prepare("SELECT id,name,type,size,state FROM attachments WHERE report_id=?").bind(id).all(),env.DB.prepare("SELECT id,kind,state,attempts,last_error,provider_id,delivery_status,first_attempt_at,reviewed_at FROM outbox WHERE report_id=? ORDER BY created_at").bind(id).all()])
  return {report,attachments:files.results,deliveries:jobs.results}
}
export async function privateAttachment(env: Env,id:string,fileId:string) {
  await getReport(env,id);const file=await env.DB.prepare("SELECT * FROM attachments WHERE report_id=? AND id=? AND state='uploaded'").bind(id,fileId).first<AttachmentRow>()
  if(!file) throw new HttpError(404,"Attachment not found or expired.")
  const object=await env.MEDIA.get(file.object_key);if(!object) throw new HttpError(410,"This attachment has expired.")
  return new Response(object.body as unknown as ReadableStream,{headers:{"Content-Type":file.type,"Content-Disposition":`attachment; filename*=UTF-8''${encodeURIComponent(file.name)}`,"Cache-Control":"no-store","X-Content-Type-Options":"nosniff"}})
}
export const knownStatus = (s: unknown): s is ReportStatus => ["received","planned","in_progress","resolved","declined"].includes(String(s))
