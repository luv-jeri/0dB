import { Footnotes, Footnote, FootnoteReference } from "@/registry/0db/ui/footnotes"
import { State } from "@/components/site/state"

export default function Example() {
  return <div className="grid w-full max-w-2xl gap-16">
    <p className="db-f">A pause belongs to the phrase.<FootnoteReference id="pause-ref" noteId="pause-note" number={1} /> Silence gives the next word its weight.<FootnoteReference id="silence-ref" noteId="silence-note" number={2} /></p>
    <Footnotes><Footnote id="pause-note" referenceId="pause-ref" number={1}>In a score, a rest is measured with the same care as a note.</Footnote><Footnote id="silence-note" referenceId="silence-ref" number={2}>The space between two parts can say as much as the parts themselves.</Footnote></Footnotes>
  </div>
}

export function States() {
  return <>
    <State label="The called note"><Footnotes className="w-72"><Footnote data-force="target" id="pinned-note" number={1}>The coordinate inks, and its short leader answers.</Footnote></Footnotes></State>
    <State label="Reference focus"><FootnoteReference noteId="pinned-note" number={1} data-force="focus" /></State>
    <State label="Long note, RTL"><Footnotes dir="rtl" label="ملاحظات" className="w-72"><Footnote id="rtl-note" number={1}>المسافة بين الكلمات جزء من المعنى. A very long reference remains readable in its own margin.</Footnote></Footnotes></State>
  </>
}
