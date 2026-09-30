import { Field, Input, Textarea } from "@/registry/0db/ui/field"
import { State } from "@/components/site/state"

export default function Example() {
  return (
    <div className="grid w-full max-w-md gap-10">
      <Field label="Your name" count maxLength={40}>
        <Input autoComplete="name" placeholder="As you'd like to be addressed" />
      </Field>
      <Field label="Email" error="Check the address. It needs a domain after the @, like studio.com.">
        <Input type="email" defaultValue="hello@studio" autoComplete="email" />
      </Field>
      <Field label="Notes" count maxLength={400} hint="Ruled like paper. The lines scroll with what you write.">
        <Textarea rows={4} placeholder="What should we know first?" />
      </Field>
    </div>
  )
}

export function States() {
  return (
    <>
      <State label="Rest"><Field label="Label" className="w-52"><Input placeholder="Placeholder" /></Field></State>
      <State label="Focus"><Field label="Label" count maxLength={40} data-force="focus" className="w-52"><Input defaultValue="Halden" /></Field></State>
      <State label="Filled"><Field label="Label" className="w-52"><Input defaultValue="Halden" /></Field></State>
      <State label="Error"><Field label="Label" error="Add the ending." className="w-52"><Input defaultValue="hello@studio" /></Field></State>
      <State label="Disabled"><Field label="Label" className="w-52"><Input defaultValue="Locked" disabled /></Field></State>
    </>
  )
}
