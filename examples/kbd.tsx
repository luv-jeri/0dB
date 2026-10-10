import { Kbd } from "@/registry/0nlytype/ui/kbd"
import { State } from "@/components/site/state"

export default function Example() {
  return (
    <div className="grid gap-8">
      <p className="db-mp">
        Press <Kbd>G</Kbd> anywhere to lay the grid over the page, or <Kbd>⌘K</Kbd> to find another.
      </p>
      <p className="db-mp">
        Type the note in, <Kbd variant="typewriter">A</Kbd> to <Kbd variant="typewriter">G</Kbd>, then <Kbd variant="chord">⌘⇧S</Kbd> to
        save it under a new name.
      </p>
    </div>
  )
}

export function States() {
  return (
    <>
      <State label="Rest"><Kbd>G</Kbd></State>
      <State label="Pressed"><Kbd pressed>G</Kbd></State>
      <State label="Two glyphs"><Kbd>⌘K</Kbd></State>
      <State label="Two glyphs, pressed"><Kbd pressed>⌘K</Kbd></State>
      <State label="Typewriter"><Kbd variant="typewriter">G</Kbd></State>
      <State label="Typewriter, pressed"><Kbd variant="typewriter" pressed>G</Kbd></State>
      <State label="Typewriter, a word"><Kbd variant="typewriter">Esc</Kbd></State>
      <State label="Chord"><Kbd variant="chord">⌘⇧S</Kbd></State>
      <State label="Chord, pressed"><Kbd variant="chord" pressed>⌘⇧S</Kbd></State>
      <State label="Chord, in words"><Kbd variant="chord">Ctrl+Shift+S</Kbd></State>
    </>
  )
}
