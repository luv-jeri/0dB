"use client"

import * as React from "react"

import { Button } from "@/registry/0nlytype/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/registry/0nlytype/ui/dropdown-menu"
import { State } from "@/components/site/state"

function Options() {
  const [notes, setNotes] = React.useState(true)
  const [view, setView] = React.useState("list")
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="bracket">Options</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent aria-label="Options for Halden">
        <DropdownMenuGroup>
          <DropdownMenuItem>Rename</DropdownMenuItem>
          <DropdownMenuItem>
            Duplicate <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>Archive</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Show</DropdownMenuLabel>
        <DropdownMenuCheckboxItem checked={notes} onCheckedChange={setNotes}>
          Show margin notes <DropdownMenuShortcut>N</DropdownMenuShortcut>
        </DropdownMenuCheckboxItem>
        <DropdownMenuRadioGroup value={view} onValueChange={setView}>
          <DropdownMenuRadioItem value="list">As a list</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="grid">As a grid</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Move to</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>Northlight</DropdownMenuItem>
            <DropdownMenuItem>Oda Studio</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuItem variant="destructive">Delete Halden for good</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/** A contents page: every word joined to its keys by leader dots. */
function Arrange() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="bracket">Arrange</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent variant="leaders" aria-label="Arrange">
        <DropdownMenuItem>
          Bring forward <DropdownMenuShortcut>⌘]</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          Send backward <DropdownMenuShortcut>⌘[</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Group <DropdownMenuShortcut>⌘G</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          Ungroup <DropdownMenuShortcut>⇧⌘G</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Align</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>
              To the left <DropdownMenuShortcut>⌥A</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              To the centre <DropdownMenuShortcut>⌥H</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuItem>Lock in place</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/** Each word explained by a note hung beside the list. */
function Share() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="bracket">Share</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent variant="marginalia" aria-label="Share Halden">
        <DropdownMenuItem hint="Anyone with the link can read Halden, not change it.">Copy the link</DropdownMenuItem>
        <DropdownMenuItem hint="They get a note from you and can change anything.">Invite to edit</DropdownMenuItem>
        <DropdownMenuItem hint="A public page at studio.com/halden, updated as you work.">Publish to the web</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem hint="Every link stops working at once. Invited people keep access.">Stop sharing</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default function Example() {
  return (
    <div className="flex w-full flex-wrap items-start gap-x-16 gap-y-10">
      <div className="grid justify-items-start gap-3">
        <span className="db-label">List</span>
        <Options />
      </div>
      <div className="grid justify-items-start gap-3">
        <span className="db-label">Leaders</span>
        <Arrange />
      </div>
      <div className="grid justify-items-start gap-3">
        <span className="db-label">Marginalia</span>
        <Share />
      </div>
    </div>
  )
}

/** A list, pinned open with one item pointed at. The docs' states row is inert, so this is the look alone. */
function Pinned({ variant, children, note }: { variant: string; children: React.ReactNode; note?: React.ReactNode }) {
  return (
    <div className="db-pop db-menu" data-variant={variant} data-state="open" style={{ position: "relative" }}>
      {children}
      {note}
    </div>
  )
}

const narrow = "(max-width: 40rem)"
const onResize = (change: () => void) => (addEventListener("resize", change), () => removeEventListener("resize", change))

export function States() {
  // Where there's no room beside the list, marginalia sets its note under it; the pinned one follows.
  const under = React.useSyncExternalStore(onResize, () => matchMedia(narrow).matches, () => false)
  return (
    <>
      <State label="List, pointed at">
        <Pinned variant="list">
          <div className="db-menu-item">Rename</div>
          <div className="db-menu-item" data-force="hover">Duplicate <span className="db-menu-keys" dir="ltr"><kbd className="db-kbd">⌘</kbd><kbd className="db-kbd">D</kbd></span></div>
          <div className="db-menu-item">Archive</div>
        </Pinned>
      </State>
      <State label="Leaders, pointed at">
        <Pinned variant="leaders">
          <div className="db-menu-item">Bring forward <span className="db-menu-keys" dir="ltr"><kbd className="db-kbd">⌘</kbd><kbd className="db-kbd">]</kbd></span></div>
          <div className="db-menu-item" data-force="hover">Group <span className="db-menu-keys" dir="ltr"><kbd className="db-kbd">⌘</kbd><kbd className="db-kbd">G</kbd></span></div>
          <div className="db-menu-item db-menu-sub">Align</div>
        </Pinned>
      </State>
      <State label="Marginalia, pointed at">
        <div style={{ paddingInlineEnd: under ? 0 : "15rem", paddingBlockEnd: under ? "4rem" : 0 }}>
          <Pinned variant="marginalia" note={<div className="db-menu-note" data-under={under ? "" : undefined} style={{ "--db-note-y": "4.3em" } as React.CSSProperties}>They get a note from you and can change anything.</div>}>
            <div className="db-menu-item">Copy the link</div>
            <div className="db-menu-item" data-force="hover">Invite to edit</div>
            <div className="db-menu-item">Publish to the web</div>
          </Pinned>
        </div>
      </State>
    </>
  )
}
