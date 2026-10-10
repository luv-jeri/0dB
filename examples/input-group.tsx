import { Field } from "@/registry/0nlytype/ui/field"
import { InputGroup, InputGroupButton, InputGroupInput, InputGroupText } from "@/registry/0nlytype/ui/input-group"
import { State } from "@/components/site/state"

export default function Example() {
  return (
    <div className="grid w-full max-w-md gap-10">
      <Field label="Your project's address">
        <InputGroup>
          <InputGroupText>halden.studio/</InputGroupText>
          <InputGroupInput defaultValue="identity" autoComplete="off" />
          <InputGroupText>/brief</InputGroupText>
        </InputGroup>
      </Field>
      <Field label="Invite someone">
        <InputGroup>
          <InputGroupInput type="email" placeholder="name@studio.com" autoComplete="off" />
          <InputGroupButton type="submit">Send invite</InputGroupButton>
        </InputGroup>
      </Field>
      <Field label="How long you'll stay">
        <InputGroup variant="legend">
          <InputGroupInput inputMode="numeric" defaultValue="3" maxLength={2} autoComplete="off" />
          <InputGroupText agree={{ one: "night", other: "nights" }}>at the Halden house</InputGroupText>
          <InputGroupText>from Friday 14 November</InputGroupText>
        </InputGroup>
      </Field>
      <Field label="Share the draft">
        <InputGroup variant="arrow">
          <InputGroupInput type="email" required placeholder="name@studio.com" autoComplete="off" />
          <InputGroupButton type="submit">Send</InputGroupButton>
        </InputGroup>
      </Field>
    </div>
  )
}

export function States() {
  return (
    <>
      <State label="Rest">
        <InputGroup className="w-64"><InputGroupText>halden.studio/</InputGroupText><InputGroupInput placeholder="slug" /></InputGroup>
      </State>
      <State label="Focus">
        <InputGroup className="w-64" data-force="focus"><InputGroupText>halden.studio/</InputGroupText><InputGroupInput defaultValue="identity" /></InputGroup>
      </State>
      <State label="Error">
        <Field error="Use letters, numbers and hyphens." className="w-64">
          <InputGroup><InputGroupText>halden.studio/</InputGroupText><InputGroupInput defaultValue="my brief" /></InputGroup>
        </Field>
      </State>
      <State label="legend, one">
        <InputGroup variant="legend" className="w-64"><InputGroupInput aria-label="Nights" defaultValue="1" /><InputGroupText agree={{ one: "night", other: "nights" }}>at the house</InputGroupText><InputGroupText>from 14 November</InputGroupText></InputGroup>
      </State>
      <State label="legend, focus">
        <InputGroup variant="legend" className="w-64" data-force="focus"><InputGroupInput aria-label="Nights" defaultValue="12" /><InputGroupText agree={{ one: "night", other: "nights" }}>at the house</InputGroupText><InputGroupText>from 14 November</InputGroupText></InputGroup>
      </State>
      <State label="arrow, empty">
        <InputGroup variant="arrow" className="w-64"><InputGroupInput aria-label="Email" type="email" required placeholder="name@studio.com" /><InputGroupButton>Send</InputGroupButton></InputGroup>
      </State>
      <State label="arrow, ready">
        <InputGroup variant="arrow" className="w-64"><InputGroupInput aria-label="Email" type="email" required defaultValue="ada@halden.studio" /><InputGroupButton>Send</InputGroupButton></InputGroup>
      </State>
      <State label="arrow, pointed at">
        <InputGroup variant="arrow" className="w-64"><InputGroupInput aria-label="Email" type="email" required defaultValue="ada@halden.studio" /><InputGroupButton data-force="hover">Send</InputGroupButton></InputGroup>
      </State>
      <State label="Disabled">
        <InputGroup className="w-64"><InputGroupText>halden.studio/</InputGroupText><InputGroupInput defaultValue="identity" disabled /></InputGroup>
      </State>
    </>
  )
}
