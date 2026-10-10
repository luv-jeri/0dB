import { Reverb } from "@/registry/0nlytype/ui/reverb"
import { State } from "@/components/site/state"

/** The canon drifts on by a word; the antiphon answers from either wall; the vowels ring on after the consonants have gone. */
export default function Example() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-y-(--db-space-8)">
      <Reverb>Nothing left to say</Reverb>
      <Reverb variant="antiphon" echoes={4} className="max-w-[36rem]">Is anyone there</Reverb>
      <Reverb variant="vowels" from="f" echoes={5}>Let it ring</Reverb>
    </div>
  )
}

export function States() {
  return (
    <>
      <State label="Rest">
        <div style={{ width: "12rem", maxWidth: "100%" }}><Reverb echoes={3} from="mp">Say it once</Reverb></div>
      </State>
      <State label="Pointed at">
        <div style={{ width: "12rem", maxWidth: "100%" }}><Reverb echoes={3} from="mp" data-force="hover">Say it once</Reverb></div>
      </State>
      <State label="Loud">
        <div style={{ width: "22rem", maxWidth: "100%" }}><Reverb echoes={4} from="f">Again</Reverb></div>
      </State>
      <State label="Antiphon">
        <div style={{ width: "18rem", maxWidth: "100%" }}><Reverb variant="antiphon" echoes={4} from="mp">Call and answer</Reverb></div>
      </State>
      <State label="Antiphon, pointed at">
        <div style={{ width: "18rem", maxWidth: "100%" }}><Reverb variant="antiphon" echoes={4} from="mp" data-force="hover">Call and answer</Reverb></div>
      </State>
      <State label="Antiphon, right to left">
        <div dir="rtl" lang="ar" style={{ width: "18rem", maxWidth: "100%" }}><Reverb variant="antiphon" echoes={4} from="mp">نداء وجواب</Reverb></div>
      </State>
      <State label="Vowels">
        <div style={{ width: "18rem", maxWidth: "100%" }}><Reverb variant="vowels" echoes={4} from="mf">Say it once</Reverb></div>
      </State>
      <State label="Vowels, pointed at">
        <div style={{ width: "18rem", maxWidth: "100%" }}><Reverb variant="vowels" echoes={4} from="mf" data-force="hover">Say it once</Reverb></div>
      </State>
    </>
  )
}
