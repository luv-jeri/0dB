import { Chart } from "@/registry/0db/ui/chart"
import { State } from "@/components/site/state"

const visits = [
  { label: "January", value: 1820 },
  { label: "February", value: 2140 },
  { label: "March", value: 2600 },
  { label: "April", value: 2380 },
  { label: "May", value: 3050 },
  { label: "June", value: 2890 },
  { label: "July", value: 3400 },
  { label: "August", value: 3120 },
  { label: "September", value: 4210 },
]

export default function Example() {
  return <Chart data={visits} label="Visits by month, 2026" unit="visits" className="max-w-[44rem]" />
}

export function States() {
  return (
    <>
      <State label="Rest"><Chart data={visits.slice(4)} label="Visits, May to September" unit="visits" className="w-64" /></State>
      <State label="Pointed at"><Chart data={visits.slice(4)} label="Visits, May to September" unit="visits" className="w-64" data-force="hover" /></State>
    </>
  )
}
