"use client"

import * as React from "react"

import { Row, RowKind, RowMeta, RowTitle, Rows } from "@/registry/0nlytype/ui/rows"
import { Tabs, TabsContent, TabsCount, TabsList, TabsTrigger } from "@/registry/0nlytype/ui/tabs"
import { State } from "@/components/site/state"

const PROJECTS = [
  ["Halden", "Identity", "2026"],
  ["Northlight", "Web", "2026"],
  ["Oda Studio", "Identity", "2025"],
  ["Tidewater", "Motion", "2025"],
  ["Marram", "Web", "2025"],
  ["Quiet Hours", "Web", "2024"],
  ["Felt & Field", "Identity", "2024"],
]
const KINDS = ["Identity", "Web", "Motion"]
const count = (kind: string) => (kind === "all" ? PROJECTS.length : PROJECTS.filter((p) => p[1] === kind).length)
const two = (n: number) => String(n).padStart(2, "0")

function Work({ variant }: { variant: "line" | "rubato" }) {
  const [kind, setKind] = React.useState("all")
  return (
    <Tabs variant={variant} value={kind} onValueChange={setKind}>
      <TabsList aria-label="Work">
        <TabsTrigger value="all" count={count("all")}>All</TabsTrigger>
        {KINDS.map((k) => (
          <TabsTrigger key={k} value={k} count={count(k)}>{k}</TabsTrigger>
        ))}
        {variant === "line" ? <TabsCount>{two(count(kind))}</TabsCount> : null}
      </TabsList>
      {["all", ...KINDS].map((k) => (
        <TabsContent key={k} value={k}>
          <Rows aria-label="Projects">
            {PROJECTS.filter((p) => k === "all" || p[1] === k).slice(0, variant === "line" ? 7 : 3).map(([name, kindName, year]) => (
              <Row key={name} href={`#${name}`}>
                <RowTitle>{name}</RowTitle>
                <RowKind>{kindName}</RowKind>
                <RowMeta>{year}</RowMeta>
              </Row>
            ))}
          </Rows>
        </TabsContent>
      ))}
    </Tabs>
  )
}

const STUDIO = [
  ["practice", "Practice", "Identity, type and the websites that carry them, for teams who would rather say less and mean it."],
  ["people", "People", "Four designers and a developer, in one room, on one project at a time."],
  ["method", "Method", "We write before we draw. The words decide the layout, and the layout decides the rest."],
]

export default function Example() {
  return (
    <div className="grid gap-y-10">
      <div className="grid gap-y-4">
        <span className="db-label">line</span>
        <Work variant="line" />
      </div>
      <div className="grid gap-y-4">
        <span className="db-label">rubato</span>
        <Work variant="rubato" />
      </div>
      <div className="grid gap-y-4">
        <span className="db-label">open</span>
        <Tabs variant="open" defaultValue="practice">
          <TabsList aria-label="The studio">
            {STUDIO.map(([v, name]) => <TabsTrigger key={v} value={v}>{name}</TabsTrigger>)}
          </TabsList>
          {STUDIO.map(([v, , text]) => <TabsContent key={v} value={v}><p className="db-mp" style={{ margin: 0, maxWidth: "32ch" }}>{text}</p></TabsContent>)}
        </Tabs>
      </div>
    </div>
  )
}

export function States() {
  return (
    <>
      <State label="Rest">
        <Tabs defaultValue="all"><TabsList aria-label="Rest"><TabsTrigger value="all" count={7}>All</TabsTrigger><TabsTrigger value="web" count={3}>Web</TabsTrigger></TabsList></Tabs>
      </State>
      <State label="Pointed at">
        <Tabs defaultValue="all"><TabsList aria-label="Pointed at"><TabsTrigger value="all" count={7}>All</TabsTrigger><TabsTrigger value="web" count={3} data-force="hover">Web</TabsTrigger></TabsList></Tabs>
      </State>
      <State label="rubato, rest">
        <Tabs variant="rubato" defaultValue="all" style={{ width: "16rem" }}><TabsList aria-label="rubato"><TabsTrigger value="all">All</TabsTrigger><TabsTrigger value="web">Web</TabsTrigger><TabsTrigger value="motion">Motion</TabsTrigger></TabsList></Tabs>
      </State>
      <State label="rubato, pointed at">
        <Tabs variant="rubato" defaultValue="all" style={{ width: "16rem" }}><TabsList aria-label="rubato pointed"><TabsTrigger value="all">All</TabsTrigger><TabsTrigger value="web" data-force="hover">Web</TabsTrigger><TabsTrigger value="motion">Motion</TabsTrigger></TabsList></Tabs>
      </State>
      <State label="open, rest">
        <Tabs variant="open" defaultValue="web"><TabsList aria-label="open"><TabsTrigger value="all">All</TabsTrigger><TabsTrigger value="web">Web</TabsTrigger><TabsTrigger value="motion">Motion</TabsTrigger></TabsList><TabsContent value="web"><p style={{ margin: 0 }}>Three sites.</p></TabsContent></Tabs>
      </State>
      <State label="open, pointed at">
        <Tabs variant="open" defaultValue="web"><TabsList aria-label="open pointed"><TabsTrigger value="all" data-force="hover">All</TabsTrigger><TabsTrigger value="web">Web</TabsTrigger><TabsTrigger value="motion">Motion</TabsTrigger></TabsList><TabsContent value="web"><p style={{ margin: 0 }}>Three sites.</p></TabsContent></Tabs>
      </State>
      <State label="Right to left">
        <div dir="rtl"><Tabs defaultValue="all"><TabsList aria-label="Right to left"><TabsTrigger value="all" count={7}>All</TabsTrigger><TabsTrigger value="web" count={3}>Web</TabsTrigger><TabsTrigger value="motion" count={2}>Motion</TabsTrigger></TabsList></Tabs></div>
      </State>
      <State label="Disabled">
        <Tabs defaultValue="all"><TabsList aria-label="Disabled"><TabsTrigger value="all" count={7}>All</TabsTrigger><TabsTrigger value="web" count={3} disabled>Web</TabsTrigger></TabsList></Tabs>
      </State>
    </>
  )
}
