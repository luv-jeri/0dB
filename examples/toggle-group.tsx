"use client"

import * as React from "react"

import { ToggleGroup, ToggleGroupItem } from "@/registry/0db/ui/toggle-group"
import { State } from "@/components/site/state"

export default function Example() {
  const [format, setFormat] = React.useState(["bold"])
  return (
    <div className="grid gap-6">
      <ToggleGroup type="multiple" value={format} onValueChange={setFormat} aria-label="Format">
        <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
        <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
        <ToggleGroupItem value="underline">Underline</ToggleGroupItem>
        <ToggleGroupItem value="wide">Wide</ToggleGroupItem>
      </ToggleGroup>
      <p
        className="db-mp"
        style={{
          fontWeight: format.includes("bold") ? 700 : undefined,
          fontStyle: format.includes("italic") ? "italic" : undefined,
          textDecoration: format.includes("underline") ? "underline" : undefined,
          fontStretch: format.includes("wide") ? "125%" : undefined,
        }}
      >
        Silence is structure.
      </p>
    </div>
  )
}

export function States() {
  return (
    <>
      <State label="One at a time">
        <ToggleGroup type="single" defaultValue="grid" aria-label="Layout">
          <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
          <ToggleGroupItem value="list">List</ToggleGroupItem>
        </ToggleGroup>
      </State>
      <State label="Any of them">
        <ToggleGroup type="multiple" defaultValue={["web", "motion"]} aria-label="Disciplines">
          <ToggleGroupItem value="identity">Identity</ToggleGroupItem>
          <ToggleGroupItem value="web">Web</ToggleGroupItem>
          <ToggleGroupItem value="motion">Motion</ToggleGroupItem>
        </ToggleGroup>
      </State>
      <State label="Disabled">
        <ToggleGroup type="single" disabled aria-label="Layout">
          <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
          <ToggleGroupItem value="list">List</ToggleGroupItem>
        </ToggleGroup>
      </State>
    </>
  )
}
