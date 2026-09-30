import { Field } from "@/registry/0db/ui/field"
import { InputGroup, InputGroupButton, InputGroupInput, InputGroupText } from "@/registry/0db/ui/input-group"
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
      <State label="Disabled">
        <InputGroup className="w-64"><InputGroupText>halden.studio/</InputGroupText><InputGroupInput defaultValue="identity" disabled /></InputGroup>
      </State>
    </>
  )
}
