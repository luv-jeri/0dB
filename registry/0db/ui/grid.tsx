import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"

type GridProps = React.ComponentProps<"div"> & {
  /** rules: faint hairlines, as the posters lay a construction grid under the words. dots: a fine point at each crossing, as a drafting sheet is dotted. */
  variant?: "rules" | "dots"
  /** The side of one square: a number of pixels or any CSS length. The content stands one cell in, on a line. */
  cell?: number | string
}

// ponytail: a fixed run of labels, clipped by the box; past column 48 or row Z the lines go on unlabelled.
const COLUMNS = Array.from({ length: 48 }, (_, i) => String(i + 1).padStart(2, "0"))
const CORNERS = ["start-top", "end-top", "start-foot", "end-foot"]
const ROWS = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))

/**
 * A quiet structure behind a section: a faint square grid, a registration cross at each corner, and the columns
 * numbered along the top and the rows lettered down the start edge, like a drafting sheet. It never moves.
 */
function Grid({ variant = "rules", cell, className, style, children, ...props }: GridProps) {
  const size = typeof cell === "number" ? `${cell}px` : cell
  return (
    <div
      data-slot="grid"
      data-variant={variant}
      className={cn("db-grid", className)}
      style={size ? ({ "--db-grid-cell": size, ...style } as React.CSSProperties) : style}
      {...props}
    >
      {CORNERS.map((c) => <span key={c} className="db-grid-cross" data-corner={c} aria-hidden="true" />)}
      <span className="db-grid-ticks" data-axis="columns" aria-hidden="true">
        {COLUMNS.map((n) => <span key={n}>{n}</span>)}
      </span>
      <span className="db-grid-ticks" data-axis="rows" aria-hidden="true">
        {ROWS.map((n) => <span key={n}>{n}</span>)}
      </span>
      {children}
    </div>
  )
}

export { Grid, type GridProps }
