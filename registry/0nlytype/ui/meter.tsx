import * as React from "react"

import { cn } from "@/registry/0nlytype/lib/utils"

type MeterProps = Omit<React.ComponentProps<"meter">, "children" | "value" | "min" | "max"> & {
  /** What is measured. The native label names the meter. */
  label: React.ReactNode
  value: number
  min?: number
  max?: number
  /** Written as supplied: " GB" with its space, "%" without. */
  unit?: string
  /** The same formatter sets the reading and both ends of the scale. */
  format?: (value: number) => string
  /** Context for the reading, also attached to the native meter. */
  note?: React.ReactNode
}

const number = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 2 })

/** A bounded reading, not work in progress. The index is exact; the italic figure stays inside the measure. */
function Meter({ label, value, min = 0, max = 100, unit = "", format = (n) => number.format(n), note, id, className, style, hidden, dir, lang, "aria-describedby": describedBy, "aria-valuetext": valueText, ...props }: MeterProps) {
  const generated = React.useId()
  const meterId = id ?? generated
  if (![value, min, max, max - min].every(Number.isFinite) || max <= min)
    throw new RangeError("Meter needs a finite value and a finite range with max greater than min")
  // Match the native meter's clamping, so its spoken value and its visible index always agree.
  const reading = Math.min(max, Math.max(min, value))
  const p = (reading - min) / (max - min)
  const figure = format(reading)
  const text = `${figure}${unit}`
  const noteId = note != null ? `${meterId}-note` : undefined
  const description = [describedBy, noteId].filter(Boolean).join(" ") || undefined
  return (
    <div data-slot="meter" className={cn("db-meter", className)} style={{ "--db-meter-p": p, "--db-meter-length": Math.max(1, [...figure].length), "--db-meter-unit-length": [...unit].length, ...style } as React.CSSProperties} hidden={hidden} dir={dir} lang={lang}>
      <label data-slot="meter-label" className="db-meter-label" htmlFor={meterId}>{label}</label>
      <div data-slot="meter-scale" className="db-meter-scale" aria-hidden="true">
        <span data-slot="meter-reading" className="db-meter-reading"><bdi dir="ltr"><span className="db-yours">{figure}</span><small>{unit}</small></bdi></span>
        <span data-slot="meter-rule" className="db-meter-rule"><i data-slot="meter-index" className="db-meter-index" /></span>
        <span data-slot="meter-limits" className="db-meter-ends"><bdi dir="ltr" data-slot="meter-min">{format(min)}{unit}</bdi><bdi dir="ltr" data-slot="meter-max">{format(max)}{unit}</bdi></span>
      </div>
      <meter {...props} data-slot="meter-native" className="db-sr" id={meterId} value={reading} min={min} max={max} aria-valuetext={valueText ?? text} aria-describedby={description} />
      {note != null ? <p data-slot="meter-note" className="db-meter-note" id={noteId}>{note}</p> : null}
    </div>
  )
}

export { Meter, type MeterProps }
