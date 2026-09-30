"use client"

import * as React from "react"

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/registry/0db/ui/context-menu"

export default function Example() {
  const [pinned, setPinned] = React.useState(false)
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="db-corners" tabIndex={0} aria-describedby="context-menu-help" style={{ padding: "var(--db-space-6)" }}>
          <p id="context-menu-help">Right-click here, or focus this and press Shift F10.</p>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent aria-label="Spring notes">
        <ContextMenuItem>Copy the link</ContextMenuItem>
        <ContextMenuItem>
          Duplicate <ContextMenuShortcut>⌘D</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuCheckboxItem checked={pinned} onCheckedChange={setPinned}>
          Pin to the top
        </ContextMenuCheckboxItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger>Move to</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem>Halden</ContextMenuItem>
            <ContextMenuItem>Northlight</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuItem>Archive</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive">Delete Spring notes for good</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
