import { RadialChart } from "@/registry/0nlytype/ui/radial-chart"
import { State } from "@/components/site/state"

// Days in September each habit was kept, out of the month's 30.
const month = [
  { label: "Reading", value: 24 },
  { label: "Running", value: 19 },
  { label: "Drawing", value: 11 },
]

export default function Example() {
  return (
    <div className="flex flex-wrap items-start gap-x-24 gap-y-16">
      <RadialChart data={month} max={30} label="Habits kept in September" unit="days" />
      <RadialChart variant="horizon" data={[{ label: "Pages read", value: 1240 }]} max={2000} label="Pages read in 2026" unit="pages" />
    </div>
  )
}

export function States() {
  return (
    <>
      <State label="One series"><RadialChart data={[{ label: "Reading", value: 24 }]} max={30} label="Reading in September" unit="days" className="w-56" /></State>
      <State label="Rest"><RadialChart data={month} max={30} label="Habits kept in September" className="w-56" /></State>
      <State label="Pointed at"><RadialChart data={month} max={30} now={2} label="Habits kept in September" className="w-56" data-force="hover" /></State>
      <State label="horizon, rest"><RadialChart variant="horizon" data={month} max={30} label="Habits kept in September" className="w-64" /></State>
      <State label="horizon, pointed at"><RadialChart variant="horizon" data={month} max={30} now={1} label="Habits kept in September" className="w-64" data-force="hover" /></State>
      <State label="Closed"><RadialChart data={[{ label: "Running", value: 30 }]} max={30} label="Running in September" unit="days" className="w-56" /></State>
    </>
  )
}
