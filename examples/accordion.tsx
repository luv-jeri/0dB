import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/registry/0db/ui/accordion"
import { State } from "@/components/site/state"

export default function Example() {
  return (
    <Accordion type="single">
      <AccordionItem defaultOpen>
        <AccordionTrigger>How long does a project take?</AccordionTrigger>
        <AccordionContent>
          <p>Most identity work runs four to eight weeks, and websites take a season. We agree the timeline before anything starts, and we keep to it.</p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem>
        <AccordionTrigger>Do you work with early teams?</AccordionTrigger>
        <AccordionContent>
          <p>Often. Some of the best briefs arrive before there&apos;s a name.</p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem>
        <AccordionTrigger>What do you need from us to begin?</AccordionTrigger>
        <AccordionContent>
          <p>A short brief, one person who can decide, and an hour for a first call.</p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export function States() {
  return (
    <>
      <State label="Closed">
        <Accordion style={{ width: "18rem" }}>
          <AccordionItem>
            <AccordionTrigger>Do you work with early teams?</AccordionTrigger>
            <AccordionContent><p>Often.</p></AccordionContent>
          </AccordionItem>
        </Accordion>
      </State>
      <State label="Open">
        <Accordion style={{ width: "18rem" }}>
          <AccordionItem defaultOpen>
            <AccordionTrigger>Do you work with early teams?</AccordionTrigger>
            <AccordionContent><p>Often.</p></AccordionContent>
          </AccordionItem>
        </Accordion>
      </State>
    </>
  )
}
