"use client"

import * as React from "react"

import { cn } from "@/registry/0nlytype/lib/utils"
import { roll } from "@/registry/0nlytype/lib/roll"
import { Marker, type MarkerProps } from "@/registry/0nlytype/ui/marker"
import { Scrollbar } from "@/registry/0nlytype/ui/scrollbar"

type ThreadProps = Omit<React.ComponentProps<"div">, "aria-label"> & {
  /** Names the log: "Halden thread". */
  label: string
  /** The word after the count in the jump: "2 new". */
  newLabel?: string
  /**
   * rests: the space between two messages is the silence between them, and a pause of an hour or more is said in
   * the silence, as a lapse marker says it ("3 hours later"). running: scrolled back, a running head on the top edge says which day you are in.
   */
  variant?: "default" | "rests" | "running"
}

/** Within this many px of the end still counts as being at the end. */
const NEAR = 40

/** A pause long enough to be marked, in minutes. */
const LONG_REST = 60

/** How a long rest reads, in the marker lapse's words: "3 hours later", or "2 days later" across days with no divider. */
const restLabel = (mins: number) => {
  const [n, unit] = mins < 1440 ? [Math.round(mins / 60), "hour"] : [Math.round(mins / 1440), "day"]
  return n === 1 ? `A${unit === "hour" ? "n" : ""} ${unit} later` : `${n} ${unit}s later`
}
/** How far the lapse spreads its letters, 0 to 1: the marker's own scale, a minute (a breath) to a week (the widest). */
const lapseOf = (mins: number) => Math.min(1, Math.log1p(mins) / Math.log1p(7 * 1440))

/**
 * Rests: each message's gap grows with the log of the minutes since the one before (read from its <time dateTime>).
 * A day divider breaks the count, since it already says the time has passed.
 */
function measureRests(scroller: HTMLElement) {
  let prev: number | undefined
  for (const n of Array.from(scroller.children)) {
    if (!(n instanceof HTMLElement)) continue
    if (n.matches('[data-slot="thread-day"]')) {
      prev = undefined
      continue
    }
    if (!n.matches('[data-slot="message"]')) continue
    const t = Date.parse(n.querySelector("time")?.dateTime ?? "")
    const mins = prev === undefined || Number.isNaN(t) ? undefined : (t - prev) / 60000
    if (!Number.isNaN(t)) prev = t
    if (mins === undefined || mins < 0) {
      n.style.removeProperty("--db-rest")
      n.style.removeProperty("--db-lapse")
      delete n.dataset.rest
      continue
    }
    n.style.setProperty("--db-rest", Math.log2(1 + mins).toFixed(2))
    n.style.setProperty("--db-lapse", lapseOf(mins).toFixed(3))
    if (mins >= LONG_REST) n.dataset.rest = restLabel(mins)
    else delete n.dataset.rest
  }
}

type Head = { day: string; time: string }

/** Running head: the day of the first message in view, once that day's divider has scrolled away above it. */
function readHead(scroller: HTMLElement, headHeight: number): Head | null {
  const top = scroller.getBoundingClientRect().top + headHeight
  let day: string | null = null
  for (const n of Array.from(scroller.children)) {
    if (!(n instanceof HTMLElement)) continue
    const isDay = n.matches('[data-slot="thread-day"]')
    if (n.getBoundingClientRect().bottom > top) {
      if (isDay || day === null) return null // the divider is in view and says it itself
      return { day, time: n.querySelector("time")?.textContent ?? "" }
    }
    if (isDay) day = n.textContent ?? ""
  }
  return null
}

/**
 * A message scroller. Give it a height. It keeps to the latest message while you are at the end; scrolled back
 * to read, it stays where you are and counts what arrives in a pill you can press to go down.
 * The messages are its direct children. The scroller takes focus, so the keyboard can scroll it.
 */
function Thread({ label, newLabel = "new", variant = "default", className, children, ...props }: ThreadProps) {
  const scroller = React.useRef<HTMLDivElement>(null)
  const counter = React.useRef<HTMLSpanElement>(null)
  const headEl = React.useRef<HTMLParagraphElement>(null)
  const headDay = React.useRef<HTMLSpanElement>(null)
  const [head, setHead] = React.useState<Head | null>(null)
  // Whether the reader was at the end before anything arrived: the scroll position after it arrives can't say.
  const atEnd = React.useRef(true)
  const unread = React.useRef(0)
  const [shown, setShown] = React.useState(0)

  React.useEffect(() => {
    const el = scroller.current
    if (!el) return
    const toEnd = (behavior: ScrollBehavior = "auto") => el.scrollTo({ top: el.scrollHeight, behavior })
    // The running head rolls its day word, forward when a later day comes up, back when an earlier one does.
    let shownHead: Head | null = null
    const updateHead = () => {
      if (variant !== "running") return
      const next = readHead(el, headEl.current?.offsetHeight ?? 0)
      if (next?.day === shownHead?.day && next?.time === shownHead?.time) return
      const turn = next && shownHead && next.day !== shownHead.day && headDay.current
      const later = turn && !!shownHead && el.scrollTop > lastTop
      shownHead = next
      if (turn) roll(turn, () => setHead(next), "0.5em", later ? 1 : -1)
      else setHead(next)
    }
    let lastTop = el.scrollTop
    if (variant === "rests") measureRests(el)
    toEnd()
    updateHead()
    const onScroll = () => {
      updateHead()
      lastTop = el.scrollTop
      atEnd.current = el.scrollHeight - el.scrollTop - el.clientHeight < NEAR
      if (atEnd.current && unread.current) {
        unread.current = 0
        setShown(0)
      }
    }
    // ponytail: following is instant; smooth-scrolling to each arrival would fight the reader's own scrolling.
    const watch = new MutationObserver((records) => {
      if (variant === "rests") measureRests(el)
      let theirs = 0
      let yours = false
      for (const r of records)
        if (r.target === el)
          r.addedNodes.forEach((n) => {
            if (!(n instanceof HTMLElement && n.matches('[data-slot="message"]'))) return
            if (n.dataset.from === "you") yours = true
            else theirs++
          })
      if (atEnd.current || yours) {
        toEnd() // what you send takes you down; a reply being written in is followed too
        return updateHead()
      }
      if (!theirs) return
      const next = (unread.current += theirs)
      if (counter.current) roll(counter.current, () => setShown(next), "0.5em")
      else setShown(next)
    })
    watch.observe(el, { childList: true, subtree: true, characterData: true })
    el.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      watch.disconnect()
      el.removeEventListener("scroll", onScroll)
    }
  }, [variant])

  const jump = () => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches
    scroller.current?.focus({ preventScroll: true })
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: reduced ? "auto" : "smooth" })
  }

  return (
    <div data-slot="thread" data-variant={variant === "default" ? undefined : variant} className={cn("db-thread", className)} {...props}>
      <div
        ref={scroller}
        data-slot="thread-scroll"
        data-lenis-prevent=""
        role="log"
        aria-label={label}
        tabIndex={0}
        className="db-thread-scroll db-scroll"
      >
        {children}
        <Scrollbar />
      </div>
      {variant === "running" && (
        // The log already says every day and time; the head repeats them for the eye.
        <p ref={headEl} data-slot="thread-head" className="db-thread-head" aria-hidden="true" data-shown={head ? "" : undefined}>
          <span ref={headDay}>{head?.day}</span>
          <time>{head?.time}</time>
        </p>
      )}
      {shown > 0 && (
        <button type="button" data-slot="thread-latest" className="db-thread-latest" onClick={jump}>
          <span aria-hidden="true">↓</span>
          <span ref={counter} className="db-thread-new">{shown}</span> {newLabel}
          <span className="db-sr"> messages: go to the latest</span>
        </button>
      )}
    </div>
  )
}

/** Where a day begins: a word with a rule drawn out to each side. */
function ThreadDay(props: Omit<MarkerProps, "variant">) {
  return <Marker data-slot="thread-day" variant="divider" {...props} />
}

export { Thread, ThreadDay, type ThreadProps }
