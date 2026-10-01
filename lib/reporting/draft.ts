import type { Diagnostics, Pin, Receipt, ReportKind } from "./contracts"
import type { FrozenSubmission, ReportFile } from "./client"

export type ReportingDraft = {
  kind: ReportKind; title: string; description: string; email: string; topicId?: string
  pins: Pin[]; files: ReportFile[]; diagnostics: Diagnostics | null
  frozen: FrozenSubmission | null; attempted: boolean; receipt: Receipt | null
}
export function emptyDraft(): ReportingDraft { return { kind: "request", title: "", description: "", email: "", pins: [], files: [], diagnostics: null, frozen: null, attempted: false, receipt: null }; }
const databaseName = "0db-reporting-v1"
/** Seven days since the last explicit save. Reads never extend retention. */
export const DRAFT_TTL_MS = 7 * 86400000
type Saved<T> = { expiresAt: number; value: T }
function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") { reject(new Error("Local draft storage is unavailable.")); return; }
    const request = indexedDB.open(databaseName, 1)
    request.onupgradeneeded = () => request.result.createObjectStore("drafts")
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error("Local draft storage is unavailable."))
    request.onblocked = () => reject(new Error("Local draft storage is blocked by another tab."))
  })
}
async function operation<T>(mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDatabase()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("drafts", mode)
    const request = action(transaction.objectStore("drafts"))
    transaction.oncomplete = () => { db.close(); resolve(request.result); }
    transaction.onerror = transaction.onabort = () => { db.close(); reject(transaction.error ?? new Error("Could not save this draft.")); }
  })
}
async function loadSaved<T>(key: string): Promise<T | null> {
  const saved = await operation<Saved<T> | undefined>("readwrite", store => {
    const request = store.get(key)
    request.onsuccess = () => {
      const entry = request.result as Saved<T> | undefined
      if (entry && (!Number.isFinite(entry.expiresAt) || entry.expiresAt <= Date.now())) store.clear()
    }
    return request
  })
  return saved && Number.isFinite(saved.expiresAt) && saved.expiresAt > Date.now() ? saved.value : null
}
export async function loadDraft(): Promise<ReportingDraft | null> { return loadSaved("current") }
export async function saveDraft(draft: ReportingDraft): Promise<void> {
  await operation("readwrite", store => store.put({ expiresAt: Date.now() + DRAFT_TTL_MS, value: draft }, "current"))
}
/** Clears both kinds, files, receipt credentials and the single-draft key. */
export async function deleteDraft(): Promise<void> { await operation("readwrite", store => store.clear()) }

export type ReportingDraftWorkspace = {
  activeKind: ReportKind
  drafts: Partial<Record<ReportKind, ReportingDraft>>
}

export async function loadDraftWorkspace(): Promise<ReportingDraftWorkspace | null> {
  const saved = await loadSaved<ReportingDraftWorkspace>("workspace")
  if (saved) return saved
  const legacy = await loadDraft()
  return legacy ? { activeKind: legacy.kind, drafts: { [legacy.kind]: legacy } } : null
}

export async function saveDraftWorkspace(workspace: ReportingDraftWorkspace): Promise<void> {
  // Migrate the old single draft atomically: never lose its files or retry key,
  // and do not leave a second private copy behind after a later clear.
  await operation("readwrite", store => {
    const request = store.put({ expiresAt: Date.now() + DRAFT_TTL_MS, value: workspace }, "workspace")
    store.delete("current")
    return request
  })
}
