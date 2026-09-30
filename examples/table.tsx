"use client"

import * as React from "react"

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, TablePick } from "@/registry/0db/ui/table"

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

export default function Example() {
  const [sort, setSort] = React.useState<{ key: Key; dir: 1 | -1 }>({ key: "fee", dir: -1 })
  const [picked, setPicked] = React.useState<Set<string>>(new Set())
  const rows = [...projects].sort((a, b) => (a[sort.key] > b[sort.key] ? 1 : -1) * sort.dir)
  const all = picked.size === projects.length

  return (
    <div className="grid gap-(--db-space-4)">
      <Table>
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
