import { Switch } from "@/registry/0nlytype/ui/switch"
import { State } from "@/components/site/state"

export default function Example() {
  return (
    <div className="ot-mp grid justify-items-start gap-4">
      <Switch defaultChecked>Email me when someone replies:</Switch>
      <Switch>Send the weekly digest:</Switch>
      <Switch variant="either" defaultChecked>Comments on this draft are</Switch>
      <Switch variant="either" on="public" off="private">Keep this board</Switch>
      <Switch variant="question">Share my location with the team</Switch>
      <Switch variant="question" defaultChecked>Play a sound when a build finishes</Switch>
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
      <State label="either, on"><Switch variant="either" defaultChecked>Autosave is</Switch></State>
      <State label="either, off"><Switch variant="either">Autosave is</Switch></State>
      <State label="either, pointed at"><Switch variant="either" data-force="hover" defaultChecked>Autosave is</Switch></State>
      <State label="either, focus"><Switch variant="either" data-force="focus" defaultChecked>Autosave is</Switch></State>
      <State label="question, off"><Switch variant="question">Save as I type</Switch></State>
      <State label="question, on"><Switch variant="question" defaultChecked>Save as I type</Switch></State>
      <State label="question, pointed at"><Switch variant="question" data-force="hover">Save as I type</Switch></State>
      <State label="question, focus"><Switch variant="question" data-force="focus">Save as I type</Switch></State>
    </>
  )
}
