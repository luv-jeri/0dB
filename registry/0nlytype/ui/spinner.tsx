import * as React from "react"

import { cn } from "@/registry/0nlytype/lib/utils"

type SpinnerProps = Omit<React.ComponentProps<"span">, "children"> & {
  /**
   * How the wait is written. dots: three periods breathing in turn. round: three voices chasing
   * round a ring, as the voices of a round do. metronome: a pendulum keeping a slow beat. fermata:
   * the hold, drawn, held and lifted. breath: a dot that opens into a ring and closes again.
   * arpeggio: four notes rising, struck in turn and let ring. word: the label, inked letter by letter.
   */
  variant?: "dots" | "round" | "metronome" | "fermata" | "breath" | "arpeggio" | "word"
  /** m takes the size of the text around it; l stands alone, at the section-heading size. */
  size?: "m" | "l"
  /**
   * Leave it out when the words beside it say what's happening ("Saving"), as a busy button's do:
   * the spinner then stays silent. Given, it's a polite status a screen reader hears once.
   * `word` writes it (default "Loading") and is always read.
   */
  label?: string
}

const marks = { dots: 3, round: 3, metronome: 1, fermata: 1, breath: 1, arpeggio: 4 }

/** Something the person started is under way. Sized in em, so it sits in a line of text at that text's size. */
function Spinner({ variant = "dots", size = "m", label, className, style, ...props }: SpinnerProps) {
  const word = variant === "word" ? (label ?? "Loading") : undefined
  const said = word ?? label
  return (
    <span
      data-slot="spinner"
      data-variant={variant}
      data-size={size === "m" ? undefined : size}
      className={cn("ot-dots", className)}
      style={word ? ({ "--n": Array.from(word).length, ...style } as React.CSSProperties) : style}
      {...(said ? { role: "status", "aria-live": "polite" as const } : { "aria-hidden": true })}
      {...props}
    >
      <span className="ot-dots-art" aria-hidden="true">
        {word
          ? Array.from(word).map((c, i) => (
              <span key={i} style={{ "--i": i } as React.CSSProperties}>
                {c}
              </span>
            ))
          : Array.from({ length: marks[variant as keyof typeof marks] }, (_, i) => <i key={i} />)}
      </span>
      {said ? <span className="ot-sr">{said}</span> : null}
    </span>
  )
}

export { Spinner, type SpinnerProps }
