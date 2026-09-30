import { TextRibbon } from "@/registry/0db/ui/text-ribbon"
import { State } from "@/components/site/state"

export default function Example() {
  return (
    <div className="grid w-full grid-cols-[minmax(0,1fr)] gap-(--db-space-8)">
      <div className="grid gap-(--db-space-3)">
        <TextRibbon className="db-mf">Nothing moves unless you do</TextRibbon>
        <p className="db-pp" style={{ margin: 0, color: "var(--db-pencil)" }}>Drag it along the arch, or scroll the page. It stops when you stop.</p>
      </div>
      <TextRibbon variant="wave" className="db-mp">the quietest sound a person can hear</TextRibbon>
    </div>
  )
}

export function States() {
  return (
    <>
      <State label="Arc"><TextRibbon className="db-mp w-[22rem] max-w-full">one note of colour</TextRibbon></State>
      <State label="Wave"><TextRibbon variant="wave" className="db-p w-[22rem] max-w-full">silence is structure</TextRibbon></State>
    </>
  )
}
