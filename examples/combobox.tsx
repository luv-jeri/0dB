"use client"

import * as React from "react"

import { Combobox } from "@/registry/0db/ui/combobox"
import { Field } from "@/registry/0db/ui/field"
import { State } from "@/components/site/state"

const FACES = ["Akzidenz-Grotesk", "Archivo", "Avenir", "Baskerville", "Bodoni Moda", "Bricolage Grotesque", "Caslon", "Cormorant", "Didot", "EB Garamond", "Frutiger", "Futura", "Gill Sans", "Helvetica", "Instrument Sans", "Newsreader", "Schibsted Grotesk", "Univers"].map((name) => ({
  value: name.toLowerCase().replace(/\s+/g, "-"),
  label: name,
}))

const PROJECTS = [
  { value: "halden", label: "Halden", hint: "Identity, 2026" },
  { value: "northlight", label: "Northlight", hint: "Web, 2026" },
  { value: "oda-studio", label: "Oda Studio", hint: "Identity, 2025" },
  { value: "tidewater", label: "Tidewater", hint: "Motion, 2025" },
  { value: "marram", label: "Marram", hint: "Web, 2025" },
]

export default function Example() {
  const [project, setProject] = React.useState("")
  return (
    <div className="grid w-full max-w-md gap-10">
      <Combobox label="Typeface" placeholder="Start typing a name" options={FACES} empty="Nothing matches. Try part of a name, like Garamond." />
      <Field label="Project" hint="Type a year or a kind to narrow the list.">
        <Combobox options={PROJECTS} placeholder="Choose a project" value={project} onValueChange={setProject} />
      </Field>
    </div>
  )
}

export function States() {
  return (
    <>
      <State label="Rest"><Combobox aria-label="Typeface" placeholder="Choose a typeface" options={FACES} className="w-52" /></State>
      <State label="Hover"><Combobox aria-label="Typeface" placeholder="Choose a typeface" options={FACES} data-force="hover" className="w-52" /></State>
      <State label="Focus"><Combobox aria-label="Typeface" placeholder="Choose a typeface" options={FACES} data-force="focus" className="w-52" /></State>
      <State label="Chosen"><Combobox aria-label="Typeface" options={FACES} defaultValue="newsreader" className="w-52" /></State>
      <State label="Error"><Field label="Label" error="Choose a typeface." className="w-52"><Combobox placeholder="Choose a typeface" options={FACES} /></Field></State>
      <State label="Disabled"><Combobox aria-label="Typeface" options={FACES} defaultValue="futura" disabled className="w-52" /></State>
    </>
  )
}
