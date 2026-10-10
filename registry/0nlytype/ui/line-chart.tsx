"use client"

import * as React from "react"

import { cn } from "@/registry/0nlytype/lib/utils"
import { ChartFrame, type ChartGeometry, type ChartShared } from "@/registry/0nlytype/ui/chart"

type Curve = "linear" | "smooth" | "step"
type Point = [number, number]

type LineChartProps = ChartShared & {
  /** linear: straight between points. smooth: one sweep through them, never past them. step: level across each point's column. */
  variant?: Curve
}

// The path through the points, without its opening M, so an area can run back along another.
function through(p: Point[], curve: Curve): string {
  if (p.length < 2) return ""
  if (curve === "step")
    return p.slice(1).map(([x, y], i) => { const mid = (p[i][0] + x) / 2; return `H${mid}V${y}H${x}` }).join("")
  if (curve === "linear") return p.slice(1).map(([x, y]) => `L${x},${y}`).join("")
  // Monotone cubic (Fritsch and Carlson, as d3's curveMonotoneX): smooth, and it never overshoots a point.
  const n = p.length
  const d = p.slice(1).map(([x, y], i) => (y - p[i][1]) / (x - p[i][0]))
  const m = p.map((_, i) => {
    if (i === 0) return d[0]
    if (i === n - 1) return d[n - 2]
    const [a, b] = [d[i - 1], d[i]]
    return (Math.sign(a) + Math.sign(b)) * Math.min(Math.abs(a), Math.abs(b), Math.abs(a + b) / 4)
  })
  return p.slice(1).map(([x, y], i) => {
    const [x0, y0] = p[i]
    const h = (x - x0) / 3
    return `C${x0 + h},${y0 + h * m[i]} ${x - h},${y - h * m[i + 1]} ${x},${y}`
  }).join("")
}

/**
 * The drawing under the points, in pixels so a hairline stays a hairline: one line per series
 * and, for an area, the drops under it at barcode rhythm. Laid out once the plot has a size.
 */
function Draw({ spans, series, curve, area }: ChartGeometry & { curve: Curve; area?: boolean }) {
  const ref = React.useRef<SVGSVGElement>(null)
  const [[w, h], setSize] = React.useState([0, 0])
  const id = React.useId()
  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setSize([e.contentRect.width, e.contentRect.height]))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const x = (i: number) => ((i + 0.5) / spans.length) * w
  const y = (v: number) => (1 - v) * h
  return (
    <svg ref={ref} data-slot="chart-draw" className="db-line-chart-draw" aria-hidden="true">
      {w
        ? series.map((s, k) => {
            const tops = spans.map((p, i): Point => [x(i), y(p[k][1])])
            const line = `M${tops[0][0]},${tops[0][1]}${through(tops, curve)}`
            const bases = spans.map((p, i): Point => [x(i), y(p[k][0])]).reverse()
            return (
              <g key={s.key} data-series={k}>
                {area ? (
                  <>
                    <pattern id={`${id}-${k}`} patternUnits="userSpaceOnUse" width={[3, 6, 12][Math.min(k, 2)]} height={h}>
                      <rect width="1" height={h} />
                    </pattern>
                    <path className="db-area-chart-drops" fill={`url(#${id}-${k})`} d={`${line}L${bases[0][0]},${bases[0][1]}${through(bases, curve)}Z`} />
                  </>
                ) : null}
                <path className="db-line-chart-line" d={line} />
              </g>
            )
          })
        : null}
    </svg>
  )
}

/** The line and area charts' shared body: chart's frame with a drawing laid under its points. */
function ChartLines({ variant = "linear", area, className, ...props }: LineChartProps & { area?: boolean }) {
  return (
    <ChartFrame
      {...props}
      variant={variant}
      stacked={area}
      className={cn(area ? "db-area-chart" : "db-line-chart", className)}
      layer={(g) => <Draw {...g} curve={variant} area={area} />}
    />
  )
}

/**
 * One hairline through the points, a ring on each, against one very large number. Point at the
 * line, or focus it, and the ring swells, a drop runs down to the baseline and the number rolls.
 */
function LineChart(props: LineChartProps) {
  return <ChartLines {...props} />
}

export { LineChart, ChartLines, type LineChartProps }
