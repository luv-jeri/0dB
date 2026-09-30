"use client"

import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"
import { roll } from "@/registry/0db/lib/roll"
import { Marker, type MarkerProps } from "@/registry/0db/ui/marker"
import { Scrollbar } from "@/registry/0db/ui/scrollbar"

type ThreadProps = Omit<React.ComponentProps<"div">, "aria-label"> & {
  /** Names the log: "Halden thread". */
  label: string
  /** The word after the count in the jump: "2 new". */
  newLabel?: string
}

/** Within this many px of the end still counts as being at the end. */
const NEAR = 40

/**
 * A message scroller. Give it a height. It keeps to the latest message while you are at the end; scrolled back
 * to read, it stays where you are and counts what arrives in a pill you can press to go down.
 * The messages are its direct children. The scroller takes focus, so the keyboard can scroll it.
 */
function Thread({ label, newLabel = "new", className, children, ...props }: ThreadProps) {
  const scroller = React.useRef<HTMLDivElement>(null)
  const counter = React.useRef<HTMLSpanElement>(null)
  // Whether the reader was at the end before anything arrived: the scroll position after it arrives can't say.
  const atEnd = React.useRef(true)
  const unread = React.useRef(0)
  const [shown, setShown] = React.useState(0)

  React.useEffect(() => {
    const el = scroller.current
    if (!el) return
    const toEnd = (behavior: ScrollBehavior = "auto") => el.scrollTo({ top: el.scrollHeight, behavior })
    toEnd()
    const onScroll = () => {
      atEnd.current = el.scrollHeight - el.scrollTop - el.clientHeight < NEAR
      if (atEnd.current && unread.current) {
        unread.current = 0
        setShown(0)
      }
    }
    // ponytail: following is instant; smooth-scrolling to each arrival would fight the reader's own scrolling.
    const watch = new MutationObserver((records) => {
      let theirs = 0
      let yours = false
      for (const r of records)
        if (r.target === el)
          r.addedNodes.forEach((n) => {
            if (!(n instanceof HTMLElement && n.matches('[data-slot="message"]'))) return
            if (n.dataset.from === "you") yours = true
            else theirs++
          })
      if (atEnd.current || yours) return toEnd() // what you send takes you down; a reply being written in is followed too
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
  }, [])

  const jump = () => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: reduced ? "auto" : "smooth" })
  }

  return (
    <div data-slot="thread" className={cn("db-thread", className)} {...props}>
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
