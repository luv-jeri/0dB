import { Button } from "@/registry/0db/ui/button"
import { State } from "@/components/site/state"

export default function Example() {
  return (
    <div className="flex flex-wrap items-center gap-10">
      <Button variant="statement" size="l">Start a project</Button>
      <Button variant="bracket">Save draft</Button>
      <Button variant="quiet">View the work</Button>
    </div>
  )
}

export function States() {
  return (
    <>
      <State label="Statement"><Button variant="statement">Start</Button></State>
      <State label="Pointed at"><Button variant="statement" data-force="hover">Start</Button></State>
      <State label="Focus"><Button variant="statement" data-force="focus">Start</Button></State>
      <State label="Disabled"><Button variant="statement" disabled>Start</Button></State>
      <State label="Busy"><Button variant="statement" busy="Starting">Start</Button></State>
      <State label="Bracket"><Button variant="bracket">Save</Button></State>
      <State label="Pointed at"><Button variant="bracket" data-force="hover">Save</Button></State>
      <State label="Quiet"><Button variant="quiet">View</Button></State>
      <State label="Pointed at"><Button variant="quiet" data-force="hover">View</Button></State>
    </>
  )
}
