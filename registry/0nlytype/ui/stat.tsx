"use client"

import * as React from "react"

import { Fraction } from "@/registry/0nlytype/ui/fraction"
import { cn } from "@/registry/0nlytype/lib/utils"

type StatsProps = React.ComponentProps<"dl"> & {
  /**
   * crop: SPECTRA's giant thin figures, their feet cut off by one hairline that runs under the whole row, the
   * name small beneath. beside: WOVE's 03, a heavy figure with its name and a line about it set beside it.
   * grid: "Less is more.", each stat a cell of a hairline grid, its name in the top corner and its figure in the far one.
   */
  variant?: "crop" | "beside" | "grid"
}

/**
 * A row of named values. Each Stat is a figure and what it counts. The figures in a row share one size, set by the
 * longest, so they stand on one line.
 */
function Stats({ className, variant = "crop", style, children, ...props }: StatsProps) {
  // ponytail: reads the Stats among the direct children; a Stat wrapped in another component keeps its own size.
  const lens = React.Children.toArray(children).flatMap((c) =>
    React.isValidElement<StatProps>(c) && c.type === Stat ? [figure(c.props.value, c.props.format).length] : [],
  )
  return (
    <dl
      data-slot="stats"
      data-variant={variant === "crop" ? undefined : variant}
      className={cn("ot-stats", className)}
      style={lens.length ? ({ "--row-len": Math.max(...lens), ...style } as React.CSSProperties) : style}
      {...props}
    >
      {children}
    </dl>
  )
}

type StatProps = Omit<React.ComponentProps<"div">, "children"> & {
  value: number | string
  /** What the figure counts: "visits in September". */
  label: React.ReactNode
  /** A line about it, in pencil: "up 12% on August". */
  note?: React.ReactNode
  /** Formats a number. Defaults to en-GB, grouped by a thin space as SI sets figures, since crop cuts off a comma's tail. */
  format?: (value: number) => string
}

const en = new Intl.NumberFormat("en-GB")
const grouped = (n: number) => en.format(n).replace(/,/g, "\u202f")
const figure = (value: number | string, format = grouped) => (typeof value === "number" ? format(value) : value)

/**
 * A figure and what it counts. When the value changes the figure turns over like a counter's wheels (a Fraction
 * with no total): only the figures that changed turn, the units first and each carry one arpeggio step behind.
 * A figure that gains or loses a place turns over whole. The figure is read aloud whole.
 */
function Stat({ value, label, note, format = grouped, className, style, ...props }: StatProps) {
  const text = figure(value, format)
  return (
    <div data-slot="stat" className={cn("ot-stat", className)} style={{ "--len": text.length, ...style } as React.CSSProperties} {...props}>
      <dt className="ot-stat-label">{label}</dt>
      <dd className="ot-stat-figure">
        <Fraction count={text} />
      </dd>
      {note ? <dd className="ot-stat-note">{note}</dd> : null}
    </div>
  )
}

export { Stats, Stat, type StatsProps, type StatProps }
