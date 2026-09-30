"use client"

import * as React from "react"
import { emptyDraft, loadDraftWorkspace, saveDraftWorkspace, type ReportingDraft, type ReportingDraftWorkspace } from "@/lib/reporting/draft"
import { isUUID, type ComponentMatch, type ReportKind } from "@/lib/reporting/contracts"

const fresh = (kind: ReportKind): ReportingDraft => ({ ...emptyDraft(), kind })

/** The shared draft client owns storage. This hook only coordinates the two visible forms and ordered saves. */
export function useReportingWorkspace(entries: ComponentMatch[], href?: string) {
  const [draft, setDraft] = React.useState(() => fresh("bug"))
  const [loaded, setLoaded] = React.useState(false)
  const [storage, setStorage] = React.useState("")
  const [notice, setNotice] = React.useState("")
  const current = React.useRef<ReportingDraftWorkspace>({ activeKind: "bug", drafts: {} })
  const prefill = React.useRef<Partial<ReportingDraft> | null>(null)
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const queue = React.useRef(Promise.resolve())
  const dirty = React.useRef(false)

  const persist = React.useCallback(() => {
    if (timer.current) clearTimeout(timer.current)
    if (!dirty.current) return Promise.resolve()
    const snapshot = current.current
    const next = queue.current.then(() => saveDraftWorkspace(snapshot))
    queue.current = next.catch(() => {})
    return next.then(() => {
      if (current.current === snapshot) { dirty.current = false; setStorage("Saved on this device.") }
    }).catch(() => {
      setStorage("Couldn’t save on this device. Keep this page open; reloading may lose your draft or receipt.")
    })
  }, [])

  const replace = React.useCallback((value: ReportingDraft) => {
    current.current = { activeKind: value.kind, drafts: { ...current.current.drafts, [value.kind]: value } }
    dirty.current = true
    setDraft(value)
    setStorage("Saving on this device…")
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => void persist(), 250)
  }, [persist])

  React.useEffect(() => {
    let active = true
    const load = async () => {
      let saved: ReportingDraftWorkspace | null = null
      try { saved = await loadDraftWorkspace() }
      catch { if (active) setStorage("Local storage is unavailable. Keep this page open to keep your draft.") }
      if (!active) return
      const params = new URL(href ?? window.location.href, window.location.origin).searchParams
      const kind = params.get("kind") === "request" ? "request" : params.get("kind") === "bug" || params.has("item") ? "bug" : saved?.activeKind ?? "bug"
      const item = entries.find((entry) => entry.name === params.get("item"))
      const topic = params.get("topic")
      const title = params.get("title")?.slice(0, 120)
      const values: Partial<ReportingDraft> = item
        ? { title: `Issue with ${item.title}`.slice(0, 120), description: `Component: https://0db.cojeev.com/docs/${item.name}/\n\n` }
        : kind === "request" && title ? { title, ...(isUUID(topic) ? { topicId: topic } : {}) } : {}
      prefill.current = Object.keys(values).length ? { ...values, kind } : null
      let value = saved?.drafts[kind] ?? fresh(kind)
      if (prefill.current) {
        if (!value.title && !value.description && !value.attempted && !value.receipt) value = { ...value, ...values }
        else setNotice("Your saved draft is open. Clear it below to start from the link you followed.")
      }
      current.current = { activeKind: kind, drafts: { ...saved?.drafts, [kind]: value } }
      setDraft(value)
      setLoaded(true)
    }
    void load()
    return () => { active = false }
  }, [entries, href])

  React.useEffect(() => {
    if (!loaded) return
    const save = () => void persist()
    window.addEventListener("pagehide", save)
    return () => { window.removeEventListener("pagehide", save); void persist() }
  }, [loaded, persist])

  const select = (kind: ReportKind) => {
    replace(current.current.drafts[kind] ?? fresh(kind))
    setNotice("")
  }
  const clear = () => {
    replace({ ...fresh(draft.kind), ...(prefill.current?.kind === draft.kind ? prefill.current : {}) })
    prefill.current = null
    setNotice("")
    void persist()
  }
  return { draft, loaded, storage, notice, replace, persist, select, clear }
}
