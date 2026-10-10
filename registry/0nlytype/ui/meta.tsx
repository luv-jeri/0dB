import * as React from "react"

import { cn } from "@/registry/0nlytype/lib/utils"

type MetaProps = React.ComponentProps<"div"> & {
  /** proportional sizes each hairline by the interval in `at`; credits sets MetaItems as labelled columns under one rule. */
  variant?: "proportional" | "credits"
  /** For proportional: where each child stands (a year, a minute), so the hairline between two is as long as their interval. */
  at?: number[]
}

/** A frame row: small words held apart by hairlines. A hairline goes between each child (not in credits). */
function Meta({ className, variant, at, children, ...props }: MetaProps) {
  const items = React.Children.toArray(children)
  return (
    <div data-slot="meta" data-variant={variant} className={cn("db-meta", className)} {...props}>
      {items.map((child, i) => (
        <React.Fragment key={i}>
          {i > 0 && variant !== "credits" ? (
            <hr
              aria-hidden="true"
              style={variant === "proportional" && at?.[i] != null && at[i - 1] != null ? ({ "--db-span": Math.max(at[i] - at[i - 1], 0) } as React.CSSProperties) : undefined}
            />
          ) : null}
          {child}
        </React.Fragment>
      ))}
    </div>
  )
}

/** One fact in a credits row: a small label over its value. */
function MetaItem({ className, label, children, ...props }: React.ComponentProps<"span"> & { label: React.ReactNode }) {
  return (
    <span data-slot="meta-item" className={cn("db-meta-item", className)} {...props}>
      <span className="db-meta-label">{label}</span> <span>{children}</span>
    </span>
  )
}

export { Meta, MetaItem, type MetaProps }
