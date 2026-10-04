"use client"

import * as React from "react"
import { createRoot } from "react-dom/client"
import { ShortcutRecorder } from "@/registry/0db/ui/shortcut-recorder"

function Fixture() {
  const [hostKeys, setHostKeys] = React.useState(0)
  React.useEffect(() => {
    const key = (e: KeyboardEvent) => { if (e.ctrlKey && e.key.toLowerCase() === "k") setHostKeys((n) => n + 1) }
    window.addEventListener("keydown", key)
    return () => window.removeEventListener("keydown", key)
  }, [])
  return <>
    <form id="settings" onSubmit={(e) => e.preventDefault()}><button type="reset">Reset</button></form>
    <ShortcutRecorder label="External shortcut" form="settings" name="shortcut" defaultValue={{ key: "J", modifiers: ["Control"] }} />
    <output data-testid="host-keys">{hostKeys}</output>
  </>
}

createRoot(document.getElementById("fixture")!).render(<Fixture />)
