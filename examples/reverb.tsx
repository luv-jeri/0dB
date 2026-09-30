import { Reverb } from "@/registry/0db/ui/reverb"
import { State } from "@/components/site/state"

export default function Example() {
  return <Reverb>Nothing left to say</Reverb>
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
    </>
  )
}
