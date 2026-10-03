import { TransferList } from "@/registry/0db/ui/transfer-list"
import { State } from "@/components/site/state"

const items = [{ id: "brief", label: "Working brief" }, { id: "type", label: "Type study" }, { id: "motion", label: "Motion study" }, { id: "proof", label: "Print proof" }, { id: "archive", label: "Master archive", disabled: true }]

export default function Example() {
  return <TransferList className="w-full max-w-2xl" items={items} defaultValue={["brief", "type"]} availableLabel="In the studio" includedLabel="In the handoff" />
}

export function States() {
  return <>
    <State label="Empty destination"><TransferList className="w-72" items={items.slice(0, 2)} /></State>
    <State label="All included"><TransferList className="w-72" items={items.slice(0, 2)} defaultValue={["brief", "type"]} /></State>
    <State label="Disabled"><TransferList className="w-72" items={items.slice(0, 2)} defaultValue={["brief"]} disabled /></State>
    <State label="Long name, RTL"><TransferList className="w-72" dir="rtl" items={[{ id: "long", label: "The complete production specification and the final print proof" }, { id: "ar", label: "دراسة الخط" }]} defaultValue={["long"]} /></State>
  </>
}
