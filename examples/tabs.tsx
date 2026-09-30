"use client"

import * as React from "react"

import { Row, RowKind, RowMeta, RowTitle, Rows } from "@/registry/0db/ui/rows"
import { Tabs, TabsContent, TabsCount, TabsList, TabsTrigger } from "@/registry/0db/ui/tabs"
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

export default function Example() {
  const [kind, setKind] = React.useState("all")
  return (
    <Tabs value={kind} onValueChange={setKind}>
      <TabsList aria-label="Work">
        <TabsTrigger value="all" count={count("all")}>All</TabsTrigger>
        {KINDS.map((k) => (
          <TabsTrigger key={k} value={k} count={count(k)}>{k}</TabsTrigger>
        ))}
        <TabsCount>{two(count(kind))}</TabsCount>
      </TabsList>
      {["all", ...KINDS].map((k) => (
        <TabsContent key={k} value={k}>
          <Rows aria-label="Projects">
            {PROJECTS.filter((p) => k === "all" || p[1] === k).map(([name, kindName, year]) => (
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

export function States() {
  return (
    <>
      <State label="Rest">
        <Tabs defaultValue="all"><TabsList aria-label="Rest"><TabsTrigger value="all" count={7}>All</TabsTrigger><TabsTrigger value="web" count={3}>Web</TabsTrigger></TabsList></Tabs>
      </State>
      <State label="Pointed at">
        <Tabs defaultValue="all"><TabsList aria-label="Pointed at"><TabsTrigger value="all" count={7}>All</TabsTrigger><TabsTrigger value="web" count={3} data-force="hover">Web</TabsTrigger></TabsList></Tabs>
      </State>
      <State label="Disabled">
        <Tabs defaultValue="all"><TabsList aria-label="Disabled"><TabsTrigger value="all" count={7}>All</TabsTrigger><TabsTrigger value="web" count={3} disabled>Web</TabsTrigger></TabsList></Tabs>
      </State>
    </>
  )
}
