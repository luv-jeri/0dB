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
      <Field label="What would you like to make or improve?" count maxLength={400} hint="You can start in the middle.">
        <Textarea grow minRows={2} maxRows={8} placeholder="Start with what you have." />
      </Field>
      <Field variant="overprint" label="Working title">
        <Input autoComplete="off" />
      </Field>
      <Field variant="signature" label="Signed, in full" hint="Your name as it should appear on the agreement.">
        <Input autoComplete="name" />
      </Field>
    </div>
  )
}

export function States() {
  return (
    <>
      <State label="Room for your thought"><Field label="Your starting point" className="w-64"><Textarea grow minRows={2} maxRows={5} defaultValue="An idea to explore. A product to improve. A problem to solve." /></Field></State>
      <State label="A longer thought, scrolls"><Field label="Your starting point" className="w-64"><Textarea grow minRows={2} maxRows={3} defaultValue={"An idea to explore.\nA product to improve.\nA problem to solve.\nYou can start in the middle."} /></Field></State>
      <State label="Rest"><Field label="Label" className="w-52"><Input placeholder="Placeholder" /></Field></State>
      <State label="Focus"><Field label="Label" count maxLength={40} data-force="focus" className="w-52"><Input defaultValue="Halden" /></Field></State>
      <State label="Filled"><Field label="Label" className="w-52"><Input defaultValue="Halden" /></Field></State>
      <State label="Error"><Field label="Label" error="Add the ending." className="w-52"><Input defaultValue="hello@studio" /></Field></State>
      <State label="Disabled"><Field label="Label" className="w-52"><Input defaultValue="Locked" disabled /></Field></State>
      <State label="overprint, rest"><Field variant="overprint" label="Title" className="w-52"><Input /></Field></State>
      <State label="overprint, focus"><Field variant="overprint" label="Title" data-force="focus" className="w-52"><Input defaultValue="Nocturne" /></Field></State>
      <State label="overprint, filled"><Field variant="overprint" label="Title" className="w-52"><Input defaultValue="Nocturne" /></Field></State>
      <State label="signature, rest"><Field variant="signature" label="Signed" className="w-52"><Input /></Field></State>
      <State label="signature, focus"><Field variant="signature" label="Signed" data-force="focus" className="w-52"><Input defaultValue="Halden" /></Field></State>
      <State label="signature, signed"><Field variant="signature" label="Signed" className="w-52"><Input defaultValue="Halden" /></Field></State>
      <State label="signature, error"><Field variant="signature" label="Signed" error="Sign in full." className="w-52"><Input defaultValue="A." /></Field></State>
    </>
  )
}
