import { LineChart } from "@/registry/0db/ui/line-chart"
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

// This year against last, month by month.
const years = visits.map((d, i) => ({ label: d.label, now: d.value, then: [1540, 1610, 1990, 2210, 2050, 2480, 2300, 2720, 2940][i] }))
const both = [
  { key: "now", label: "2026" },
  { key: "then", label: "2025" },
]

export default function Example() {
  return (
    <div className="grid gap-y-16">
      <LineChart data={visits} label="Visits by month, 2026" unit="visits" className="max-w-[44rem]" />
      <LineChart variant="smooth" data={years} series={both} label="Visits by month, 2026 against 2025" className="max-w-[44rem]" />
      <LineChart variant="step" data={visits} label="Visits by month, 2026" unit="visits" className="max-w-[44rem]" />
    </div>
  )
}

export function States() {
  const may = visits.slice(4)
  return (
    <>
      <State label="Rest"><LineChart data={may} label="Visits, May to September" unit="visits" className="w-64" /></State>
      <State label="Pointed at"><LineChart data={may} label="Visits, May to September" unit="visits" className="w-64" data-force="hover" /></State>
      <State label="smooth"><LineChart variant="smooth" data={may} label="Visits, May to September" unit="visits" className="w-64" /></State>
      <State label="step"><LineChart variant="step" data={may} label="Visits, May to September" unit="visits" className="w-64" /></State>
      <State label="two series, pointed at"><LineChart data={years.slice(4)} series={both} label="Visits, 2026 against 2025" className="w-64" data-force="hover" /></State>
    </>
  )
}
