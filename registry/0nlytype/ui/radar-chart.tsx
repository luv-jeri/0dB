"use client"

import * as React from "react"

import { cn } from "@/registry/0nlytype/lib/utils"
import { activeIndex } from "@/registry/0nlytype/lib/chart-index"
import { rove } from "@/registry/0nlytype/lib/rove"
import { Grid } from "@/registry/0nlytype/ui/grid"

/** One axis: its name and a number under each series key (`value` when there's one series). */
type RadarDatum = { label: string; value?: number; [key: string]: string | number | undefined }
type RadarSeries = { key: string; label: string }

type RadarChartProps = Omit<React.ComponentProps<"figure">, "children"> & {
  /** One axis per entry, clockwise from the top. Three or more. */
  data: RadarDatum[]
  /** Two or three shapes on one sheet, each read from its key in every datum. */
  series?: RadarSeries[]
  /** Names the chart for assistive tech, e.g. "How the three typefaces compare". */
  label: string
  /** The value at the rim, shared by every axis; the measured figure reads against it (8/10). Defaults to the next round number above the largest. */
  max?: number
  format?: (value: number) => string
  /** The axis the keyboard starts on, and the one a forced hover measures. Defaults to the first. */
  now?: number
  /** The side of one square of the dotted sheet behind, in pixels. */
  cell?: number
  /** Pins the pointed-at look on `now`; set on the root for documentation. */
  "data-force"?: string
}

const figures = new Intl.NumberFormat("en-GB")
// The rim's radius: a third of the plot's width, less where the plot is narrow, so the axis names keep ROOM
// pixels beside it and stay off the sheet's lettered border.
const RIM = 0.34
const ROOM = 76
// How far each dimension line stands off its spoke, in pixels, and how long its end ticks are.
const OFF = 12
const TICK = 5

// ponytail: chart's 1, 2, 2.5, 5, 10 ceiling, kept here so a radar doesn't pull in the bar chart.
function ceiling(n: number) {
  if (n <= 0) return 1
  const p = 10 ** Math.floor(Math.log10(n))
  return ([1, 2, 2.5, 5, 10].find((s) => s * p >= n) ?? 10) * p
}

type XY = [number, number]
const at = (r: number, a: number): XY => [Math.sin(a) * r, -Math.cos(a) * r]
const poly = (p: XY[]) => `M${p.map(([x, y]) => `${x},${y}`).join("L")}Z`

/**
 * Several measures on one shape: a hairline polygon on a dotted construction sheet, each axis named in small caps at
 * its end. Point at an axis, or focus its name, and its value is measured off as a draughtsman's dimension line, from
 * the centre out along the spoke to the point, with its figure set on it.
 */
function RadarChart({ data, series, label, max, format = figures.format, now = 0, cell = 27, className, style, ...props }: RadarChartProps) {
  const force = props["data-force"]?.split(" ").includes("hover")
  const [active, setShown] = React.useState(force ? now : -1)
  const shown = activeIndex(active, data.length)
  // Forget an axis that was removed, so adding axes later cannot revive an old highlight.
  if (active !== shown) setShown(shown)
  const [w, setW] = React.useState(0)
  const draw = React.useRef<SVGSVGElement>(null)
  const plot = React.useRef<HTMLDivElement>(null)
  const observe = React.useCallback((el: SVGSVGElement | null) => {
    draw.current = el
    if (!el) return
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width))
    ro.observe(el)
    return () => {
      ro.disconnect()
      draw.current = null
    }
  }, [])

  const list = series?.length ? series.slice(0, 3) : [{ key: "value", label: "" }]
  const n = data.length
  const read = (d: RadarDatum, k: string) => Math.max(0, Number(d[k] ?? 0) || 0)
  const top = max && max > 0 ? max : ceiling(Math.max(...data.flatMap((d) => list.map((s) => read(d, s.key)))))
  const angle = (i: number) => (i / n) * 2 * Math.PI
  const R = Math.max(0.2 * w, Math.min(RIM * w, w / 2 - ROOM))
  const rest = () => !plot.current?.contains(document.activeElement) && setShown(-1)

  // The axis nearest the pointer, by angle; the very middle keeps what's shown.
  function pick(e: React.PointerEvent) {
    const box = draw.current?.getBoundingClientRect()
    if (!box) return
    const rtl = getComputedStyle(e.currentTarget).direction === "rtl"
    const dx = (e.clientX - box.left - box.width / 2) * (rtl ? -1 : 1)
    const dy = e.clientY - box.top - box.height / 2
    if (Math.hypot(dx, dy) < 8) return
    const t = (Math.atan2(dx, -dy) / (2 * Math.PI) + 1) % 1
    setShown(Math.round(t * n) % n)
  }

  if (n < 3) {
    return (
      <figure data-slot="radar-chart" aria-label={label} className={cn("ot-radar", className)} style={style} {...props}>
        <p className="ot-radar-note">A radar needs three measures or more; this one has {n}.</p>
      </figure>
    )
  }

  const says = (d: RadarDatum) => list.map((s) => `${s.label ? `${s.label} ` : ""}${format(read(d, s.key))}`).join(", ")

  return (
    <figure
      data-slot="radar-chart"
      data-pointed={shown >= 0 || undefined}
      className={cn("ot-radar", className)}
      style={{ "--n": n, "--m": list.length, ...style } as React.CSSProperties}
      {...props}
    >
      <Grid variant="dots" cell={cell} className="ot-radar-sheet">
        <div
          ref={plot}
          role="group"
          aria-label={label}
          data-slot="radar-chart-plot"
          className="ot-radar-plot"
          style={w ? ({ "--r": `${R}px` } as React.CSSProperties) : undefined}
          onKeyDown={(e) => rove(e, "button", true)}
          onPointerMove={pick}
          onPointerLeave={rest}
          onBlur={(e) => !plot.current?.contains(e.relatedTarget) && setShown(-1)}
        >
          <svg ref={observe} data-slot="radar-chart-draw" className="ot-radar-draw" aria-hidden="true">
            {w ? (
              <g transform={`translate(${w / 2} ${w / 2})`}>
                <g className="ot-radar-build">
                  {[0.25, 0.5, 0.75, 1].map((q) => (
                    <path key={q} data-rim={q === 1 || undefined} d={poly(data.map((_, i) => at(R * q, angle(i))))} />
                  ))}
                  {data.map((d, i) => {
                    const [x, y] = at(R, angle(i))
                    return <line key={d.label} x1={0} y1={0} x2={x} y2={y} />
                  })}
                </g>
                {list.map((s, k) => {
                  const p = data.map((d, i) => at((R * Math.min(read(d, s.key), top)) / top, angle(i)))
                  return (
                    <g key={s.key} data-series={k} className="ot-radar-series">
                      <path className="ot-radar-line" d={poly(p)} />
                      {p.map(([x, y], i) => (
                        <circle key={i} className="ot-radar-bead" data-shown={i === shown || undefined} cx={x} cy={y} r={3} />
                      ))}
                    </g>
                  )
                })}
                {shown >= 0 ? (
                  // The dimension lines: one per series, stepped off the spoke, from the centre to the point, a tick at each end.
                  <g key={shown} className="ot-radar-dims">
                    {list.map((s, k) => {
                      const a = angle(shown)
                      const r = (R * Math.min(read(data[shown], s.key), top)) / top
                      const off = OFF * (k + 1)
                      const [nx, ny] = [Math.cos(a), Math.sin(a)]
                      const [ex, ey] = at(r, a)
                      const [x0, y0, x1, y1] = [nx * off, ny * off, ex + nx * off, ey + ny * off]
                      return (
                        <g key={s.key} data-series={k} className="ot-radar-dim">
                          <path d={`M${x0},${y0}L${x1},${y1}M${x0 - nx * TICK},${y0 - ny * TICK}L${x0 + nx * TICK},${y0 + ny * TICK}M${x1 - nx * TICK},${y1 - ny * TICK}L${x1 + nx * TICK},${y1 + ny * TICK}`} />
                        </g>
                      )
                    })}
                  </g>
                ) : null}
              </g>
            ) : null}
          </svg>
          {shown >= 0 && w && list.length === 1
            ? list.map((s, k) => {
                const a = angle(shown)
                const v = read(data[shown], s.key)
                const [mx, my] = at((R * Math.min(v, top)) / top / 2, a)
                // Clear of its dimension line whichever way the spoke runs: half the figure's extent across the spoke.
                const text = `${format(v)}/${format(top)}`
                const off = OFF + 4 + Math.abs(Math.cos(a)) * text.length * 3.8 + Math.abs(Math.sin(a)) * 7
                return (
                  <span
                    key={`${shown}-${s.key}`}
                    data-series={k}
                    className="ot-radar-figure"
                    aria-hidden="true"
                    style={{ "--x": `${mx + Math.cos(a) * off}px`, "--y": `${my + Math.sin(a) * off}px` } as React.CSSProperties}
                  >
                    {format(v)}
                    <span className="ot-radar-of">/{format(top)}</span>
                  </span>
                )
              })
            : null}
          {data.map((d, i) => {
            const a = angle(i)
            return (
              <button
                key={d.label}
                type="button"
                tabIndex={i === (shown >= 0 ? shown : activeIndex(now, n, 0)) ? 0 : -1}
                data-slot="radar-chart-axis"
                className="ot-radar-axis"
                data-shown={i === shown || undefined}
                style={{ "--c": Math.sin(a).toFixed(4), "--s": (-Math.cos(a)).toFixed(4) } as React.CSSProperties}
                aria-label={`${d.label}: ${says(d)} of ${format(top)}`}
                onPointerEnter={() => setShown(i)}
                onFocus={() => setShown(i)}
              >
                {d.label}
              </button>
            )
          })}
        </div>
      </Grid>
      {list.length > 1 ? (
        <figcaption data-slot="radar-chart-key" className="ot-radar-key">
          {list.map((s, k) => (
            <span key={s.key} data-series={k} className="ot-radar-name">
              <svg className="ot-radar-swatch" aria-hidden="true"><line x1="0" y1="50%" x2="100%" y2="50%" /></svg>
              {s.label}
              {shown >= 0 ? <span className="ot-radar-key-value"> {format(read(data[shown], s.key))}</span> : null}
            </span>
          ))}
        </figcaption>
      ) : null}
    </figure>
  )
}

export { RadarChart, type RadarChartProps, type RadarDatum, type RadarSeries }
