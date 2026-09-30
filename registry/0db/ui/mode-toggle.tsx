"use client"

import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"

type Mode = "day" | "nocturne"

type ModeToggleProps = Omit<React.ComponentProps<"button">, "children" | "onChange"> & {
  /**
   * Seven ways to draw the same choice. eclipse: a disc slides over a ring; horizon: the dot rises or sets; words: the chosen word,
   * drawn like a select, rolls to the other; fermata: the arc is an eyelid; sentence: "Read by light." and "Read by night.";
   * knockout: "midday" and "midnight", the second half reversed out of the ink as night falls; hour: 12:00 and 00:00, the hour
   * turning forward whichever way you go.
   */
  variant?: "eclipse" | "horizon" | "words" | "fermata" | "sentence" | "knockout" | "hour"
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
 * The day and night toggle. One button, pressed when it is night, drawn seven ways: a disc sliding
 * across a ring, a dot above or below a hairline, a word on a hairline that rolls to the other, the fermata
 * as an eye, a sentence whose last word rolls, midday turning to midnight in an ink block, or a clock
 * turning from noon to midnight. It only reports the choice; the page applies it,
 * for instance `document.documentElement.dataset.mode = mode`.
 */
function ModeToggle({ variant = "eclipse", mode, defaultMode = "day", onModeChange, onClick, className, "data-force": force, "aria-label": label = "Night mode", ...props }: ModeToggleProps) {
  const [own, setOwn] = React.useState<Mode>(defaultMode)
  const now = mode ?? own
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
      aria-pressed={now === "nocturne"}
      aria-label={label}
      className={cn("db-mode", className)}
      onClick={(e) => {
        onClick?.(e)
        if (e.defaultPrevented) return
        const next: Mode = now === "nocturne" ? "day" : "nocturne"
        if (mode === undefined) setOwn(next)
        onModeChange?.(next, e)
      }}
      {...props}
    >
      <span className="db-mode-art" aria-hidden="true">
        {variant === "words" ? (
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
