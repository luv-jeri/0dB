"use client"

import { Tree, type TreeNode } from "@/registry/0db/ui/tree"
import { State } from "@/components/site/state"

// A fictional studio's archive.
const archive: TreeNode[] = [
  {
    id: "harbour",
    label: "Harbour Line",
    children: [
      { id: "harbour-brief", label: "Brief", value: "12 kB" },
      {
        id: "harbour-type",
        label: "Type",
        children: [
          { id: "harbour-display", label: "Display, 200", value: "184 kB" },
          { id: "harbour-text", label: "Text, 400", value: "176 kB" },
          { id: "harbour-italic", label: "Text italic, 400", value: "181 kB" },
        ],
      },
      { id: "harbour-posters", label: "Posters", children: [{ id: "harbour-a1", label: "Timetable, A1", value: "8.2 MB" }, { id: "harbour-a2", label: "Night service, A2", value: "6.9 MB" }] },
      { id: "harbour-invoice", label: "Invoice", value: "40 kB" },
    ],
  },
  { id: "salt", label: "Salt & Rye", children: [{ id: "salt-mark", label: "The mark", value: "96 kB" }, { id: "salt-menu", label: "Menu", value: "2.4 MB" }] },
  { id: "drafts", label: "Drafts", children: [] },
  { id: "notes", label: "Studio notes", value: "8 kB" },
]

// A fictional book's contents, the pages as values.
const contents: TreeNode[] = [
  { id: "c1", label: "Silence", value: 1, children: [{ id: "c1-1", label: "The page at rest", value: 3 }, { id: "c1-2", label: "Margins", value: 11 }] },
  {
    id: "c2",
    label: "Measure",
    value: 19,
    children: [
      { id: "c2-1", label: "Scale", value: 21 },
      { id: "c2-2", label: "Rhythm", value: 30, children: [{ id: "c2-2-1", label: "Tempo", value: 32 }, { id: "c2-2-2", label: "Rests", value: 37 }] },
      { id: "c2-3", label: "Figures", value: 44 },
    ],
  },
  { id: "c3", label: "Voice", value: 51 },
]

const files = (n: number): TreeNode[] =>
  ["Contact sheet", "Proof, first", "Proof, second", "Proof, final", "Letter", "Estimate", "Photographs", "Cover, flat", "Cover, wrap"].slice(0, n).map((label, i) => ({ id: `f${i}`, label, value: `${(i * 37) % 90 + 10} kB` }))

export default function Example() {
  return (
    <div className="grid w-full max-w-xl gap-16">
      <Tree nodes={archive} defaultExpanded={["harbour", "harbour-type"]} defaultSelected="harbour-italic" aria-label="The studio's archive" />
      <Tree nodes={contents} variant="outline" defaultExpanded={["c1", "c2", "c2-2"]} defaultSelected="c2-2-2" aria-label="Contents" />
    </div>
  )
}

export function States() {
  return (
    <>
      <State label="All closed">
        <Tree nodes={archive} aria-label="The studio's archive, closed" className="w-72" />
      </State>
      <State label="A long folder ends in the rest">
        <Tree nodes={[{ id: "proofs", label: "Kestrel Press", children: files(9) }]} defaultExpanded={["proofs"]} limit={4} aria-label="Kestrel Press" className="w-72" />
      </State>
      <State label="An empty folder, open">
        <Tree nodes={archive.slice(2)} defaultExpanded={["drafts"]} aria-label="Drafts" className="w-72" />
      </State>
    </>
  )
}
