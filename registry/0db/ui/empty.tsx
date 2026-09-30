import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"

/** An invitation to act, not a mood. Say what is missing and what to do about it. */
function Empty({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="empty" className={cn("db-empty", className)} {...props} />
}

/** Nothing, as a number: a zero cropped to its top half, which is a fermata's arc. Decorative. */
function EmptyFigure({ className, children = "0", ...props }: React.ComponentProps<"p">) {
  return (
    <p data-slot="empty-figure" aria-hidden="true" className={cn("db-empty-figure", className)} {...props}>
      <span>{children}</span>
    </p>
  )
}

function EmptyTitle({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="empty-title" className={cn("db-empty-title", className)} {...props} />
}

function EmptyDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="empty-description" className={cn("db-empty-description", className)} {...props} />
}

function EmptyActions({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="empty-actions" className={cn("db-empty-actions", className)} {...props} />
}

export { Empty, EmptyFigure, EmptyTitle, EmptyDescription, EmptyActions }
