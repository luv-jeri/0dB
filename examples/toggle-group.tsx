"use client"

import * as React from "react"

import { ToggleGroup, ToggleGroupItem } from "@/registry/0nlytype/ui/toggle-group"
import { State } from "@/components/site/state"

const sizes = ["p", "mp", "mf", "f"] as const

export default function Example() {
  const [format, setFormat] = React.useState(["italic"])
  const [size, setSize] = React.useState<string>("mf")
  const has = (f: string) => format.includes(f)
  return (
    <div className="grid justify-items-start gap-8">
      <div className="grid justify-items-start gap-2">
        <span className="ot-label">Format</span>
        <ToggleGroup type="multiple" value={format} onValueChange={setFormat} aria-label="Format">
          <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
          <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
          <ToggleGroupItem value="underline">Underline</ToggleGroupItem>
          <ToggleGroupItem value="wide">Wide</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="grid justify-items-start gap-2">
        <span className="ot-label">Size</span>
        {/* Radix single groups clear on a second press; a size is always one of the four. */}
        <ToggleGroup variant="bracket" type="single" value={size} onValueChange={(v) => v && setSize(v)} aria-label="Size">
          {sizes.map((s) => (
            <ToggleGroupItem key={s} value={s}>{s}</ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <p className="text-balance" style={{
          color: "var(--ot-ink)",
          fontSize: `var(--ot-${size})`,
          lineHeight: `var(--ot-${size}-lh)`,
          fontFamily: has("italic") ? "var(--ot-expression)" : undefined,
          fontStyle: has("italic") ? "italic" : undefined,
          fontWeight: has("bold") ? 700 : 400,
          fontStretch: has("wide") ? "125%" : "100%",
          textDecorationLine: "underline",
          textDecorationColor: has("underline") ? "currentColor" : "transparent",
          textDecorationThickness: "var(--ot-hairline)",
          textUnderlineOffset: "0.18em",
          transition: "font-size var(--ot-moderato) var(--ot-exhale), font-weight var(--ot-moderato) var(--ot-exhale), font-stretch var(--ot-moderato) var(--ot-exhale), text-decoration-color var(--ot-allegro)",
        }}>
        Silence is structure.
      </p>
      <div className="grid justify-items-start gap-2">
        <span className="ot-label">Rank what matters</span>
        <ToggleGroup variant="fingering" type="multiple" defaultValue={["purpose", "clarity"]} aria-label="Rank what matters">
          {["Clarity", "Purpose", "Simplicity", "Impact"].map((w) => (
            <ToggleGroupItem key={w} value={w.toLowerCase()}>{w}</ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <div className="grid justify-items-start gap-2">
        <span className="ot-label">Show on the page</span>
        <ToggleGroup variant="margin" type="multiple" defaultValue={["baselines", "captions"]} aria-label="Show on the page">
          {["Grid", "Baselines", "Margins", "Captions"].map((w) => (
            <ToggleGroupItem key={w} value={w.toLowerCase()}>{w}</ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
    </div>
  )
}

export function States() {
  return (
    <>
      <State label="Pointed at">
        <ToggleGroup type="multiple" aria-label="Pointed at">
          <ToggleGroupItem value="grid" data-force="hover">Grid</ToggleGroupItem>
          <ToggleGroupItem value="list">List</ToggleGroupItem>
        </ToggleGroup>
      </State>
      <State label="Focus">
        <ToggleGroup type="multiple" aria-label="Focus">
          <ToggleGroupItem value="grid" data-force="focus">Grid</ToggleGroupItem>
          <ToggleGroupItem value="list">List</ToggleGroupItem>
        </ToggleGroup>
      </State>
      <State label="Held">
        <ToggleGroup type="single" defaultValue="grid" aria-label="Held">
          <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
          <ToggleGroupItem value="list">List</ToggleGroupItem>
        </ToggleGroup>
      </State>
      <State label="Held together">
        <ToggleGroup type="multiple" defaultValue={["web", "motion"]} aria-label="Held together">
          <ToggleGroupItem value="identity">Identity</ToggleGroupItem>
          <ToggleGroupItem value="web">Web</ToggleGroupItem>
          <ToggleGroupItem value="motion">Motion</ToggleGroupItem>
        </ToggleGroup>
      </State>
      <State label="Disabled">
        <ToggleGroup type="single" defaultValue="grid" disabled aria-label="Disabled">
          <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
          <ToggleGroupItem value="list">List</ToggleGroupItem>
        </ToggleGroup>
      </State>
      <State label="Bracket, pointed at">
        <ToggleGroup variant="bracket" type="multiple" aria-label="Bracket, pointed at">
          <ToggleGroupItem value="grid" data-force="hover">Grid</ToggleGroupItem>
          <ToggleGroupItem value="list">List</ToggleGroupItem>
        </ToggleGroup>
      </State>
      <State label="Bracket, focus">
        <ToggleGroup variant="bracket" type="multiple" aria-label="Bracket, focus">
          <ToggleGroupItem value="grid" data-force="focus">Grid</ToggleGroupItem>
          <ToggleGroupItem value="list">List</ToggleGroupItem>
        </ToggleGroup>
      </State>
      <State label="Bracket, held">
        <ToggleGroup variant="bracket" type="single" defaultValue="grid" aria-label="Bracket, held">
          <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
          <ToggleGroupItem value="list">List</ToggleGroupItem>
        </ToggleGroup>
      </State>
      <State label="Bracket, held together">
        <ToggleGroup variant="bracket" type="multiple" defaultValue={["web", "motion"]} aria-label="Bracket, held together">
          <ToggleGroupItem value="identity">Identity</ToggleGroupItem>
          <ToggleGroupItem value="web">Web</ToggleGroupItem>
          <ToggleGroupItem value="motion">Motion</ToggleGroupItem>
        </ToggleGroup>
      </State>
      <State label="Fingering, pointed at">
        <ToggleGroup variant="fingering" type="multiple" defaultValue={["web"]} aria-label="Fingering, pointed at">
          <ToggleGroupItem value="web">Web</ToggleGroupItem>
          <ToggleGroupItem value="print" data-force="hover">Print</ToggleGroupItem>
        </ToggleGroup>
      </State>
      <State label="Fingering, held in turn">
        <ToggleGroup variant="fingering" type="multiple" defaultValue={["motion", "identity"]} aria-label="Fingering, held in turn">
          <ToggleGroupItem value="identity">Identity</ToggleGroupItem>
          <ToggleGroupItem value="web">Web</ToggleGroupItem>
          <ToggleGroupItem value="motion">Motion</ToggleGroupItem>
        </ToggleGroup>
      </State>
      <State label="Fingering, disabled">
        <ToggleGroup variant="fingering" type="multiple" defaultValue={["grid"]} disabled aria-label="Fingering, disabled">
          <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
          <ToggleGroupItem value="list">List</ToggleGroupItem>
        </ToggleGroup>
      </State>
      <State label="Margin, pointed at">
        <ToggleGroup variant="margin" type="multiple" aria-label="Margin, pointed at">
          <ToggleGroupItem value="grid" data-force="hover">Grid</ToggleGroupItem>
          <ToggleGroupItem value="list">List</ToggleGroupItem>
        </ToggleGroup>
      </State>
      <State label="Margin, held">
        <ToggleGroup variant="margin" type="multiple" defaultValue={["list"]} aria-label="Margin, held">
          <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
          <ToggleGroupItem value="list">List</ToggleGroupItem>
          <ToggleGroupItem value="table">Table</ToggleGroupItem>
        </ToggleGroup>
      </State>
      <State label="Margin, focus">
        <ToggleGroup variant="margin" type="multiple" aria-label="Margin, focus">
          <ToggleGroupItem value="grid" data-force="focus">Grid</ToggleGroupItem>
          <ToggleGroupItem value="list">List</ToggleGroupItem>
        </ToggleGroup>
      </State>
      <State label="Bracket, disabled">
        <ToggleGroup variant="bracket" type="single" defaultValue="grid" disabled aria-label="Bracket, disabled">
          <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
          <ToggleGroupItem value="list">List</ToggleGroupItem>
        </ToggleGroup>
      </State>
    </>
  )
}
