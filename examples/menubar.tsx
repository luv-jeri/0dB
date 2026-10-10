"use client"

import * as React from "react"

import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/registry/0nlytype/ui/menubar"
import { State } from "@/components/site/state"

function Editor({ label, variant }: { label: string; variant?: "pocket" | "leaders" | "caption" }) {
  const [notes, setNotes] = React.useState(true)
  const [grid, setGrid] = React.useState(false)
  return (
    <Menubar aria-label={label} variant={variant}>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            New note <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Open <MenubarShortcut>⌘O</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarLabel>Recent</MenubarLabel>
          <MenubarItem>Northlight</MenubarItem>
          <MenubarItem>Oda Studio</MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Export</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>As PDF</MenubarItem>
              <MenubarItem>As Markdown</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Undo <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem disabled>
            Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            Copy <MenubarShortcut>⌘C</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Paste <MenubarShortcut>⌘V</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem checked={notes} onCheckedChange={setNotes}>
            Show margin notes
          </MenubarCheckboxItem>
          <MenubarCheckboxItem checked={grid} onCheckedChange={setGrid}>
            Show the grid <MenubarShortcut>G</MenubarShortcut>
          </MenubarCheckboxItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}

export default function Example() {
  return (
    <div className="grid w-full gap-10">
      <div className="grid gap-3">
        <span className="ot-label">Pocket</span>
        <Editor label="Editor" />
      </div>
      <div className="grid gap-3">
        <span className="ot-label">Leaders</span>
        <Editor label="Editor, as contents" variant="leaders" />
      </div>
      <div className="grid gap-3">
        <span className="ot-label">Caption</span>
        <Editor label="Spring notes" variant="caption" />
      </div>
    </div>
  )
}

/** The bar at rest, pointed at, focused and with a word disabled. Open, see the specimen above. */
function Words({ label, force, disabled, variant }: { label: string; force?: "hover" | "focus"; disabled?: boolean; variant?: "caption" }) {
  return (
    <Menubar aria-label={label} variant={variant} style={variant ? { width: "min(26rem, 80vw)" } : undefined}>
      <MenubarMenu>
        <MenubarTrigger data-force={force === "focus" ? force : undefined}>File</MenubarTrigger>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger data-force={force === "hover" ? force : undefined} disabled={disabled}>Edit</MenubarTrigger>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
      </MenubarMenu>
    </Menubar>
  )
}

export function States() {
  return (
    <>
      <State label="Rest"><Words label="Rest" /></State>
      <State label="Pointed at"><Words label="Pointed at" force="hover" /></State>
      <State label="Focus"><Words label="Focus" force="focus" /></State>
      <State label="Disabled"><Words label="Disabled" disabled /></State>
      <State label="Caption, rest"><Words label="Spring notes" variant="caption" /></State>
      <State label="Caption, pointed at">
        {/* The caption follows focus, so its pointed look is pinned by hand. */}
        <div className="ot-menubar" data-variant="caption" style={{ width: "min(26rem, 80vw)" }}>
          <button type="button" className="ot-menubar-trigger" data-state="open">File</button>
          <button type="button" className="ot-menubar-trigger">Edit</button>
          <button type="button" className="ot-menubar-trigger">View</button>
          <span className="ot-menubar-caption" aria-hidden><span>File</span><span>Export</span><span>As PDF</span></span>
        </div>
      </State>
      <State label="Leaders, pointed at">
        <div style={{ width: "min(26rem, 80vw)" }}>
          <div className="ot-menubar">
            <button type="button" className="ot-menubar-trigger" data-state="open">File</button>
            <button type="button" className="ot-menubar-trigger">Edit</button>
            <button type="button" className="ot-menubar-trigger">View</button>
          </div>
          <div className="ot-pop ot-menu" data-slot="menubar-content" data-variant="leaders" data-state="open" style={{ marginTop: -1.5, width: "max-content" }}>
            <div className="ot-menu-item">New note <span className="ot-menu-keys" dir="ltr"><kbd className="ot-kbd">⌘</kbd><kbd className="ot-kbd">N</kbd></span></div>
            <div className="ot-menu-item" data-force="hover">Open <span className="ot-menu-keys" dir="ltr"><kbd className="ot-kbd">⌘</kbd><kbd className="ot-kbd">O</kbd></span></div>
            <div className="ot-menu-item ot-menu-sub">Export</div>
          </div>
        </div>
      </State>
    </>
  )
}
