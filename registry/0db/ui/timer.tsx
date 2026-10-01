"use client"

import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"
import { useDigitRoll } from "@/registry/0db/lib/use-digit-roll"
import { Button } from "@/registry/0db/ui/button"
import { Ring } from "@/registry/0db/ui/radial-chart"

type TimerState = "idle" | "running" | "paused" | "done"

type TimerProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** How long a session lasts, in seconds. Changing it resets the timer. */
  duration?: number
  /** Seconds already spent when it first shows, for a session picked up again. */
  defaultElapsed?: number
  /** What the time is for, e.g. "Writing". It also names the timer for assistive tech. */
  label?: React.ReactNode
  /** ring: a full ring round the time, emptying clockwise. horizon: a half ring on a horizon, the dot crossing it like the sun. */
  variant?: "ring" | "horizon"
  /** Called once when the time runs out. */
  onComplete?: () => void
  /** Pins a state for documentation: "running", "paused" or "done". It does not count. */
  "data-force"?: string
}

const still = () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches
const pad = (n: number) => String(n).padStart(2, "0")
const clock = (s: number) => {
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  return h ? `${h}:${pad(m)}:${pad(s % 60)}` : `${pad(m)}:${pad(s % 60)}`
}
const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? "" : "s"}`
const spoken = (s: number) => {
  const [h, m, sec] = [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60]
  return [h && plural(h, "hour"), m && plural(m, "minute"), sec && plural(sec, "second")].filter(Boolean).join(" ") || "0 seconds"
}
// Worth saying: every five minutes, each of the last five, and thirty seconds. Crossed, not hit, so a tab that slept still says it.
const mark = (m: number) => (m % 60 === 0 && (m % 300 === 0 || m <= 300)) || m === 30
const passed = (from: number, to: number) => {
  for (let m = to; m < from; m++) if (mark(m)) return true
  return false
}
const at = new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" })

/** The figures turn over like a counter's wheels, only those that changed, the units first. */
function Figures({ text }: { text: string }) {
  const { shown: valueShown, figs } = useDigitRoll(text, { order: text, distance: "0.4em" })
  const shown = String(valueShown)
  return (
    <span className="db-timer-figures" dir="ltr" aria-hidden="true">
      {[...shown].map((f, k) => (
        <span key={shown.length - k} ref={(el) => void (figs.current[k] = el)} data-colon={f === ":" || undefined}>
          {f}
        </span>
      ))}
    </span>
  )
}

/**
 * A countdown the person starts. The time is set large in tabular figures inside a hairline ring; the ring empties
 * clockwise from the top as the time goes, the accent dot leading it like a clock's hand. It only counts after
 * Start, follows the wall clock (so a hidden tab doesn't fall behind), and tells screen readers the time politely:
 * on each press, every five minutes, each of the last five, at thirty seconds, and when it's up.
 */
function Timer({ duration = 1500, defaultElapsed = 0, label, variant = "ring", onComplete, className, style, ...props }: TimerProps) {
  const total = Math.max(1, Math.round(duration))
  const force = ["running", "paused", "done"].find((s) => props["data-force"]?.split(" ").includes(s)) as TimerState | undefined
  const [left, setLeft] = React.useState(() => Math.min(total, Math.max(0, total - Math.round(defaultElapsed))))
  const [state, setState] = React.useState<TimerState>(left === 0 ? "done" : left < total ? "paused" : "idle")
  const [ends, setEnds] = React.useState<number | null>(null)
  const [said, setSaid] = React.useState("")
  const ring = React.useRef<HTMLSpanElement>(null)
  const done = React.useRef(onComplete)
  const was = React.useRef(total)
  React.useEffect(() => void (done.current = onComplete), [onComplete])

  // A new length starts over.
  React.useEffect(() => {
    if (was.current === total) return
    was.current = total
    setLeft(total)
    setState("idle")
    setEnds(null)
  }, [total])

  // Before paint, so the ring is never seen empty between a render and the first frame.
  React.useLayoutEffect(() => {
    if (state !== "running" || ends == null) return
    let frame = 0
    let prev = -1
    const smooth = !still()
    // The ring follows the clock every frame (under reduced motion, once a second); it is written here, not by React.
    const draw = (p: number) => {
      ring.current?.style.setProperty("--db-ring-p", String(p))
      ring.current?.style.setProperty("--db-ring-from", String(1 - p))
    }
    const tick = () => {
      const s = Math.max(0, Math.ceil((ends - Date.now()) / 1000))
      if (s === prev) return
      const was = prev
      prev = s
      setLeft(s)
      if (!smooth) draw(s / total)
      if (s === 0) {
        setState("done")
        setEnds(null)
        setSaid("Time is up.")
        done.current?.()
      } else if (was > 0 && passed(was, s)) setSaid(`${spoken(s)} left.`) // the press already said the first
    }
    const run = () => {
      draw(Math.max(0, ends - Date.now()) / 1000 / total)
      frame = requestAnimationFrame(run)
    }
    const beat = setInterval(tick, 250)
    document.addEventListener("visibilitychange", tick)
    tick()
    if (smooth) run()
    return () => {
      clearInterval(beat)
      cancelAnimationFrame(frame)
      document.removeEventListener("visibilitychange", tick)
    }
  }, [state, ends, total])

  const shown = force === "done" ? 0 : left
  const now = force ?? state
  function go() {
    if (state === "running") {
      const s = ends == null ? left : Math.max(0, Math.ceil((ends - Date.now()) / 1000))
      setLeft(s)
      setEnds(null)
      setState("paused")
      setSaid(`Paused, ${spoken(s)} left.`)
      return
    }
    const s = state === "done" ? total : left
    setLeft(s)
    setEnds(Date.now() + s * 1000)
    setState("running")
    setSaid(`${state === "paused" ? "Resumed" : "Started"}, ${spoken(s)} left.`)
  }
  function reset() {
    setLeft(total)
    setEnds(null)
    setState("idle")
    setSaid(`Reset to ${spoken(total)}.`)
  }

  const p = shown / total
  // Running, the effect draws the arc from the clock, so React lets go of it rather than set it back a second.
  const drawn = state === "running" && !force
  const note = now === "running" ? (ends ? `Ends ${at.format(ends)}` : "Running") : now === "paused" ? "Paused" : now === "done" ? "Done" : spoken(total)
  const named = typeof label === "string" ? `${label} timer` : "Timer"
  return (
    <div
      role="group"
      aria-label={named}
      data-slot="timer"
      data-variant={variant}
      data-state={now}
      className={cn("db-timer", className)}
      style={{ "--db-timer-chars": clock(total).length, ...style } as React.CSSProperties}
      {...props}
    >
      <div data-slot="timer-face" className="db-timer-face" aria-hidden="true">
        <Ring ref={ring} value={p} from={1 - p} head="start" style={drawn ? ({ "--db-ring-p": undefined, "--db-ring-from": undefined } as React.CSSProperties) : undefined} />
      </div>
      <div data-slot="timer-read" className="db-timer-read">
        <span role="timer" className="db-timer-time">
          <Figures text={clock(shown)} />
          <span className="db-sr">{spoken(shown)}</span>
        </span>
        <span className="db-timer-words">
          {label != null ? <span className="db-timer-label">{label}</span> : null}
          <span className="db-timer-note">{note}</span>
        </span>
      </div>
      <div data-slot="timer-actions" className="db-timer-actions">
        <Button variant="bracket" onClick={go}>
          {now === "running" ? "Pause" : now === "paused" ? "Resume" : now === "done" ? "Start again" : "Start"}
        </Button>
        <Button variant="bracket" onClick={reset} disabled={now === "idle"}>
          Reset
        </Button>
      </div>
      <p className="db-sr" aria-live="polite">
        {said}
      </p>
    </div>
  )
}

export { Timer, type TimerProps }
