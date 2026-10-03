import { TimeRange } from "@/registry/0db/ui/time-range"
import { State } from "@/components/site/state"

export default function Example() {
  return <TimeRange className="w-full max-w-2xl" label="Studio listening hours" defaultValue={{ start: "09:00", end: "17:30" }} startProps={{ name: "start", required: true }} endProps={{ name: "end", required: true }} />
}

export function States() {
  return <>
    <State label="Incomplete"><TimeRange className="w-72" label="Listening hours" defaultValue={{ start: "09:00", end: "" }} /></State>
    <State label="End before start"><TimeRange className="w-72" label="Listening hours" value={{ start: "17:00", end: "09:00" }} /></State>
    <State label="Across midnight"><TimeRange className="w-72" label="Night shift" overnight value={{ start: "22:00", end: "02:00" }} /></State>
    <State label="Disabled"><TimeRange className="w-72" label="Listening hours" disabled value={{ start: "09:00", end: "17:30" }} /></State>
    <State label="RTL"><TimeRange className="w-72" dir="rtl" label="ساعات العمل" startLabel="من" endLabel="حتى" value={{ start: "09:00", end: "17:30" }} /></State>
  </>
}
