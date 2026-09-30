import { Toggle } from "@/registry/0db/ui/toggle"
import { State } from "@/components/site/state"

export default function Example() {
  return <Toggle>Pin this note</Toggle>
}

export function States() {
  return (
    <>
      <State label="Rest"><Toggle>Pin</Toggle></State>
      <State label="Pointed at"><Toggle data-force="hover">Pin</Toggle></State>
      <State label="Held"><Toggle defaultPressed>Pin</Toggle></State>
      <State label="Disabled"><Toggle disabled>Pin</Toggle></State>
    </>
  )
}
