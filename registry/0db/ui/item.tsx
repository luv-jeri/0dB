import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"

/** A ledger of items. */
function ItemGroup({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul data-slot="item-group" className={cn("db-items", className)} {...props} />
}

type ItemProps = React.ComponentProps<"li"> & {
  /** Pins a state for documentation ("hover"); set on the root. */
  "data-force"?: string
}

/** A ledger line: what it is, a dotted leader, what you can do. Point at it and the leader inks across. */
function Item({ className, ...props }: ItemProps) {
  return <li data-slot="item" className={cn("db-item", className)} {...props} />
}

/** An avatar or other small picture at the start of the line. */
function ItemMedia({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="item-media" className={cn("db-item-media", className)} {...props} />
}

function ItemContent({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="item-content" className={cn("db-item-body", className)} {...props} />
}

function ItemTitle({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="item-title" className={cn("db-item-title", className)} {...props} />
}

function ItemDescription({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="item-description" className={cn("db-item-desc", className)} {...props} />
}

/** A value or an action at the end of the line, joined to the content by the leader. */
function ItemActions({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <>
      <span data-slot="item-leader" className="db-item-leader" aria-hidden="true" />
      <span data-slot="item-actions" className={cn("db-item-end", className)} {...props} />
    </>
  )
}

export { ItemGroup, Item, ItemMedia, ItemContent, ItemTitle, ItemDescription, ItemActions }
