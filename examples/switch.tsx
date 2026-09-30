import { Switch } from "@/registry/0db/ui/switch"
import { State } from "@/components/site/state"

export default function Example() {
  return (
    <div className="db-mp grid justify-items-start gap-4">
      <Switch defaultChecked>Email me when someone replies:</Switch>
      <Switch>Send the weekly digest:</Switch>
    </div>
  )
}

export function States() {
  return (
    <>
      <State label="On"><Switch defaultChecked>Autosave is</Switch></State>
      <State label="Off"><Switch>Autosave is</Switch></State>
      <State label="Pointed at"><Switch data-force="hover" defaultChecked>Autosave is</Switch></State>
      <State label="Focus"><Switch data-force="focus" defaultChecked>Autosave is</Switch></State>
      <State label="Disabled"><Switch disabled defaultChecked>Autosave is</Switch></State>
    </>
  )
}
