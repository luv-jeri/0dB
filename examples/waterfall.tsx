import { Waterfall } from "@/registry/0db/ui/waterfall"
import { State } from "@/components/site/state"

const words = "Hush, the whole hall is listening. Nothing is louder than a room that has just gone quiet, and every sound after it is measured against that silence."

const fading =
  "Strike one note and let it ring. It is loudest the instant it begins, and from then on it only falls away, a little quieter with every breath, until you are no longer sure whether you are hearing the note or remembering it."

export default function Example() {
  return (
    <div className="grid gap-y-16">
      <Waterfall className="max-w-[56rem]">{words}</Waterfall>
      <Waterfall variant="decay" from="fff" className="max-w-[56rem]">{fading}</Waterfall>
      <Waterfall variant="solo" from="ff" className="max-w-[56rem]">{words}</Waterfall>
    </div>
  )
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
      <State label="Decay">
        <Waterfall variant="decay" from="fff" to="pp" className="w-[30rem] max-w-full">{fading}</Waterfall>
      </State>
      <State label="Decay, italic">
        <Waterfall variant="decay" italic from="ff" to="p" className="w-[30rem] max-w-full">{fading}</Waterfall>
      </State>
      <State label="Solo, at rest">
        <Waterfall variant="solo" from="f" to="pp" className="w-[30rem] max-w-full">{words}</Waterfall>
      </State>
    </>
  )
}
