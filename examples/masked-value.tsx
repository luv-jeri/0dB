import { MaskedValue } from "@/registry/0db/ui/masked-value"
import { State } from "@/components/site/state"

export default function Example() {
  return <MaskedValue className="w-full max-w-2xl" label="Recovery phrase" value="paper river quiet morning" />
}

export function States() {
  return <>
    <State label="Not shown"><MaskedValue label="Account reference" value="STUDIO-2026-014" /></State>
    <State label="Revealed"><MaskedValue label="Account reference" value="STUDIO-2026-014" revealed /></State>
    <State label="Unavailable"><MaskedValue label="Account reference" value="STUDIO-2026-014" buttonProps={{ disabled: true }} /></State>
    <State label="Long reading"><MaskedValue className="w-72" label="Private note" value="A long personal reading that can wrap between its parentheses without losing its Hide control." revealed /></State>
    <State label="Right to left"><MaskedValue className="w-72" dir="rtl" label="المرجع" value="STUDIO-014" revealLabel="إظهار" hideLabel="إخفاء" revealed /></State>
  </>
}
