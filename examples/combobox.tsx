"use client"

import * as React from "react"

import { Combobox } from "@/registry/0nlytype/ui/combobox"
import { Field } from "@/registry/0nlytype/ui/field"
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
    <div className="grid w-full max-w-md gap-12">
      <div className="grid gap-10">
        <span className="ot-label">list</span>
        <Combobox label="Typeface" placeholder="Start typing a name" options={FACES} empty="Nothing matches. Try part of a name, like Garamond." />
        <Field label="Project" hint="Type a year or a kind to narrow the list.">
          <Combobox options={PROJECTS} placeholder="Choose a project" value={project} onValueChange={setProject} />
        </Field>
      </div>
      <div className="grid gap-10">
        <span className="ot-label">concordance</span>
        <Combobox variant="concordance" label="Typeface" placeholder="Type any part of a name" options={FACES} empty="Nothing matches. Try a few letters, like ond." />
      </div>
      <div className="grid gap-10">
        <span className="ot-label">pencil</span>
        <Field label="Typeface" hint="Tab takes the pencilled rest of the name.">
          <Combobox variant="pencil" placeholder="Start typing a name" options={FACES} empty="Nothing matches. Try part of a name, like Garamond." />
        </Field>
      </div>
      <div className="grid gap-10">
        <span className="ot-label">multiple</span>
        <Field label="Typefaces" hint="Choose as many as you like. Press a name to take it out.">
          <Combobox multiple name="faces" placeholder="Choose any number" options={FACES} defaultValue={["didot", "futura", "univers"]} empty="Nothing matches. Try part of a name, like Garamond." />
        </Field>
      </div>
    </div>
  )
}

export function States() {
  return (
    <>
      <State label="Rest"><Combobox aria-label="Typeface" placeholder="Choose one" options={FACES} className="w-52" /></State>
      <State label="Hover"><Combobox aria-label="Typeface" placeholder="Choose one" options={FACES} data-force="hover" className="w-52" /></State>
      <State label="Focus"><Combobox aria-label="Typeface" placeholder="Choose one" options={FACES} data-force="focus" className="w-52" /></State>
      <State label="Chosen"><Combobox aria-label="Typeface" options={FACES} defaultValue="newsreader" className="w-52" /></State>
      <State label="Error"><Field label="Typeface" error="Choose a typeface." className="w-52"><Combobox placeholder="Choose one" options={FACES} /></Field></State>
      <State label="Disabled"><Combobox aria-label="Typeface" options={FACES} defaultValue="futura" disabled className="w-52" /></State>
      <State label="pencil, rest"><Combobox variant="pencil" aria-label="Typeface" placeholder="Start typing" options={FACES} className="w-52" /></State>
      <State label="pencil, focus"><Combobox variant="pencil" aria-label="Typeface" placeholder="Start typing" options={FACES} data-force="focus" className="w-52" /></State>
      <State label="pencil, chosen"><Combobox variant="pencil" aria-label="Typeface" options={FACES} defaultValue="bodoni-moda" className="w-52" /></State>
      <State label="multiple, rest"><Combobox multiple aria-label="Typefaces" options={FACES} className="w-52" /></State>
      <State label="multiple, focus"><Combobox multiple aria-label="Typefaces" options={FACES} defaultValue={["didot", "futura"]} data-force="focus" className="w-52" /></State>
      <State label="multiple, chosen"><Combobox multiple aria-label="Typefaces" options={FACES} defaultValue={["baskerville", "didot", "futura"]} className="w-52" /></State>
      <State label="multiple, disabled"><Combobox multiple aria-label="Typefaces" options={FACES} defaultValue={["caslon", "gill-sans"]} disabled className="w-52" /></State>
    </>
  )
}
