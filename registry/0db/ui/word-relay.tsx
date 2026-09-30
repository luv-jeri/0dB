"use client"

import * as React from "react"
import { flushSync } from "react-dom"

import { roll } from "@/registry/0db/lib/roll"
import { cn } from "@/registry/0db/lib/utils"

type WordRelayProps = Omit<React.ComponentProps<"button">, "children" | "onChange"> & {
  /** The sentence up to the word that changes: ours, in the roman. */
  children?: React.ReactNode
  /** The words it can end on, in order, each with its own punctuation ("design."). Pressing goes round them. */
  words: readonly string[]
  /** The chosen word's place in `words`, when you hold it (controlled). */
  index?: number
  /** The word to start on, when the relay holds it. */
  defaultIndex?: number
  /** Called with the place of the word the person moved to. */
  onIndexChange?: (index: number) => void
  /** sentence: the word on a hairline at the end of the line. statement: after "It has to be design.", the sentence heavy and
   *  narrow, the word large under it in the italic and the accent, overlapping it. */
  variant?: "sentence" | "statement"
  /** Pins a state for documentation ("hover", "focus"). */
  "data-force"?: string
}

const turn = (i: number, n: number) => ((i % n) + n) % n

/**
 * A sentence whose last word is yours to change. Pressing it, or an arrow key, rolls the word on to the
 * next one (out at the top, in from below; back the other way), and the line narrows or widens to it.
 * The word is set in the expression italic, since it is the one you chose. It never moves by itself.
 */
function WordRelay({ children, words, index, defaultIndex = 0, onIndexChange, variant = "sentence", className, onClick, onKeyDown, "data-force": force, ...props }: WordRelayProps) {
  const n = Math.max(1, words.length)
  const [own, setOwn] = React.useState(defaultIndex)
  const now = turn(index ?? own, n)
  const [shown, setShown] = React.useState(now)
  const way = React.useRef<1 | -1>(1)
  const word = React.useRef<HTMLSpanElement>(null)

  React.useEffect(() => {
    const el = word.current
    if (now === shown || !el) return
    const box = el.parentElement!
    roll(el, () => {
      // The line follows the word: it narrows or widens from the old width to the new one while the word comes in.
      const from = box.offsetWidth
      flushSync(() => setShown(now))
      const to = box.offsetWidth
      if (from !== to && !matchMedia("(prefers-reduced-motion: reduce)").matches)
        box.animate([{ width: `${from}px` }, { width: `${to}px` }], { duration: 320, easing: "cubic-bezier(.65,0,.35,1)" })
    }, "0.7em", way.current)
  }, [now, shown])

  const go = (next: number, dir: 1 | -1) => {
    const to = turn(next, n)
    if (to === now) return
    way.current = dir
    if (index === undefined) setOwn(to)
    onIndexChange?.(to)
  }

  return (
    <button
      type="button"
      data-slot="word-relay"
      data-variant={variant === "sentence" ? undefined : variant}
      data-force={force}
      className={cn("db-relay", className)}
      onClick={(e) => {
        onClick?.(e)
        if (!e.defaultPrevented) go(now + 1, 1)
      }}
      onKeyDown={(e) => {
        onKeyDown?.(e)
        if (e.defaultPrevented) return
        const rtl = getComputedStyle(e.currentTarget).direction === "rtl"
        const k = e.key === "ArrowLeft" && rtl ? "ArrowRight" : e.key === "ArrowRight" && rtl ? "ArrowLeft" : e.key
        if (k === "ArrowDown" || k === "ArrowRight") go(now + 1, 1)
        else if (k === "ArrowUp" || k === "ArrowLeft") go(now - 1, -1)
        else if (k === "Home") go(0, -1)
        else if (k === "End") go(n - 1, 1)
        else return
        e.preventDefault()
      }}
      {...props}
    >
      {children ? <span className="db-relay-lead">{children} </span> : null}
      <span className="db-relay-word" aria-hidden="true">
        <span ref={word}>{words[shown]}</span>
      </span>
      {/* The chosen word for readers: part of the button's name, and read again when it changes. */}
      <span className="db-sr" aria-live="polite">{words[now]}</span>
    </button>
  )
}

export { WordRelay, type WordRelayProps }
