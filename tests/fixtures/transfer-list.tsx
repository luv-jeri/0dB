"use client"

import { createRoot } from "react-dom/client"
import { TransferList } from "@/registry/0db/ui/transfer-list"

function Fixture() {
  return <>
    <form id="membership" onSubmit={(e) => e.preventDefault()}>
      <TransferList name="parts" items={[{ id: "a", label: "Brief" }, { id: "b", label: "Proof" }, { id: "c", label: "Release" }]} defaultValue={["a"]} />
      <button type="reset">Reset membership</button>
    </form>
  </>
}

createRoot(document.getElementById("fixture")!).render(<Fixture />)
