"use client"

import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"
import { roll } from "@/registry/0db/lib/roll"

type ChartProps = Omit<React.ComponentProps<"figure">, "children"> & {
  data: { label: string; value: number }[]
  /** Names the chart for assistive tech, e.g. "Visits by month, 2026". */
  label: string
  /** What the values count, e.g. "visits". Reads "visits in September" beside the number. */
  unit?: string
  /** The bar the number rests on; it carries the accent. Defaults to the last. */
  now?: number
  /** The value the tallest bar could reach. Defaults to the next round number above the largest. */
  max?: number
  format?: (value: number) => string
  /** Pins the pointed-at look on the bar the number is on; set on the root for documentation. */
  "data-force"?: string
}

const figures = new Intl.NumberFormat("en-GB")

// ponytail: 1, 2, 2.5, 5, 10 steps; swap for d3-scale ticks if axes ever need more than a ceiling.
function ceiling(n: number) {
  if (n <= 0) return 1
  const p = 10 ** Math.floor(Math.log10(n))
  return ([1, 2, 2.5, 5, 10].find((s) => s * p >= n) ?? 10) * p
}

/**
 * Hairlines and dots against one very large number. Point at a bar, or focus it, and
 * its line inks, its dot swells and the number rolls to it; leave and it rolls back.
 * Every bar is a button labelled with its value, so the data is read without a pointer.
 */
function Chart({ data, label, unit, now = data.length - 1, max, format = figures.format, className, style, ...props }: ChartProps) {
  const [shown, setShown] = React.useState(now)
  const target = React.useRef(now)
  const value = React.useRef<HTMLSpanElement>(null)
  const plot = React.useRef<HTMLDivElement>(null)
  const top = max ?? ceiling(Math.max(...data.map((d) => d.value)))

  function show(i: number) {
    if (i === target.current || !value.current) return
    const dir = data[i].value > data[target.current].value ? 1 : -1
    target.current = i
    roll(value.current, () => setShown(i), "0.3em", dir)
  }

  const at = data[shown] ?? data[now]
  return (
    <figure
      data-slot="chart"
      className={cn("db-chart", className)}
      style={{ "--n": data.length, ...style } as React.CSSProperties}
      {...props}
    >
      <figcaption data-slot="chart-read" className="db-chart-read">
        <span ref={value} className="db-chart-value">{format(at.value)}</span>
        <span>{unit ? `${unit} in ${at.label}` : at.label}</span>
      </figcaption>
      <div
        ref={plot}
        role="group"
        aria-label={label}
        data-slot="chart-plot"
        className="db-chart-plot"
        onPointerLeave={() => plot.current && !plot.current.contains(document.activeElement) && show(now)}
        onBlur={(e) => !plot.current?.contains(e.relatedTarget) && show(now)}
      >
        {data.map((d, i) => (
          <button
            key={d.label}
            type="button"
            data-slot="chart-bar"
            className="db-chart-bar"
            style={{ "--v": Math.min(d.value / top, 1) } as React.CSSProperties}
            data-now={i === now || undefined}
            data-shown={i === shown || undefined}
            aria-label={`${d.label}, ${format(d.value)}${unit ? ` ${unit}` : ""}`}
            onPointerEnter={() => show(i)}
            onFocus={() => show(i)}
          />
        ))}
      </div>
      <div data-slot="chart-axis" className="db-chart-axis" aria-hidden="true">
        {data.map((d) => (
          <span key={d.label}>{d.label.charAt(0)}</span>
        ))}
      </div>
    </figure>
  )
}

export { Chart, type ChartProps }
