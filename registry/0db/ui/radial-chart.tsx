"use client"

import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"
import { roll } from "@/registry/0db/lib/roll"

const share = (n: number) => (Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : 0)

type RingProps = Omit<React.ComponentProps<"span">, "children"> & {
  /** How much of the ring the arc covers, 0–1. */
  value: number
  /** Where the arc begins, 0–1 of the way round from the ring's start. */
  from?: number
  /** The end of the arc that carries the dot, or none. */
  head?: "end" | "start" | "none"
}

/**
 * One hairline ring with an arc drawn on it at stroke width, and a dot at one end of the arc: the calendar's ring
 * for what's to come, inked for what was had. Absolutely placed in a positioned box, square unless the box says
 * otherwise. The parent sets how much of a turn the ring spans (--db-ring-sweep, 1 by default) and where it
 * starts (--db-ring-start, 0deg is the top); --db-ring-inset steps it in, --db-ring-ink and --db-ring-head colour it.
 * The arc glides between values at andante. Decorative: the words that say its value live elsewhere.
 */
function Ring({ value, from = 0, head = "end", className, style, ...props }: RingProps) {
  return (
    <span
      data-slot="ring"
      data-head={head === "none" ? undefined : head}
      aria-hidden="true"
      className={cn("db-ring", className)}
      style={{ "--db-ring-p": share(value), "--db-ring-from": share(from), ...style } as React.CSSProperties}
      {...props}
    >
      {head === "none" ? null : <i className="db-ring-head" />}
    </span>
  )
}

type RadialChartProps = Omit<React.ComponentProps<"figure">, "children"> & {
  /** One ring per entry, the first outermost. */
  data: { label: string; value: number }[]
  /** Names the chart for assistive tech, e.g. "Reading goals, 2026". */
  label: string
  /** What a closed ring means, shared by every series. */
  max?: number
  /** What the values count. The readout reads "of 100 pages". */
  unit?: string
  /** The series the number rests on; its dot carries the accent. Defaults to the first. */
  now?: number
  format?: (value: number) => string
  /** ring: full concentric rings, the number inside. horizon: half rings standing on a horizon, the number on it. */
  variant?: "ring" | "horizon"
  /** Pins the pointed-at look on the series the number is on; set on the root for documentation. */
  "data-force"?: string
}

const figures = new Intl.NumberFormat("en-GB")

/**
 * Progress against a shared maximum: one hairline ring per series, its arc inked as far as it has got,
 * and one very large number inside. Point at a ring or focus its name and that ring inks, the others step
 * back and the number rolls to it; leave and it rolls back to now.
 */
function RadialChart({ data, label, max = 100, unit, now = 0, format = figures.format, variant = "ring", className, style, ...props }: RadialChartProps) {
  const [shown, setShown] = React.useState(now)
  const [pointed, setPointed] = React.useState(false)
  const target = React.useRef(now)
  const value = React.useRef<HTMLSpanElement>(null)
  const face = React.useRef<HTMLDivElement>(null)
  const key = React.useRef<HTMLUListElement>(null)
  const top = max > 0 ? max : 100
  const many = data.length > 1

  function show(i: number, on = true) {
    setPointed(on)
    if (i === target.current || !value.current || !data[i]) return
    const dir = data[i].value > data[target.current].value ? 1 : -1
    target.current = i
    roll(value.current, () => setShown(i), "0.3em", dir)
  }

  // The ring nearest the pointer, by radius; the middle, where the number stands, keeps what's shown.
  function pick(e: React.PointerEvent) {
    const rings = face.current?.querySelectorAll<HTMLElement>(".db-ring")
    if (!rings?.length) return
    const box = rings[0].getBoundingClientRect()
    const d = Math.hypot(e.clientX - (box.left + box.width / 2), e.clientY - (box.top + box.height / 2))
    let best = -1
    let gap = 14
    rings.forEach((r, i) => {
      const off = Math.abs(r.getBoundingClientRect().width / 2 - d)
      if (off < gap) [best, gap] = [i, off]
    })
    if (best >= 0) show(best)
  }

  const at = data[shown] ?? data[now]
  const of = `of ${format(top)}${unit ? ` ${unit}` : ""}`

  return (
    <figure
      data-slot="radial-chart"
      data-variant={variant}
      data-pointed={pointed || undefined}
      aria-label={label}
      className={cn("db-radial", className)}
      style={{ "--n": data.length, ...style } as React.CSSProperties}
      {...props}
    >
      <div
        ref={face}
        data-slot="radial-chart-face"
        className="db-radial-face"
        aria-hidden="true"
        onPointerMove={many ? pick : undefined}
        onPointerLeave={many ? () => !key.current?.contains(document.activeElement) && show(now, false) : undefined}
      >
        {data.map((d, i) => (
          <Ring key={d.label} value={d.value / top} data-shown={i === shown || undefined} style={{ "--i": i } as React.CSSProperties} />
        ))}
      </div>
      <figcaption data-slot="radial-chart-read" className="db-radial-read">
        <span ref={value} className="db-radial-value">
          {at ? format(at.value) : ""}
        </span>
        <span className="db-radial-words">
          <span className="db-radial-name">{at?.label}</span>
          <span className="db-radial-of">{of}</span>
        </span>
      </figcaption>
      {many ? (
        <ul
          ref={key}
          data-slot="radial-chart-key"
          className="db-radial-key"
          onPointerLeave={() => !key.current?.contains(document.activeElement) && show(now, false)}
          onBlur={(e) => !key.current?.contains(e.relatedTarget) && show(now, false)}
        >
          {data.map((d, i) => (
            <li key={d.label}>
              <button type="button" data-shown={i === shown || undefined} onPointerEnter={() => show(i)} onFocus={() => show(i)}>
                <span>{d.label}</span> <span className="db-radial-key-value">{format(d.value)}</span>
                <span className="db-sr"> {of}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </figure>
  )
}

export { RadialChart, Ring, type RadialChartProps, type RingProps }
