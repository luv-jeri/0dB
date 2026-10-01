"use client"

import * as React from "react"

import { Button } from "@/registry/0db/ui/button"
import { Segue, SegueScene } from "@/registry/0db/ui/segue"
import { State } from "@/components/site/state"

const acts = [
  ["Overture", "Silence first.", "The room before anyone speaks: paper, and the space the words will take."],
  ["Theme", "Then one line.", "A single statement, set large, with nothing beside it to lean on."],
  ["Coda", "Then nothing again.", "The last word stays a moment, and the page is quiet once more."],
]

function Scenes({ variant, size = "db-ff" }: { variant?: "wipe" | "horizon"; size?: string }) {
  const [at, setAt] = React.useState(0)
  return (
    <div className="grid gap-8">
      <Segue value={at} onValueChange={setAt} variant={variant} aria-label="Three scenes">
        {acts.map(([label, line, note]) => (
          <SegueScene key={label} label={label} className="grid content-start gap-4 py-10">
            <p className={size} style={{ margin: 0, color: "var(--db-ink)" }}>{line}</p>
            <p className="db-p" style={{ margin: 0, maxWidth: "34ch", color: "var(--db-graphite)" }}>{note}</p>
          </SegueScene>
        ))}
      </Segue>
      <div className="flex gap-6">
        <Button variant="quiet" disabled={at === 0} onClick={() => setAt(at - 1)}>
          Back
        </Button>
        <Button variant="quiet" disabled={at === acts.length - 1} onClick={() => setAt(at + 1)}>
          Next scene
        </Button>
      </div>
    </div>
  )
}

export default function Example() {
  return (
    <div className="grid gap-y-24">
      <Scenes />
      <Scenes variant="horizon" />
    </div>
  )
}

export function States() {
  return (
    <>
      <State label="Wipe">
        <Scenes size="db-mf" />
      </State>
      <State label="Horizon">
        <Scenes variant="horizon" size="db-mf" />
      </State>
      <State label="Scrub">
        <Segue scrub aria-label="Scenes that change as you scroll" style={{ width: "20rem", maxWidth: "100%" }}>
          {acts.map(([label, line]) => (
            <SegueScene key={label} label={label} className="py-10">
              <p className="db-mf" style={{ margin: 0, color: "var(--db-ink)" }}>{line}</p>
            </SegueScene>
          ))}
        </Segue>
      </State>
      <State label="Scrub, horizon">
        <Segue scrub variant="horizon" aria-label="Scenes that rise as you scroll" style={{ width: "20rem", maxWidth: "100%" }}>
          {acts.map(([label, line]) => (
            <SegueScene key={label} label={label} className="py-10">
              <p className="db-mf" style={{ margin: 0, color: "var(--db-ink)" }}>{line}</p>
            </SegueScene>
          ))}
        </Segue>
      </State>
    </>
  )
}
