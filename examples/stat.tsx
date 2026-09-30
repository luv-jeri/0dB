"use client"

import * as React from "react"

import { Select } from "@/registry/0db/ui/select"
import { Stat, Stats, type StatsProps } from "@/registry/0db/ui/stat"
import { State } from "@/components/site/state"

const years = {
  "2026": { visits: 4210, projects: 12, fees: 304000, hours: "1,860" },
  "2025": { visits: 3120, projects: 9, fees: 251000, hours: "1,745" },
  "2024": { visits: 2380, projects: 11, fees: 198000, hours: "1,902" },
}
type Year = keyof typeof years
const pounds = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 })

function Year({ year, variant }: { year: Year; variant?: StatsProps["variant"] }) {
  const y = years[year]
  return (
    <Stats variant={variant} aria-label={`The studio in ${year}`} className="w-full">
      <Stat value={y.visits} label="Visits in September" note={variant ? "The best month of the year" : undefined} />
      <Stat value={y.projects} label="Projects shipped" note={variant ? "Web, identity and motion" : undefined} />
      <Stat value={y.fees} format={(n) => pounds.format(n).replace(/,/g, "\u202f")} label="Fees invoiced" note={variant ? "Before tax" : undefined} />
    </Stats>
  )
}

export default function Example() {
  const [year, setYear] = React.useState<Year>("2026")
  return (
    <div className="grid w-full grid-cols-[minmax(0,1fr)] justify-items-start gap-12">
      <Select label="The studio in" value={year} onChange={(e) => setYear(e.target.value as Year)}>
        {Object.keys(years).map((y) => <option key={y}>{y}</option>)}
      </Select>
      <div className="grid w-full gap-3">
        <span className="db-label">Crop</span>
        <Year year={year} />
      </div>
      <div className="grid w-full gap-3">
        <span className="db-label">Beside</span>
        <Year year={year} variant="beside" />
      </div>
      <div className="grid w-full gap-3">
        <span className="db-label">Grid</span>
        <Year year={year} variant="grid" />
      </div>
    </div>
  )
}

export function States() {
  return (
    <>
      <State label="One stat, a string value">
        <Stats><Stat value="98%" label="Invoices paid on time" /></Stats>
      </State>
      <State label="Beside, with a note">
        <Stats variant="beside"><Stat value="03" label="Ambient" note="Already on, and never turns off." /></Stats>
      </State>
    </>
  )
}
