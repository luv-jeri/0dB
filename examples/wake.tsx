import { Wake } from "@/registry/0db/ui/wake"
import { State } from "@/components/site/state"

const text =
  "A hand drawn through still water leaves nothing behind it. The surface opens where you touch it, the ripples carry your shape outward for a moment, and then the water forgets you were there. Text can do the same. It only has to be given room, and to take it back the instant you go."

export default function Example() {
  return <Wake className="db-mp max-w-[36rem]">{text}</Wake>
}

export function States() {
  return (
    <>
      <State label="Unmarked, point at it">
        <Wake className="db-p max-w-[24rem]">{text}</Wake>
      </State>
      <State label="Marked, point at it">
        <Wake mark radius={2.4} className="db-p max-w-[24rem]">{text}</Wake>
      </State>
    </>
  )
}
