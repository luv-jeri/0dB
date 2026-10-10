import { TextRibbon } from "@/registry/0nlytype/ui/text-ribbon"
import { State } from "@/components/site/state"

export default function Example() {
  return (
    <div className="grid w-full grid-cols-[minmax(0,1fr)] gap-(--db-space-8)">
      <div className="grid gap-(--db-space-3)">
        <TextRibbon className="db-mf">a little room to move</TextRibbon>
        <p className="db-pp" style={{ margin: 0, color: "var(--db-pencil)" }}>Let the phrase drift, or take over with a drag, the keys or the page. Pause holds it still.</p>
      </div>
      <TextRibbon variant="wave" className="db-mp">the quietest sound a person can hear</TextRibbon>
    </div>
  )
}

export function States() {
  return (
    <>
      <State label="Autoplaying"><TextRibbon className="db-mp w-[22rem] max-w-full">one note of colour</TextRibbon></State>
      <State label="Paused"><TextRibbon defaultPaused className="db-mp w-[22rem] max-w-full">a moment of rest</TextRibbon></State>
      <State label="Reduced motion"><TextRibbon data-force="reduced" className="db-mp w-[22rem] max-w-full">the phrase stands still</TextRibbon></State>
      <State label="Move it yourself"><TextRibbon autoplay={false} className="db-mp w-[22rem] max-w-full">the hand sets the pace</TextRibbon></State>
      <State label="Wave"><TextRibbon variant="wave" className="db-p w-[22rem] max-w-full">silence is structure</TextRibbon></State>
    </>
  )
}
