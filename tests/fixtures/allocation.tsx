"use client"

import * as React from "react"
import { createRoot } from "react-dom/client"
import { Allocation } from "@/registry/0db/ui/allocation"

function Fixture() {
  const [total, setTotal] = React.useState(20)
  return <>
    <form id="settings" onSubmit={(e) => e.preventDefault()}><button type="reset">Reset</button></form>
    <Allocation label="External shares" form="settings" name="shares" total={40} items={[{ id: "a", label: "Research" }, { id: "b", label: "Type" }]} defaultValue={{ a: 8, b: 12 }} />
    <Allocation label="Changing allowance" total={total} value={{ a: 15 }} items={[{ id: "a", label: "Assigned" }]} />
    <button type="button" onClick={() => setTotal(total === 20 ? 10 : 20)}>Change allowance</button>
    <form id="stepped"><Allocation label="Stepped shares" total={10} step={3} defaultValue={{ a: 3, b: 3 }} items={[{ id: "a", label: "First" }, { id: "b", label: "Second" }]} /></form>
    <Allocation label="Decimal shares" total={0.3} step={0.1} value={{ a: 0.1, b: 0.2 }} items={[{ id: "a", label: "One" }, { id: "b", label: "Two" }]} />
  </>
}

createRoot(document.getElementById("fixture")!).render(<Fixture />)
