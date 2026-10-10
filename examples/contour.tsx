import { Contour } from "@/registry/0nlytype/ui/contour"
import { State } from "@/components/site/state"

const coda =
  "The last bar is not the end of the piece. The players hold still, the bows stay on the strings, and for a moment nobody in the hall moves, because the silence after the music is still part of it. Then someone breathes, and it is over."

const tale =
  "Fury said to a mouse that he met in the house, let us both go to law, I will prosecute you. Come, I will take no denial, we must have a trial, for really this morning I have nothing to do. Said the mouse to the cur, such a trial, dear sir, with no jury or judge, would be wasting our breath."

export default function Example() {
  return (
    <div className="grid gap-16">
      <Contour fade className="db-mp max-w-[36rem]">{coda}</Contour>
      <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-12 sm:grid-cols-2">
        <Contour variant="tale" fade least={0.4} className="db-mp">{tale}</Contour>
        <Contour variant="cola" className="db-mp">{coda}</Contour>
      </div>
    </div>
  )
}

export function States() {
  return (
    <>
      <State label="Diminuendo"><Contour fade style={{ width: "18rem", maxWidth: "100%" }}>{coda}</Contour></State>
      <State label="Crescendo"><Contour shape="crescendo" fade style={{ width: "18rem", maxWidth: "100%" }}>{coda}</Contour></State>
      <State label="Hairpin"><Contour shape="hairpin" fade least={0.4} style={{ width: "18rem", maxWidth: "100%" }}>{coda}</Contour></State>
      <State label="Tale"><Contour variant="tale" fade least={0.4} style={{ width: "18rem", maxWidth: "100%" }}>{tale}</Contour></State>
      <State label="Cola"><Contour variant="cola" style={{ width: "18rem", maxWidth: "100%" }}>{coda}</Contour></State>
    </>
  )
}
