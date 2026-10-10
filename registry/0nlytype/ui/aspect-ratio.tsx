"use client"

import * as React from "react"

import { cn } from "@/registry/0nlytype/lib/utils"
import { roll } from "@/registry/0nlytype/lib/roll"

/** 1.7778 to 16 : 9. Finds the smallest denominator up to 20 that lands on a whole number. */
function toFraction(ratio: number): [number, number] {
  for (let b = 1; b <= 20; b++) if (Math.abs(ratio * b - Math.round(ratio * b)) < 0.01) return [Math.round(ratio * b), b]
  return [Math.round(ratio * 10), 10]
}

type AspectRatioProps = React.ComponentProps<"div"> & {
  /** Width over height. 16 / 9 by default. */
  ratio?: number
  /**
   * What sits in the frame's middle. true draws the ratio as a fraction (16 over 9);
   * it rolls when the ratio changes. Anything else is shown as given.
   */
  label?: React.ReactNode
  /**
   * crop: the printer's crop marks only.
   * diagonal: the scaling diagonal, corner to corner, with the ratio written along it.
   * square: the largest square ruled off, and what's left named by its own ratio.
   */
  variant?: "crop" | "diagonal" | "square"
}

const gcd = (x: number, y: number): number => (y ? gcd(y, x % y) : x)

/** A frame kept to a ratio and marked the way a printer marks a crop: short lines outside each corner, never a border. */
function AspectRatio({ ratio = 16 / 9, label, variant = "crop", className, style, children, ...props }: AspectRatioProps) {
  const [a, b] = toFraction(ratio)
  const orient = a > b ? "landscape" : a < b ? "portrait" : "square"
  // What's left once the square is ruled off: 16 : 9 leaves 7 : 9, 4 : 5 leaves 4 : 1.
  const rest = orient === "landscape" ? [a - b, b] : [a, b - a]
  const k = gcd(rest[0], rest[1]) || 1
  const [shown, setShown] = React.useState<[number, number]>([a, b])
  const before = React.useRef(ratio)
  const refs = React.useRef<[HTMLSpanElement | null, HTMLSpanElement | null]>([null, null])

  React.useEffect(() => {
    if (before.current === ratio) return
    const dir = ratio > before.current ? 1 : -1
    before.current = ratio
    const next = toFraction(ratio)
    // The numerator and the denominator each roll the way the ratio moved.
    refs.current.forEach((el, i) => el && roll(el, () => setShown((s) => (i ? [s[0], next[1]] : [next[0], s[1]])), "0.5em", dir))
  }, [ratio])

  return (
    <div
      data-slot="aspect-ratio"
      data-variant={variant}
      data-orient={orient}
      style={{ "--ratio": ratio, ...style } as React.CSSProperties}
      className={cn("ot-ratio", className)}
      {...props}
    >
      {label === true ? (
        <span className="ot-fraction" aria-hidden="true">
          <span ref={(el) => void (refs.current[0] = el)} className="ot-yours">{shown[0]}</span>
          <i />
          <span ref={(el) => void (refs.current[1] = el)}>{shown[1]}</span>
        </span>
      ) : null}
      {label === true ? (
        <span className="ot-sr">
          {a} by {b}
        </span>
      ) : (
        label
      )}
      {label === true && variant === "square" && orient !== "square" ? (
        // Keyed, so the name of what's left arrives again once the square has glided to its new place.
        <span key={`${orient} ${rest}`} className="ot-ratio-rest" aria-hidden="true">
          <span className="ot-fraction">
            <span>{rest[0] / k}</span>
            <i />
            <span>{rest[1] / k}</span>
          </span>
        </span>
      ) : null}
      {children}
    </div>
  )
}

export { AspectRatio, type AspectRatioProps }
