import type { Env } from "./types"
export class HttpError extends Error { constructor(public status: number, message: string, public retryAfter?: number) { super(message); } }
export async function digest(value: string | ArrayBuffer): Promise<string> {
  return Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", typeof value === "string" ? new TextEncoder().encode(value) : value))).map(n => n.toString(16).padStart(2,"0")).join("")
}
export async function keyedDigest(secret: string, value: string): Promise<string> {
  const encoder=new TextEncoder()
  const key=await crypto.subtle.importKey("raw",encoder.encode(secret),{name:"HMAC",hash:"SHA-256"},false,["sign"])
  return Array.from(new Uint8Array(await crypto.subtle.sign("HMAC",key,encoder.encode(value)))).map(n=>n.toString(16).padStart(2,"0")).join("")
}
export async function equalSecret(a: string, b: string): Promise<boolean> {
  const [x,y] = await Promise.all([digest(a),digest(b)]); let mismatch = 0
  for(let i=0;i<x.length;i++) mismatch |= x.charCodeAt(i)^y.charCodeAt(i)
  return mismatch === 0
}
export async function requireAdmin(request: Request, env: Env) {
  if (!env.ADMIN_TOKEN || env.ADMIN_TOKEN.length < 32) throw new HttpError(503,"Maintainer access has not been configured.")
  if (!await equalSecret(request.headers.get("Authorization") ?? "", `Bearer ${env.ADMIN_TOKEN}`)) throw new HttpError(401,"Enter a valid maintainer access token.")
}
export async function boundedBody(request: Request | Response, max: number): Promise<ArrayBuffer> {
  if (Number(request.headers.get("Content-Length")) > max) throw new HttpError(413,"The upload is too large.")
  if (!request.body) return new ArrayBuffer(0)
  const reader = request.body.getReader(); const parts: Uint8Array[] = []; let size = 0
  for (;;) { const {done,value} = await reader.read(); if(done) break; size += value.byteLength; if(size>max) { await reader.cancel(); throw new HttpError(413,"The upload is too large."); } parts.push(value); }
  const bytes = new Uint8Array(size); let offset=0; for(const part of parts) { bytes.set(part,offset); offset += part.length; } return bytes.buffer
}
export async function readJSON(request: Request, max = 196608): Promise<unknown> {
  try { return JSON.parse(new TextDecoder().decode(await boundedBody(request,max))); } catch(e) { if(e instanceof HttpError) throw e; throw new HttpError(400,"Send a valid JSON report."); }
}
/** Configuration may restrict this list, but cannot add another product or local production origin. */
export function origins(env: Env) {
  const allowed = ["https://0db.cojeev.com", ...(env.LOCAL_MODE === "true" ? ["http://localhost:3000"] : [])]
  return [...new Set(env.ALLOWED_ORIGINS.split(",").map(v => v.trim()).filter(v => allowed.includes(v)))]
}
export function assertBrowserOrigin(request: Request, env: Env) {
  if (!origins(env).includes(request.headers.get("Origin") ?? "")) throw new HttpError(403,"This site is not enabled for reporting.")
}
export async function checkAbuse(request: Request, env: Env, token: unknown, id: string) {
  const isLocal = env.LOCAL_MODE === "true" && ["127.0.0.1","localhost","[::1]"].includes(new URL(request.url).hostname)
  if (!isLocal && (!env.TURNSTILE_SECRET || !env.IP_HASH_SECRET || env.IP_HASH_SECRET.length < 32)) throw new HttpError(503,"Reporting protection is not configured yet.")
  const ip = request.headers.get("CF-Connecting-IP") ?? "local"
  const slot = Math.floor(Date.now()/600000)
  const key = await digest(`${env.IP_HASH_SECRET ?? "local-only"}:${ip}:${slot}`)
  const rate = await env.DB.prepare("INSERT INTO rate_limits(key,count,expires_at) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1 RETURNING count").bind(key,(slot+1)*600000).first<{count:number}>()
  if ((rate?.count ?? 99) > 10) throw new HttpError(429,"Too many reports right now. Please try again later.",Math.ceil(((slot+1)*600000-Date.now())/1000))
  if(isLocal) return
  if(typeof token !== "string" || !token || token.length>2048) throw new HttpError(403,"Complete the security check and try again.")
  let result: { success?: boolean; hostname?: string; action?: string }
  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({secret:env.TURNSTILE_SECRET,response:token,remoteip:ip,idempotency_key:id}),signal:AbortSignal.timeout(10000)})
    result = await response.json()
  } catch { throw new HttpError(503,"The security check is temporarily unavailable. Your draft is still here."); }
  const hosts = origins(env).map(v=>new URL(v).hostname)
  if(!result.success || !result.hostname || !hosts.includes(result.hostname) || result.action !== "reporting") throw new HttpError(403,"The security check expired. Please try again.")
}
export async function verifyWebhook(request: Request, env: Env, body: ArrayBuffer) {
  if(!env.GITHUB_WEBHOOK_SECRET) throw new HttpError(503,"GitHub webhook is not configured.")
  const signature=request.headers.get("X-Hub-Signature-256") ?? ""
  if(!/^sha256=[a-f0-9]{64}$/.test(signature)) throw new HttpError(401,"Invalid webhook signature.")
  const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(env.GITHUB_WEBHOOK_SECRET),{name:"HMAC",hash:"SHA-256"},false,["verify"])
  const bytes=Uint8Array.from(signature.slice(7).match(/../g)!,v=>parseInt(v,16))
  if(!await crypto.subtle.verify("HMAC",key,bytes,body)) throw new HttpError(401,"Invalid webhook signature.")
}
