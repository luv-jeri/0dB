import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"

type TilingProps = React.ComponentProps<"div"> & {
  /** rules: one hairline between tiles, as "Less is more." divides its sheet. crosses: no lines, a registration cross where the tiles' corners meet. */
  variant?: "rules" | "crosses"
}

/**
 * Tiles on the 12-column grid, held apart by space and one hairline, never boxed. A tiling covers the plane with
 * no gaps and no overlaps, so neighbours share an edge: each tile draws only its start and top edge, halfway into
 * the gap, and the edges that meet the tiling's own border are clipped away.
 */
function Tiling({ variant = "rules", className, children, ...props }: TilingProps) {
  // The sheet is the grid; the outer box is the container its narrow layouts are measured against.
  return (
    <div data-slot="tiling" data-variant={variant} className={cn("db-tiling", className)} {...props}>
      <div className="db-tiling-sheet">{children}</div>
    </div>
  )
}

type TileProps = React.ComponentProps<"div"> & {
  /** Columns out of 12. In a narrow tiling a tile of 6 or fewer takes half, a wider one the whole width. */
  span?: number
  /** Rows it stands through. */
  rows?: number
  /** The corner its content keeps to, as the poster keeps its notes. A child with margin-block-start: auto goes to the foot. */
  place?: "start-top" | "end-top" | "start-foot" | "end-foot"
}

function Tile({ span = 4, rows = 1, place = "start-top", className, style, ...props }: TileProps) {
  return (
    <div
      data-slot="tile"
      data-place={place}
      className={cn("db-tile", className)}
      style={{ "--span": span, "--rows": rows, ...style } as React.CSSProperties}
      {...props}
    />
  )
}

export { Tiling, Tile, type TilingProps, type TileProps }
