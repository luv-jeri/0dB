"use client"

import * as React from "react"
import { createRoot } from "react-dom/client"
import { Allocation } from "@/registry/0db/ui/allocation"
import { AudioPlayer } from "@/registry/0db/ui/audio-player"
import { MaskedValue } from "@/registry/0db/ui/masked-value"
import { ShortcutRecorder } from "@/registry/0db/ui/shortcut-recorder"
import { TextSearch } from "@/registry/0db/ui/text-search"
import { TimeRange } from "@/registry/0db/ui/time-range"
import { TransferList } from "@/registry/0db/ui/transfer-list"

function Fixture() {
  const [source, setSource] = React.useState("/one.wav")
  const [total, setTotal] = React.useState(20)
  const [disabled, setDisabled] = React.useState(false)
  const [hostKeys, setHostKeys] = React.useState(0)
  React.useEffect(() => {
    const key = (e: KeyboardEvent) => { if (e.ctrlKey && e.key.toLowerCase() === "k") setHostKeys((n) => n + 1) }
    window.addEventListener("keydown", key)
    return () => window.removeEventListener("keydown", key)
  }, [])
  return <>
    <TextSearch text="one and one and one" defaultQuery="one" />
    <button type="button" onClick={() => setSource("/one.wav")}>Source A</button>
    <button type="button" onClick={() => setSource("/two.wav")}>Source B</button>
    <AudioPlayer src={source} label="Reading" audioProps={{ preload: "none" }} />
    <form id="settings" onSubmit={(e) => e.preventDefault()}><button type="reset">Reset</button></form>
    <Allocation label="External shares" form="settings" name="shares" total={40} items={[{ id: "a", label: "Research" }, { id: "b", label: "Type" }]} defaultValue={{ a: 8, b: 12 }} />
    <ShortcutRecorder label="External shortcut" form="settings" name="shortcut" defaultValue={{ key: "J", modifiers: ["Control"] }} disabled={disabled} />
    <button type="button" onClick={() => setDisabled(!disabled)}>Change disabled</button>
    <output data-testid="host-keys">{hostKeys}</output>
    <TimeRange form="settings" label="External hours" defaultValue={{ start: "09:00", end: "17:30" }} startProps={{ name: "from" }} endProps={{ name: "until" }} />
    <form id="membership" onSubmit={(e) => e.preventDefault()}>
      <TransferList name="parts" items={[{ id: "a", label: "Brief" }, { id: "b", label: "Proof" }]} defaultValue={["a"]} />
      <button type="reset">Reset membership</button>
    </form>
    <Allocation label="Changing allowance" total={total} value={{ a: 15 }} items={[{ id: "a", label: "Assigned" }]} />
    <button type="button" onClick={() => setTotal(total === 20 ? 10 : 20)}>Change allowance</button>
    <Allocation label="Decimal shares" total={0.3} step={0.1} value={{ a: 0.1, b: 0.2 }} items={[{ id: "a", label: "One" }, { id: "b", label: "Two" }]} />
    <MaskedValue label="Initial reading" value="Held still" defaultRevealed />
    <MaskedValue label="Private reading" value="Personal words" />
  </>
}

createRoot(document.getElementById("fixture")!).render(<Fixture />)
