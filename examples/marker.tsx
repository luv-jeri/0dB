"use client"

import * as React from "react"

import { State } from "@/components/site/state"
import { Button } from "@/registry/0nlytype/ui/button"
import { Marker } from "@/registry/0nlytype/ui/marker"

/** A line of the conversation the markers sit in, set as the thread sets theirs and yours. */
function Said({ you, children }: { you?: boolean; children: React.ReactNode }) {
  return (
    <p className={you ? "db-yours justify-self-end" : undefined} style={{ margin: 0, fontSize: "var(--db-p)", color: "var(--db-ink)" }}>
      {children}
    </p>
  )
}

export default function Example() {
  const [played, setPlayed] = React.useState(0)
  const arriving = played > 0
  return (
    <div className="grid max-w-[36rem] justify-items-stretch gap-(--db-space-5)">
      <div key={played} className="grid justify-items-stretch gap-(--db-space-5)">
        <div className="flex gap-(--db-space-4)" style={{ fontSize: "var(--db-pp)", color: "var(--db-graphite)" }}>
          <span>Halden</span>
          <Marker variant="divider" orientation="vertical" arriving={arriving} />
          <span>Round two</span>
          <Marker variant="divider" orientation="vertical" arriving={arriving} />
          <span>Three people</span>
        </div>
        <Marker variant="divider" arriving={arriving} />
        <Marker variant="divider" arriving={arriving}>Yesterday</Marker>
        <Marker dot>Ada joined the thread</Marker>
        <Said>The harbour mark is ready for a look.</Said>
        <Marker variant="lapse" minutes={180} arriving={arriving}>Three hours later</Marker>
        <Said you>Looking now. Can we see it at stamp size?</Said>
        <Marker variant="divider" arriving={arriving}>Today</Marker>
        <Said>Here it is at stamp size.</Said>
        <Marker variant="ribbon" arriving={arriving}>New</Marker>
        <Said>And one in a single colour, for the ferry office.</Said>
        <Marker>Edited at 09:52</Marker>
      </div>
      <Button variant="quiet" className="justify-self-start" onClick={() => setPlayed((n) => n + 1)}>Draw them again</Button>
    </div>
  )
}

const wide = { width: "18rem", maxWidth: "100%" }

export function States() {
  return (
    <>
      <State label="Status"><Marker>Edited at 09:52</Marker></State>
      <State label="Status, dot"><Marker dot>Ada joined the thread</Marker></State>
      <State label="Divider"><div style={wide}><Marker variant="divider">Today</Marker></div></State>
      <State label="Rule"><div style={wide}><Marker variant="divider" /></div></State>
      <State label="Rule, standing">
        <div className="flex items-baseline gap-(--db-space-4)" style={{ fontSize: "var(--db-pp)" }}><span>Ours</span><Marker variant="divider" orientation="vertical" /><span className="db-yours">Yours</span></div>
      </State>
      <State label="Standing, with a word"><div className="flex" style={{ height: "10rem" }}><Marker variant="divider" orientation="vertical">Today</Marker></div></State>
      <State label="Ribbon"><div style={wide}><Marker variant="ribbon">New</Marker></div></State>
      <State label="Ribbon, right to left"><div style={wide} dir="rtl"><Marker variant="ribbon" lang="ar">جديد</Marker></div></State>
      <State label="Lapse, a minute"><div style={wide}><Marker variant="lapse" minutes={1}>A minute later</Marker></div></State>
      <State label="Lapse, an hour"><div style={wide}><Marker variant="lapse" minutes={60}>An hour later</Marker></div></State>
      <State label="Lapse, a day"><div style={wide}><Marker variant="lapse" minutes={1440}>The next day</Marker></div></State>
      <State label="Lapse, right to left"><div style={wide} dir="rtl"><Marker variant="lapse" minutes={1440} lang="ar">في اليوم التالي</Marker></div></State>
      <State label="Lapse, a week"><div style={wide}><Marker variant="lapse" minutes={10080}>A week later</Marker></div></State>
    </>
  )
}
