import { LIMITS, MEDIA_TYPES, matchesMedia, type AttachmentManifest, type Receipt, type ReportPayload } from "./contracts"

export const REPORTING_API = (process.env.NEXT_PUBLIC_REPORTING_API_URL ?? "").replace(/\/$/, "")
export const REPORTING_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ""
export type ReportingConfig = { emailEnabled: boolean; turnstileSiteKey: string; local: boolean }
export type ReportFile = { id: string; file: File }
export type FrozenSubmission = { report: ReportPayload; token: string }

export class ReportingError extends Error {
  constructor(message: string, public status = 0) { super(message); this.name = "ReportingError"; }
}
/** A first definite client rejection has not accepted this report. Ambiguous retries stay frozen. */
export function canEditRejectedSubmission(error: unknown, previouslyAttempted: boolean): boolean {
  return !previouslyAttempted && error instanceof ReportingError && error.status >= 400 && error.status < 500 && error.status !== 408 && error.status !== 409
}
export async function reportingFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!REPORTING_API) throw new ReportingError("Reporting is not connected yet. Your draft stays on this device.")
  let response: Response
  try { response = await fetch(`${REPORTING_API}${path}`, { ...init, cache: "no-store", credentials: "omit", signal: init.signal ?? AbortSignal.timeout(30000) }); }
  catch { throw new ReportingError("The connection was interrupted. Retry uses the same report, so it will not create a duplicate."); }
  if (!response.ok) {
    const detail = await response.json().catch(() => null) as { error?: string } | null
    throw new ReportingError(detail?.error || (response.status === 429 ? "Too many attempts. Please wait a minute before retrying." : `The report service returned ${response.status}. Please retry.`), response.status)
  }
  return response.json() as Promise<T>
}
export function receiptSecret(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)), n => n.toString(16).padStart(2, "0")).join("")
}
export async function manifestFiles(files: ReportFile[]): Promise<AttachmentManifest[]> {
  if (files.length > LIMITS.files) throw new Error("Attach up to six files.")
  if (files.reduce((sum, item) => sum + item.file.size, 0) > LIMITS.totalBytes) throw new Error("Attachments must total at most 30 MiB.")
  return Promise.all(files.map(async ({ id, file }) => {
    if (!(MEDIA_TYPES as readonly string[]).includes(file.type)) throw new Error(`${file.name}: use PNG, JPEG, WebP, MP4 or WebM.`)
    if (file.size < 1 || file.size > LIMITS.fileBytes) throw new Error(`${file.name}: each file must be between 1 byte and 10 MiB.`)
    const bytes = await file.arrayBuffer()
    if (!matchesMedia(new Uint8Array(bytes), file.type)) throw new Error(`${file.name} does not match its file type. Please choose the original image or video.`)
    const hash = await crypto.subtle.digest("SHA-256", bytes)
    return { id, name: file.name.slice(0, 160), type: file.type, size: file.size, sha256: Array.from(new Uint8Array(hash), n => n.toString(16).padStart(2, "0")).join("") }
  }))
}
export function submitReport(frozen: FrozenSubmission, turnstileToken: string): Promise<Receipt> {
  return reportingFetch("/v1/reports", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...frozen, turnstileToken }) })
}
export function fetchReceipt(id: string, token: string): Promise<Receipt> {
  return reportingFetch(`/v1/reports/${encodeURIComponent(id)}`, { headers: { Authorization: `Bearer ${token}` } })
}
export async function uploadAttachment(receipt: Receipt, item: ReportFile): Promise<void> {
  await reportingFetch(`/v1/reports/${receipt.id}/attachments/${item.id}`, { method: "PUT", headers: { Authorization: `Bearer ${receipt.token}`, "Content-Type": item.file.type }, body: item.file })
}
