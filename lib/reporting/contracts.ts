import { siteRoute } from "../site/config.mjs"
export const LIMITS = { files: 6, fileBytes: 10 * 1024 * 1024, totalBytes: 30 * 1024 * 1024, pins: 8, events: 40 } as const
export const MEDIA_TYPES = ["image/png", "image/jpeg", "image/webp", "video/mp4", "video/webm"] as const
export type ReportKind = "bug" | "request"
export type ReportStatus = "received" | "planned" | "in_progress" | "resolved" | "declined"
export type Pin = { path: string; tag: string; x: number; y: number }
export type DiagnosticEvent = { at: string; kind: string; message: string }
export type Diagnostics = { environment?: Record<string, string | number | boolean>; console?: DiagnosticEvent[]; network?: DiagnosticEvent[]; actions?: DiagnosticEvent[] }
export type AttachmentManifest = { id: string; name: string; type: string; size: number; sha256: string }
export type ReportPayload = { id: string; kind: ReportKind; title: string; description: string; email: string; references: string[]; pins: Pin[]; attachments: AttachmentManifest[]; diagnostics: Diagnostics | null; topicId?: string }
export type Receipt = { id: string; token: string; status: ReportStatus; topicId: string | null; componentUrl?: string; email: "pending" | "sent" | "setup_required" | "needs_review"; emailDelivery?: string; issue: "pending" | "created" | "setup_required" | "needs_review"; issueDelivery?: string; attachments: { id: string; state: string }[] }
export type RequestTopic = { id: string; title: string; status: ReportStatus; componentUrl: string | null; createdAt: number; updatedAt: number; demand: number }
export type ComponentMatch = { name: string; title: string; description: string }
const UUID = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i
export function isUUID(value: unknown): value is string { return typeof value === "string" && UUID.test(value); }
const envKeys = new Set(["appVersion", "userAgent", "platform", "language", "timezone", "viewport", "screen", "pixelRatio", "online", "theme", "reducedMotion", "touchPoints", "hardwareConcurrency", "deviceMemory", "connection", "page", "capturedAt"])
function object(v: unknown): Record<string, unknown> { if (!v || typeof v !== "object" || Array.isArray(v)) throw new Error("Invalid report object."); return v as Record<string, unknown>; }
function text(v: unknown, field: string, max: number, min = 0): string { if (typeof v !== "string" || v.trim().length < min || v.length > max) throw new Error(`${field} must contain ${min}–${max} characters.`); return v.trim(); }
function list(v: unknown, field: string, max: number): unknown[] { if (!Array.isArray(v) || v.length > max) throw new Error(`${field} allows up to ${max} items.`); return v; }
function keys(v: Record<string, unknown>, allowed: string[], field: string) { if (Object.keys(v).some(k => !allowed.includes(k))) throw new Error(`Unsupported ${field} field.`); }
export function safeReference(v: unknown): string { const value = text(v, "Reference link", 2000, 1); try { const u = new URL(value); if (!["https:", "http:"].includes(u.protocol) || u.username || u.password) throw new Error(); return u.href; } catch { throw new Error("Reference links must be valid http or https addresses without credentials."); } }
export function validateReport(raw: unknown): ReportPayload {
  const v = object(raw)
  keys(v, ["id", "kind", "title", "description", "email", "references", "pins", "attachments", "diagnostics", "topicId"], "report")
  if (!isUUID(v.id)) throw new Error("Invalid report ID.")
  if (v.kind !== "bug" && v.kind !== "request") throw new Error("Choose a bug report or component request.")
  const email = text(v.email, "Email", 254, 3).toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || /[\r\n]/.test(email)) throw new Error("Enter a valid email address.")
  const pins = list(v.pins, "Element pins", LIMITS.pins).map(rawPin => {
    const p = object(rawPin); keys(p, ["path", "tag", "x", "y"], "pin")
    const path = text(p.path, "Element pin", 600, 1)
    if (!/^[a-z0-9 >():-]+$/.test(path) || !/^[a-z][a-z0-9]*(?::nth-of-type\(\d+\))?(?: > [a-z][a-z0-9]*(?::nth-of-type\(\d+\))?)*$/.test(path)) throw new Error("Invalid structural element pin.")
    const tag = text(p.tag, "Element tag", 30, 1); if (!/^[a-z][a-z0-9-]*$/.test(tag)) throw new Error("Invalid element pin tag.")
    if (![p.x, p.y].every(n => typeof n === "number" && Number.isFinite(n) && n >= 0 && n <= 100000)) throw new Error("Invalid element pin position.")
    return { path, tag, x: p.x as number, y: p.y as number }
  })
  const attachments = list(v.attachments, "Attachments", LIMITS.files).map(rawFile => {
    const f = object(rawFile); keys(f, ["id", "name", "type", "size", "sha256"], "attachment")
    if (!isUUID(f.id) || typeof f.sha256 !== "string" || !/^[a-f0-9]{64}$/.test(f.sha256)) throw new Error("Invalid attachment identity.")
    if (!(MEDIA_TYPES as readonly unknown[]).includes(f.type)) throw new Error("Use PNG, JPEG, WebP, MP4 or WebM files.")
    if (typeof f.size !== "number" || !Number.isInteger(f.size) || f.size < 1 || f.size > LIMITS.fileBytes) throw new Error("Each attachment must be at most 10 MiB.")
    return { id: f.id, name: text(f.name, "Filename", 160, 1).replace(/[\x00-\x1f/\\]/g, "_"), type: f.type as string, size: f.size, sha256: f.sha256 }
  })
  if (new Set(attachments.map(f => f.id)).size !== attachments.length) throw new Error("Attachment IDs must be unique.")
  if (attachments.reduce((n, f) => n + f.size, 0) > LIMITS.totalBytes) throw new Error("Attachments must total at most 30 MiB.")
  let diagnostics: Diagnostics | null = null
  if (v.diagnostics != null) {
    const d = object(v.diagnostics); keys(d, ["environment", "console", "network", "actions"], "diagnostic"); diagnostics = {}
    if (d.environment !== undefined) {
      const env = object(d.environment); diagnostics.environment = {}
      for (const [key, val] of Object.entries(env)) {
        if (!envKeys.has(key) || !["string", "number", "boolean"].includes(typeof val) || (typeof val === "number" && !Number.isFinite(val))) throw new Error("Unsupported diagnostic environment field.")
        diagnostics.environment[key] = typeof val === "string" ? redact(text(val, "Diagnostic detail", 1000)) : val as number | boolean
      }
    }
    for (const group of ["console", "network", "actions"] as const) {
      if (d[group] === undefined) continue
      diagnostics[group] = list(d[group], "Diagnostic events", LIMITS.events).map(rawEvent => {
        const e = object(rawEvent); keys(e, ["at", "kind", "message"], "diagnostic")
        return { at: text(e.at, "Event time", 40), kind: text(e.kind, "Event kind", 30), message: redact(text(e.message, "Event detail", 1000)) }
      })
    }
  }
  if (v.topicId !== undefined && (!isUUID(v.topicId) || v.kind !== "request")) throw new Error("Invalid request reference.")
  return { id: v.id, kind: v.kind, title: text(v.title, "Title", 120, 3), description: text(v.description, "Details", 6000, 1), email, references: list(v.references, "Reference links", 8).map(safeReference), pins, attachments, diagnostics, ...(v.topicId ? { topicId: v.topicId as string } : {}) }
}
export function redact(value: string): string {
  return value.replace(/https?:\/\/[^\s)"'<>]+/gi, url => safeRoute(url))
    .replace(/\bBearer\s+[^\s,;"'}]+/gi, "Bearer [redacted]")
    .replace(/\b(?:sk-|gh[pousr]_)[A-Za-z0-9_-]{8,}/g, "[redacted]")
    .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, "[email]")
    .replace(/((?:token|password|secret|authorization|api[_-]?key|cookie)\s*["']?\s*[=:]\s*)(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|[^\s,;}]+)/gi, "$1[redacted]")
    .replace(/\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g, "[redacted]")
    .replace(/\/(?:Users|home)\/[^\s/:]+/g, "/[user]").slice(0, 1000)
}
export function safeRoute(value: string): string {
  try {
    const u = new URL(value, "https://local.invalid")
    // Only this library's static public routes are permitted verbatim.
    if (/^\/(?:docs\/(?:[a-z][a-z0-9-]{0,60}\/?)?|requests\/?)$/.test(siteRoute(u.pathname)) || siteRoute(u.pathname) === "/") return u.pathname
    return u.pathname.split("/").map(p => p ? ":segment" : "").join("/").slice(0, 180)
  } catch { return "[route]"; }
}
export function matchesMedia(bytes: Uint8Array, type: string): boolean {
  const start = (values: number[]) => values.every((n, i) => bytes[i] === n)
  if (type === "image/png") return start([137,80,78,71,13,10,26,10])
  if (type === "image/jpeg") return start([255,216,255])
  if (type === "image/webp") return new TextDecoder().decode(bytes.slice(0,4)) === "RIFF" && new TextDecoder().decode(bytes.slice(8,12)) === "WEBP"
  if (type === "video/webm") return start([26,69,223,163])
  return type === "video/mp4" && new TextDecoder().decode(bytes.slice(4,8)) === "ftyp"
}
export function findComponents(query: string, entries: ComponentMatch[]): ComponentMatch[] {
  const words = query.toLowerCase().replace(/[^a-z0-9 -]/g, " ").split(/[\s-]+/).filter(w => w.length > 1 && !new Set(["want","need","would","like","the","with","for","and","component","please","can","have","this","that","some"]).has(w))
  if (!words.length) return []
  return entries.map(entry => ({ entry, score: words.reduce((n, word) => n + (`${entry.name} ${entry.title}`.toLowerCase().split(/[\s-]+/).includes(word) ? 3 : entry.description.toLowerCase().includes(word) ? 1 : 0), 0) })).filter(v => v.score >= Math.min(words.length, 2) * 2).sort((a,b) => b.score - a.score).slice(0, 4).map(v => v.entry)
}
