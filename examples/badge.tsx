"use client"

import * as React from "react"

import { Badge } from "@/registry/0db/ui/badge"
import { Button } from "@/registry/0db/ui/button"
import { State } from "@/components/site/state"

const all = ["Identity", "Web", "Motion", "Print"]

export default function Example() {
  const [tags, setTags] = React.useState(all)
  return (
    <div className="flex flex-col items-start" style={{ gap: "var(--db-space-5)" }}>
      <div className="flex flex-wrap gap-3">
        {tags.map((t) => (
          <Badge key={t} onRemove={() => setTags((c) => c.filter((x) => x !== t))}>
            {t}
          </Badge>
        ))}
      </div>
      {tags.length === 0 ? (
        <Button variant="quiet" onClick={() => setTags(all)}>Put them back</Button>
      ) : null}
      <div className="flex flex-wrap gap-3">
        <Badge>Draft</Badge>
        <Badge variant="ink">New</Badge>
        <Badge variant="accent">Live</Badge>
      </div>
    </div>
  )
}

export function States() {
  return (
    <>
      <State label="Rest"><Badge>Draft</Badge></State>
      <State label="Ink"><Badge variant="ink">New</Badge></State>
      <State label="Accent"><Badge variant="accent">Live</Badge></State>
      <State label="Removable"><Badge onRemove={() => {}}>Identity</Badge></State>
      <State label="Pointed at"><Badge onRemove={() => {}} data-force="hover">Identity</Badge></State>
    </>
  )
}
