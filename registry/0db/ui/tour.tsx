"use client"

import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"
import { Dialog, DialogSurface, DialogTrigger, useDialog } from "@/registry/0db/ui/dialog"

type TourProps = {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** The step you're on, counted from 1. Left uncontrolled, the tour starts again from the first step each time it opens. */
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  children: React.ReactNode
}

const Place = React.createContext<{ at: number; go: (n: number) => void } | null>(null)

/**
 * A tour of callouts, after Weingart's letter: each step is an ink callout hung on a leader line that ends in a
 * dot on the thing it is about. It moves only when the person presses Next or Back (or the arrow keys); it never
 * plays by itself. Built on the native <dialog>, so focus, Escape and the top layer are the browser's.
 */
function Tour({ open, defaultOpen, onOpenChange, value, defaultValue = 1, onValueChange, children }: TourProps) {
  const [own, setOwn] = React.useState(defaultValue)
  const at = value ?? own
  const go = React.useCallback(
    (n: number) => {
      if (value === undefined) setOwn(n)
      onValueChange?.(n)
    },
    [value, onValueChange],
  )
  const change = React.useCallback(
    (next: boolean) => {
      if (!next && value === undefined) setOwn(defaultValue) // the next tour starts at the beginning
      onOpenChange?.(next)
    },
    [value, defaultValue, onOpenChange],
  )
  const place = React.useMemo(() => ({ at, go }), [at, go])
  return (
    <Dialog open={open} defaultOpen={defaultOpen} onOpenChange={change}>
      <Place.Provider value={place}>{children}</Place.Provider>
    </Dialog>
  )
}

const TourTrigger = DialogTrigger

type TourStepProps = {
  /** What the step is about: a selector, or a ref. Left out, the callout stands alone in the middle, with no leader. */
  target?: string | React.RefObject<Element | null>
  /** The step's name, in bold at the head of the callout. */
  title: React.ReactNode
  /** A sentence or two. */
  children?: React.ReactNode
}

/** One step. It renders nothing itself: TourContent reads it and shows the one you're on. */
function TourStep(props: TourStepProps): React.ReactNode {
  void props
  return null
}

type TourContentProps = Omit<React.ComponentProps<"dialog">, "children"> & {
  /** The steps, as TourStep elements, in order. */
  children: React.ReactNode
  /** The words on the callout's controls. */
  labels?: { back?: string; next?: string; done?: string; end?: string }
}

const two = (n: number) => String(n).padStart(2, "0")
const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), Math.max(lo, hi))

/** The window-wide, see-through dialog that holds the leader and the callout of the step you're on. */
function TourContent({ className, children, labels, onKeyDown, ...props }: TourContentProps) {
  const { open, setOpen, titleId, descriptionId } = useDialog()
  const place = React.useContext(Place)
  if (!place) throw new Error("TourContent must sit inside <Tour>.")
  const steps = React.Children.toArray(children)
    .filter(React.isValidElement<TourStepProps>)
    .map((kid) => kid.props)
  const n = steps.length
  const at = clamp(place.at, 1, n)
  const step = steps[at - 1]
  const { back = "Back", next = "Next", done = "Done", end = "End" } = labels ?? {}
  const countId = `${titleId}-count`
  const callout = React.useRef<HTMLDivElement>(null)
  const lead = React.useRef<SVGSVGElement>(null)
  const moved = React.useRef<"next" | "back" | null>(null)
  const target = step?.target

  const move = (to: number) => {
    if (to > n) return setOpen(false)
    if (to < 1 || to === at) return
    moved.current = to > at ? "next" : "back"
    place.go(to)
  }

  // Hang the callout: the dot on the target's edge, the leader leaning off it toward the roomier side, the callout
  // a gap beyond, held inside the window. Written straight to the DOM, so the first frame is already in place.
  React.useEffect(() => {
    const box = callout.current
    const svg = lead.current
    const d = box?.closest("dialog")
    if (!open || !box || !svg || !d) return
    const el = typeof target === "string" ? document.querySelector(target) : (target?.current ?? null)
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches
    const line = svg.querySelector("line")
    const dot = svg.querySelector("circle")
    const margin = 20
    const lay = () => {
      const space = getComputedStyle(d).getPropertyValue("--db-space-7").trim() // 3.75rem, as the tokens are written
      const gap = parseFloat(space) * (space.endsWith("rem") ? parseFloat(getComputedStyle(document.documentElement).fontSize) : 1) || 60
      const vw = d.clientWidth
      const vh = d.clientHeight
      const cw = box.offsetWidth
      const ch = box.offsetHeight
      const inset = parseFloat(getComputedStyle(box).fontSize) * 1.4
      let x = (vw - cw) / 2
      let y = (vh - ch) / 2
      if (el && line && dot) {
        const r = el.getBoundingClientRect()
        const down = vh - r.bottom >= ch + gap + margin || vh - r.bottom >= r.top
        const px = clamp(r.left + r.width / 2, margin, vw - margin)
        const py = down ? r.bottom : r.top
        const right = px < vw / 2
        const ax = right ? px + gap * 1.5 : px - gap * 1.5
        x = clamp(right ? ax - inset : ax + inset - cw, margin, vw - margin - cw)
        y = clamp(down ? r.bottom + gap : r.top - gap - ch, margin, vh - margin - ch)
        const tx = clamp(ax, x + inset, x + cw - inset)
        const ty = down ? y : y + ch
        line.setAttribute("x1", String(px))
        line.setAttribute("y1", String(py))
        line.setAttribute("x2", String(tx))
        line.setAttribute("y2", String(ty))
        dot.setAttribute("cx", String(px))
        dot.setAttribute("cy", String(py))
        box.style.setProperty("--db-tour-tip", `${tx - x}px ${down ? 0 : ch}px`)
      }
      box.style.left = `${Math.round(x)}px`
      box.style.top = `${Math.round(y)}px`
      box.setAttribute("data-laid", "")
    }
    if (el) {
      const r = el.getBoundingClientRect()
      if (r.top < margin || r.bottom > innerHeight - margin) el.scrollIntoView({ block: "center", inline: "nearest", behavior: still ? "auto" : "smooth" })
    }
    lay()
    let frame = 0
    const soon = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(lay)
    }
    addEventListener("scroll", soon, { capture: true, passive: true })
    addEventListener("resize", soon)
    const sized = new ResizeObserver(soon)
    sized.observe(box)
    return () => {
      cancelAnimationFrame(frame)
      removeEventListener("scroll", soon, { capture: true })
      removeEventListener("resize", soon)
      sized.disconnect()
    }
  }, [open, at, target])

  // Each step is a new callout: focus goes back to the control that moved it (Next, or Back while there is one).
  React.useEffect(() => {
    const way = moved.current
    moved.current = null
    if (!way || !callout.current) return
    const to = callout.current.querySelector<HTMLElement>(`[data-go="${way}"]`) ?? callout.current.querySelector<HTMLElement>('[data-go="next"]')
    to?.focus()
  }, [at])

  const described = `${countId} ${titleId} ${descriptionId}`
  return (
    <DialogSurface
      data-slot="tour-content"
      className={cn("db-tour", className)}
      onKeyDown={(e) => {
        onKeyDown?.(e)
        if (e.defaultPrevented || (e.key !== "ArrowRight" && e.key !== "ArrowLeft")) return
        e.preventDefault()
        const rtl = getComputedStyle(e.currentTarget).direction === "rtl"
        const on = (e.key === "ArrowRight") !== rtl
        if (on ? at < n : at > 1) move(on ? at + 1 : at - 1)
      }}
      {...props}
    >
      <svg key={`lead-${at}`} ref={lead} className="db-tour-lead" aria-hidden="true" data-alone={step?.target ? undefined : ""}>
        <line className="db-tour-line" pathLength={1} />
        <circle className="db-tour-dot" r={3.5} />
      </svg>
      <div key={`callout-${at}`} ref={callout} data-slot="tour-callout" className="db-tour-callout">
        <div className="db-tour-head">
          <h2 id={titleId} className="db-tour-title">{step?.title}</h2>
          <span id={countId} className="db-tour-count">
            <span aria-hidden="true">
              {two(at)}/{two(n)}
            </span>
            <span className="db-sr">Step {at} of {n}</span>
          </span>
        </div>
        <p id={descriptionId} className="db-tour-text">{step?.children}</p>
        <div className="db-tour-actions">
          <button type="button" className="db-tour-end" onClick={() => setOpen(false)}>
            {end}
          </button>
          {at > 1 && (
            <button type="button" data-go="back" aria-describedby={described} onClick={() => move(at - 1)}>
              {back}
            </button>
          )}
          <button type="button" data-go="next" data-last={at === n ? "" : undefined} data-autofocus aria-describedby={described} onClick={() => move(at + 1)}>
            {at === n ? done : next}
          </button>
        </div>
      </div>
    </DialogSurface>
  )
}

export { Tour, TourTrigger, TourContent, TourStep, type TourProps, type TourStepProps, type TourContentProps }
