"use client"

import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"

type MarqueeProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** The words: each child is one word or phrase in the band. */
  children: React.ReactNode
  /**
   * band: display words, each closed by a full stop, cropped by the frame's ends.
   * ticker: small capitals running between two hairlines.
   * counter: two rows of the band cropped against each other, running opposite ways.
   */
  variant?: "band" | "ticker" | "counter"
  /** How far the words travel for each pixel the page scrolls. */
  speed?: number
  /** Travel towards the start as you scroll down, instead of reading along towards the end. */
  reverse?: boolean
  /** Names the list of words for readers. */
  label?: string
  /** Drift between interactions. Reduced motion always keeps the band still. */
  autoplay?: boolean
  /** Start with the visible play control, awaiting the person's choice. */
  defaultPaused?: boolean
  pauseLabel?: string
  playLabel?: string
  "data-force"?: string
}

/**
 * A band of words that drifts, with a visible pause control. Scroll takes over and keeps step with smooth scrolling.
 * The first run of words is the list readers get; the copies that fill the band are hidden from them.
 */
function Marquee({ children, variant = "band", speed = 0.4, reverse = false, label, autoplay = true, defaultPaused = false, pauseLabel = "pause", playLabel = "play", "data-force": force, className, ...props }: MarqueeProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [paused, setPaused] = React.useState(defaultPaused)
  const drift = React.useRef<(delta: number) => void>(() => {})
  const [copies, setCopies] = React.useState(2)
  const words = React.Children.toArray(children)

  React.useEffect(() => {
    const el = ref.current
    const run = el?.querySelector<HTMLElement>(".db-marquee-words")
    if (!el || !run) return
    const reduced = matchMedia("(prefers-reduced-motion: reduce)")
    let period = 0, frame = 0, carried = 0
    // How far the band has risen through the view, times the speed, wrapped to one run of words. Read from the real
    // layout in a frame asked for by the scroll event, which runs after a smooth scroller's own frame.
    const read = () => {
      if (!period || reduced.matches || force?.split(" ").includes("reduced")) return
      const travelled = carried + (innerHeight - el.getBoundingClientRect().top) * speed
      el.style.setProperty("--o", `${((travelled % period) + period) % period}px`)
    }
    const measure = () => {
      period = run.offsetWidth // one run, its trailing gap included: a new face or size changes it
      el.style.setProperty("--period", `${period}px`)
      if (period) setCopies(Math.max(2, Math.ceil(el.clientWidth / period) + 1))
      read()
    }
    drift.current = (delta) => {
      carried = period ? (carried + delta * 0.024) % period : 0
      read()
    }
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(read)
    }
    const resized = new ResizeObserver(measure)
    resized.observe(el)
    resized.observe(run)
    reduced.addEventListener("change", measure)
    addEventListener("scroll", onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      resized.disconnect()
      reduced.removeEventListener("change", measure)
      drift.current = () => {}
      removeEventListener("scroll", onScroll)
    }
  }, [speed, force])

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
      drift.current(delta)
      if (running) frame = requestAnimationFrame(tick)
    }
    const sync = () => {
      running = false
      cancelAnimationFrame(frame)
      clearTimeout(timer)
      last = 0
      const resting = performance.now() < restUntil
      const stopped = !autoplay || paused || reduced.matches || forced.includes("reduced") || forced.includes("hover") || forced.includes("focus") || !visible || hovered || held || root.contains(document.activeElement) || document.hidden
      root.dataset.autoplay = stopped || resting ? "paused" : "playing"
      if (stopped) return
      if (resting) timer = window.setTimeout(sync, restUntil - performance.now())
      else { running = true; frame = requestAnimationFrame(tick) }
    }
    const rest = () => {
      restUntil = performance.now() + 1600
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
  }, [autoplay, paused, force])

  const rows = variant === "counter" ? 2 : 1
  return (
    <div ref={ref} data-slot="marquee" data-force={force} data-variant={variant === "band" ? undefined : variant} className={cn("db-marquee", className)} {...props}>
      <div className="db-marquee-frame">
        {Array.from({ length: rows }, (_, row) => (
          <div key={row} className="db-marquee-row" data-back={reverse !== (row === 1) || undefined}>
            <div className="db-marquee-track">
              {Array.from({ length: copies }, (_, copy) => {
                const read = row === 0 && copy === 0
                return (
                  <ul key={copy} className="db-marquee-words" aria-label={read ? label : undefined} aria-hidden={read ? undefined : true} inert={!read}>
                    {words.map((word, i) => (
                      <li key={i}>{word}</li>
                    ))}
                  </ul>
                )
              })}
            </div>
          </div>
        ))}
      </div>
      {autoplay && <button type="button" className="db-marquee-pause" onClick={() => setPaused((value) => !value)}>{paused ? playLabel : pauseLabel}</button>}
    </div>
  )
}

export { Marquee, type MarqueeProps }
