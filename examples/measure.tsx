import { Measure } from "@/registry/0db/ui/measure"
import { State } from "@/components/site/state"

const text =
  "A line is a breath. Set it too short and the reader is thrown back to the margin before the thought has landed; set it too long and the eye finishes one line without knowing where the next begins. Somewhere between the two, a sentence sits down and is read without anyone noticing that it was set."

export default function Example() {
  return <Measure>{text}</Measure>
}

export function States() {
  return (
    <>
      <State label="Too short"><Measure className="w-[44rem] max-w-full" defaultMeasure={32}>{text}</Measure></State>
      <State label="Comfortable"><Measure className="w-[44rem] max-w-full" defaultMeasure={62}>{text}</Measure></State>
      <State label="Too long"><Measure className="w-[44rem] max-w-full" defaultMeasure={96}>{text}</Measure></State>
    </>
  )
}
