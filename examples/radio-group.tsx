import { RadioGroup, RadioGroupItem } from "@/registry/0nlytype/ui/radio-group"
import { State } from "@/components/site/state"

export default function Example() {
  return (
    <div className="grid justify-items-start gap-(--ot-space-8)">
      <RadioGroup legend="Timeline" defaultValue="month">
        <RadioGroupItem value="two-weeks">Two weeks</RadioGroupItem>
        <RadioGroupItem value="month">A month</RadioGroupItem>
        <RadioGroupItem value="season">A season</RadioGroupItem>
      </RadioGroup>
      <RadioGroup variant="glissando" legend="Reply by" defaultValue="wednesday">
        <RadioGroupItem value="monday">Monday</RadioGroupItem>
        <RadioGroupItem value="wednesday">Wednesday</RadioGroupItem>
        <RadioGroupItem value="friday">Friday</RadioGroupItem>
        <RadioGroupItem value="later">Next week</RadioGroupItem>
      </RadioGroup>
      <RadioGroup variant="ballot" legend="Seat" defaultValue="aisle">
        <RadioGroupItem value="window">Window</RadioGroupItem>
        <RadioGroupItem value="aisle">Aisle</RadioGroupItem>
        <RadioGroupItem value="either">Either</RadioGroupItem>
      </RadioGroup>
      <RadioGroup variant="sforzando" legend="Tone of voice" defaultValue="warm">
        <RadioGroupItem value="plain">Plain</RadioGroupItem>
        <RadioGroupItem value="warm">Warm</RadioGroupItem>
        <RadioGroupItem value="bold">Bold</RadioGroupItem>
        <RadioGroupItem value="grand">Grand</RadioGroupItem>
      </RadioGroup>
    </div>
  )
}

export function States() {
  return (
    <>
      <State label="Rest">
        <RadioGroup aria-label="Rest">
          <RadioGroupItem value="month">A month</RadioGroupItem>
        </RadioGroup>
      </State>
      <State label="Pointed at">
        <RadioGroup aria-label="Pointed at" defaultValue="weeks">
          <RadioGroupItem value="weeks">Weeks</RadioGroupItem>
          <RadioGroupItem value="month" data-force="hover">
            A month
          </RadioGroupItem>
        </RadioGroup>
      </State>
      <State label="Focus">
        <RadioGroup aria-label="Focus">
          <RadioGroupItem value="month" data-force="focus">
            A month
          </RadioGroupItem>
        </RadioGroup>
      </State>
      <State label="Chosen">
        <RadioGroup aria-label="Chosen" defaultValue="month">
          <RadioGroupItem value="month">A month</RadioGroupItem>
        </RadioGroup>
      </State>
      <State label="Disabled">
        <RadioGroup aria-label="Disabled">
          <RadioGroupItem value="month" disabled>
            A month
          </RadioGroupItem>
        </RadioGroup>
      </State>
      <State label="In a column">
        <RadioGroup aria-label="In a column" orientation="vertical" defaultValue="month">
          <RadioGroupItem value="weeks">Weeks</RadioGroupItem>
          <RadioGroupItem value="month">A month</RadioGroupItem>
          <RadioGroupItem value="season" data-force="hover">
            A season
          </RadioGroupItem>
        </RadioGroup>
      </State>
      <State label="Glissando, pointed at">
        <RadioGroup aria-label="Glissando, pointed at" variant="glissando">
          <RadioGroupItem value="month" data-force="hover">
            A month
          </RadioGroupItem>
        </RadioGroup>
      </State>
      <State label="Glissando, chosen">
        <RadioGroup aria-label="Glissando, chosen" variant="glissando" defaultValue="month">
          <RadioGroupItem value="month">A month</RadioGroupItem>
        </RadioGroup>
      </State>
      <State label="Ballot, pointed at">
        <RadioGroup aria-label="Ballot, pointed at" variant="ballot">
          <RadioGroupItem value="month" data-force="hover">
            A month
          </RadioGroupItem>
        </RadioGroup>
      </State>
      <State label="Ballot, chosen">
        <RadioGroup aria-label="Ballot, chosen" variant="ballot" defaultValue="month">
          <RadioGroupItem value="month">A month</RadioGroupItem>
        </RadioGroup>
      </State>
      <State label="Sforzando, pointed at">
        <RadioGroup aria-label="Sforzando, pointed at" variant="sforzando" defaultValue="day">
          <RadioGroupItem value="week" data-force="hover">
            Week
          </RadioGroupItem>
          <RadioGroupItem value="day">Day</RadioGroupItem>
        </RadioGroup>
      </State>
      <State label="Sforzando, focus">
        <RadioGroup aria-label="Sforzando, focus" variant="sforzando" defaultValue="day">
          <RadioGroupItem value="day" data-force="focus">
            Day
          </RadioGroupItem>
        </RadioGroup>
      </State>
    </>
  )
}
