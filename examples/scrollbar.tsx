import type { CSSProperties } from "react"

import { Scrollbar } from "@/registry/0db/ui/scrollbar"
import { State } from "@/components/site/state"

const sections = [
  { id: "overture", num: "I", name: "Overture" },
  { id: "notes", num: "II", name: "Notes" },
  { id: "close", num: "III", name: "Close" },
]

const lines = Array.from({ length: 18 }, (_, i) => `Line ${i + 1} of the brief.`)

/** A box that scrolls, with the rail as its last child. Its sections are the headings inside it. */
export default function Example() {
  return (
    <div className="relative h-56 max-w-xl overflow-auto">
      <div className="grid gap-4 pe-8">
        <h4 id="overture" className="db-label">Overture</h4>
        {lines.slice(0, 6).map((l) => <p key={l}>{l}</p>)}
        <h4 id="notes" className="db-label">Notes</h4>
        {lines.slice(6, 12).map((l) => <p key={l}>{l}</p>)}
        <h4 id="close" className="db-label">Close</h4>
        {lines.slice(12).map((l) => <p key={l}>{l}</p>)}
      </div>
      <Scrollbar sections={sections} />
    </div>
  )
}

const pinned = [
  { id: "a", num: "II", name: "Notes", at: 0.2 },
  { id: "b", num: "III", name: "Close", at: 0.45 },
  { id: "c", num: "IV", name: "Credits", at: 0.75 },
]

function Rail({ force }: { force?: string }) {
  return (
    <div className="relative h-40 w-16">
      <Scrollbar data-force={force} sections={pinned} style={{ "--view": 0.3, "--p": 0.35 } as CSSProperties} />
    </div>
  )
}

export function States() {
  return (
    <>
      <State label="Rest"><Rail force="rest" /></State>
      <State label="Pointed at"><Rail force="hover" /></State>
      <State label="Held"><Rail force="active" /></State>
    </>
  )
}
