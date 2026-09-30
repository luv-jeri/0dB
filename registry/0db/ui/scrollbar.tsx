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
  /** Which way the host scrolls. Inner only: the page always scrolls down. */
  axis?: "y" | "x"
  /** The thumb is never shorter than this many px, so it can be held. */
  min?: number
  sections?: ScrollbarSection[]
  /** Leave the rail as drawn (documentation pins its look). */
  still?: boolean
}

const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches

/** The nearest box around the rail that scrolls its way, or the rail's parent when none does (a dialog scrolls only once it is open). */
function scroller(rail: HTMLElement, across: boolean) {
  for (let p = rail.parentElement; p && p !== document.body && p !== document.documentElement; p = p.parentElement) {
    if (/(auto|scroll)/.test(getComputedStyle(p)[across ? "overflowX" : "overflowY"])) return p
  }
  return rail.parentElement
}

/**
 * Returns the ref for the rail. Measures the rail's host (the nearest scroller around it, or the document for the page
 * variant) and drives the rail: --view (thumb length), --max (how far the rail travels), data-idle (nothing to
 * scroll) and data-ready. The thumb's travel itself is CSS, on the scroller's timeline.
 * Once ready the host says so (data-scrollbar-host), which hides the browser's own bar there and keeps smooth-scroll
 * libraries out of it (data-lenis-prevent, while there is something to scroll).
 */
function useScrollbar({ variant = "inner", axis = "y", min = 24, sections = [], still = false }: ScrollbarOptions) {
  const key = JSON.stringify(sections)
  const [el, setEl] = React.useState<HTMLDivElement | null>(null)

  React.useEffect(() => {
    // The rail needs scroll-driven animation and a pointer; elsewhere the native bar stays.
    if (!el || still || !matchMedia("(pointer: fine)").matches || !CSS.supports("animation-timeline: scroll()")) return
    const page = variant === "page"
    const across = axis === "x" && !page
    const host = page ? document.documentElement : scroller(el, across)
    if (!host) return
    const thumb = el.querySelector<HTMLElement>("[data-slot=scrollbar-thumb]")!
    const marks = [...el.querySelectorAll<HTMLElement>("[data-slot=scrollbar-mark]")]
    const wanted = JSON.parse(key) as ScrollbarSection[]
    const target = (i: number) => document.getElementById(wanted[i].id)
    const rtl = () => getComputedStyle(host).direction === "rtl"
    const seen = () => (page ? innerHeight : across ? host.clientWidth : host.clientHeight)
    const whole = () => (across ? host.scrollWidth : host.scrollHeight)
    const top = () => (page ? scrollY : across ? Math.abs(host.scrollLeft) : host.scrollTop)
    // A section's offset from the top of the scrolled content.
    const offset = (s: HTMLElement) => s.getBoundingClientRect().top - (page ? 0 : host.getBoundingClientRect().top) + top()
    const attrs = { pin: false }
    // A rail is absolute: its host must be a positioned box (unless it already is: a dialog is fixed).
    if (!page && getComputedStyle(host).position === "static") {
      host.setAttribute("data-scrollbar-host", "pin")
      attrs.pin = true
    }
    const hadPrevent = host.hasAttribute("data-lenis-prevent")
    // The thumb's top travels (1 − view) of the rail, so a mark sits where the thumb's top
    // will be when its section reaches the top.
    const measure = () => {
      const shown = seen(), all = page ? host.scrollHeight : whole(), max = all - shown
      const view = Math.min(1, Math.max(shown / all, min / (page ? el.clientHeight : shown))) || 1 // a closed box measures 0 / 0
      el.style.setProperty("--view", String(view))
      el.style.setProperty("--max", `${max}px`)
      el.style.setProperty("--dir", rtl() ? "-1" : "1") // a horizontal rail travels the other way in right-to-left
      el.toggleAttribute("data-idle", max < 1)
      // Smooth scrolling leaves this box's wheel alone while it has something to scroll (a sideways one never needs it).
      if (!page && !across && !hadPrevent) host.toggleAttribute("data-lenis-prevent", max >= 1)
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
    const scrolled: EventTarget = page ? window : host
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
    if (marks.length) scrolled.addEventListener("scroll", soon, { passive: true })
    measure()
    el.setAttribute("data-ready", "")
    host.setAttribute("data-scrollbar-host", attrs.pin ? "pin" : "")

    const scrollToY = (y: number, instant: boolean) => {
      const behavior = instant || reduced() ? "instant" : "smooth"
      if (across) host.scrollTo({ left: rtl() ? -y : y, behavior })
      else (page ? window : host).scrollTo({ top: y, behavior })
    }
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
      const grab = e.target === thumb ? (across ? e.clientX - t.left : e.clientY - t.top) : (across ? t.width : t.height) / 2
      const follow = (ev: PointerEvent) => {
        const max = (page ? host.scrollHeight : whole()) - seen()
        let share = across ? (ev.clientX - r.left - grab) / (r.width - t.width) : (ev.clientY - r.top - grab) / (r.height - t.height)
        if (across && rtl()) share = 1 - share
        scrollToY(Math.max(0, Math.min(max, share * max)), true)
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
      scrolled.removeEventListener("scroll", soon)
      el.removeEventListener("pointerdown", onPointerDown)
      el.removeAttribute("data-ready")
      host.removeAttribute("data-scrollbar-host")
      if (!hadPrevent) host.removeAttribute("data-lenis-prevent")
    }
  }, [el, variant, axis, min, key, still])
  return setEl
}

type ScrollbarProps = Omit<React.ComponentProps<"div">, "children"> &
  Omit<ScrollbarOptions, "still"> & {
    /** Pins a look for documentation ("hover", "active") and leaves the rail as drawn: set --view and --p yourself. */
    "data-force"?: string
  }

/**
 * A scrollbar as a ruler: a hairline and a thumb as long as the view. Place it inside any scroll container
 * (as its last child, or deeper: it finds the scroller around it) and it pins to that container's edge;
 * axis="x" is the same rail along the bottom of a box that scrolls sideways; variant="page" fixes it
 * to the window and measures the document.
 *
 * It is a pointer aid, hidden from assistive technology: keyboard scrolling stays native, and
 * the sections are marks on the rail that scroll to the element with that id. Anyone who can't point still needs
 * those sections elsewhere on the page (a table of contents).
 */
function Scrollbar({ variant = "inner", axis = "y", min = variant === "page" ? 40 : 24, sections, className, "data-force": force, ...props }: ScrollbarProps) {
  const rail = useScrollbar({ variant, axis, min, sections, still: force !== undefined })
  return (
    <div ref={rail} data-force={force} data-slot="scrollbar" data-variant={variant} data-axis={variant === "inner" && axis === "x" ? "x" : undefined} aria-hidden="true" className={cn("db-scrollbar", className)} {...props}>
      <span data-slot="scrollbar-thumb" className="db-scrollbar-thumb" />
      {sections?.map((s, i) => (
        <span key={s.id} data-slot="scrollbar-mark" data-num={s.num} data-name={s.name} style={{ "--i": i, "--at": s.at } as React.CSSProperties} className="db-scrollbar-mark" />
      ))}
    </div>
  )
}

export { Scrollbar, useScrollbar, type ScrollbarProps, type ScrollbarSection }
