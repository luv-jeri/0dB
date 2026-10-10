import type { CSSProperties, ReactNode } from "react"

import { Button } from "@/registry/0nlytype/ui/button"
import { Checkbox, CheckboxGroup } from "@/registry/0nlytype/ui/checkbox"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerTitle, DrawerTrigger } from "@/registry/0nlytype/ui/drawer"
import { Fraction } from "@/registry/0nlytype/ui/fraction"
import { State } from "@/components/site/state"

const notes = [
  "Keep the flag. The blue is older than the company and every islander knows it.",
  "Lose the anchor. It says harbour; the line is about the crossing.",
  "The timetable is the real product. Set it large enough to read from the quay.",
  "One typeface, two weights. The ferries' names in the italic.",
  "Paint the hulls last. The livery follows the type, not the other way round.",
]

function Filters() {
  return (
    <CheckboxGroup legend="Kinds of work">
      <Checkbox>Identity</Checkbox>
      <Checkbox>Web</Checkbox>
      <Checkbox>Motion</Checkbox>
    </CheckboxGroup>
  )
}

function Notes() {
  return (
    <ol className="grid gap-4" style={{ maxWidth: "36rem" }}>
      {notes.map((n) => (
        <li key={n}>{n}</li>
      ))}
    </ol>
  )
}

export default function Example() {
  return (
    <div className="flex flex-wrap items-center gap-10">
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="bracket">Filter the work</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerTitle>Filter the work</DrawerTitle>
          <Filters />
          <DrawerClose asChild>
            <Button variant="statement" data-autofocus>Show 7 projects</Button>
          </DrawerClose>
        </DrawerContent>
      </Drawer>
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="bracket">Read the notes</Button>
        </DrawerTrigger>
        <DrawerContent variant="thirds" handleLabel="Height of the notes">
          <DrawerTitle>Notes on the Halden brief</DrawerTitle>
          <DrawerDescription>Drag the arc up for more of them, or press the arrow keys on it.</DrawerDescription>
          <Notes />
          <DrawerClose asChild>
            <Button variant="bracket">Close</Button>
          </DrawerClose>
        </DrawerContent>
      </Drawer>
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="bracket">Sort the work</Button>
        </DrawerTrigger>
        <DrawerContent variant="solid">
          <DrawerTitle>Sort the work</DrawerTitle>
          <Filters />
          <DrawerClose asChild>
            <Button variant="statement" data-autofocus>Sort by year</Button>
          </DrawerClose>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

/** A drawer drawn still, in the page, for the states row. */
function Still({ variant, style, share, children }: { variant?: string; style?: CSSProperties; share?: number; children: ReactNode }) {
  return (
    <dialog
      open
      className="db-drawer"
      data-variant={variant}
      style={{ position: "relative", inset: "auto", translate: "none", width: "min(22rem, 100%)", maxHeight: "none", height: "auto", boxShadow: "none", transition: "none", ...style }}
    >
      <span className="db-drawer-handle" aria-hidden="true" style={{ width: "fit-content" }}>
        <svg viewBox="0 0 40 22">
          <path d="M3 20 A17 17 0 0 1 37 20" />
          <circle cx="20" cy="17" r="2.6" />
        </svg>
      </span>
      {share && (
        <span className="db-drawer-share" aria-hidden="true">
          <Fraction count={share} total={3} />
        </span>
      )}
      <div className="db-drawer-body">{children}</div>
    </dialog>
  )
}

export function States() {
  return (
    <>
      <State label="Open">
        <Still><p className="db-drawer-title">Filter the work</p><Button variant="statement">Show 7 projects</Button></Still>
      </State>
      <State label="thirds, at two thirds">
        <Still variant="thirds" share={2}><p className="db-drawer-title">Notes</p><p>Keep the flag. Lose the anchor.</p></Still>
      </State>
      <State label="solid, at rest">
        <Still variant="solid"><p className="db-drawer-title">Sort the work</p><p>By year</p><Button variant="statement">Sort</Button></Still>
      </State>
      <State label="solid, pulled halfway">
        <Still variant="solid" style={{ "--solid": 0.5 } as CSSProperties}><p className="db-drawer-title">Sort the work</p><p>By year</p><Button variant="statement">Sort</Button></Still>
      </State>
      <State label="solid, set solid">
        <Still variant="solid" style={{ "--solid": 1 } as CSSProperties}><p className="db-drawer-title">Sort the work</p><p>By year</p><Button variant="statement">Sort</Button></Still>
      </State>
    </>
  )
}
