import { Toggle } from "@/registry/0db/ui/toggle"
import { State } from "@/components/site/state"

export default function Example() {
  return (
    <div className="db-mp grid justify-items-start gap-x-10 gap-y-12 sm:grid-cols-2">
      <div className="grid justify-items-start gap-4">
        <span className="db-label">fermata</span>
        <Toggle>Pin this note</Toggle>
      </div>
      <div className="grid justify-items-start gap-4">
        <span className="db-label">tenuto</span>
        <Toggle variant="tenuto">Keep a copy</Toggle>
      </div>
      <div className="grid justify-items-start gap-4">
        <span className="db-label">aside</span>
        <Toggle variant="aside" note="muted">Mute replies</Toggle>
      </div>
      <div className="grid justify-items-start gap-4">
        <span className="db-label">guides</span>
        <Toggle variant="guides">Show guides</Toggle>
      </div>
    </div>
  )
}

export function States() {
  return (
    <>
      {(["fermata", "tenuto", "aside", "guides"] as const).flatMap((variant) => [
        <State key={`${variant}-rest`} label={`${variant}, rest`}><Toggle variant={variant}>Pin</Toggle></State>,
        <State key={`${variant}-hover`} label={`${variant}, pointed at`}><Toggle variant={variant} note="pinned" data-force="hover">Pin</Toggle></State>,
        <State key={`${variant}-held`} label={`${variant}, held`}><Toggle variant={variant} note="pinned" defaultPressed>Pin</Toggle></State>,
      ])}
      <State label="Focus"><Toggle data-force="focus">Pin</Toggle></State>
      <State label="Disabled"><Toggle disabled>Pin</Toggle></State>
    </>
  )
}
