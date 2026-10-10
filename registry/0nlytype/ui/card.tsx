import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/registry/0nlytype/lib/utils"
import { Meta } from "@/registry/0nlytype/ui/meta"

type CardProps = React.ComponentProps<"article"> & {
  /**
   * rule: a column under a rule, the giant letter hanging from it.
   * epigraph: someone's words set before the name, the way a book sets a quotation before a chapter.
   * ledger: figures that add up, the total ruled off the way an account is.
   */
  variant?: "rule" | "epigraph" | "ledger"
}

/** A column under a rule, not a box. Point at it and an ink stroke passes along the rule. */
function Card({ variant = "rule", className, ...props }: CardProps) {
  return <article data-slot="card" data-variant={variant} className={cn("db-card", className)} {...props} />
}

/** One giant letter, cropped by the rule like a poster's headline. Decorative. */
function CardFigure({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="card-figure" aria-hidden="true" className={cn("db-card-figure", className)} {...props} />
}

function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return <h3 data-slot="card-title" className={cn("db-card-title", className)} {...props} />
}

/** The link inside the title. Its hit area stretches over the whole card, so the card is one target. */
function CardLink({ className, asChild = false, ...props }: React.ComponentProps<"a"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "a"
  return <Comp data-slot="card-link" className={cn("db-card-link", className)} {...props} />
}

function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="card-description" className={cn("db-card-body", className)} {...props} />
}

/** Ledger figures: pairs of <dt> and <dd> in a <div> each. The last pair is the total. */
function CardSum({ className, ...props }: React.ComponentProps<"dl">) {
  return <dl data-slot="card-sum" className={cn("db-card-sum", className)} {...props} />
}

/** A frame row at the foot: small facts held apart by hairlines. */
function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <Meta data-slot="card-footer" className={cn("db-card-foot", className)} {...props} />
}

export { Card, CardFigure, CardTitle, CardLink, CardDescription, CardSum, CardFooter, type CardProps }
