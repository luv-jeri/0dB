"use client"

import { addTransitionType, startTransition, useId, useState } from "react"
import { PageTurn } from "@/registry/0db/ui/page-turn"
import { Button } from "@/registry/0db/ui/button"
import { State } from "@/components/site/state"

export default function Example() {
  const [next, setNext] = useState(false)
  const name = useId()
  return (
    <div className="grid max-w-xl gap-10">
      <PageTurn key={String(next)}>
        <section className="grid gap-6" aria-live="polite">
          <PageTurn share={name}><p className="db-label">Sanjay Kumar</p></PageTurn>
          <h3 className="db-f">{next ? "You can start in the middle." : "Start with what you have."}</h3>
          <p>{next ? "A thought becoming real. Open. Align. Release." : "An idea to explore. A product to improve. A problem to solve."}</p>
        </section>
      </PageTurn>
      <Button variant="quiet" onClick={() => startTransition(() => { addTransitionType(next ? "back" : "forward"); setNext(!next) })}>{next ? "Back to the opening" : "See how I work"}</Button>
    </div>
  )
}

export function States() {
  return <>
    <State label="The opening"><PageTurn><p className="db-mp max-w-xs">Start with what you have.</p></PageTurn></State>
    <State label="The next reading"><PageTurn><p className="db-mp max-w-xs">You can start in the middle.</p></PageTurn></State>
  </>
}
