import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, type AccordionProps } from "@/registry/0nlytype/ui/accordion"
import { State } from "@/components/site/state"

const FAQ = [
  ["How long does a project take?", "Most identity work runs four to eight weeks, and websites take a season. We agree the timeline before anything starts, and we keep to it."],
  ["Do you work with early teams?", "Often. Some of the best briefs arrive before there's a name."],
  ["What do you need from us to begin?", "A short brief, one person who can decide, and an hour for a first call."],
]

function Questions({ variant }: { variant: AccordionProps["variant"] }) {
  return (
    <Accordion type="single" variant={variant}>
      {FAQ.map(([q, a], i) => (
        <AccordionItem key={q} defaultOpen={i === 0}>
          <AccordionTrigger>{q}</AccordionTrigger>
          <AccordionContent>
            <p>{a}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

const WORK = [
  ["Identity for a ferry line", "Keep the flag, lose the anchor. The timetable is the real product, so the type is chosen for the quay, read from twenty metres in the rain."],
  ["A reading room", "Shelving, signs and a catalogue for a library that opens at night. Every sign is set in one size, so nothing shouts."],
  ["Wine labels", "Six labels, one grid. The vintage stands large; the grape is set in the italic, because the grower chose it."],
  ["The annual report", "Forty pages of figures set as type, with nothing drawn."],
]

function Columns() {
  return (
    <Accordion type="single" orientation="horizontal">
      {WORK.map(([q, a], i) => (
        <AccordionItem key={q} defaultOpen={i === 0}>
          <AccordionTrigger>{q}</AccordionTrigger>
          <AccordionContent>
            <p>{a}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

export default function Example() {
  return (
    <div className="grid gap-y-10">
      {(["cross", "run-in", "gloss"] as const).map((v) => (
        <div key={v} className="grid gap-y-4">
          <span className="db-label">{v}</span>
          <Questions variant={v} />
        </div>
      ))}
      <div className="grid gap-y-4">
        <span className="db-label">horizontal</span>
        <Columns />
      </div>
    </div>
  )
}

export function States() {
  const one = (variant: AccordionProps["variant"], open: boolean, force?: string) => (
    <Accordion variant={variant} style={{ width: variant === "gloss" ? "26rem" : "18rem", maxWidth: "100%" }}>
      <AccordionItem defaultOpen={open}>
        <AccordionTrigger data-force={force}>Do you work with early teams?</AccordionTrigger>
        <AccordionContent><p>Often, before there&apos;s a name.</p></AccordionContent>
      </AccordionItem>
    </Accordion>
  )
  return (
    <>
      <State label="cross, closed">{one("cross", false)}</State>
      <State label="cross, open">{one("cross", true)}</State>
      <State label="run-in, closed">{one("run-in", false)}</State>
      <State label="run-in, pointed at">{one("run-in", false, "hover")}</State>
      <State label="run-in, open">{one("run-in", true)}</State>
      <State label="gloss, closed">{one("gloss", false)}</State>
      <State label="gloss, open">{one("gloss", true)}</State>
      <State label="horizontal, one open, one pointed at">
        <Accordion orientation="horizontal" style={{ width: "30rem", maxWidth: "100%" }}>
          <AccordionItem defaultOpen>
            <AccordionTrigger>A reading room</AccordionTrigger>
            <AccordionContent><p>Every sign is set in one size.</p></AccordionContent>
          </AccordionItem>
          <AccordionItem>
            <AccordionTrigger data-force="hover">Wine labels</AccordionTrigger>
            <AccordionContent><p>Six labels, one grid.</p></AccordionContent>
          </AccordionItem>
        </Accordion>
      </State>
    </>
  )
}
