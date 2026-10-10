import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/registry/0nlytype/lib/utils"

type BreadcrumbProps = React.ComponentProps<"nav"> & {
  /**
   * slashes: one line, divided by leaning hairlines.
   * stack: a stair, one step a line, each set in a little further; where you are is the large italic at the foot.
   * elide: the steps between the first and the last two elided, one full stop for each; they open back into words for a still pointer or focus.
   */
  variant?: "slashes" | "stack" | "elide"
}

function Breadcrumb({ variant = "slashes", className, ...props }: BreadcrumbProps) {
  return <nav data-slot="breadcrumb" data-variant={variant} aria-label="Breadcrumb" className={cn("ot-crumbs", className)} {...props} />
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return <ol data-slot="breadcrumb-list" className={className} {...props} />
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return <li data-slot="breadcrumb-item" className={className} {...props} />
}

/** A step above this page. Point at it and the hairlines beside it lean in to hold it. */
function BreadcrumbLink({ asChild = false, ...props }: React.ComponentProps<"a"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "a"
  return <Comp data-slot="breadcrumb-link" {...props} />
}

/** Where you are. It's yours, so it's italic. */
function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="breadcrumb-page" aria-current="page" className={cn("ot-yours", className)} {...props} />
}

/** A hairline drawn leaning like a slash (nothing, in a stack; elided with its steps, in elide). Put one between each pair of items. */
function BreadcrumbSeparator({ className, ...props }: React.ComponentProps<"li">) {
  return <li data-slot="breadcrumb-separator" role="presentation" aria-hidden="true" className={className} {...props} />
}

export { type BreadcrumbProps, Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator }
