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
import { State } from "@/components/site/state"

/** The area that answers a right-click: corner marks round a line of help. */
function Area({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <ContextMenuTrigger asChild>
      <div
        className="db-corners"
        tabIndex={0}
        aria-describedby={id}
        style={{
          display: "grid",
          placeItems: "center",
          width: "min(19rem, 100%)",
          minHeight: "9rem",
          padding: "var(--db-space-5)",
          textAlign: "center",
          fontSize: "var(--db-pp)",
          color: "var(--db-pencil)",
          cursor: "context-menu",
        }}
      >
        <p id={id}>{children}</p>
      </div>
    </ContextMenuTrigger>
  )
}

function Notes() {
  const [pinned, setPinned] = React.useState(false)
  return (
    <ContextMenu>
      <Area id="context-menu-help">Right-click here, or focus this and press Shift F10.</Area>
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

/** Every word joined to its keys by leader dots, as on a contents page. */
function Text() {
  return (
    <ContextMenu>
      <Area id="context-menu-leaders-help">Right-click the text, or focus it and press Shift F10.</Area>
      <ContextMenuContent variant="leaders" aria-label="Selected text">
        <ContextMenuItem>
          Cut <ContextMenuShortcut>⌘X</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          Copy <ContextMenuShortcut>⌘C</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          Paste <ContextMenuShortcut>⌘V</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>
          Look up <ContextMenuShortcut>⌃⌘D</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>Add a margin note</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

/** The words stand on an arc bowed away from where you pressed. */
function Photo() {
  return (
    <ContextMenu>
      <Area id="context-menu-orbit-help">Right-click the photograph, or focus it and press Shift F10.</Area>
      <ContextMenuContent variant="orbit" aria-label="Photograph">
        <ContextMenuItem>Open</ContextMenuItem>
        <ContextMenuItem>Set as the cover</ContextMenuItem>
        <ContextMenuItem>Copy the photograph</ContextMenuItem>
        <ContextMenuItem>Save to Halden</ContextMenuItem>
        <ContextMenuItem>Show the original</ContextMenuItem>
        <ContextMenuItem variant="destructive">Remove it</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

export default function Example() {
  return (
    <div className="flex w-full flex-wrap items-start gap-x-10 gap-y-10">
      <div className="grid gap-3">
        <span className="db-label">List</span>
        <Notes />
      </div>
      <div className="grid gap-3">
        <span className="db-label">Leaders</span>
        <Text />
      </div>
      <div className="grid gap-3">
        <span className="db-label">Orbit</span>
        <Photo />
      </div>
    </div>
  )
}

/** A menu pinned open where it was pressed, one item pointed at. The docs' states row is inert, so this is the look alone. */
function Pinned({ variant, children }: { variant: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: "var(--db-space-3) 0 0 var(--db-space-3)" }}>
      <div className="db-pop db-menu" data-at="point" data-variant={variant} data-state="open" style={{ "--db-at-x": "-2px", "--db-at-y": "-2px" } as React.CSSProperties}>
        {children}
      </div>
    </div>
  )
}

export function States() {
  return (
    <>
      <State label="List, pointed at">
        <Pinned variant="list">
          <div className="db-menu-item">Copy the link</div>
          <div className="db-menu-item" data-force="hover">Duplicate <span className="db-menu-keys" dir="ltr"><kbd className="db-kbd">⌘</kbd><kbd className="db-kbd">D</kbd></span></div>
          <div className="db-menu-item">Archive</div>
        </Pinned>
      </State>
      <State label="Leaders, pointed at">
        <Pinned variant="leaders">
          <div className="db-menu-item">Cut <span className="db-menu-keys" dir="ltr"><kbd className="db-kbd">⌘</kbd><kbd className="db-kbd">X</kbd></span></div>
          <div className="db-menu-item" data-force="hover">Copy <span className="db-menu-keys" dir="ltr"><kbd className="db-kbd">⌘</kbd><kbd className="db-kbd">C</kbd></span></div>
          <div className="db-menu-item">Add a margin note</div>
        </Pinned>
      </State>
      <State label="Orbit, pointed at">
        <Pinned variant="orbit">
          <div className="db-menu-item">Open</div>
          <div className="db-menu-item">Set as the cover</div>
          <div className="db-menu-item" data-force="hover">Copy the photograph</div>
          <div className="db-menu-item">Save to Halden</div>
          <div className="db-menu-item">Remove it</div>
        </Pinned>
      </State>
    </>
  )
}
