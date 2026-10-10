import { Slider } from "@/registry/0nlytype/ui/slider"
import { State } from "@/components/site/state"

export default function Example() {
  return (
    <div className="grid max-w-[36rem] gap-y-9">
      <Slider label="Volume" defaultValue={64} />
      <Slider variant="spread" label="Brightness" defaultValue={58} unit="%" />
      <Slider variant="dynamics" label="Volume" defaultValue={40} />
    </div>
  )
}

export function States() {
  return (
    <>
      <State label="Rest"><Slider label="Volume" className="w-64" defaultValue={40} /></State>
      <State label="Too short a gap"><Slider label="Volume" className="w-64" defaultValue={6} /></State>
      <State label="Focus"><Slider label="Volume" className="w-64" defaultValue={40} data-force="focus" /></State>
      <State label="Disabled"><Slider label="Volume" className="w-64" defaultValue={40} disabled /></State>
      <State label="spread, rest"><Slider variant="spread" label="Warmth" className="w-64" defaultValue={35} /></State>
      <State label="spread, focus"><Slider variant="spread" label="Warmth" className="w-64" defaultValue={35} data-force="focus" /></State>
      <State label="dynamics, quiet"><Slider variant="dynamics" label="Volume" className="w-64" defaultValue={8} /></State>
      <State label="dynamics, loud"><Slider variant="dynamics" label="Volume" className="w-64" defaultValue={92} /></State>
    </>
  )
}
