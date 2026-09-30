"use client"

import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"

type Mode = "day" | "nocturne"

type ModeToggleProps = Omit<React.ComponentProps<"button">, "children" | "onChange"> & {
  /** Five ways to draw the same choice. eclipse: a disc slides over a ring; horizon: the dot rises or sets; words: day and night, one struck through; fermata: the arc is an eyelid; sentence: "Read by light." and "Read by night." */
  variant?: "eclipse" | "horizon" | "words" | "fermata" | "sentence"
  /** The mode, when you hold it (controlled). */
  mode?: Mode
  /** The mode to start in, when the toggle holds it. */
  defaultMode?: Mode
  /** Called with the mode the person chose, and the click that chose it. The toggle applies nothing to the page. */
  onModeChange?: (mode: Mode, event: React.MouseEvent<HTMLButtonElement>) => void
  /** Pins a state for documentation ("hover", "focus"); set on the root. */
  "data-force"?: string
}

const pair = (word: string) => (
  <span className="db-mode-w">
    <span>{word}</span>
    <i>{word}</i>
  </span>
)

/**
 * The day and night toggle. One button, pressed when it is night, drawn five ways: a disc sliding
 * across a ring, a dot above or below a hairline, two words with one struck through, the fermata
 * as an eye, or a sentence whose last word rolls. It only reports the choice; the page applies it,
 * for instance `document.documentElement.dataset.mode = mode`.
 */
function ModeToggle({ variant = "eclipse", mode, defaultMode = "day", onModeChange, onClick, className, "data-force": force, "aria-label": label = "Night mode", ...props }: ModeToggleProps) {
  const [own, setOwn] = React.useState<Mode>(defaultMode)
  const now = mode ?? own
  return (
    <button
      type="button"
      data-slot="mode-toggle"
      data-variant={variant}
      data-force={force}
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
          <>
            {pair("day")}
            {pair("night")}
          </>
        ) : variant === "sentence" ? (
          <>
            Read by{" "}
            <span className="db-mode-state">
              <span>light</span>
              <span>night</span>
            </span>
            <span className="db-mode-stop" />
          </>
        ) : null}
      </span>
    </button>
  )
}

export { ModeToggle, type ModeToggleProps, type Mode }
