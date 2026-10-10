"use client"

import * as React from "react"

import { cn } from "@/registry/0nlytype/lib/utils"

type SliderProps = Omit<React.ComponentProps<"input">, "type" | "value" | "defaultValue" | "onChange" | "min" | "max" | "step" | "children"> & {
  /** What is being measured. It labels the range; spread and dynamics set it as the picture, so pass a string there. */
  label: React.ReactNode
  /**
   * dimension: the value is a dimension line from zero to the hand, your number in its gap.
   * spread: the label's letters are spread across the ruler as its marks, and the hand inks them as it passes.
   * dynamics: the label is as loud as the value (its weight follows the hand), over a scale from pp to ff.
   */
  variant?: "dimension" | "spread" | "dynamics"
  min?: number
  max?: number
  step?: number
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  /** Set after the number, as written: pass " kg" with its space, "%" without. */
  unit?: string
  /** Classes for the root. */
  className?: string
  /** Pins a state for documentation ("focus"); set on the root. */
  "data-force"?: string
}

/** The value a quarter-mark stands for, snapped to a step and free of float dust. */
const at = (min: number, max: number, step: number, fraction: number) => {
  const digits = (String(step).split(".")[1] ?? "").length
  return Number((min + Math.round(((max - min) * fraction) / step) * step).toFixed(digits))
}

const dynamics = ["pp", "p", "mp", "mf", "f", "ff"]

/**
 * A ruler with a hand. Native range, so arrows step, Page keys jump and Home / End go to the ends.
 * dimension (the default) draws the value as a dimension, after Paul Rand: a line from zero to the hand with your
 * number, in italic, in the gap; when the gap is too short for it, the number stands outside, past the far tick,
 * as a draughtsman sets it. spread and dynamics make the label the picture (see the variant prop).
 */
function Slider({
  label,
  variant = "dimension",
  min = 0,
  max = 100,
  step = 1,
  value: controlled,
  defaultValue,
  onValueChange,
  unit = "",
  className,
  id,
  "data-force": force,
  ...props
}: SliderProps) {
  const generated = React.useId()
  const inputId = id ?? generated
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue ?? min)
  const value = controlled ?? uncontrolled
  const p = max > min ? (value - min) / (max - min) : 0
  const word = typeof label === "string" && variant !== "dimension" ? label : null
  const shape = word ? variant : "dimension"
  const out = React.useRef<HTMLOutputElement>(null)
  const figure = React.useRef<HTMLSpanElement>(null)

  // The dimension must stay true to the hand, so a figure that doesn't fit its gap is set outside it.
  React.useLayoutEffect(() => {
    const o = out.current
    const f = figure.current
    if (shape !== "dimension" || !o || !f) return
    const place = () => o.toggleAttribute("data-outside", f.offsetWidth + parseFloat(getComputedStyle(o).fontSize) * 0.9 > o.clientWidth)
    place()
    const watch = new ResizeObserver(place)
    watch.observe(o)
    document.fonts?.ready.then(place, () => {})
    return () => watch.disconnect()
  }, [shape, value])

  return (
    <div data-slot="slider" data-variant={shape} data-force={force} className={cn("ot-ruler", className)} style={{ "--p": p } as React.CSSProperties}>
      <label className={word ? "ot-sr" : "ot-label"} htmlFor={inputId}>
        {label}
      </label>
      {shape === "dynamics" ? (
        <output className="ot-ruler-loud" htmlFor={inputId} style={{ "--chars": word?.length } as React.CSSProperties}>
          <span aria-hidden="true">{word}</span>{" "}
          <span className="ot-ruler-yours">
            {`${value}${unit}`}
          </span>
        </output>
      ) : shape === "spread" ? (
        <output className="ot-ruler-yours ot-ruler-corner" htmlFor={inputId}>
          {`${value}${unit}`}
        </output>
      ) : (
        <output ref={out} className="ot-ruler-value" htmlFor={inputId}>
          <span ref={figure}>
            {`${value}${unit}`}
          </span>
        </output>
      )}
      <div className="ot-ruler-hand">
        {shape === "spread" ? (
          <span className="ot-ruler-letters" aria-hidden="true">
            {[...(word ?? "")].map((l, i) => (
              <span key={i}>{l === " " ? " " : l}</span>
            ))}
          </span>
        ) : null}
        <input
          type="range"
          id={inputId}
          min={min}
          max={max}
          step={step}
          value={value}
          aria-valuetext={unit ? `${value}${unit}` : undefined}
          onChange={(e) => {
            const next = Number(e.target.value)
            if (controlled === undefined) setUncontrolled(next)
            onValueChange?.(next)
          }}
          {...props}
        />
      </div>
      <div className="ot-ruler-scale" aria-hidden="true">
        {shape === "dynamics"
          ? dynamics.map((d, i) => (
              <span key={d} className="ot-term" style={{ "--n": i / 5 } as React.CSSProperties} data-on={Math.round(p * 5) === i || undefined}>
                {d}
              </span>
            ))
          : [0, 0.25, 0.5, 0.75, 1].map((n) => (
              <span key={n} style={{ "--n": n } as React.CSSProperties}>
                {at(min, max, step, n)}
              </span>
            ))}
      </div>
    </div>
  )
}

export { Slider, type SliderProps }
