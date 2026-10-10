import * as React from "react"

import { cn } from "@/registry/0nlytype/lib/utils"

type EmptyProps = React.ComponentProps<"div"> & {
  /**
   * arc: a zero cropped to its top half, which is a fermata's arc. tacet: the word a score prints on a part with
   * nothing to play, which dies away as you reach for the action. blank: the printer's page left blank on purpose,
   * the words spread to its corners and one small line in the middle of the silence.
   */
  variant?: "arc" | "tacet" | "blank"
}

/** An invitation to act, not a mood. Say what is missing and what to do about it. */
function Empty({ variant = "arc", className, ...props }: EmptyProps) {
  return <div data-slot="empty" data-variant={variant} className={cn("db-empty", className)} {...props} />
}

/**
 * The figure, decorative. In arc, a number (a zero by default). In tacet, the term (pass "Tacet").
 * In blank, the small line in the middle of the page ("This space is left blank on purpose.").
 */
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

export { Empty, EmptyFigure, EmptyTitle, EmptyDescription, EmptyActions, type EmptyProps }
