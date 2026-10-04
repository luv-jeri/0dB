"use client"

import * as React from "react"

import { useComposedRefs } from "@/registry/0db/lib/refs"
import { useFormReset } from "@/registry/0db/lib/use-form-reset"
import { cn } from "@/registry/0db/lib/utils"

type TransferItem = { id: string; label: string; disabled?: boolean }
type TransferListProps = Omit<React.ComponentProps<"div">, "children" | "onChange" | "defaultValue"> & {
  items: TransferItem[]
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (ids: string[]) => void
  availableLabel?: string
  includedLabel?: string
  includeLabel?: string
  removeLabel?: string
  emptyLabel?: string
  name?: string
  disabled?: boolean
}

/** Membership in two sets, not an ordering or a multiple-choice popup. */
function TransferList({ items, value: controlled, defaultValue = [], onValueChange, availableLabel = "Available", includedLabel = "Included", includeLabel = "Include selected", removeLabel = "Remove selected", emptyLabel = "None", name, disabled, className, ref: forwardedRef, ...props }: TransferListProps) {
  const id = React.useId()
  const [local, setLocal] = React.useState(defaultValue)
  const [picked, setPicked] = React.useState<string[]>([])
  const [moved, setMoved] = React.useState<string[]>([])
  const [message, setMessage] = React.useState("")
  const root = React.useRef<HTMLDivElement>(null)
  const ref = useComposedRefs(root, forwardedRef)
  useFormReset(root, () => { if (controlled === undefined) setLocal(defaultValue); setPicked([]); setMoved([]); setMessage("") })
  const destinations = React.useRef<(HTMLHeadingElement | null)[]>([])
  const positions = React.useRef(new Map<string, DOMRect>())
  const flights = React.useRef<Animation[]>([])
  React.useLayoutEffect(() => {
    if (!positions.current.size || !root.current) return
    const before = positions.current
    positions.current = new Map()
    flights.current.forEach((flight) => flight.cancel())
    flights.current = []
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || root.current.closest('[data-perform="off"]')) return
    const tempo = getComputedStyle(root.current).getPropertyValue("--db-andante").trim()
    const duration = tempo.endsWith("ms") ? parseFloat(tempo) : parseFloat(tempo) * 1000
    root.current.querySelectorAll<HTMLElement>("[data-transfer-word]").forEach((word) => {
      const old = before.get(word.dataset.transferWord ?? "")
      if (!old) return
      const now = word.getBoundingClientRect()
      const dx = old.x - now.x, dy = old.y - now.y
      if (Math.abs(dx) + Math.abs(dy) < 1) return
      const ratio = now.width ? Math.min(1.4, Math.max(0.7, old.width / now.width)) : 1
      const flight = word.animate([
        { transform: `translate(${dx}px, ${dy}px) scaleX(${ratio}) skewX(${dx > 0 ? -8 : 8}deg)` },
        { transform: `translate(${-dx * 0.025}px, ${-dy * 0.025}px) scaleX(1.025) skewX(0deg)`, offset: 0.78 },
        { transform: "none" },
      ], { duration: Number.isFinite(duration) ? duration * 1.3 : 832, easing: "cubic-bezier(.16,1,.3,1)" })
      flights.current.push(flight)
    })
  })
  React.useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)")
    const stop = () => { flights.current.forEach((flight) => flight.cancel()); flights.current = [] }
    preference.addEventListener("change", stop)
    return () => { preference.removeEventListener("change", stop); stop() }
  }, [])
  const ids = new Set(items.map((item) => item.id))
  if (ids.size !== items.length || items.some((item) => !item.id)) throw new Error("TransferList needs unique, non-empty item ids")
  const raw = controlled ?? local
  const included = new Set(raw.filter((item) => ids.has(item)))
  const groups = [items.filter((item) => !included.has(item.id)), items.filter((item) => included.has(item.id))]
  const eligible = (side: number) => groups[side].filter((item) => picked.includes(item.id) && !item.disabled)
  const move = (side: number) => {
    const chosen = eligible(side).map((item) => item.id)
    if (disabled || !chosen.length) return
    positions.current = new Map([...root.current?.querySelectorAll<HTMLElement>("[data-transfer-word]") ?? []].map((word) => [word.dataset.transferWord ?? "", word.getBoundingClientRect()]))
    const next = new Set(included)
    chosen.forEach((item) => { if (side === 0) next.add(item); else next.delete(item) })
    // Stable source order, even if the reader picked in a different order.
    const ordered = items.filter((item) => next.has(item.id)).map((item) => item.id)
    if (controlled === undefined) setLocal(ordered)
    onValueChange?.(ordered)
    setPicked([])
    setMoved(chosen)
    setMessage(`${chosen.length} ${side === 0 ? includedLabel : availableLabel}`)
    destinations.current[1 - side]?.focus()
  }
  return <div {...props} ref={ref} data-slot="transfer-list" className={cn("db-transfer", className)}>
    {groups.map((group, side) => <section key={side} data-slot="transfer-side" aria-labelledby={`${id}-${side}`} className="db-transfer-side">
      <h3 data-slot="transfer-heading" id={`${id}-${side}`} tabIndex={-1} ref={(el) => { destinations.current[side] = el }}>{side === 0 ? availableLabel : includedLabel}<small><span className="db-sr">: </span>{String(group.length).padStart(2, "0")}</small></h3>
      <ul data-slot="transfer-items">
        {group.map((item) => <li key={item.id} data-slot="transfer-item" data-included={side === 1 ? "" : undefined} data-moved={moved.includes(item.id) ? "" : undefined}>
          <label><input type="checkbox" checked={picked.includes(item.id)} disabled={disabled || item.disabled} onChange={(e) => { setMessage(""); setPicked(e.target.checked ? [...picked, item.id] : picked.filter((p) => p !== item.id)) }} /><span data-transfer-word={item.id} className={side === 1 ? "db-reading" : undefined}>{item.label}</span></label>
        </li>)}
      </ul>
      {!group.length ? <p className="db-transfer-empty">{emptyLabel}</p> : null}
      <button type="button" data-slot={side === 0 ? "transfer-include" : "transfer-remove"} disabled={disabled || !eligible(side).length} onClick={() => move(side)}>{side === 0 ? includeLabel : removeLabel}</button>
    </section>)}
    <span className="db-sr" role="status" aria-atomic="true">{message}</span>
    {name ? items.filter((item) => included.has(item.id)).map((item) => <input key={item.id} type="hidden" name={name} value={item.id} disabled={disabled} />) : null}
  </div>
}

export { TransferList, type TransferListProps, type TransferItem }
