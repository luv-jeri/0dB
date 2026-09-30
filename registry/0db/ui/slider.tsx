"use client"

import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"

type SliderProps = Omit<React.ComponentProps<"input">, "type" | "value" | "defaultValue" | "onChange" | "min" | "max" | "step" | "children"> & {
  /** What is being measured. It labels the range. */
  label: React.ReactNode
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

/**
 * A ruler with a hand. Above it the value is drawn as a dimension: a line from zero
 * to the hand with your number, in italic, in the gap. Native range, so arrows step,
 * Page keys jump and Home / End go to the ends.
 */
function Slider({
  label,
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
  return (
    <div data-slot="slider" data-force={force} className={cn("db-ruler", className)} style={{ "--p": p } as React.CSSProperties}>
      <label className="db-label" htmlFor={inputId}>
        {label}
      </label>
      <output className="db-ruler-value" htmlFor={inputId}>
        {value}
        {unit}
      </output>
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
      <div className="db-ruler-scale" aria-hidden="true">
        {[0, 0.25, 0.5, 0.75, 1].map((n) => (
          <span key={n} style={{ "--n": n } as React.CSSProperties}>
            {at(min, max, step, n)}
          </span>
        ))}
      </div>
    </div>
  )
}

export { Slider, type SliderProps }
