import { Calligram } from "@/registry/0db/ui/calligram"
import { State } from "@/components/site/state"

const text =
  "Zero decibels is not silence. It is the quietest sound a person can hear, the edge of the audible, and everything else in the world is measured upward from it. A room at zero has a pulse in it, a breath, a page turning three seats away. The threshold is a place you can stand and listen, and this is the shape it leaves when it is set down in words."

export default function Example() {
  return <Calligram fade className="mx-auto">{text}</Calligram>
}

export function States() {
  return (
    <>
      <State label="Circle"><Calligram size="20rem">{text}</Calligram></State>
      <State label="Fermata"><Calligram shape="fermata" size="20rem">{text}</Calligram></State>
      <State label="Wave"><Calligram shape="wave" size="20rem">{text}</Calligram></State>
    </>
  )
}
