import { Wake } from "@/registry/0nlytype/ui/wake"
import { State } from "@/components/site/state"

const text =
  "A hand drawn through still water leaves nothing behind it. The surface opens where you touch it, the ripples carry your shape outward for a moment, and then the water forgets you were there. Text can do the same. It only has to be given room, and to take it back the instant you go."

const river =
  "A typesetter spends a career closing rivers, the channels of white that run down a page when the spaces in one line fall under the spaces in the next. Here the river is yours. It follows your hand from edge to edge, the column parts either side of it, and every line reads straight across the white you have made."
const caesura =
  "A caesura is the pause in the middle of a line, the breath a singer takes where the verse allows it. Point at any line here and the paragraph gives it that breath, above and below, so it stands alone for as long as you stay. Move on and the next line is held instead; leave and the paragraph closes up."

const weight =
  "Press harder and the letter prints heavier. The ink spreads under the platen, the counters close, and a compositor keeps the line from moving by setting it narrower."

export default function Example() {
  return (
    <div className="grid gap-y-8">
      <Wake className="ot-mp max-w-[36rem]">{text}</Wake>
      <Wake variant="river" mark className="ot-p max-w-[36rem]">{river}</Wake>
      <Wake variant="caesura" mark className="ot-p max-w-[36rem]">{caesura}</Wake>
      <Wake variant="weight" className="ot-mf max-w-[36rem] font-light">{weight}</Wake>
    </div>
  )
}

export function States() {
  return (
    <>
      <State label="Unmarked, at rest">
        <Wake className="ot-p max-w-[24rem]">{text}</Wake>
      </State>
      <State label="Marked, at rest">
        <Wake mark radius={2.4} className="ot-p max-w-[24rem]">{text}</Wake>
      </State>
      <State label="River, at rest">
        <Wake variant="river" className="ot-p max-w-[24rem]">{river}</Wake>
      </State>
      <State label="Weight, at rest">
        <Wake variant="weight" className="ot-mp max-w-[24rem]">{weight}</Wake>
      </State>
      <State label="Caesura, at rest">
        <Wake variant="caesura" className="ot-p max-w-[24rem]">{caesura}</Wake>
      </State>
    </>
  )
}
