"use client"

import * as React from "react"

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, TablePick, type TableProps } from "@/registry/0db/ui/table"
import { State } from "@/components/site/state"

const projects = [
  { name: "Northlight", kind: "Web", year: 2026, fee: 62000 },
  { name: "Tidewater", kind: "Motion", year: 2025, fee: 54000 },
  { name: "Halden", kind: "Identity", year: 2026, fee: 48000 },
  { name: "Marram", kind: "Web", year: 2025, fee: 41000 },
  { name: "Oda Studio", kind: "Identity", year: 2025, fee: 36000 },
  { name: "Felt & Field", kind: "Identity", year: 2024, fee: 33000 },
  { name: "Quiet Hours", kind: "Web", year: 2024, fee: 29000 },
]
type Key = keyof (typeof projects)[number]
const columns: { key: Key; label: string; numeric?: boolean }[] = [
  { key: "name", label: "Project" },
  { key: "kind", label: "Kind" },
  { key: "year", label: "Year", numeric: true },
  { key: "fee", label: "Fee", numeric: true },
]
const pounds = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 })

const cities = ["Oslo", "Basel", "Lisbon", "Lagos", "Kyoto"]
// Kilometres as the crow flies, rounded; the chart is symmetric, so each pair is listed once.
const km: Record<string, number> = {
  "Oslo Basel": 1370, "Oslo Lisbon": 2740, "Oslo Lagos": 5980, "Oslo Kyoto": 8570, "Basel Lisbon": 1560,
  "Basel Lagos": 4520, "Basel Kyoto": 9600, "Lisbon Lagos": 3800, "Lisbon Kyoto": 11000, "Lagos Kyoto": 13300,
}
const between = (a: string, b: string) => km[`${a} ${b}`] ?? km[`${b} ${a}`]
const figures = new Intl.NumberFormat("en-GB")

function Distances({ force }: { force?: [number, number] }) {
  return (
    <Table variant="cross">
      <TableCaption>Distances between the studios, in kilometres</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead><span className="db-sr">From</span></TableHead>
          {cities.map((c) => <TableHead key={c} numeric>{c}</TableHead>)}
        </TableRow>
      </TableHeader>
      <TableBody>
        {cities.map((from, r) => (
          <TableRow key={from}>
            <TableHead scope="row">{from}</TableHead>
            {cities.map((to, c) => (
              <TableCell key={to} numeric data-force={force?.[0] === r && force[1] === c ? "hover" : undefined}>
                {from === to ? "" : figures.format(between(from, to))}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default function Example() {
  return (
    <div className="grid w-full grid-cols-[minmax(0,1fr)] justify-items-start gap-12">
      <div className="grid w-full justify-items-start gap-3">
        <span className="db-label">Ink</span>
        <Projects />
      </div>
      <div className="grid w-full justify-items-start gap-3">
        <span className="db-label">Forte</span>
        <Projects variant="forte" />
      </div>
      <div className="grid w-full justify-items-start gap-3">
        <span className="db-label">Cross</span>
        <Distances />
      </div>
    </div>
  )
}

function Projects({ variant }: { variant?: TableProps["variant"] }) {
  const [sort, setSort] = React.useState<{ key: Key; dir: 1 | -1 }>({ key: "fee", dir: -1 })
  const [picked, setPicked] = React.useState<Set<string>>(new Set())
  const rows = [...projects].sort((a, b) => (a[sort.key] > b[sort.key] ? 1 : -1) * sort.dir)
  const all = picked.size === projects.length

  return (
    <div className="grid w-full gap-(--db-space-4)">
      <Table variant={variant}>
        <TableCaption>Fees by project</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>
              <TablePick
                aria-label="Choose all projects"
                checked={all}
                ref={(el) => { if (el) el.indeterminate = picked.size > 0 && !all }}
                onChange={() => setPicked(all ? new Set() : new Set(projects.map((p) => p.name)))}
              />
            </TableHead>
            {columns.map((c) => (
              <TableHead
                key={c.key}
                numeric={c.numeric}
                sort={sort.key === c.key ? (sort.dir === 1 ? "ascending" : "descending") : undefined}
              >
                <button type="button" onClick={() => setSort({ key: c.key, dir: sort.key === c.key ? (-sort.dir as 1 | -1) : 1 })}>
                  {c.label}
                </button>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((p) => (
            <TableRow key={p.name} picked={picked.has(p.name)}>
              <TableCell>
                <TablePick
                  aria-label={`Choose ${p.name}`}
                  checked={picked.has(p.name)}
                  onChange={() => setPicked((s) => { const n = new Set(s); if (!n.delete(p.name)) n.add(p.name); return n })}
                />
              </TableCell>
              <TableCell primary sorted={sort.key === "name"}>{p.name}</TableCell>
              <TableCell sorted={sort.key === "kind"}>{p.kind}</TableCell>
              <TableCell numeric sorted={sort.key === "year"}>{p.year}</TableCell>
              <TableCell numeric sorted={sort.key === "fee"}>{pounds.format(p.fee)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p aria-live="polite">
        <span className="db-yours">{picked.size}</span> of {projects.length} chosen
      </p>
    </div>
  )
}

export function States() {
  return (
    <>
      <State label="Forte, sorted by fee">
        <Table variant="forte">
          <TableHeader><TableRow><TableHead>Project</TableHead><TableHead numeric sort="descending">Fee</TableHead></TableRow></TableHeader>
          <TableBody>
            {projects.slice(0, 3).map((p) => (
              <TableRow key={p.name}><TableCell primary>{p.name}</TableCell><TableCell numeric sorted>{pounds.format(p.fee)}</TableCell></TableRow>
            ))}
          </TableBody>
        </Table>
      </State>
      <State label="Cross, pointed at Lisbon to Kyoto"><Distances force={[2, 4]} /></State>
    </>
  )
}
