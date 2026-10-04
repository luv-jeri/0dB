"use client"

import * as React from "react"
import { createRoot } from "react-dom/client"
import { TimeRange } from "@/registry/0db/ui/time-range"

function Fixture() {
  const [overnight, setOvernight] = React.useState(false)
  return <>
    <form id="settings" onSubmit={(e) => e.preventDefault()}><button type="reset">Reset</button></form>
    <TimeRange form="settings" label="External hours" overnight={overnight} defaultValue={{ start: "09:00", end: "17:30" }} startProps={{ name: "from" }} endProps={{ name: "until" }} />
    <button type="button" onClick={() => setOvernight(!overnight)}>Allow overnight</button>
  </>
}

createRoot(document.getElementById("fixture")!).render(<Fixture />)
