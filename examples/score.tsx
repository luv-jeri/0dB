"use client"

import * as React from "react"
import { ScoreProvider, ScoreToggle, useScore } from "@/registry/0db/ui/score"
import { Button } from "@/registry/0db/ui/button"
import { State } from "@/components/site/state"

function Chapters() {
  const { on, voice, resolve, cue, letter } = useScore()
  const [chapter, setChapter] = React.useState(0)
  const [resolved, setResolved] = React.useState(false)
  const parts = [1, 3, 4]
  return <div className="grid justify-items-start gap-(--db-space-5)">
    <p className="db-mf">Start with what you have.</p>
    <p className="db-p">An idea to explore. A product to improve. A problem to solve.</p>
    <ScoreToggle />
    <div className="flex flex-wrap gap-x-8 gap-y-3">
      <Button variant="quiet" disabled={!on || chapter === parts.length} onClick={() => { voice(parts[chapter]); setChapter((value) => value + 1) }}>Add a chapter</Button>
      <Button variant="quiet" disabled={!on} onClick={() => cue("set")}>Set the thought</Button>
      <Button variant="quiet" disabled={!on} onClick={() => letter("a")}>Sound a letter</Button>
      <Button variant="quiet" disabled={!on || resolved} onClick={() => { resolve(); setResolved(true) }}>Resolve</Button>
    </div>
    <p role="status" className="db-caption">{!on ? "You can start in the middle. Sound is optional." : resolved ? "The thought has found its shape." : `${chapter + 2} of 5 voices. Room for what comes next.`}</p>
  </div>
}

export default function Example() {
  return <ScoreProvider><Chapters /></ScoreProvider>
}

export function States() {
  return <>
    <State label="Your choice"><ScoreProvider><ScoreToggle /></ScoreProvider></State>
    <State label="Keyboard focus"><ScoreProvider><ScoreToggle data-force="focus" /></ScoreProvider></State>
    <State label="Unavailable"><ScoreToggle disabled /></State>
  </>
}
