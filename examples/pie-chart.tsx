import { PieChart } from "@/registry/0db/ui/pie-chart"
import { State } from "@/components/site/state"

// Where September's visits came from.
const visits = [
  { label: "Search", value: 1240 },
  { label: "Newsletter", value: 820 },
  { label: "Links from other sites", value: 540 },
  { label: "Typed in", value: 350 },
]

// How a working week was spent, in hours.
const week = [
  { label: "Drawing", value: 18 },
  { label: "Meetings", value: 9 },
  { label: "Writing", value: 7 },
  { label: "Email", value: 4 },
  { label: "Reading", value: 2 },
]

export default function Example() {
  return (
    <div className="flex flex-wrap items-start gap-x-24 gap-y-16">
      <PieChart data={visits} label="Where visits came from, September" unit="visits" />
      <PieChart variant="horizon" data={week} label="A working week, in hours" unit="hours" />
    </div>
  )
}

export function States() {
  return (
    <>
      <State label="Rest"><PieChart data={visits} label="Where visits came from, September" unit="visits" className="w-64" /></State>
      <State label="Pointed at"><PieChart data={visits} label="Where visits came from, September" unit="visits" className="w-64" data-force="hover" /></State>
      <State label="horizon, rest"><PieChart variant="horizon" data={week} label="A working week" unit="hours" className="w-64" /></State>
      <State label="horizon, pointed at"><PieChart variant="horizon" data={week} label="A working week" unit="hours" className="w-64" data-force="hover" /></State>
      <State label="One share"><PieChart data={[{ label: "Search", value: 1240 }]} label="Visits from search" unit="visits" className="w-64" /></State>
      <State label="Nothing yet"><PieChart data={[{ label: "Search", value: 0 }, { label: "Newsletter", value: 0 }]} label="Visits, October" unit="visits" className="w-64" /></State>
      <State label="Right to left"><PieChart dir="rtl" data={visits} label="Where visits came from, September" unit="visits" className="w-64" /></State>
    </>
  )
}
