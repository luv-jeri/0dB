"use client"

import { createRoot } from "react-dom/client"
import { MaskedValue } from "@/registry/0db/ui/masked-value"

function Fixture() {
  return <>
    <MaskedValue label="Initial reading" value="Held still" defaultRevealed />
    <MaskedValue label="Private reading" value="Personal words" />
  </>
}

createRoot(document.getElementById("fixture")!).render(<Fixture />)
