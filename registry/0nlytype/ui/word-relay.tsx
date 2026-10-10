"use client"

import * as React from "react"
import { flushSync } from "react-dom"

import { cn } from "@/registry/0nlytype/lib/utils"

type WordRelayProps = Omit<React.ComponentProps<"button">, "children" | "onChange"> & {
  /** The sentence up to the word that changes: ours, in the roman. */
  children?: React.ReactNode
  /** The words it can end on, in order, each with its own punctuation ("design."). Pressing goes round them. */
  words: readonly string[]
  /** The chosen word's place in `words`, when you hold it (controlled). */
  index?: number
  /** The word to start on, when the relay holds it. */
  defaultIndex?: number
  /** Requests the next index, whether moved by the person or by autoplay. */
  onIndexChange?: (index: number) => void
  /** sentence: the word on a hairline at the end of the line. statement: after "It has to be design.", the sentence heavy and
   *  narrow, the word large under it in the italic and the accent, overlapping it. */
  variant?: "sentence" | "statement"
  autoplay?: boolean
  /** Time between words, in milliseconds; at least 1000 for a readable rest. */
  interval?: number
  defaultPaused?: boolean
  pauseLabel?: string
  playLabel?: string
  /** Pins a state for documentation ("hover", "focus"). */
  "data-force"?: string
}

const turn = (i: number, n: number) => ((i % n) + n) % n

/**
 * A sentence whose last word is yours to change. Pressing it, or an arrow key, rolls the word on to the
 * next one (out at the top, in from below; back the other way), and the line narrows or widens to it.
 * The word is set in the expression italic. Autoplay gives each word a readable rest; your action takes over.
 */
function WordRelay({ children, words, index, defaultIndex = 0, onIndexChange, variant = "sentence", autoplay = true, interval = 2400, defaultPaused = false, pauseLabel = "pause", playLabel = "play", className, onClick, onKeyDown, "data-force": force, ...props }: WordRelayProps) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const [paused, setPaused] = React.useState(defaultPaused)
  const elapsed = React.useRef(0)
  const automatic = React.useRef(false)
  const [announce, setAnnounce] = React.useState(false)
  const n = Math.max(1, words.length)
  const [own, setOwn] = React.useState(defaultIndex)
  const now = turn(index ?? own, n)
  const [shown, setShown] = React.useState(now)
  const rendered = React.useRef(now)
  const motion = React.useRef<Animation[]>([])
  const way = React.useRef<1 | -1>(1)
  const word = React.useRef<HTMLSpanElement>(null)

  React.useEffect(() => {
    const el = word.current
    if (now === rendered.current || !el) return
    const box = el.parentElement!
    const reduced = matchMedia("(prefers-reduced-motion: reduce)")
    let cancelled = false, frame = 0
    const clear = () => {
      motion.current.forEach((animation) => animation.cancel())
      motion.current = []
    }
    const apply = (animate: boolean) => {
      if (cancelled) return
      const from = box.offsetWidth
      flushSync(() => setShown(now))
      rendered.current = now
      const to = box.offsetWidth
      clear()
      if (!animate) return
      motion.current.push(el.animate([{ opacity: 0, translate: `0 ${way.current > 0 ? "0.7em" : "-0.7em"}` }, { opacity: 1, translate: "0 0" }], { duration: 320, easing: "cubic-bezier(.16,1,.3,1)" }))
      if (from !== to) motion.current.push(box.animate([{ width: `${from}px` }, { width: `${to}px` }], { duration: 320, easing: "cubic-bezier(.65,0,.35,1)" }))
      if (automatic.current && ref.current?.dataset.autoplay !== "playing") motion.current.forEach((animation) => animation.pause())
    }
    const still = () => {
      if (reduced.matches) apply(false)
    }
    if (reduced.matches || force?.split(" ").includes("reduced")) frame = requestAnimationFrame(() => apply(false))
    else {
      const out = el.animate([{ opacity: 1, translate: "0 0" }, { opacity: 0, translate: `0 ${way.current > 0 ? "-0.7em" : "0.7em"}` }], { duration: 160, easing: "cubic-bezier(.65,0,.35,1)", fill: "forwards" })
      motion.current = [out]
      if (automatic.current && ref.current?.dataset.autoplay !== "playing") out.pause()
      out.finished.then(() => apply(!reduced.matches), () => {})
    }
    reduced.addEventListener("change", still)
    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      reduced.removeEventListener("change", still)
      clear()
    }
  }, [now, force])

  const go = (next: number, dir: 1 | -1) => {
    const to = turn(next, n)
    if (to === now) return
    way.current = dir
    if (index === undefined) setOwn(to)
    onIndexChange?.(to)
  }

  const advance = React.useEffectEvent((delta: number) => {
    elapsed.current += delta
    const wait = Number.isFinite(interval) ? Math.max(1000, interval) : 2400
    if (elapsed.current < wait) return
    elapsed.current = 0
    automatic.current = true
    setAnnounce(false)
    go(now + 1, 1)
  })

  const disabled = props.disabled
  const count = words.length
  // A single clock for idle motion. Every pause cancels it; resuming starts with a fresh delta.
  React.useEffect(() => {
    const root = ref.current
    if (!root) return
    const reduced = matchMedia("(prefers-reduced-motion: reduce)")
    let running = false, held = false, visible = false, hovered = root.matches(":hover"), frame = 0, last = 0, timer = 0, restUntil = 0
    const forced = force?.split(" ") ?? []
    const tick = (time: number) => {
      if (!running) return
      const delta = last ? Math.min(time - last, 64) : 0
      last = time
      advance(delta)
      if (running) frame = requestAnimationFrame(tick)
    }
    const sync = () => {
      running = false
      cancelAnimationFrame(frame)
      clearTimeout(timer)
      last = 0
      const resting = performance.now() < restUntil
      const stopped = !autoplay || paused || reduced.matches || forced.includes("reduced") || forced.includes("hover") || forced.includes("focus") || !visible || hovered || held || root.contains(document.activeElement) || document.hidden || disabled || count < 2
      root.dataset.autoplay = stopped || resting ? "paused" : "playing"
      if (automatic.current) motion.current.forEach((animation) => {
        if (animation.playState === "finished") return
        if (stopped || resting) animation.pause()
        else if (animation.playState === "paused") animation.play()
      })
      if (stopped) return
      if (resting) timer = window.setTimeout(sync, restUntil - performance.now())
      else { running = true; frame = requestAnimationFrame(tick) }
    }
    const rest = () => {
      restUntil = performance.now() + 1600
      elapsed.current = 0
      sync()
    }
    const enter = (event: PointerEvent) => {
      if (event.pointerType === "touch") return
      hovered = true
      rest()
    }
    const leave = () => { hovered = false; rest() }
    const down = () => { held = true; rest() }
    const up = () => { if (held) { held = false; rest() } }
    const seen = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync() })
    seen.observe(root)
    root.addEventListener("pointerenter", enter)
    root.addEventListener("pointerleave", leave)
    root.addEventListener("pointerdown", down)
    addEventListener("pointerup", up)
    addEventListener("pointercancel", up)
    root.addEventListener("keydown", rest)
    root.addEventListener("focusin", rest)
    root.addEventListener("focusout", rest)
    addEventListener("scroll", rest, { passive: true })
    document.addEventListener("visibilitychange", sync)
    reduced.addEventListener("change", sync)
    sync()
    return () => {
      running = false
      cancelAnimationFrame(frame)
      clearTimeout(timer)
      seen.disconnect()
      root.removeEventListener("pointerenter", enter)
      root.removeEventListener("pointerleave", leave)
      root.removeEventListener("pointerdown", down)
      removeEventListener("pointerup", up)
      removeEventListener("pointercancel", up)
      root.removeEventListener("keydown", rest)
      root.removeEventListener("focusin", rest)
      root.removeEventListener("focusout", rest)
      removeEventListener("scroll", rest)
      document.removeEventListener("visibilitychange", sync)
      reduced.removeEventListener("change", sync)
    }
  }, [autoplay, paused, force, disabled, count])

  return (
    <span ref={ref} className="ot-relay-frame" data-force={force?.split(" ").includes("reduced") ? "reduced" : undefined} dir={props.dir}>
      <button
        type="button"
        data-slot="word-relay"
        data-variant={variant === "sentence" ? undefined : variant}
        data-force={force}
        className={cn("ot-relay", className)}
        onClick={(e) => {
          onClick?.(e)
          if (!e.defaultPrevented) {
            automatic.current = false
            setAnnounce(true)
            elapsed.current = 0
            go(now + 1, 1)
          }
        }}
        onKeyDown={(e) => {
          onKeyDown?.(e)
          if (e.defaultPrevented) return
          automatic.current = false
          setAnnounce(true)
          elapsed.current = 0
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
        {children ? <span className="ot-relay-lead">{children} </span> : null}
        <span className="ot-relay-word" aria-hidden="true">
          <span ref={word}>{words[shown]}</span>
        </span>
        {/* The chosen word for readers: part of the button's name, and read again when it changes. */}
        <span className="ot-sr" aria-live={announce ? "polite" : "off"}>{words[now]}</span>
      </button>
      {autoplay && <button type="button" className="ot-relay-pause" disabled={props.disabled || words.length < 2} onClick={() => setPaused((value) => !value)}>{paused ? playLabel : pauseLabel}</button>}
    </span>
  )
}

export { WordRelay, type WordRelayProps }
