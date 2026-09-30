import { Melody } from "@/registry/0db/ui/melody"
import { State } from "@/components/site/state"

export default function Example() {
  return <Melody className="max-w-[40rem]">Say it slowly enough and the sentence begins to sing, one word at a time, over the quiet.</Melody>
}

export function States() {
  return (
    <>
      <State label="Its own tune">
        <Melody style={{ width: "22rem", maxWidth: "100%" }}>Nothing is louder than the pause before it.</Melody>
      </State>
      <State label="A given contour">
        <Melody contour={[0, 2, 4, 6, 8, 4]} style={{ width: "22rem", maxWidth: "100%" }}>Up the stairs and down again</Melody>
      </State>
    </>
  )
}
