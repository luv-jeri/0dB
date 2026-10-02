"use client"

import { Room } from "@/registry/0db/ui/room"
import { Calligram } from "@/registry/0db/ui/calligram"
import { State } from "@/components/site/state"

const capabilities = "An idea to explore. Start with what you have: an unfinished thought can become something you can work with. A product to improve. Make the next decision clear, from the first question to the interface people use. A website or store. Give the story a place, and make the next step easy to find. A workflow to simplify. Make room for the work, from one person’s question to a team’s everyday routine. An AI question. Keep human decision at the centre, where the moving shape stops and sets. A problem to solve. You can start in the middle. Bring what you know, and we can find the next useful step together."
const idea = <Calligram label="An idea to explore" size="10rem">{Array(40).fill("idea").join(" ")}</Calligram>
const diamond = (y: number) => 1 - Math.abs(2 * y - 1)

export default function Example() {
  return <Room shape={idea} outline="ellipse" travel="scroll">{capabilities}</Room>
}

export function States() {
  return (
    <>
      <State label="Set, centre"><Room shape={idea}>{capabilities}</Room></State>
      <State label="Pointer, start"><Room shape={idea} travel="pointer" side="start">{capabilities}</Room></State>
      <State label="Scroll, end"><Room shape={idea} travel="scroll" side="end">{capabilities}</Room></State>
      <State label="Box"><Room shape={<Calligram shape="square" label="A product to improve" size="8rem">{Array(40).fill("product").join(" ")}</Calligram>} outline="box">{capabilities}</Room></State>
      <State label="Custom outline"><Room shape={<Calligram shape="diamond" label="An AI question" size="8rem">{Array(40).fill("AI").join(" ")}</Calligram>} outline={diamond}>{capabilities}</Room></State>
    </>
  )
}
