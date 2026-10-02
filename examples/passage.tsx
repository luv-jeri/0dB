"use client"

import { useState } from "react"
import { Passage } from "@/registry/0db/ui/passage"
import { Button } from "@/registry/0db/ui/button"
import { State } from "@/components/site/state"

const readings = [
  "An idea to explore. A product to improve. A problem to solve.",
  "You can start in the middle. Bring the product you want to improve, the problem you are still working through, or the thought you have not quite found the words for.",
]

export default function Example() {
  const [tailored, setTailored] = useState(false)
  return (
    <div className="grid max-w-xl gap-10">
      <h3 className="db-f">Start with what you have.</h3>
      <Passage announce className="db-mp">{readings[Number(tailored)]}</Passage>
      <Button variant="quiet" onClick={() => setTailored(!tailored)}>{tailored ? "Read the opening" : "Make room for my thought"}</Button>
    </div>
  )
}

export function States() {
  return <>
    <State label="Opening"><Passage className="max-w-xs">{readings[0]}</Passage></State>
    <State label="A longer thought"><Passage className="max-w-xs">{readings[1]}</Passage></State>
    <State label="One line"><Passage>You can start in the middle.</Passage></State>
  </>
}
