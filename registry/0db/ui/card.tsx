import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/registry/0db/lib/utils"
import { Meta } from "@/registry/0db/ui/meta"

/** A column under a rule, not a box. Point at it and an ink stroke passes along the rule. */
function Card({ className, ...props }: React.ComponentProps<"article">) {
  return <article data-slot="card" className={cn("db-card", className)} {...props} />
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

/** A frame row at the foot: small facts held apart by hairlines. */
function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <Meta data-slot="card-footer" className={cn("db-card-foot", className)} {...props} />
}

export { Card, CardFigure, CardTitle, CardLink, CardDescription, CardFooter }
