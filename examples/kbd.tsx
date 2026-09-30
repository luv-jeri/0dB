import { Kbd } from "@/registry/0db/ui/kbd"
import { State } from "@/components/site/state"

export default function Example() {
  return (
    <p className="db-mp">
      Press <Kbd>G</Kbd> anywhere to lay the grid over the page, or <Kbd>⌘K</Kbd> to find another.
    </p>
  )
}

export function States() {
  return (
    <>
      <State label="Rest"><Kbd>G</Kbd></State>
      <State label="Pressed"><Kbd pressed>G</Kbd></State>
      <State label="Two glyphs"><Kbd>⌘K</Kbd></State>
      <State label="Two glyphs, pressed"><Kbd pressed>⌘K</Kbd></State>
    </>
  )
}
