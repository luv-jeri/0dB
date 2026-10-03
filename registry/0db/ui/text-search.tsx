"use client"

import * as React from "react"

import { Input } from "@/registry/0db/ui/field"
import { cn } from "@/registry/0db/lib/utils"

function findTextMatches(text: string, query: string): { start: number; end: number }[] {
  if (!query) return []
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  return [...text.matchAll(new RegExp(escaped, "giu"))].map((m) => ({ start: m.index, end: m.index + m[0].length }))
}

type TextSearchProps = Omit<React.ComponentProps<"section">, "children"> & {
  text: string
  label?: string
  query?: string
  defaultQuery?: string
  onQueryChange?: (query: string) => void
  previousLabel?: string
  nextLabel?: string
  countLabel?: (current: number, total: number) => string
}

/** Find within the supplied passage, rather than filtering away its context. */
function TextSearch({ text, label = "Find in this passage", query: controlled, defaultQuery = "", onQueryChange, previousLabel = "Previous", nextLabel = "Next", countLabel = (current, total) => `${current} of ${total} matches`, className, ...props }: TextSearchProps) {
  const id = React.useId()
  const [local, setLocal] = React.useState(defaultQuery)
  const query = controlled ?? local
  const matches = React.useMemo(() => findTextMatches(text, query), [text, query])
  const [position, setPosition] = React.useState({ text, query, index: 0 })
  if (position.text !== text || position.query !== query) setPosition({ text, query, index: 0 })
  const index = position.text === text && position.query === query ? Math.min(position.index, Math.max(0, matches.length - 1)) : 0
  const marks = React.useRef<(HTMLElement | null)[]>([])
  const reading = React.useRef<HTMLDivElement>(null)
  const coordinate = React.useRef<HTMLSpanElement>(null)
  const [located, setLocated] = React.useState(false)
  React.useLayoutEffect(() => {
    const place = () => {
      const mark = marks.current[index]
      if (reading.current && coordinate.current && mark) {
        const y = mark.getBoundingClientRect().top - reading.current.getBoundingClientRect().top
        coordinate.current.style.setProperty("--db-search-y", `${y}px`)
      }
    }
    place()
    const observer = new ResizeObserver(place)
    if (reading.current) observer.observe(reading.current)
    return () => observer.disconnect()
  }, [index, text, query])
  const move = (delta: number) => {
    if (!matches.length) return
    setLocated(true)
    const next = (index + delta + matches.length) % matches.length
    setPosition({ text, query, index: next })
    // Navigation is deliberate; typing never scrolls or steals focus.
    marks.current[next]?.scrollIntoView({ block: "nearest", behavior: "instant" })
  }
  const chunks: React.ReactNode[] = []
  let end = 0
  matches.forEach((m, i) => {
    chunks.push(text.slice(end, m.start))
    chunks.push(<mark key={m.start} ref={(el) => { marks.current[i] = el }} data-slot="text-search-match" data-current={i === index ? "" : undefined}>{text.slice(m.start, m.end)}</mark>)
    end = m.end
  })
  chunks.push(text.slice(end))
  return <section {...props} data-slot="text-search" data-located={located ? "" : undefined} className={cn("db-text-search", className)} aria-label={props["aria-label"] ?? label}>
    <label data-slot="text-search-label" className="db-label" htmlFor={id}>{label}</label>
    <Input type="search" id={id} data-slot="text-search-input" value={query} aria-describedby={`${id}-count`} onChange={(e) => { setLocated(true); if (controlled === undefined) setLocal(e.target.value); onQueryChange?.(e.target.value) }} onKeyDown={(e) => { if (e.key === "Enter" && !e.nativeEvent.isComposing) { e.preventDefault(); move(e.shiftKey ? -1 : 1) } }} />
    <div className="db-text-search-tools">
      <span id={`${id}-count`} role="status" aria-atomic="true">{countLabel(matches.length ? index + 1 : 0, matches.length)}</span>
      <button type="button" disabled={!matches.length} onClick={() => move(-1)}>{previousLabel}</button>
      <button type="button" disabled={!matches.length} onClick={() => move(1)}>{nextLabel}</button>
    </div>
    <div className="db-text-search-reading" ref={reading}>
      {matches.length ? <span ref={coordinate} className="db-text-search-coordinate" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span> : null}
      <p data-slot="text-search-passage" className="db-text-search-passage">{chunks}</p>
    </div>
  </section>
}

export { TextSearch, findTextMatches, type TextSearchProps }
