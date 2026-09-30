"use client"

import * as React from "react"

import { State } from "@/components/site/state"
import { Button } from "@/registry/0db/ui/button"
import { Sidebar, SidebarGroup, SidebarHead, SidebarLink } from "@/registry/0db/ui/sidebar"

// Folded, pointing at a tick names it and shows its line.
const pages = {
  Work: { Projects: "Seven of them, three live.", Clients: "Who we work for, and since when.", Journal: "What the studio writes down." },
  "II Studio": { People: "Nine, and a dog.", Settings: "Hours, billing and who can sign in." },
}

export default function Example() {
  const [current, setCurrent] = React.useState("Projects")
  const [folded, setFolded] = React.useState(false)
  return (
    <div className="grid gap-10 min-[860px]:grid-cols-[auto_minmax(0,1fr)]">
      <Sidebar id="studio-app" label="Studio app" sheetLabel="Studio" folded={folded}>
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
        <Button variant="quiet" aria-expanded={!folded} aria-controls="studio-app" onClick={() => setFolded((f) => !f)}>
          {folded ? "Unfold the sidebar" : "Fold the sidebar"}
        </Button>
        <p className="db-mf">{current}</p>
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
    </>
  )
}
