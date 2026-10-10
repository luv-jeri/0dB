"use client"

import * as React from "react"

import { Badge } from "@/registry/0nlytype/ui/badge"
import { Button } from "@/registry/0nlytype/ui/button"
import { State } from "@/components/site/state"

const all = ["Identity", "Web", "Motion", "Print"]

function Series() {
  const [tags, setTags] = React.useState(all)
  return (
    <div className="flex flex-col items-start" style={{ gap: "var(--ot-space-4)" }}>
      <p className="ot-mp" style={{ margin: 0, maxWidth: "30ch" }}>
        {tags.length ? "Showing work in " : "Showing all the work."}
        {tags.map((t) => (
          <Badge key={t} variant="series" onRemove={() => setTags((c) => c.filter((x) => x !== t))}>
            {t}
          </Badge>
        ))}
        {tags.length ? "." : null}
      </p>
      {tags.length === 0 ? <Button variant="quiet" onClick={() => setTags(all)}>Put them back</Button> : null}
    </div>
  )
}

export default function Example() {
  const [tags, setTags] = React.useState(all)
  return (
    <div className="flex flex-col items-start" style={{ gap: "var(--ot-space-6)" }}>
      <div className="flex flex-col items-start" style={{ gap: "var(--ot-space-5)" }}>
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
      <Series />
      <div className="flex flex-wrap items-center" style={{ gap: "var(--ot-space-6)" }}>
        <Badge variant="seal" legend="First edition · 2026">01</Badge>
        <Badge variant="seal" legend="Set in Parma · Bodoni">B</Badge>
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
      <State label="Series">
        <span className="ot-p">
          {["Identity", "Web", "Motion"].map((t) => <Badge key={t} variant="series">{t}</Badge>)}
        </span>
      </State>
      <State label="Series, pointed at">
        <span className="ot-p">
          <Badge variant="series" onRemove={() => {}}>Identity</Badge>
          <Badge variant="series" onRemove={() => {}} data-force="hover">Web</Badge>
        </span>
      </State>
      <State label="Seal"><Badge variant="seal" legend="First edition · 2026">01</Badge></State>
      <State label="Seal, pointed at"><Badge variant="seal" legend="First edition · 2026" data-force="hover">01</Badge></State>
    </>
  )
}
