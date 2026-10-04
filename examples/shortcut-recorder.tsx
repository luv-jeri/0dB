import { ShortcutRecorder } from "@/registry/0db/ui/shortcut-recorder"
import { State } from "@/components/site/state"

export default function Example() {
  return <ShortcutRecorder className="w-full max-w-2xl" label="Open the project index" defaultValue={{ key: "K", modifiers: ["Control", "Shift"] }} />
}

export function States() {
  return <>
    <State label="Unassigned"><ShortcutRecorder className="w-72" label="Open the index" /></State>
    <State label="Assigned"><ShortcutRecorder className="w-72" label="Open the index" value={{ key: "K", modifiers: ["Meta", "Shift"] }} /></State>
    <State label="Disabled"><ShortcutRecorder className="w-72" label="Open the index" disabled defaultValue={{ key: "K", modifiers: ["Control"] }} /></State>
    <State label="A named key, RTL"><ShortcutRecorder dir="rtl" className="w-72" label="فتح الفهرس" defaultValue={{ key: "PageDown", modifiers: ["Control", "Alt"] }} /></State>
  </>
}
