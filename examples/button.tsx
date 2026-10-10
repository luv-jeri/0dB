import { Button } from "@/registry/0nlytype/ui/button"
import { State } from "@/components/site/state"

export default function Example() {
  return (
    <div className="grid grid-cols-1 gap-(--db-space-8)">
      <div className="flex flex-wrap items-baseline gap-x-10 gap-y-6">
        <Button variant="statement">Start a project</Button>
        <Button variant="bracket">Save draft</Button>
        <Button variant="quiet">View the work</Button>
      </div>
      <div className="flex flex-wrap items-baseline gap-x-14 gap-y-8">
        <Button variant="overture" size="l">Install 0nlyType</Button>
        <Button variant="crescendo" size="l">Turn it up</Button>
        <Button variant="stave" size="l" className="max-[380px]:[--run:1.4em]">Read the score</Button>
        <Button variant="ink" size="l" className="max-[380px]:px-3">Browse the library</Button>
      </div>
      <div className="grid justify-items-start gap-y-6">
        <Button variant="space" size="l" className="max-[380px]:text-(--db-p)">Watch this space.</Button>
        <Button variant="repeat">Play it again</Button>
      </div>
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
      <State label="Disabled"><Button variant="bracket" disabled>Save</Button></State>
      <State label="Busy"><Button variant="bracket" busy="Saving">Save</Button></State>
      <State label="Quiet"><Button variant="quiet">View</Button></State>
      <State label="Pointed at"><Button variant="quiet" data-force="hover">View</Button></State>
      <State label="Disabled"><Button variant="quiet" disabled>View</Button></State>
      <State label="Overture"><Button variant="overture">Begin</Button></State>
      <State label="Pointed at"><Button variant="overture" data-force="hover">Begin</Button></State>
      <State label="Disabled"><Button variant="overture" disabled>Begin</Button></State>
      <State label="Crescendo"><Button variant="crescendo">Louder</Button></State>
      <State label="Pointed at"><Button variant="crescendo" data-force="hover">Louder</Button></State>
      <State label="Disabled"><Button variant="crescendo" disabled>Louder</Button></State>
      <State label="Stave"><Button variant="stave">Listen</Button></State>
      <State label="Pointed at"><Button variant="stave" data-force="hover">Listen</Button></State>
      <State label="Disabled"><Button variant="stave" disabled>Listen</Button></State>
      <State label="Ink"><Button variant="ink">Enter</Button></State>
      <State label="Pointed at"><Button variant="ink" data-force="hover">Enter</Button></State>
      <State label="Focus"><Button variant="ink" data-force="focus">Enter</Button></State>
      <State label="Disabled"><Button variant="ink" disabled>Enter</Button></State>
      <State label="Space"><Button variant="space" className="w-44">Read on</Button></State>
      <State label="Pointed at"><Button variant="space" className="w-44" data-force="hover">Read on</Button></State>
      <State label="Disabled"><Button variant="space" className="w-44" disabled>Read on</Button></State>
      <State label="Repeat"><Button variant="repeat">Again</Button></State>
      <State label="Pointed at"><Button variant="repeat" data-force="hover">Again</Button></State>
      <State label="Disabled"><Button variant="repeat" disabled>Again</Button></State>
      <State label="Busy"><Button variant="repeat" busy="Replaying">Again</Button></State>
    </>
  )
}
