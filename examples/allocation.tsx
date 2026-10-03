import { Allocation } from "@/registry/0db/ui/allocation"
import { State } from "@/components/site/state"

const items = [{ id: "research", label: "Research" }, { id: "type", label: "Type studies" }, { id: "motion", label: "Motion studies" }]

export default function Example() {
  return <Allocation className="w-full max-w-2xl" label="Set aside 40 studio hours" total={40} items={items} defaultValue={{ research: 8, type: 12, motion: 8 }} unit=" h" name="hours" />
}

export function States() {
  return <>
    <State label="Unassigned"><Allocation className="w-72" label="Studio hours" total={40} items={items} unit=" h" /></State>
    <State label="All assigned"><Allocation className="w-72" label="Studio hours" total={40} items={items} value={{ research: 10, type: 20, motion: 10 }} unit=" h" /></State>
    <State label="Allowance was reduced"><Allocation className="w-72" label="Studio hours" total={20} items={items} value={{ research: 10, type: 20, motion: 10 }} unit=" h" /></State>
    <State label="Disabled"><Allocation className="w-72" label="Studio hours" total={40} items={items} disabled unit=" h" /></State>
    <State label="RTL, decimal shares"><Allocation className="w-72" dir="rtl" label="ساعات العمل" total={10} step={0.5} items={items} defaultValue={{ research: 2.5, type: 3.5 }} unit=" h" /></State>
  </>
}
