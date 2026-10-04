"use client"

import * as React from "react"

import { Meter } from "@/registry/0db/ui/meter"
import { Select } from "@/registry/0db/ui/select"
import { State } from "@/components/site/state"

const projects = { "Film archive": 72, "Identity archive": 38, "Empty archive": 0, "Full archive": 100 }

export default function Example() {
  const [project, setProject] = React.useState<keyof typeof projects>("Film archive")
  return (
    <div className="grid w-full max-w-xl gap-12">
      <Select label="Read the storage in" value={project} onChange={(e) => setProject(e.target.value as keyof typeof projects)}>
        {Object.keys(projects).map((name) => <option key={name}>{name}</option>)}
      </Select>
      <Meter label="Storage used" value={projects[project]} max={100} unit=" GB" note={`${100 - projects[project]} GB available for the next project`} />
    </div>
  )
}

export function States() {
  const measure = { width: "20rem" }
  return (
    <>
      <State label="At the minimum"><Meter style={measure} label="Storage used" value={0} unit=" GB" /></State>
      <State label="At the maximum"><Meter style={measure} label="Storage used" value={100} unit=" GB" /></State>
      <State label="A signed range"><Meter style={measure} label="Balance against budget" min={-500} max={500} value={-125} unit=" GBP" /></State>
      <State label="Right to left"><Meter style={measure} label="الرصيد" dir="rtl" min={-100} max={100} value={-25} /></State>
      <State label="Localized figures"><Meter style={measure} label="Budget used" value={1234.5} max={5000} unit=" EUR" format={(n) => new Intl.NumberFormat("de-DE", { minimumFractionDigits: 2 }).format(n)} /></State>
      <State label="A decimal reading"><Meter style={measure} label="Paper weight" min={80} max={300} value={170.5} unit=" gsm" /></State>
    </>
  )
}
