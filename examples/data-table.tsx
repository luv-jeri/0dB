"use client"

import { DataTable, type DataTableColumn, type DataTableFilter } from "@/registry/0db/ui/data-table"
import { State } from "@/components/site/state"

type Project = { name: string; kind: "web" | "identity" | "motion"; year: number; fee: number }

// Fictional studio work.
const projects: Project[] = [
  ["Harbour Line", "web", 2026, 48000], ["Salt & Rye", "identity", 2026, 22000], ["Nightjar", "motion", 2025, 31000],
  ["Kestrel Press", "identity", 2025, 18500], ["Low Tide", "web", 2024, 26000], ["Common Ground", "web", 2026, 61000],
  ["Paper Moon", "motion", 2024, 14000], ["Field Notes", "identity", 2023, 9500], ["Orchard", "web", 2025, 37500],
  ["Quiet Hours", "motion", 2026, 42000], ["Tin Roof", "identity", 2024, 12000], ["Northlight", "web", 2023, 29000],
  ["Glasshouse", "identity", 2026, 27500], ["Slow Burn", "motion", 2023, 8000], ["Wayfarer", "web", 2024, 33000],
  ["Linden", "identity", 2025, 16000], ["Undertow", "motion", 2025, 23500], ["Blue Hour", "web", 2026, 54000],
  ["Marram", "identity", 2023, 11000], ["Signal Box", "web", 2025, 40500], ["Cinder", "motion", 2024, 19000],
  ["Almanac", "identity", 2026, 30000], ["Fen", "web", 2023, 21000], ["Longshore", "motion", 2026, 36000],
].map(([name, kind, year, fee]) => ({ name, kind, year, fee }) as Project)

const pounds = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 })
const columns: DataTableColumn<Project>[] = [
  { id: "name", header: "Project", value: (p) => p.name, primary: true },
  { id: "kind", header: "Kind", value: (p) => p.kind },
  { id: "year", header: "Year", value: (p) => p.year, numeric: true },
  { id: "fee", header: "Fee", value: (p) => p.fee, cell: (p) => pounds.format(p.fee), numeric: true },
]
const filters: DataTableFilter<Project>[] = (["web", "identity", "motion"] as const).map((k) => ({ id: k, label: k, test: (p) => p.kind === k }))
const byName = (p: Project) => p.name

export default function Example() {
  return (
    <div className="grid w-full gap-16">
      <DataTable data={projects} columns={columns} filters={filters} noun="projects" caption="The studio's projects" getRowId={byName} defaultSort={{ id: "year", dir: -1 }} />
      <DataTable data={projects} columns={columns} noun="projects" caption="The studio's projects, by fee" getRowId={byName} defaultSort={{ id: "fee", dir: -1 }} variant="tail" pageSize={5} tableVariant="forte" />
    </div>
  )
}

export function States() {
  return (
    <>
      <State label="A filter that keeps nothing">
        <DataTable data={projects} columns={columns} filters={[...filters, { id: "print", label: "print", test: () => false }]} defaultFilter="print" noun="projects" caption="Print projects" getRowId={byName} className="w-full" />
      </State>
      <State label="The last page">
        <DataTable data={projects} columns={columns} noun="projects" caption="The studio's projects, last page" getRowId={byName} defaultPage={3} className="w-full" />
      </State>
      <State label="Tail, all shown">
        <DataTable data={projects.slice(0, 7)} columns={columns} noun="projects" caption="Seven projects" getRowId={byName} variant="tail" pageSize={5} defaultPage={2} className="w-full" />
      </State>
    </>
  )
}
