import { Melody } from "@/registry/0nlytype/ui/melody"
import { State } from "@/components/site/state"

/** The words as notes; the tune as discs with the words sung under them; and the staff drawn only under the words. */
export default function Example() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-y-(--ot-space-8)">
      <Melody className="max-w-[40rem]">Say it slowly enough and the sentence begins to sing, one word at a time, over the quiet.</Melody>
      <Melody variant="noteheads" className="max-w-[40rem]">Every word you reach is sung, and the rest are still to come.</Melody>
      <Melody variant="cutaway" className="max-w-[40rem]">Where nothing sounds, the lines fall silent, and only the words keep their place.</Melody>
    </div>
  )
}

export function States() {
  return (
    <>
      <State label="Its own tune">
        <Melody style={{ width: "22rem", maxWidth: "100%" }}>Nothing is louder than the pause before it.</Melody>
      </State>
      <State label="A given contour">
        <Melody contour={[0, 2, 4, 6, 8, 4]} style={{ width: "22rem", maxWidth: "100%" }}>Up the stairs and down again</Melody>
      </State>
      <State label="Noteheads, to come">
        <Melody variant="noteheads" contour={[0, 2, 4, 6, 8, 4]} style={{ width: "22rem", maxWidth: "100%" }}>Up the stairs and down again</Melody>
      </State>
      <State label="Noteheads, right to left">
        <Melody variant="noteheads" dir="rtl" lang="ar" style={{ width: "22rem", maxWidth: "100%" }}>قلها ببطء فتبدأ الجملة بالغناء</Melody>
      </State>
      <State label="Cutaway">
        <Melody variant="cutaway" style={{ width: "22rem", maxWidth: "100%" }}>Nothing is louder than the pause before it.</Melody>
      </State>
      <State label="Cutaway, a given contour">
        <Melody variant="cutaway" contour={[0, 2, 4, 6, 8, 4]} style={{ width: "22rem", maxWidth: "100%" }}>Up the stairs and down again</Melody>
      </State>
    </>
  )
}
