import { Waterfall } from "@/registry/0db/ui/waterfall"
import { State } from "@/components/site/state"

const words = "Hush, the whole hall is listening. Nothing is louder than a room that has just gone quiet, and every sound after it is measured against that silence."

export default function Example() {
  return <Waterfall className="max-w-[56rem]">{words}</Waterfall>
}

export function States() {
  return (
    <>
      <State label="Voice">
        <Waterfall from="f" to="pp" className="w-[30rem] max-w-full">{words}</Waterfall>
      </State>
      <State label="Italic">
        <Waterfall italic from="f" to="pp" className="w-[30rem] max-w-full">{words}</Waterfall>
      </State>
    </>
  )
}
