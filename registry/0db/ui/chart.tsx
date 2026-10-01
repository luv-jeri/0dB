"use client"

import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"
import { roll } from "@/registry/0db/lib/roll"
import { rove } from "@/registry/0db/lib/rove"

/** One point: its label and a number under each series key (`value` when there's one series). */
type ChartDatum = { label: string; value?: number; [key: string]: string | number | undefined }
/** A series: the key it reads from each datum, and its name in the readout. */
type ChartSeries = { key: string; label: string }

type ChartShared = Omit<React.ComponentProps<"figure">, "children"> & {
  data: ChartDatum[]
  /** Two or more series turn the one giant number into a short list, read at the point you're on. */
  series?: ChartSeries[]
  /** Names the chart for assistive tech, e.g. "Visits by month, 2026". */
  label: string
  /** What the values count, e.g. "visits". Reads "visits in September" beside the number. */
  unit?: string
  /** The point the number rests on; it carries the accent. Defaults to the last. */
  now?: number
  /** The value the tallest bar could reach. Defaults to the next round number above the largest. */
  max?: number
  format?: (value: number) => string
  /** Pins the pointed-at look on the point the number is on; set on the root for documentation. */
  "data-force"?: string
}

type ChartProps = ChartShared & {
  /**
   * stems: hairlines and dots against one very large number. spark: word-sized, set in a sentence,
   * the number after it. isotype: each month a column of dots, one dot a fixed amount, counted not scaled.
   */
  variant?: "stems" | "spark" | "isotype"
  /** isotype: what one dot counts. Defaults to a tenth of the ceiling. */
  each?: number
  /** stems: bars stand up from the baseline, or run along from the start edge as a ledger. */
  orientation?: "vertical" | "horizontal"
  /** stems with series: one stem per column, each series a length of it, a dot at every joint. */
  stacked?: boolean
}

/** What a chart's drawing layer is given: each point's [from, to] per series, 0–1 of the ceiling. */
type ChartGeometry = { spans: [number, number][][]; series: ChartSeries[] }

type ChartFrameProps = Omit<ChartProps, "variant"> & {
  variant: string
  /** Drawn in the plot under the points (line-chart, area-chart). */
  layer?: (geometry: ChartGeometry) => React.ReactNode
}

const figures = new Intl.NumberFormat("en-GB")

// ponytail: 1, 2, 2.5, 5, 10 steps; swap for d3-scale ticks if axes ever need more than a ceiling.
function ceiling(n: number) {
  if (n <= 0) return 1
  const p = 10 ** Math.floor(Math.log10(n))
  return ([1, 2, 2.5, 5, 10].find((s) => s * p >= n) ?? 10) * p
}

/**
 * The frame every 0dB chart shares: the rolling readout (one giant number, or a short list for
 * several series), a plot of one button per point, and the axis. Point at or focus a point and the
 * number rolls to it; Left and Right (or Up and Down) move between points, Home and End jump.
 */
function ChartFrame({
  data,
  series,
  label,
  unit,
  now = data.length - 1,
  max,
  format = figures.format,
  variant,
  each,
  orientation = "vertical",
  stacked = false,
  layer,
  className,
  style,
  ...props
}: ChartFrameProps) {
  const [shown, setShown] = React.useState(now)
  // Nothing counts itself in until the person has pointed at something.
  const [moved, setMoved] = React.useState(false)
  const target = React.useRef(now)
  const values = React.useRef<(HTMLSpanElement | null)[]>([])
  const plot = React.useRef<HTMLSpanElement>(null)
  const spark = variant === "spark"
  const isotype = variant === "isotype"
  // Spark and isotype read one series; stems, lines and areas read them all.
  const list = series?.length ? (spark || isotype ? series.slice(0, 1) : series) : [{ key: "value", label: unit ?? "" }]
  const multi = list.length > 1
  const stack = multi && stacked
  const across = orientation === "horizontal" && !spark && !isotype
  // ponytail: missing values count as 0; add gaps in the line when data with holes turns up.
  const raw = data.map((d) => {
    let from = 0
    return list.map((s): [number, number] => {
      const v = Number(d[s.key] ?? 0)
      const span: [number, number] = stack ? [from, from + v] : [0, v]
      from += v
      return span
    })
  })
  const tops = raw.map((s) => Math.max(...s.map((p) => p[1])))
  const top = max ?? ceiling(Math.max(...tops))
  const unitEach = each ?? top / 10
  const rows = isotype ? Math.max(1, Math.round(top / unitEach)) : 0
  const spans = raw.map((s) => s.map(([a, b]): [number, number] => [Math.min(a / top, 1), Math.min(b / top, 1)]))
  // A sparkline spans its own range, low to high, so a word-sized line still shows the shape.
  const lo = Math.min(...tops)
  const hi = Math.max(...tops)
  // What the readout shows at point i: one number, or each series then (stacked) the sum.
  const reading = (i: number) => (multi ? [...raw[i].map((p) => p[1] - p[0]), ...(stack ? [tops[i]] : [])] : [tops[i]])

  function show(i: number) {
    if (i === target.current) return
    const was = reading(target.current)
    const next = reading(i)
    target.current = i
    setMoved(true)
    let rolled = false
    values.current.forEach((el, k) => {
      if (!el || next[k] === was[k]) return
      rolled = true
      roll(el, () => setShown(target.current), "0.3em", next[k] > was[k] ? 1 : -1)
    })
    if (!rolled) setShown(i)
  }

  const at = data[shown] ?? data[now]
  const said = reading(shown)
  const words = unit ? `${unit} in ${at.label}` : at.label
  // A sparkline sits in a sentence, so it's phrasing content: spans, not a figure.
  const Root = (spark ? "span" : "figure") as "figure"
  const Read = (spark ? "span" : "figcaption") as "figcaption"
  const read = multi ? (
    <Read data-slot="chart-read" className="db-chart-read" data-list="">
      <span className="db-chart-at">{at.label}</span>
      <span className="db-chart-list">
        {said.map((v, k) => (
          <span key={k} className="db-chart-row" data-series={k < list.length ? k : undefined} data-total={k === list.length || undefined}>
            <span ref={(el) => void (values.current[k] = el)} className="db-chart-value">
              {format(v)}
            </span>
            <span className="db-chart-name">
              <i className="db-chart-swatch" aria-hidden="true" />
              {k < list.length ? list[k].label : unit ? `${unit} in all` : "in all"}
            </span>
          </span>
        ))}
      </span>
    </Read>
  ) : (
    <Read data-slot="chart-read" className="db-chart-read">
      <span ref={(el) => void (values.current[0] = el)} className="db-chart-value">
        {format(said[0])}
      </span>
      {spark ? " " : null}
      <span>{words}</span>
    </Read>
  )
  const Plot = (spark ? "span" : "div") as "span"

  return (
    <Root
      data-slot="chart"
      data-variant={variant}
      data-orientation={across ? "horizontal" : undefined}
      data-stacked={stack || undefined}
      data-moved={moved || undefined}
      className={cn("db-chart", className)}
      style={{ "--n": data.length, "--rows": rows, "--m": list.length, ...style } as React.CSSProperties}
      {...props}
    >
      {spark ? null : read}
      <Plot
        ref={plot}
        role="group"
        aria-label={label}
        data-slot="chart-plot"
        className="db-chart-plot"
        onKeyDown={(e) => rove(e, "[data-slot=chart-bar]")}
        onPointerLeave={() => plot.current && !plot.current.contains(document.activeElement) && show(now)}
        onBlur={(e) => !plot.current?.contains(e.relatedTarget) && show(now)}
      >
        {layer ? layer({ spans, series: list }) : null}
        {data.map((d, i) => {
          const on = tops[i] > 0 ? Math.min(rows, Math.max(1, Math.round(tops[i] / unitEach))) : 0
          const read = multi
            ? `${d.label}: ${list.map((s, k) => `${s.label} ${format(raw[i][k][1] - raw[i][k][0])}`).join(", ")}${stack ? `, ${format(tops[i])} in all` : ""}`
            : `${d.label}, ${format(tops[i])}${unit ? ` ${unit}` : ""}`
          return (
            <button
              key={d.label}
              type="button"
              tabIndex={i === shown ? 0 : -1}
              data-slot="chart-bar"
              className="db-chart-bar"
              style={{ "--v": Math.min(tops[i] / top, 1), "--s": hi > lo ? 0.2 + (0.8 * (tops[i] - lo)) / (hi - lo) : 1 } as React.CSSProperties}
              data-now={i === now || undefined}
              data-shown={i === shown || undefined}
              aria-label={read}
              onPointerEnter={() => show(i)}
              onFocus={() => show(i)}
            >
              {Array.from({ length: rows }, (_, k) => (
                <i key={k} data-on={k < on || undefined} data-top={k === on - 1 || undefined} style={{ "--k": k } as React.CSSProperties} />
              ))}
              {multi
                ? spans[i].map(([b, v], k) => (
                    <span
                      key={k}
                      className="db-chart-mark"
                      data-series={k}
                      data-top={k === list.length - 1 || undefined}
                      style={{ "--b": b, "--v": v, "--k": k } as React.CSSProperties}
                    />
                  ))
                : null}
            </button>
          )
        })}
      </Plot>
      {spark ? (
        <>
          {" "}
          {read}
        </>
      ) : (
        <div data-slot="chart-axis" className="db-chart-axis" aria-hidden="true">
          {data.map((d, i) => (
            <span key={d.label} data-shown={i === shown || undefined}>{across ? d.label : d.label.charAt(0)}</span>
          ))}
        </div>
      )}
      {isotype ? (
        <span data-slot="chart-key" className="db-chart-key">
          <i aria-hidden="true" />
          One dot, {format(unitEach)}
          {unit ? ` ${unit}` : ""}
        </span>
      ) : null}
    </Root>
  )
}

/**
 * Hairlines and dots against one very large number. Point at a bar, or focus it, and
 * its line inks, its dot swells and the number rolls to it; leave and it rolls back.
 * Every bar is a button labelled with its value, so the data is read without a pointer.
 */
function Chart({ variant = "stems", ...props }: ChartProps) {
  return <ChartFrame variant={variant} {...props} />
}

export { Chart, ChartFrame, type ChartProps, type ChartShared, type ChartDatum, type ChartSeries, type ChartGeometry }
