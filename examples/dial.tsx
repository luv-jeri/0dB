import { Dial } from "@/registry/0nlytype/ui/dial"
import { State } from "@/components/site/state"

export default function Example() {
  return (
    <div className="flex flex-wrap items-end justify-center gap-x-[var(--db-space-8)] gap-y-[var(--db-space-7)]">
      <Dial name="weeks" legend="How many weeks do we have?" options={[2, 4, 6, 8, 12, 16, 24]} defaultValue={8} unit="weeks" />
      <Dial variant="tuner" name="tempo" legend="Set the tempo" min={40} max={208} defaultValue={96} unit="bpm" />
      <Dial variant="dynamics" name="volume" legend="Volume" min={0} max={100} defaultValue={60} />
      <Dial variant="tumbler" name="year" legend="The year it was printed" min={1450} max={2026} defaultValue={1623} />
    </div>
  )
}

export function States() {
  return (
    <>
      <State label="Rest"><Dial variant="tuner" legend="Tempo" min={40} max={208} defaultValue={72} unit="bpm" /></State>
      <State label="Focus"><Dial variant="tuner" legend="Tempo" min={40} max={208} defaultValue={72} unit="bpm" data-force="focus" /></State>
      <State label="Disabled"><Dial variant="tuner" legend="Tempo" min={40} max={208} defaultValue={72} unit="bpm" disabled /></State>
      <State label="Dynamics, silent"><Dial variant="dynamics" legend="Volume" defaultValue={0} /></State>
      <State label="Dynamics, loudest"><Dial variant="dynamics" legend="Volume" defaultValue={100} /></State>
      <State label="Dynamics, focus"><Dial variant="dynamics" legend="Volume" defaultValue={30} data-force="focus" /></State>
      <State label="Tumbler"><Dial variant="tumbler" legend="Pages" max={999} defaultValue={48} /></State>
      <State label="Tumbler, focus"><Dial variant="tumbler" legend="Pages" max={999} defaultValue={48} data-force="focus" /></State>
      <State label="Tumbler, disabled"><Dial variant="tumbler" legend="Pages" max={999} defaultValue={48} disabled /></State>
    </>
  )
}
