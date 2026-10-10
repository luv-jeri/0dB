import { Chart } from "@/registry/0nlytype/ui/chart"
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

// Enquiries by month, new against returning clients.
const enquiries = [
  { label: "April", new: 14, returning: 9 },
  { label: "May", new: 18, returning: 11 },
  { label: "June", new: 12, returning: 13 },
  { label: "July", new: 21, returning: 10 },
  { label: "August", new: 9, returning: 7 },
  { label: "September", new: 24, returning: 15 },
]
const clients = [
  { key: "new", label: "new clients" },
  { key: "returning", label: "returning" },
]

const readers = [
  { label: "Lisbon", value: 640 },
  { label: "London", value: 1180 },
  { label: "Mexico City", value: 410 },
  { label: "Osaka", value: 860 },
  { label: "Tallinn", value: 230 },
]

export default function Example() {
  return (
    <div className="grid gap-y-16">
      <Chart data={visits} label="Visits by month, 2026" unit="visits" className="max-w-[44rem]" />
      <p className="max-w-[34rem]" style={{ fontSize: "var(--ot-mp)", lineHeight: "var(--ot-mp-lh)", color: "var(--ot-graphite)" }}>
        The studio&rsquo;s site grew all year, <Chart variant="spark" data={visits} label="Visits by month, 2026" unit="visits" />, its best month yet.
      </p>
      <Chart variant="isotype" data={visits} label="Visits by month, 2026" unit="visits" className="max-w-[44rem]" />
      <Chart data={enquiries} series={clients} label="Enquiries by month, new and returning clients" className="max-w-[44rem]" />
      <Chart data={enquiries} series={clients} stacked label="Enquiries by month, stacked" unit="enquiries" className="max-w-[44rem]" />
      <Chart orientation="horizontal" data={readers} now={1} label="Readers by city, September" unit="readers" className="max-w-[44rem]" />
    </div>
  )
}

export function States() {
  const may = visits.slice(4)
  return (
    <>
      <State label="Rest"><Chart data={may} label="Visits, May to September" unit="visits" className="w-64" /></State>
      <State label="Pointed at"><Chart data={may} label="Visits, May to September" unit="visits" className="w-64" data-force="hover" /></State>
      <State label="spark, rest"><p className="w-64">Visits reached <Chart variant="spark" data={may} label="Visits, May to September" unit="visits" /></p></State>
      <State label="spark, pointed at"><p className="w-64">Visits reached <Chart variant="spark" data={may} label="Visits, May to September" unit="visits" data-force="hover" /></p></State>
      <State label="isotype, rest"><Chart variant="isotype" data={may} label="Visits, May to September" unit="visits" className="w-64" /></State>
      <State label="grouped, pointed at"><Chart data={enquiries.slice(3)} series={clients} label="Enquiries, July to September" className="w-64" data-force="hover" /></State>
      <State label="stacked, pointed at"><Chart data={enquiries.slice(3)} series={clients} stacked label="Enquiries, July to September" unit="enquiries" className="w-64" data-force="hover" /></State>
      <State label="horizontal, pointed at"><Chart orientation="horizontal" data={readers.slice(0, 3)} label="Readers by city" unit="readers" className="w-64" data-force="hover" /></State>
      <State label="isotype, pointed at"><Chart variant="isotype" data={may} label="Visits, May to September" unit="visits" className="w-64" data-force="hover" /></State>
    </>
  )
}
