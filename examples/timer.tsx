import { Timer } from "@/registry/0db/ui/timer"
import { State } from "@/components/site/state"

export default function Example() {
  return (
    <div className="flex flex-wrap items-start gap-x-24 gap-y-16">
      <Timer label={<span className="db-yours">The second chapter</span>} />
      <Timer variant="horizon" duration={600} label="A walk round the block" />
    </div>
  )
}

export function States() {
  return (
    <>
      <State label="Ready"><Timer duration={1500} label="Writing" className="w-56" /></State>
      <State label="Running"><Timer duration={1500} defaultElapsed={520} label="Writing" className="w-56" data-force="running" /></State>
      <State label="Paused"><Timer duration={1500} defaultElapsed={1130} label="Writing" className="w-56" /></State>
      <State label="Done"><Timer duration={1500} defaultElapsed={1500} label="Writing" className="w-56" /></State>
      <State label="horizon, running"><Timer variant="horizon" duration={600} defaultElapsed={380} label="A walk" className="w-64" data-force="running" /></State>
      <State label="An hour or more"><Timer duration={5400} defaultElapsed={1260} label="Deep work" className="w-64" /></State>
    </>
  )
}
