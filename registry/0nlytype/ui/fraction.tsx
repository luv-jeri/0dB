"use client"

import * as React from "react"

import { useDigitRoll } from "@/registry/0nlytype/lib/use-digit-roll"
import { cn } from "@/registry/0nlytype/lib/utils"

type FractionProps = Omit<React.ComponentProps<"span">, "children"> & {
  /** The part that's yours, in italic. */
  count: React.ReactNode
  /** What it counts toward. Leave it out and the count stands alone: a figure of yours that turns over as it changes. */
  total?: React.ReactNode
  /** solidus: on a leaning pen stroke. vinculum: stacked over a bar that inks the share. readout: the share hung beside it as a decimal. */
  variant?: "solidus" | "vinculum" | "readout"
}

const plain = (v: React.ReactNode): v is string | number => typeof v === "string" || typeof v === "number"
// A number, however it's grouped or pointed (12, 1 284, 0.75): figures, and no letters.
const figures = /^[^\p{L}]*\d[^\p{L}]*$/u
const digit = /\d/
// ponytail: reads the figures and the point only, which is enough to pick the way the wheels turn.
const amount = (v: string | number) => (typeof v === "number" ? v : Number(v.replace(/[^\d.]/g, "")))
const still = () => matchMedia("(prefers-reduced-motion: reduce)").matches

/**
 * One side of the fraction. A number turns over figure by figure, and only the figures that changed:
 * the units first, the carry running leftward one arpeggio step behind, as a counter's wheels do.
 * A number that gains or loses a figure, or a word, turns over whole; anything else just changes.
 */
function Side({ value, className, hidden }: { value: React.ReactNode; className?: string; hidden?: boolean }) {
  const { shown, whole, figs } = useDigitRoll(value, { order: plain(value) ? amount(value) : 0, numeric: true })

  const text = plain(value) && plain(shown) ? String(shown) : null
  return (
    <span ref={whole} className={className} aria-hidden={hidden || undefined}>
      {text !== null && figures.test(text) ? (
        <>
          <span aria-hidden="true">
            {[...text].map((f, k) => (
              <span key={text.length - k} ref={(el) => void (figs.current[k] = el)} className={digit.test(f) ? "ot-fraction-figure" : undefined}>
                {f}
              </span>
            ))}
          </span>
          <span className="ot-sr">{text}</span>
        </>
      ) : (
        (text ?? value)
      )}
    </span>
  )
}

/**
 * A count set as a display fraction with a leaning hairline. Reads aloud as "2 of 5". When a number
 * changes it turns over the way the count moved, and the solidus ticks like a pen. The figures always
 * read left to right, in a right-to-left page too. vinculum stacks the count over a bar that inks its
 * share; readout hangs the share beside it as a decimal, the way Ikeda's posters print 1/3 by 0.13.
 */
function Fraction({ count, total, variant = "solidus", className, style, ...props }: FractionProps) {
  const was = React.useRef([count, total])
  const slash = React.useRef<HTMLElement>(null)

  React.useEffect(() => {
    const moved = [count, total].map((v, i) => [was.current[i], v]).find(([a, b]) => !Object.is(a, b) && plain(a) && plain(b))
    was.current = [count, total]
    if (!moved || variant !== "solidus" || !slash.current?.animate || still()) return
    const lean = amount(moved[1] as string | number) < amount(moved[0] as string | number) ? -1 : 1
    slash.current.animate([{ rotate: "24deg" }, { rotate: `${24 + lean * 9}deg`, offset: 0.3 }, { rotate: "24deg" }], { duration: 560, easing: "cubic-bezier(0.34, 1.5, 0.5, 1)" }) // --ot-spiccato
  }, [count, total, variant])

  const share = plain(count) && plain(total) && Number(total) > 0 ? Math.min(1, Math.max(0, Number(count) / Number(total))) : null
  return (
    <span
      data-slot="fraction"
      data-variant={variant === "solidus" ? undefined : variant}
      className={cn("ot-fraction", className)}
      style={variant === "vinculum" && share !== null ? ({ "--share": share, ...style } as React.CSSProperties) : style}
      {...props}
    >
      {variant === "readout" && share !== null ? <Side value={share.toFixed(2)} className="ot-fraction-readout" hidden /> : null}
      <Side value={count} className="ot-yours" />
      {total === undefined ? null : (
        <>
          <i ref={slash}>
            <span className="ot-sr"> of </span>
          </i>
          <Side value={total} />
        </>
      )}
    </span>
  )
}

export { Fraction, type FractionProps }
