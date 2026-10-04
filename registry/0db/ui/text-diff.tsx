"use client"

import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"

type DiffPart = { kind: "same" | "removed" | "added"; text: string }
/** Exact whitespace is retained. Large passages use one honest replacement between shared ends. */
function diffWords(original: string, revised: string): DiffPart[] {
  const a = original.match(/\S+\s*|\s+/gu) ?? []
  const b = revised.match(/\S+\s*|\s+/gu) ?? []
  let head = 0
  while (head < a.length && head < b.length && a[head] === b[head]) head++
  let tail = 0
  while (tail < a.length - head && tail < b.length - head && a[a.length - 1 - tail] === b[b.length - 1 - tail]) tail++
  const x = a.slice(head, a.length - tail), y = b.slice(head, b.length - tail)
  const parts: DiffPart[] = []
  const add = (kind: DiffPart["kind"], text: string) => {
    if (!text) return
    if (parts.at(-1)?.kind === kind) parts[parts.length - 1].text += text
    else parts.push({ kind, text })
  }
  add("same", a.slice(0, head).join(""))
  if (x.length * y.length > 250000) { add("removed", x.join("")); add("added", y.join("")) }
  else {
    const width = y.length + 1
    const lengths = new Uint32Array((x.length + 1) * width)
    for (let i = x.length - 1; i >= 0; i--) for (let j = y.length - 1; j >= 0; j--)
      lengths[i * width + j] = x[i] === y[j] ? 1 + lengths[(i + 1) * width + j + 1] : Math.max(lengths[(i + 1) * width + j], lengths[i * width + j + 1])
    let i = 0, j = 0
    while (i < x.length || j < y.length) {
      if (i < x.length && j < y.length && x[i] === y[j]) { add("same", x[i++]); j++ }
      else if (i < x.length && (j === y.length || lengths[(i + 1) * width + j] >= lengths[i * width + j + 1])) add("removed", x[i++])
      else add("added", y[j++])
    }
  }
  add("same", tail ? a.slice(a.length - tail).join("") : "")
  return parts
}

type DiffView = "changes" | "original" | "revised"
type TextDiffProps = Omit<React.ComponentProps<"section">, "children"> & {
  original: string
  revised: string
  label?: string
  view?: DiffView
  defaultView?: DiffView
  onViewChange?: (view: DiffView) => void
  labels?: Partial<Record<DiffView | "added" | "removed", string>>
}

function TextDiff({ original, revised, label = "Revision", view: controlled, defaultView = "changes", onViewChange, labels, className, ...props }: TextDiffProps) {
  const [local, setLocal] = React.useState(defaultView)
  const [proofed, setProofed] = React.useState(false)
  const view = controlled ?? local
  const words = { changes: "Changes", original: "Original", revised: "Revised", added: "Added", removed: "Removed", ...labels }
  const parts = React.useMemo(() => diffWords(original, revised), [original, revised])
  const order = ["changes", "original", "revised"].indexOf(view)
  return <section {...props} data-slot="text-diff" data-view={view} data-proofed={proofed ? "" : undefined} aria-label={props["aria-label"] ?? label} className={cn("db-text-diff", className)}>
    <div data-slot="text-diff-views" className="db-text-diff-views" role="group" aria-label={label} style={{ "--db-proof-position": order } as React.CSSProperties}>
      {(["changes", "original", "revised"] as const).map((v) => <button key={v} type="button" aria-pressed={view === v} onClick={() => { setProofed(true); if (controlled === undefined) setLocal(v); onViewChange?.(v) }}><small aria-hidden="true">0{["changes", "original", "revised"].indexOf(v) + 1}</small><span>{words[v]}</span></button>)}
    </div>
    <p key={view} data-slot="text-diff-body" className="db-text-diff-body">
      {view === "original" ? original : parts.map((part, i) => part.kind === "same" ? <React.Fragment key={i}>{part.text}</React.Fragment> : part.kind === "removed" ? view === "changes" ? <del key={i}><span className="db-sr">{words.removed}: </span>{part.text}</del> : null : view === "changes" ? <ins key={i} className="db-reading"><span className="db-sr">{words.added}: </span>{part.text}</ins> : <span key={i} className="db-text-diff-new db-reading">{part.text}</span>)}
    </p>
  </section>
}

export { TextDiff, diffWords, type TextDiffProps, type DiffView }
