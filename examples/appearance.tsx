import { Appearance } from "@/registry/0nlytype/ui/appearance"
import { State } from "@/components/site/state"

// Live: choosing here retunes this page, as the Tune panel in the bar does.
export default function Example() {
  return <Appearance className="w-full max-w-[52rem]" />
}

export function States() {
  return (
    <>
      <State label="The house">
        <Appearance value={{}} className="w-[22rem] max-w-full" />
      </State>
      <State label="Its own key">
        <Appearance value={{ scheme: "blueprint", pair: "press" }} className="w-[22rem] max-w-full" />
      </State>
      <State label="Keyed, by night">
        <Appearance value={{ mode: "nocturne", scheme: "riso", key: "viridian", pair: "salon" }} className="w-[22rem] max-w-full" />
      </State>
    </>
  )
}
