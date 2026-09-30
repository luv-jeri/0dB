import { ScrollArea } from "@/registry/0db/ui/scroll-area"

const notes = [
  ["0.1", "Every component in one stylesheet, fenced for the library."],
  ["0.1", "Four type pairs and five colour schemes."],
  ["0.1", "Motion that answers the hand, and rests."],
  ["0.1", "Right-to-left support for crumbs, checkboxes and fields."],
  ["0.1", "The overture: text that parts around the pause."],
  ["0.0", "Twenty posters pinned to a wall."],
  ["0.0", "One rule: ours in roman, yours in italic."],
  ["0.0", "A name, taken from music."],
]

export default function Example() {
  return (
    <ScrollArea aria-label="Release notes" className="max-h-56 max-w-xl">
      <ul className="grid gap-3 py-4 pe-6">
        {notes.map(([version, note]) => (
          <li key={note}>
            <b className="me-2 font-medium text-[var(--db-ink)]">{version}</b>
            {note}
          </li>
        ))}
      </ul>
    </ScrollArea>
  )
}
