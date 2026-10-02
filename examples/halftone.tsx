"use client"

import * as React from "react"
import { Halftone } from "@/registry/0db/ui/halftone"
import { Button } from "@/registry/0db/ui/button"
import { State } from "@/components/site/state"

// An example-only type specimen, not a claimed project screenshot or portrait.
const specimen = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="960" height="560" viewBox="0 0 960 560"><rect width="960" height="560" fill="#f2f3f0"/><text x="44" y="70" font-family="Arial,sans-serif" font-size="22" fill="#000">THE TYPE BEHIND THE INTERFACE</text><text x="480" y="414" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="370" fill="#000">0dB</text><text x="44" y="514" font-family="Arial,sans-serif" font-size="22" fill="#000">Start with what you have.</text></svg>')}`

export default function Example() {
  const [edition, setEdition] = React.useState(0)
  return <div className="grid gap-(--db-space-5)">
    <Halftone key={edition} src={specimen} alt="0dB type specimen: The type behind the interface. Start with what you have." word="0dB" resolve="load" />
    <div className="flex flex-wrap items-baseline justify-between gap-4"><p className="db-caption">A type specimen, becoming the artifact.</p><Button variant="quiet" onClick={() => setEdition((value) => value + 1)}>See it arrive</Button></div>
  </div>
}

export function States() {
  return <>
    <State label="Held in its own name"><Halftone src={specimen} alt="0dB type specimen" word="0dB" cols={40} resolve="none" className="w-72 max-w-full" /></State>
    <State label="Scroll into evidence"><Halftone src={specimen} alt="Start with what you have, a 0dB type specimen" cols={48} className="w-72 max-w-full" /></State>
    <State label="On arrival"><Halftone src={specimen} alt="The type behind the interface" resolve="load" className="w-72 max-w-full" /></State>
  </>
}
