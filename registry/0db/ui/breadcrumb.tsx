import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/registry/0db/lib/utils"

function Breadcrumb({ className, ...props }: React.ComponentProps<"nav">) {
  return <nav data-slot="breadcrumb" aria-label="Breadcrumb" className={cn("db-crumbs", className)} {...props} />
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
  return <span data-slot="breadcrumb-page" aria-current="page" className={cn("db-yours", className)} {...props} />
}

/** A hairline drawn leaning like a slash. Put one between each pair of items. */
function BreadcrumbSeparator({ className, ...props }: React.ComponentProps<"li">) {
  return <li data-slot="breadcrumb-separator" role="presentation" aria-hidden="true" className={className} {...props} />
}

export { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator }
