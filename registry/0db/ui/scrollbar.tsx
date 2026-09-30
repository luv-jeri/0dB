"use client"

import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"

type ScrollbarSection = {
  id: string
  /** The numeral on the mark: "II". */
  num: string
  name: string
  /** Pins the mark's place on the rail (0 to 1) instead of measuring it. For documentation. */
  at?: number
}

type ScrollbarOptions = {
  variant?: "inner" | "page"
  /** The thumb is never shorter than this many px, so it can be held. */
  min?: number
  sections?: ScrollbarSection[]
  /** Leave the rail as drawn (documentation pins its look). */
  still?: boolean
}

const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches

/**
 * Returns the ref for the rail. Measures the rail's host (its parent, or the document for the page variant) and drives
 * the rail: --view (thumb length), --max (how far the rail travels), data-idle (nothing to
 * scroll) and data-ready. The thumb's travel itself is CSS, on the scroller's timeline.
 */
function useScrollbar({ variant = "inner", min = 24, sections = [], still = false }: ScrollbarOptions) {
  const key = JSON.stringify(sections)
  const [el, setEl] = React.useState<HTMLDivElement | null>(null)

  React.useEffect(() => {
    // The rail needs scroll-driven animation and a pointer; elsewhere the native bar stays.
    if (!el || still || !matchMedia("(pointer: fine)").matches || !CSS.supports("animation-timeline: scroll()")) return
    const page = variant === "page"
    const host = page ? document.documentElement : el.parentElement
    if (!host) return
    const thumb = el.querySelector<HTMLElement>("[data-slot=scrollbar-thumb]")!
    const marks = [...el.querySelectorAll<HTMLElement>("[data-slot=scrollbar-mark]")]
    const wanted = JSON.parse(key) as ScrollbarSection[]
    const target = (i: number) => document.getElementById(wanted[i].id)
    const seen = () => (page ? innerHeight : host.clientHeight)
    const top = () => (page ? scrollY : host.scrollTop)
    // A section's offset from the top of the scrolled content.
    const offset = (s: HTMLElement) => s.getBoundingClientRect().top - (page ? 0 : host.getBoundingClientRect().top) + top()

    // The thumb's top travels (1 − view) of the rail, so a mark sits where the thumb's top
    // will be when its section reaches the top.
    const measure = () => {
      const shown = seen(), whole = host.scrollHeight, max = whole - shown
      const view = Math.min(1, Math.max(shown / whole, min / (page ? el.clientHeight : shown))) || 1 // a closed box measures 0 / 0
      el.style.setProperty("--view", String(view))
      el.style.setProperty("--max", `${max}px`)
      el.toggleAttribute("data-idle", max < 1)
      marks.forEach((mark, i) => {
        const s = target(i)
        if (s) mark.style.setProperty("--at", String(Math.min(1, offset(s) / max) * (1 - view)))
      })
      // The mark for the section in the middle of the view is the one you're in.
      const middle = top() + shown / 2
      let now = -1
      marks.forEach((_, i) => {
        const s = target(i)
        if (s && offset(s) <= middle) now = i
      })
      marks.forEach((mark, i) => mark.toggleAttribute("data-now", i === now))
    }

    let frame = 0
    const soon = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(measure)
    }
    const scroller: EventTarget = page ? window : host
    const resize = new ResizeObserver(soon)
    // Content that redraws changes what there is to scroll without resizing the box.
    const mutation = new MutationObserver(soon)
    if (page) {
      resize.observe(document.body)
      addEventListener("resize", soon)
    } else {
      resize.observe(host)
      mutation.observe(host, { childList: true, subtree: true, characterData: true })
    }
    if (marks.length) scroller.addEventListener("scroll", soon, { passive: true })
    measure()
    el.setAttribute("data-ready", "")

    const scrollToY = (y: number, instant: boolean) =>
      (page ? window : host).scrollTo({ top: y, behavior: instant || reduced() ? "instant" : "smooth" })
    const onPointerDown = (e: PointerEvent) => {
      if (e.button) return
      e.preventDefault() // keep focus where it is
      const mark = (e.target as HTMLElement).closest<HTMLElement>("[data-slot=scrollbar-mark]")
      if (mark) {
        const s = target(marks.indexOf(mark))
        if (s) scrollToY(offset(s), false)
        return
      }
      // Take the thumb where you grabbed it; press the rail and the thumb centres on the pointer.
      const r = el.getBoundingClientRect(), t = thumb.getBoundingClientRect()
      const grab = e.target === thumb ? e.clientY - t.top : t.height / 2
      const follow = (ev: PointerEvent) => {
        const max = host.scrollHeight - seen()
        scrollToY(Math.max(0, Math.min(max, ((ev.clientY - r.top - grab) / (r.height - t.height)) * max)), true)
      }
      follow(e)
      el.setPointerCapture(e.pointerId)
      el.setAttribute("data-dragging", "")
      el.addEventListener("pointermove", follow)
      el.addEventListener("lostpointercapture", () => {
        el.removeEventListener("pointermove", follow)
        el.removeAttribute("data-dragging")
      }, { once: true })
    }
    el.addEventListener("pointerdown", onPointerDown)

    return () => {
      cancelAnimationFrame(frame)
      resize.disconnect()
      mutation.disconnect()
      removeEventListener("resize", soon)
      scroller.removeEventListener("scroll", soon)
      el.removeEventListener("pointerdown", onPointerDown)
      el.removeAttribute("data-ready")
    }
  }, [el, variant, min, key, still])
  return setEl
}

type ScrollbarProps = Omit<React.ComponentProps<"div">, "children"> &
  Omit<ScrollbarOptions, "still"> & {
    /** Pins a look for documentation ("hover", "active") and leaves the rail as drawn: set --view and --p yourself. */
    "data-force"?: string
  }

/**
 * A scrollbar as a ruler: a hairline and a thumb as long as the view. Place it as the last
 * child of any scroll container and it pins to that container's edge; variant="page" fixes it
 * to the window and measures the document.
 *
 * It is a pointer aid, hidden from assistive technology: keyboard scrolling stays native, and
 * the sections are marks on the rail that scroll to the element with that id. Anyone who can't point still needs
 * those sections elsewhere on the page (a table of contents).
 */
function Scrollbar({ variant = "inner", min = variant === "page" ? 40 : 24, sections, className, "data-force": force, ...props }: ScrollbarProps) {
  const rail = useScrollbar({ variant, min, sections, still: force !== undefined })
  return (
    <div ref={rail} data-force={force} data-slot="scrollbar" data-variant={variant} aria-hidden="true" className={cn("db-scrollbar", className)} {...props}>
      <span data-slot="scrollbar-thumb" className="db-scrollbar-thumb" />
      {sections?.map((s, i) => (
        <span key={s.id} data-slot="scrollbar-mark" data-num={s.num} data-name={s.name} style={{ "--i": i, "--at": s.at } as React.CSSProperties} className="db-scrollbar-mark" />
      ))}
    </div>
  )
}

export { Scrollbar, useScrollbar, type ScrollbarProps, type ScrollbarSection }
