"use client"

import * as React from "react"

import { useComposedRefs } from "@/registry/0nlytype/lib/refs"
import { cn } from "@/registry/0nlytype/lib/utils"
import { Row, RowKind, RowMeta, RowTitle, Rows } from "@/registry/0nlytype/ui/rows"

type SwapyItem = {
  id: string
  /** The row's name. It is also what a screen reader hears as the row moves. */
  label: string
  /** What it is, in graphite. */
  kind?: React.ReactNode
  /** The quiet fact at the end: a length, a year. */
  meta?: React.ReactNode
}

type SwapyProps = Omit<React.ComponentProps<"div">, "children" | "defaultValue"> & {
  /** Names the list: "Running order". */
  label: string
  items: readonly SwapyItem[]
  /** The ids in order. Ids missing from it keep their place at the end. */
  order?: readonly string[]
  defaultOrder?: readonly string[]
  onOrderChange?: (order: string[]) => void
  /**
   * default: the row you hold reverses out of ink and travels with your hand. transpose: the proofreader's
   * transposition mark, a loop in the margin from where the row was to where it is, and the held name in italic.
   */
  variant?: "default" | "transpose"
  disabled?: boolean
  /** Starts with this row picked up, as if its move word had just been pressed. */
  defaultHeld?: string
}

/** The given order, without ids that are gone, then any new ids at the end. */
function reconcile(order: readonly string[], ids: string[]) {
  const known = new Set(ids)
  const kept = order.filter((id) => known.has(id))
  const seen = new Set(kept)
  return [...kept, ...ids.filter((id) => !seen.has(id))]
}

const place = (n: number) => String(n + 1).padStart(2, "0")

/**
 * Rows you put in order by hand. Each row's "move" word is its handle: press it and the row is held (it reverses
 * out of ink), the arrow keys carry it up and down, and pressing again sets it down; Escape puts it back. Or drag
 * the word. Rows glide to their new places, their numbers turn over, and every move is said aloud.
 */
function Swapy({
  label,
  items,
  order,
  defaultOrder = [],
  onOrderChange,
  variant = "default",
  disabled = false,
  defaultHeld,
  className,
  ref: forwardedRef,
  ...props
}: SwapyProps) {
  const [local, setLocal] = React.useState<readonly string[]>(defaultOrder)
  const ids = reconcile(order ?? local, items.map((item) => item.id))
  const byId = new Map(items.map((item) => [item.id, item]))
  const [held, setHeld] = React.useState<string | null>(defaultHeld ?? null)
  const [origin, setOrigin] = React.useState(() => (defaultHeld ? ids.indexOf(defaultHeld) : -1))
  const [said, setSaid] = React.useState("")
  const [dragging, setDragging] = React.useState(false)
  const drag = React.useRef<{ id: string; pointer: number; moved: boolean; wasHeld: boolean } | null>(null)
  const root = React.useRef<HTMLDivElement>(null)
  const composedRef = useComposedRefs(root, forwardedRef)
  const list = React.useRef<HTMLUListElement>(null)
  const arc = React.useRef<SVGSVGElement>(null)
  const was = React.useRef(new Map<string, { top: number; at: number }>())
  const hint = React.useId()
  const n = ids.length
  const name = (id: string) => byId.get(id)?.label ?? id

  const commit = (next: string[]) => {
    if (order === undefined) setLocal(next)
    onOrderChange?.(next)
  }
  const moveTo = (id: string, to: number) => {
    const at = ids.indexOf(id)
    const end = Math.min(Math.max(to, 0), n - 1)
    if (at < 0 || end === at) return false
    const next = ids.filter((x) => x !== id)
    next.splice(end, 0, id)
    commit(next)
    setSaid(`${name(id)}, ${end + 1} of ${n}.`)
    return true
  }
  const lift = (id: string) => {
    setHeld(id)
    setOrigin(ids.indexOf(id))
    setSaid(`${name(id)} picked up, ${ids.indexOf(id) + 1} of ${n}.`)
  }
  const setDown = (id: string) => {
    setHeld(null)
    setSaid(`${name(id)} set down, ${ids.indexOf(id) + 1} of ${n}.`)
  }
  const putBack = (id: string) => {
    moveTo(id, origin)
    setHeld(null)
    setSaid(`${name(id)} put back, ${origin + 1} of ${n}.`)
  }

  /** Which place the pointer is over, read from the layout (not the gliding rows) so nothing jitters. */
  const slotAt = (y: number) => {
    const ul = list.current
    if (!ul) return -1
    const top = ul.getBoundingClientRect().top
    const lis = Array.from(ul.children) as HTMLElement[]
    for (let i = 0; i < lis.length; i++) if (y < top + lis[i].offsetTop + lis[i].offsetHeight) return i
    return lis.length - 1
  }

  // After every render: rows that changed place glide there (FLIP), and their numbers turn over the way they went.
  React.useLayoutEffect(() => {
    const ul = list.current
    if (!ul) return
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches
    const cs = getComputedStyle(ul)
    const glide = { duration: parseFloat(cs.getPropertyValue("--ot-moderato")) || 320, easing: cs.getPropertyValue("--ot-breath").trim() || "ease" }
    const turn = { duration: glide.duration, easing: cs.getPropertyValue("--ot-exhale").trim() || "ease-out" }
    const seen = new Map<string, { top: number; at: number }>()
    Array.from(ul.children).forEach((li, at) => {
      if (!(li instanceof HTMLElement)) return
      const id = li.dataset.id ?? ""
      const before = was.current.get(id)
      seen.set(id, { top: li.offsetTop, at })
      if (still || !before) return
      if (before.top !== li.offsetTop) li.animate([{ translate: `0 ${before.top - li.offsetTop}px` }, { translate: "0 0" }], glide)
      // ponytail: only the new figure turns in; the old one isn't kept to turn out, since React has already written the new one.
      const fig = li.querySelector<HTMLElement>(".ot-swap-n")
      if (fig && before.at !== at) fig.animate([{ opacity: 0, translate: `0 ${at > before.at ? "0.6em" : "-0.6em"}` }, { opacity: 1, translate: "0 0" }], turn)
    })
    was.current = seen

    // transpose: the loop runs in the margin from the place the row was picked up to the place it's in now.
    const svg = arc.current
    if (!svg || !held || origin < 0) return
    const lis = Array.from(ul.children) as HTMLElement[]
    const mid = (li?: HTMLElement) => (li ? ul.offsetTop + li.offsetTop + li.offsetHeight / 2 : 0)
    const now = ids.indexOf(held)
    if (now === origin) return
    const y0 = mid(lis[origin])
    const y1 = mid(lis[now])
    const w = svg.clientWidth - 6 // the ends stop short of the numbers
    svg.querySelector("path")?.setAttribute("d", `M ${w} ${y0} C ${-w * 0.33} ${y0} ${-w * 0.33} ${y1} ${w} ${y1}`)
    svg.querySelector("circle")?.setAttribute("cx", String(w))
    svg.querySelector("circle")?.setAttribute("cy", String(y1))
    root.current?.style.setProperty("--ot-swap-mid", `${(y0 + y1) / 2}px`)
  })

  const looped = variant === "transpose" && held !== null && origin >= 0 && ids.indexOf(held) !== origin

  return (
    <div
      ref={composedRef}
      data-slot="swapy"
      data-variant={variant === "default" ? undefined : variant}
      data-holding={held ? "" : undefined}
      data-dragging={dragging || undefined}
      data-disabled={disabled || undefined}
      className={cn("ot-swap", className)}
      {...props}
    >
      <Rows ref={list} aria-label={label}>
        {ids.map((id, at) => {
          const item = byId.get(id)
          if (!item) return null
          const mine = held === id
          return (
            <Row key={id} data-id={id} data-held={mine || undefined}>
              <span className="ot-swap-n" aria-hidden="true">{place(at)}</span>
              <RowTitle>{item.label}</RowTitle>
              {item.kind != null ? <RowKind>{item.kind}</RowKind> : null}
              {item.meta != null ? <RowMeta>{item.meta}</RowMeta> : null}
              <button
                type="button"
                data-slot="swapy-move"
                className="ot-swap-move"
                aria-label={`Move ${item.label}, ${at + 1} of ${n}`}
                aria-pressed={mine}
                aria-describedby={hint}
                disabled={disabled || n < 2}
                onPointerDown={(e) => {
                  if (e.button !== 0 || disabled) return
                  e.preventDefault() // no text selection; focus by hand instead
                  e.currentTarget.focus({ focusVisible: false } as FocusOptions)
                  e.currentTarget.setPointerCapture(e.pointerId)
                  drag.current = { id, pointer: e.pointerId, moved: false, wasHeld: mine }
                  setDragging(true)
                  if (!mine) lift(id)
                }}
                onPointerMove={(e) => {
                  const d = drag.current
                  if (!d || d.pointer !== e.pointerId) return
                  if (moveTo(d.id, slotAt(e.clientY))) d.moved = true
                }}
                onPointerUp={(e) => {
                  const d = drag.current
                  if (!d || d.pointer !== e.pointerId) return
                  drag.current = null
                  setDragging(false)
                  // A drag sets the row down where it's let go; a plain press picks it up, and a second press sets it down.
                  if (d.moved || d.wasHeld) setDown(d.id)
                }}
                onPointerCancel={() => {
                  if (drag.current) setDown(drag.current.id)
                  drag.current = null
                  setDragging(false)
                }}
                onClick={(e) => {
                  if (e.detail !== 0) return // the pointer already did it; this is Enter or Space
                  if (mine) setDown(id)
                  else lift(id)
                }}
                onKeyDown={(e) => {
                  const to = { ArrowUp: at - 1, ArrowDown: at + 1, Home: 0, End: n - 1 }[e.key]
                  if (to !== undefined) {
                    e.preventDefault()
                    if (!mine) lift(id)
                    moveTo(id, to)
                  } else if (e.key === "Escape" && mine) {
                    e.preventDefault()
                    putBack(id)
                  }
                }}
                onBlur={(e) => {
                  // Moving a row can blur it for a moment while React reinserts it; only a real departure sets it down.
                  const el = e.currentTarget
                  requestAnimationFrame(() => {
                    if (mine && !drag.current && document.activeElement !== el) setDown(id)
                  })
                }}
              >
                <span data-word="move">move</span>
                <span data-word="moving">moving</span>
                <span className="ot-swap-arrow" aria-hidden="true">↕</span>
              </button>
            </Row>
          )
        })}
      </Rows>
      {variant === "transpose" ? (
        <>
          <svg ref={arc} className="ot-swap-arc" data-shown={looped || undefined} aria-hidden="true">
            <path />
            <circle r="3.5" />
          </svg>
          <span className="ot-swap-tr" data-shown={looped || undefined} aria-hidden="true">tr</span>
        </>
      ) : null}
      <p id={hint} className="ot-sr">Press to pick the row up, then the arrow keys to move it, and press again to set it down. Escape puts it back.</p>
      <p role="status" className="ot-sr">{said}</p>
    </div>
  )
}

export { Swapy, type SwapyProps, type SwapyItem }
