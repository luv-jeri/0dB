import { Checkbox, CheckboxGroup } from "@/registry/0db/ui/checkbox"
import { State } from "@/components/site/state"

export default function Example() {
  return (
    <div className="grid justify-items-start gap-x-16 gap-y-10 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <CheckboxGroup legend="Before we start" tally>
          <Checkbox defaultChecked>Share the brief</Checkbox>
          <Checkbox defaultChecked>Agree the scope</Checkbox>
          <Checkbox>Book a first call</Checkbox>
          <Checkbox>Send the references</Checkbox>
          <Checkbox>Sign the proposal</Checkbox>
        </CheckboxGroup>
      </div>
      <CheckboxGroup legend="Keep in the export">
        <Checkbox variant="stet" defaultChecked>Comments</Checkbox>
        <Checkbox variant="stet">Tracked changes</Checkbox>
        <Checkbox variant="stet" defaultChecked>Page numbers</Checkbox>
      </CheckboxGroup>
      <CheckboxGroup legend="What should we cover?">
        <Checkbox variant="circled">Typography</Checkbox>
        <Checkbox variant="circled" defaultChecked>Motion</Checkbox>
        <Checkbox variant="circled">Colour</Checkbox>
      </CheckboxGroup>
    </div>
  )
}

export function States() {
  return (
    <>
      {(["strike", "stet", "circled"] as const).flatMap((variant) => [
        <State key={`${variant}-rest`} label={`${variant}, rest`}><Checkbox variant={variant}>Agree the scope</Checkbox></State>,
        <State key={`${variant}-hover`} label={`${variant}, pointed at`}><Checkbox variant={variant} data-force="hover">Agree the scope</Checkbox></State>,
        <State key={`${variant}-checked`} label={`${variant}, checked`}><Checkbox variant={variant} defaultChecked>Agree the scope</Checkbox></State>,
      ])}
      <State label="Focus"><Checkbox data-force="focus">Agree the scope</Checkbox></State>
      <State label="Disabled"><Checkbox disabled>Agree the scope</Checkbox></State>
      <State label="circled, disabled"><Checkbox variant="circled" disabled defaultChecked>Agree the scope</Checkbox></State>
    </>
  )
}
