"use client"

import * as React from "react"

import { State } from "@/components/site/state"
import { Button } from "@/registry/0nlytype/ui/button"
import { Sidebar, SidebarGroup, SidebarHead, SidebarLink, type SidebarProps } from "@/registry/0nlytype/ui/sidebar"

// Folded, pointing at a tick names it and shows its line.
const pages = {
  Work: { Projects: "Seven of them, three live.", Clients: "Who we work for, and since when.", Journal: "What the studio writes down." },
  "II Studio": { People: "Nine, and a dog.", Settings: "Hours, billing and who can sign in." },
}

type Variant = NonNullable<SidebarProps["variant"]>
const variants: Variant[] = ["words", "chapter", "numerals"]

export default function Example() {
  const [current, setCurrent] = React.useState("Projects")
  const [folded, setFolded] = React.useState(false)
  const [variant, setVariant] = React.useState<Variant>("words")
  return (
    <div className="grid gap-10 min-[860px]:grid-cols-[auto_minmax(0,1fr)]">
      <Sidebar id="studio-app" label="Studio app" sheetLabel="Studio" folded={folded} variant={variant}>
        <SidebarHead>Halden Studio</SidebarHead>
        {Object.entries(pages).map(([group, names]) => (
          <SidebarGroup key={group} label={group}>
            {Object.entries(names).map(([name, line]) => (
              <SidebarLink
                key={name}
                href={`#${name.toLowerCase()}`}
                current={name === current}
                preview={line}
                onClick={(e) => {
                  e.preventDefault()
                  setCurrent(name)
                }}
              >
                {name}
              </SidebarLink>
            ))}
          </SidebarGroup>
        ))}
      </Sidebar>
      <div className="grid content-start justify-items-start gap-4">
        <div role="group" aria-label="Sidebar variant" className="flex flex-wrap gap-x-6 gap-y-2">
          {variants.map((v) => (
            <Button key={v} variant="quiet" aria-pressed={v === variant} disabled={folded} onClick={() => setVariant(v)}>
              {v[0].toUpperCase() + v.slice(1)}
            </Button>
          ))}
        </div>
        <Button variant="quiet" aria-expanded={!folded} aria-controls="studio-app" onClick={() => setFolded((f) => !f)}>
          {folded ? "Unfold the sidebar" : "Fold the sidebar"}
        </Button>
        <p className="ot-mf">{current}</p>
        <p>Seven projects, three of them live. Choose a page on the left, or fold the column to a ruler and point at a tick.</p>
      </div>
    </div>
  )
}

export function States() {
  return (
    <>
      <State label="Rest">
        <SidebarGroup label="Work"><SidebarLink href="#projects">Projects</SidebarLink></SidebarGroup>
      </State>
      <State label="Pointed at">
        <SidebarGroup label="Work"><SidebarLink href="#projects" data-force="hover">Projects</SidebarLink></SidebarGroup>
      </State>
      <State label="Current">
        <SidebarGroup label="Work"><SidebarLink href="#projects" current>Projects</SidebarLink></SidebarGroup>
      </State>
      <State label="Chapter, closed and opened">
        <Sidebar label="Chapter" variant="chapter">
          <SidebarGroup label="Work"><SidebarLink href="#projects" current>Projects</SidebarLink><SidebarLink href="#clients">Clients</SidebarLink></SidebarGroup>
          <SidebarGroup label="II Studio"><SidebarLink href="#people">People</SidebarLink></SidebarGroup>
          <SidebarGroup label="III Books" data-force="hover"><SidebarLink href="#ledger">Ledger</SidebarLink></SidebarGroup>
        </Sidebar>
      </State>
      <State label="Numerals">
        <Sidebar label="Numerals" variant="numerals">
          <SidebarGroup label="Work"><SidebarLink href="#projects" current>Projects</SidebarLink><SidebarLink href="#clients">Clients</SidebarLink></SidebarGroup>
          <SidebarGroup label="Studio"><SidebarLink href="#people">People</SidebarLink><SidebarLink href="#settings">Settings</SidebarLink></SidebarGroup>
        </Sidebar>
      </State>
    </>
  )
}
