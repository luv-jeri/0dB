"use client"

import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"
import { roll } from "@/registry/0db/lib/roll"

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
}

/** A frame kept to a ratio and marked the way a printer marks a crop: short lines outside each corner, never a border. */
function AspectRatio({ ratio = 16 / 9, label, className, style, children, ...props }: AspectRatioProps) {
  const [a, b] = toFraction(ratio)
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
    <div data-slot="aspect-ratio" style={{ "--ratio": ratio, ...style } as React.CSSProperties} className={cn("db-ratio", className)} {...props}>
      {label === true ? (
        <span className="db-fraction" aria-hidden="true">
          <span ref={(el) => void (refs.current[0] = el)} className="db-yours">{shown[0]}</span>
          <i />
          <span ref={(el) => void (refs.current[1] = el)}>{shown[1]}</span>
        </span>
      ) : (
        label
      )}
      {children}
    </div>
  )
}

export { AspectRatio, type AspectRatioProps }
