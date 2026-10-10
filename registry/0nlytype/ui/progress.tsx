import * as React from "react"

import { cn } from "@/registry/0nlytype/lib/utils"
import { Fraction } from "@/registry/0nlytype/ui/fraction"

type ProgressProps = Omit<React.ComponentProps<"div">, "children"> & {
  /**
   * hairline (a line that fills toward a ring while an italic percentage ticks), sentence (the words themselves
   * ink in, in reading order) and count (a fraction of items, and one ring per item, like days on a calendar).
   * parentheses (the work still to do is the silence inside a pair of parentheses, which closes on the words) and
   * tally (one stroke per item, gated in fives, as a hand counts). All of them end the same way: when it's done, a full stop lands.
   */
  variant?: "hairline" | "sentence" | "count" | "parentheses" | "tally"
  /** How much is done, out of max. Leave it out (or pass null) while nobody knows yet: the bar is indeterminate. */
  value?: number | null
  /** The total. A count shows one ring per item and a tally one stroke per item, up to 100. */
  max?: number
  /** What is being done, in words ("Uploading 12 files"), without a full stop. It labels the bar; the sentence variant is made of it. */
  label?: React.ReactNode
}

/**
 * How far something the person started has got. Native <progress> underneath, named by a native <label>.
 * One number, --db-progress-p (0–1), is eased in CSS, so the fill, the numeral and the ink glide together.
 */
function Progress({ variant = "hairline", value = null, max = 100, label, className, style, ...props }: ProgressProps) {
  const id = React.useId()
  const known = value != null && Number.isFinite(value) && max > 0
  const done = known ? Math.min(Math.max(value, 0), max) : 0
  const p = known ? done / max : 0
  const state = !known ? "indeterminate" : done >= max ? "complete" : "loading"
  const paren = variant === "parentheses"
  const counted = variant === "count" || variant === "tally"
  // ponytail: one mark per item up to 100; past that each mark stands for a share, since a thousand rings is a texture, not a count.
  const units = counted && max > 0 ? Math.min(Math.round(max), 100) : 0
  const landed = Math.floor(p * units)
  const mark = (i: number) => (
    <i key={i} data-done={i < landed || undefined} data-now={(state === "loading" && i === landed) || undefined} style={{ "--i": i } as React.CSSProperties} />
  )
  return (
    <div
      data-slot="progress"
      data-variant={variant}
      data-state={state}
      className={cn("db-progress", className)}
      style={{ "--db-progress-p": p, ...style } as React.CSSProperties}
      {...props}
    >
      {paren ? (
        <>
          <span className="db-progress-paren" aria-hidden="true">(</span>
          <i className="db-progress-rest" aria-hidden="true" />
        </>
      ) : null}
      {label != null ? (
        <label data-slot="progress-label" className="db-progress-label" htmlFor={id}>
          <span>{label}</span>
        </label>
      ) : null}
      {paren ? (
        <>
          <i className="db-progress-rest" aria-hidden="true" />
          <span className="db-progress-paren" aria-hidden="true">)</span>
        </>
      ) : null}
      {variant === "hairline" ? (
        <p data-slot="progress-value" className="db-progress-value" aria-hidden="true">
          <small>%</small>
        </p>
      ) : null}
      {counted ? <Fraction data-slot="progress-count" className="db-progress-count" aria-hidden="true" count={Math.floor(done)} total={max} /> : null}
      <progress
        id={id}
        value={known ? done : undefined}
        max={max}
        aria-label={label == null ? "Progress" : undefined}
        aria-valuetext={counted && known ? `${Math.floor(done)} of ${max}` : undefined}
      />
      {variant === "hairline" ? <span data-slot="progress-stop" className="db-progress-stop" aria-hidden="true" /> : null}
      {units > 0 && variant === "count" ? (
        <span data-slot="progress-units" className="db-progress-units" aria-hidden="true" style={{ "--n": units } as React.CSSProperties}>
          {Array.from({ length: units }, (_, i) => mark(i))}
        </span>
      ) : null}
      {units > 0 && variant === "tally" ? (
        <span data-slot="progress-tally" className="db-progress-tally" aria-hidden="true" style={{ "--n": units } as React.CSSProperties}>
          {/* Gates of five: four strokes stand, the fifth crosses them. */}
          {Array.from({ length: Math.ceil(units / 5) }, (_, g) => (
            <b key={g}>{Array.from({ length: Math.min(5, units - g * 5) }, (_, k) => mark(g * 5 + k))}</b>
          ))}
        </span>
      ) : null}
    </div>
  )
}

export { Progress, type ProgressProps }
