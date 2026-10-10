import * as React from "react"

import { cn } from "@/registry/0nlytype/lib/utils"

type ItemGroupProps = React.ComponentProps<"ul"> & {
  /**
   * leader: a dotted leader joins what it is to its value. lineation: as in a critical edition, every
   * fifth line carries its number in the margin, and the line you point at shows its own. words: the
   * description runs in along the leader, small, and runs out in an ellipsis before the value.
   */
  variant?: "leader" | "lineation" | "words"
}

/** A ledger of items. */
function ItemGroup({ className, variant = "leader", ...props }: ItemGroupProps) {
  return <ul data-slot="item-group" data-variant={variant === "leader" ? undefined : variant} className={cn("ot-items", className)} {...props} />
}

type ItemProps = React.ComponentProps<"li"> & {
  /** Pins a state for documentation ("hover"); set on the root. */
  "data-force"?: string
}

/** A ledger line: what it is, a dotted leader, what you can do. Point at it and the leader inks across. */
function Item({ className, ...props }: ItemProps) {
  return <li data-slot="item" className={cn("ot-item", className)} {...props} />
}

/** An avatar or other small picture at the start of the line. */
function ItemMedia({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="item-media" className={cn("ot-item-media", className)} {...props} />
}

function ItemContent({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="item-content" className={cn("ot-item-body", className)} {...props} />
}

function ItemTitle({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="item-title" className={cn("ot-item-title", className)} {...props} />
}

function ItemDescription({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="item-description" className={cn("ot-item-desc", className)} {...props} />
}

/** A value or an action at the end of the line, joined to the content by the leader. */
function ItemActions({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <>
      <span data-slot="item-leader" className="ot-item-leader" aria-hidden="true" />
      <span data-slot="item-actions" className={cn("ot-item-end", className)} {...props} />
    </>
  )
}

export { ItemGroup, Item, ItemMedia, ItemContent, ItemTitle, ItemDescription, ItemActions }
