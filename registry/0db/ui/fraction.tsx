import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"

type FractionProps = Omit<React.ComponentProps<"span">, "children"> & {
  /** The part that's yours, in italic. */
  count: React.ReactNode
  total: React.ReactNode
}

/** A count set as a display fraction with a leaning hairline. Reads aloud as "2 of 5". */
function Fraction({ count, total, className, ...props }: FractionProps) {
  return (
    <span data-slot="fraction" className={cn("db-fraction", className)} {...props}>
      <span className="db-yours">{count}</span>
      <i>
        <span className="db-sr"> of </span>
      </i>
      <span>{total}</span>
    </span>
  )
}

export { Fraction, type FractionProps }
