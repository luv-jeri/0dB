"use client"

import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"

type Mode = "day" | "nocturne"

/** The three variants that are a real switch, each with the scene change it asks the page for (a View Transition type). */
const SCENES = { stop: "db-dissolve", dimmer: "db-dim", noon: "db-fall" } as const

type ModeToggleProps = Omit<React.ComponentProps<"button">, "children" | "onChange"> & {
  /**
   * Eight ways to draw the same choice. eclipse: a disc slides over a ring; horizon: the dot rises or sets; words: the chosen word,
   * drawn like a select, rolls to the other; fermata: the arc is an eyelid; sentence: "Read by light." and "Read by night.";
   * knockout: "midday" and "midnight", the second half reversed out of the ink as night falls; hour: 12:00 and 00:00, the hour
   * turning forward whichever way you go. Three are switches with a scene change of their own: stop: "Day" over "Night", the full
   * stop setting from one to the other (the page dissolves); dimmer: "Night", its letters taking the ink in turn (the page's
   * light is lowered or raised); noon: "Noon" and "Moon", one letter apart, the initial falling or rising (night falls over the page).
   */
  variant?: "eclipse" | "horizon" | "words" | "fermata" | "sentence" | "knockout" | "hour" | "stop" | "dimmer" | "noon"
  /** The mode, when you hold it (controlled). */
  mode?: Mode
  /** The mode to start in, when the toggle holds it. */
  defaultMode?: Mode
  /** Called with the mode the person chose, and the click that chose it. The toggle applies nothing to the page. */
  onModeChange?: (mode: Mode, event: React.MouseEvent<HTMLButtonElement>) => void
  /** Pins a state for documentation ("hover", "focus"); set on the root. */
  "data-force"?: string
}

/**
 * The day and night toggle. One button, on when it is night, drawn ten ways: a disc sliding across a ring, a dot above or
 * below a hairline, a word on a hairline that rolls to the other, the fermata as an eye, a sentence whose last word rolls,
 * midday turning to midnight in an ink block, a clock turning from noon to midnight, a full stop setting from Day to Night,
 * a word that takes the ink letter by letter, or Noon turning to Moon. It only reports the choice; the page applies it, for
 * instance `document.documentElement.dataset.mode = mode`. Stop, dimmer and noon carry `data-scene`, the View Transition
 * type their scene change is drawn for; the appearance hook passes it on.
 */
function ModeToggle({ variant = "eclipse", mode, defaultMode = "day", onModeChange, onClick, onPointerLeave, onBlur, className, "data-force": force, "aria-label": label, ...props }: ModeToggleProps) {
  const [own, setOwn] = React.useState<Mode>(defaultMode)
  const now = mode ?? own
  const scene = variant in SCENES ? SCENES[variant as keyof typeof SCENES] : undefined
  // After a press the switch rests: its pointing sketch waits until the pointer leaves or focus moves on.
  const [rested, setRested] = React.useState(false)
  // The hour only turns once the mode has changed, so nothing rolls on first paint.
  const [start] = React.useState(now)
  const [turned, setTurned] = React.useState(false)
  if (!turned && now !== start) setTurned(true)
  return (
    <button
      type="button"
      data-slot="mode-toggle"
      data-variant={variant}
      data-force={force}
      data-turned={variant === "hour" && turned ? "" : undefined}
      data-scene={scene}
      data-rested={scene && rested ? "" : undefined}
      // A scene change swaps what is under the pointer; only a real leave ends the rest.
      onPointerLeave={(e) => { if (!document.documentElement.matches(":active-view-transition")) setRested(false); onPointerLeave?.(e) }}
      onBlur={(e) => { setRested(false); onBlur?.(e) }}
      role={scene ? "switch" : undefined}
      aria-checked={scene ? now === "nocturne" : undefined}
      aria-pressed={scene ? undefined : now === "nocturne"}
      aria-label={label ?? "Night mode"}
      className={cn("db-mode", className)}
      onClick={(e) => {
        onClick?.(e)
        if (e.defaultPrevented) return
        setRested(true)
        const next: Mode = now === "nocturne" ? "day" : "nocturne"
        if (mode === undefined) setOwn(next)
        onModeChange?.(next, e)
      }}
      {...props}
    >
      <span className="db-mode-art" aria-hidden="true">
        {variant === "stop" ? (
          <>
            <span data-for="day">Day</span>
            <span data-for="nocturne">Night</span>
          </>
        ) : variant === "dimmer" ? (
          Array.from("Night", (letter, i) => <span key={i} style={{ "--i": i } as React.CSSProperties}>{letter}</span>)
        ) : variant === "noon" ? (
          <>
            <span className="db-mode-initial"><span>N</span><span>M</span></span>oon
          </>
        ) : variant === "words" ? (
          <span className="db-mode-roll">
            <span>day</span>
            <span>night</span>
          </span>
        ) : variant === "sentence" ? (
          <>
            Read by{" "}
            <span className="db-mode-state">
              <span>light</span>
              <span>night</span>
            </span>
            <span className="db-mode-stop" />
          </>
        ) : variant === "knockout" ? (
          <>
            <span className="db-mode-mid">mid</span>
            <span className="db-mode-block">
              <span>day</span>
              <span>night</span>
            </span>
          </>
        ) : variant === "hour" ? (
          <span className="db-mode-hour">
            <span className="db-mode-digit"><span>1</span><span>0</span></span>
            <span className="db-mode-digit"><span>2</span><span>0</span></span>
            <span className="db-mode-min">:00</span>
          </span>
        ) : null}
      </span>
    </button>
  )
}

export { ModeToggle, type ModeToggleProps, type Mode }
