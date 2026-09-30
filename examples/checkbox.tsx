import { Checkbox, CheckboxGroup } from "@/registry/0db/ui/checkbox"
import { State } from "@/components/site/state"

export default function Example() {
  return (
    <CheckboxGroup legend="Before we start" tally>
      <Checkbox defaultChecked>Share the brief</Checkbox>
      <Checkbox defaultChecked>Agree the scope</Checkbox>
      <Checkbox>Book a first call</Checkbox>
      <Checkbox>Send the references</Checkbox>
      <Checkbox>Sign the proposal</Checkbox>
    </CheckboxGroup>
  )
}

export function States() {
  return (
    <>
      <State label="Rest"><Checkbox>Agree the scope</Checkbox></State>
      <State label="Pointed at"><Checkbox data-force="hover">Agree the scope</Checkbox></State>
      <State label="Focus"><Checkbox data-force="focus">Agree the scope</Checkbox></State>
      <State label="Checked"><Checkbox defaultChecked>Agree the scope</Checkbox></State>
      <State label="Disabled"><Checkbox disabled>Agree the scope</Checkbox></State>
    </>
  )
}
