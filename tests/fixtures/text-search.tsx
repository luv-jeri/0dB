"use client"

import { createRoot } from "react-dom/client"
import { TextSearch } from "@/registry/0db/ui/text-search"

function Fixture() {
  return <>
    <TextSearch text="one and one and one" defaultQuery="one" />
  </>
}

createRoot(document.getElementById("fixture")!).render(<Fixture />)
