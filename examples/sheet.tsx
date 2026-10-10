"use client"

import { useState, type CSSProperties, type ReactNode } from "react"

import { Button } from "@/registry/0nlytype/ui/button"
import { Meta } from "@/registry/0nlytype/ui/meta"
import { Row, RowKind, RowMeta, RowTitle, Rows } from "@/registry/0nlytype/ui/rows"
import {
  Sheet,
  SheetActions,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetPanel,
  SheetPanelLink,
  SheetPanels,
  SheetSpine,
  SheetTitle,
  SheetTrigger,
} from "@/registry/0nlytype/ui/sheet"
import { State } from "@/components/site/state"

const WORK = [
  ["Halden Line", "Identity", "2026", "A ferry line that has run between the islands since 1911. We kept the flag, lost the anchor, and set the timetable large enough to read from the quay."],
  ["Tidewater", "Type", "2025", "A text face for a tide table: figures that hold their column at nine points, and an italic for the names of the moons."],
  ["Low Orchard", "Website", "2024", "A cider house's site with one page for every year's pressing, each one written by the person who pressed it."],
]

const brief = "A new identity for a ferry line that has run between the islands since 1911. Keep the flag, lose the anchor. The timetable is the real product."

export default function Example() {
  const [which, setWhich] = useState(0)
  return (
    <div className="flex flex-wrap items-center gap-10">
      {(["end", "start"] as const).map((side) => (
        <Sheet key={side}>
          <SheetTrigger asChild>
            <Button variant="bracket">{side === "end" ? "Read the brief" : "Read it from the start"}</Button>
          </SheetTrigger>
          <SheetContent side={side}>
            <SheetSpine>The brief</SheetSpine>
            <Meta>
              <span>Halden</span>
              <span>Edited today</span>
            </Meta>
            <SheetTitle>
              The <span className="ot-yours">Halden</span> brief
            </SheetTitle>
            <SheetDescription>{brief}</SheetDescription>
            <SheetActions>
              <SheetClose asChild>
                <Button variant="bracket" data-autofocus>Close</Button>
              </SheetClose>
            </SheetActions>
          </SheetContent>
        </Sheet>
      ))}

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="bracket">Open the brief, then its notes</Button>
        </SheetTrigger>
        <SheetContent variant="shelf">
          <SheetSpine>The brief</SheetSpine>
          <SheetTitle>
            The <span className="ot-yours">Halden</span> brief
          </SheetTitle>
          <SheetDescription>{brief}</SheetDescription>
          <SheetActions>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="bracket" data-autofocus>Read the notes</Button>
              </SheetTrigger>
              <SheetContent>
                <SheetSpine>Notes</SheetSpine>
                <SheetTitle>Notes</SheetTitle>
                <SheetDescription>Set the timetable large enough to read from the quay. The ferries&apos; names go in the italic.</SheetDescription>
                <SheetActions>
                  <SheetClose asChild>
                    <Button variant="bracket" data-autofocus>Back to the brief</Button>
                  </SheetClose>
                </SheetActions>
              </SheetContent>
            </Sheet>
          </SheetActions>
        </SheetContent>
      </Sheet>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="bracket">Open the settings</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetPanels defaultValue="settings">
            <SheetPanel value="settings" title="Settings">
              <SheetDescription>How the <span className="ot-yours">Halden</span> workspace looks and who hears about it.</SheetDescription>
              <div>
                <SheetPanelLink to="appearance" data-autofocus>Appearance</SheetPanelLink>
                <SheetPanelLink to="notices">Notices</SheetPanelLink>
              </div>
            </SheetPanel>
            <SheetPanel value="appearance" title="Appearance">
              <p className="ot-sheet-body">Day, with the parma pair. The page follows the reader&apos;s system after dark.</p>
              <SheetPanelLink to="pair">Typefaces</SheetPanelLink>
            </SheetPanel>
            <SheetPanel value="pair" title="Typefaces">
              <p className="ot-sheet-body">
                Archivo speaks for the interface; <span className="ot-yours">Bodoni Moda</span> answers for you.
              </p>
            </SheetPanel>
            <SheetPanel value="notices" title="Notices">
              <p className="ot-sheet-body">A line each morning when a file changes. Nothing on weekends.</p>
            </SheetPanel>
          </SheetPanels>
        </SheetContent>
      </Sheet>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="bracket">Read the note</Button>
        </SheetTrigger>
        <SheetContent variant="rag">
          <SheetTitle>
            Keep the <span className="ot-yours">flag</span>, lose the anchor.
          </SheetTitle>
          <SheetDescription>The blue is older than the company, and every islander knows it. The anchor says harbour; the line is about the crossing.</SheetDescription>
          <SheetActions>
            <SheetClose asChild>
              <Button variant="bracket" data-autofocus>Close</Button>
            </SheetClose>
          </SheetActions>
        </SheetContent>
      </Sheet>

      <Sheet>
        <Rows className="basis-full">
          {WORK.map(([name, kind, year], i) => (
            <Row key={name} asChild>
              <SheetTrigger onClick={() => setWhich(i)}>
                <RowTitle>{name}</RowTitle>
                <RowKind>{kind}</RowKind>
                <RowMeta>{year}</RowMeta>
              </SheetTrigger>
            </Row>
          ))}
        </Rows>
        <SheetContent variant="fold">
          <Meta>
            <span>{WORK[which][1]}</span>
            <span>{WORK[which][2]}</span>
          </Meta>
          <SheetTitle>{WORK[which][0]}</SheetTitle>
          <SheetDescription>{WORK[which][3]}</SheetDescription>
          <SheetActions>
            <SheetClose asChild>
              <Button variant="bracket" data-autofocus>Back to the index</Button>
            </SheetClose>
          </SheetActions>
        </SheetContent>
      </Sheet>
    </div>
  )
}

/** A sheet drawn still, in the page, for the states row. */
function Still({ variant, style, children }: { variant?: string; style?: CSSProperties; children: ReactNode }) {
  return (
    <dialog
      open
      className="ot-sheet"
      data-side="end"
      data-variant={variant}
      style={{ position: "relative", inset: "auto", translate: "none", width: "20rem", maxWidth: "100%", height: "22rem", transition: "none", ...style }}
    >
      {children}
    </dialog>
  )
}

export function States() {
  return (
    <>
      <State label="Open">
        <Still>
          <p className="ot-sheet-spine" aria-hidden="true">The brief</p>
          <p className="ot-sheet-title">The brief</p>
          <p className="ot-sheet-body">Keep the flag, lose the anchor.</p>
        </Still>
      </State>
      <State label="panels, two steps in">
        <Still style={{ height: "34rem" }}>
          <nav className="ot-sheet-spine ot-sheet-trail" aria-hidden="true">
            <span className="ot-sheet-trail-step">Settings</span>
            <span className="ot-sheet-trail-step">Appearance</span>
            <span className="ot-sheet-trail-step" aria-current="page">Typefaces</span>
          </nav>
          <p className="ot-sheet-title">Typefaces</p>
          <p className="ot-sheet-body">Archivo speaks for the interface.</p>
          <div>
            <span className="ot-sheet-panel-link" data-force="hover"><span>Pairs</span><span className="ot-sheet-panel-arrow">→</span></span>
          </div>
        </Still>
      </State>
      <State label="shelf, a sheet in front">
        <Still variant="shelf" style={{ width: "24rem" }}>
          <p className="ot-sheet-spine" aria-hidden="true" style={{ color: "var(--ot-pencil)" }}>The brief</p>
          <Still style={{ position: "absolute", inset: "0 0 0 auto", width: "calc(100% - var(--ot-space-8))", height: "100%", margin: 0 }}>
            <p className="ot-sheet-spine" aria-hidden="true">Notes</p>
            <p className="ot-sheet-title">Notes</p>
            <p className="ot-sheet-body">Set the timetable large.</p>
          </Still>
        </Still>
      </State>
    </>
  )
}
