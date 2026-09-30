import { Slider } from "@/registry/0db/ui/slider"
import { State } from "@/components/site/state"

export default function Example() {
  return (
    <div className="max-w-[36rem]">
      <Slider label="Volume" defaultValue={64} />
    </div>
  )
}

export function States() {
  return (
    <>
      <State label="Rest"><Slider label="Volume" defaultValue={40} /></State>
      <State label="Focus"><Slider label="Volume" defaultValue={40} data-force="focus" /></State>
      <State label="Disabled"><Slider label="Volume" defaultValue={40} disabled /></State>
    </>
  )
}
