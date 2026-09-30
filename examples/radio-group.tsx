import { RadioGroup, RadioGroupItem } from "@/registry/0db/ui/radio-group"
import { State } from "@/components/site/state"

export default function Example() {
  return (
    <RadioGroup legend="Timeline" defaultValue="month">
      <RadioGroupItem value="two-weeks">Two weeks</RadioGroupItem>
      <RadioGroupItem value="month">A month</RadioGroupItem>
      <RadioGroupItem value="season">A season</RadioGroupItem>
    </RadioGroup>
  )
}

export function States() {
  return (
    <>
      <State label="Rest">
        <RadioGroup aria-label="Rest"><RadioGroupItem value="month">A month</RadioGroupItem></RadioGroup>
      </State>
      <State label="Pointed at">
        <RadioGroup aria-label="Pointed at"><RadioGroupItem value="month" data-force="hover">A month</RadioGroupItem></RadioGroup>
      </State>
      <State label="Focus">
        <RadioGroup aria-label="Focus"><RadioGroupItem value="month" data-force="focus">A month</RadioGroupItem></RadioGroup>
      </State>
      <State label="Chosen">
        <RadioGroup aria-label="Chosen" defaultValue="month"><RadioGroupItem value="month">A month</RadioGroupItem></RadioGroup>
      </State>
      <State label="Disabled">
        <RadioGroup aria-label="Disabled"><RadioGroupItem value="month" disabled>A month</RadioGroupItem></RadioGroup>
      </State>
    </>
  )
}
