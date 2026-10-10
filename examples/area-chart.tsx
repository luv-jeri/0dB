import { AreaChart } from "@/registry/0nlytype/ui/area-chart"
import { State } from "@/components/site/state"

// Hours read on the studio's journal, by where the readers came from.
const reading = [
  { label: "January", value: 310, search: 180, letter: 90, direct: 40 },
  { label: "February", value: 360, search: 200, letter: 110, direct: 50 },
  { label: "March", value: 420, search: 210, letter: 150, direct: 60 },
  { label: "April", value: 390, search: 190, letter: 140, direct: 60 },
  { label: "May", value: 510, search: 260, letter: 170, direct: 80 },
  { label: "June", value: 470, search: 230, letter: 160, direct: 80 },
  { label: "July", value: 560, search: 280, letter: 190, direct: 90 },
  { label: "August", value: 530, search: 250, letter: 190, direct: 90 },
  { label: "September", value: 690, search: 330, letter: 240, direct: 120 },
]
const sources = [
  { key: "search", label: "from search" },
  { key: "letter", label: "from the letter" },
  { key: "direct", label: "direct" },
]

export default function Example() {
  return (
    <div className="grid gap-y-16">
      <AreaChart data={reading} label="Hours read by month, 2026" unit="hours read" className="max-w-[44rem]" />
      <AreaChart variant="smooth" data={reading} series={sources} label="Hours read by month and source, 2026" unit="hours" className="max-w-[44rem]" />
    </div>
  )
}

export function States() {
  const may = reading.slice(4)
  return (
    <>
      <State label="Rest"><AreaChart data={may} label="Hours read, May to September" unit="hours read" className="w-64" /></State>
      <State label="Pointed at"><AreaChart data={may} label="Hours read, May to September" unit="hours read" className="w-64" data-force="hover" /></State>
      <State label="step"><AreaChart variant="step" data={may} label="Hours read, May to September" unit="hours read" className="w-64" /></State>
      <State label="stacked, pointed at"><AreaChart data={may} series={sources.slice(0, 2)} label="Hours read by source" unit="hours" className="w-64" data-force="hover" /></State>
    </>
  )
}
