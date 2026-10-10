"use client"

import * as React from "react"
import { Button } from "@/registry/0db/ui/button"
import { Corners } from "@/registry/0db/ui/corners"
import { DEMO_SCORES, useDemoPlayer } from "@/components/site/demo-player"

/** Keep the generated, server-rendered Example intact. Only its own React tree resets.
 * A scripted example sits still until the person presses Demonstrate; then it shows its behaviour once, and Stop (or
 * simply touching the example) hands it back. */
export function DemoExample({ item, children }: { item: string; children: React.ReactNode }) {
  const root = React.useRef<HTMLDivElement>(null)
  const [edition, reset] = React.useReducer((n: number) => n + 1, 0)
  const { state, interactive, demonstrate, stop } = useDemoPlayer({ root, item, reset })
  const candidate = !!DEMO_SCORES[item]?.script
  const playing = state === "playing"
  const example = <React.Fragment key={edition}>{children}</React.Fragment>
  return (
    <div className="doc-demo">
      {candidate ? <div className="doc-demo-controls">
        <Button variant="bracket" data-demo-control onClick={playing ? stop : demonstrate} style={{ visibility: interactive ? undefined : "hidden" }} disabled={!interactive} aria-controls={`demo-${item}`}>{playing ? "Stop" : "Demonstrate"}</Button>
        <span className="db-sr" role="status" aria-live="polite" aria-atomic="true">{playing ? "Demonstrating" : state === "finished" ? "Demo finished" : state === "stopped" ? "Demo stopped. Your turn." : ""}</span>
      </div> : null}
      {item === "corners" ? <div ref={root} data-demo-item={item} id={`demo-${item}`} className="doc-example">{example}</div> : <Corners ref={root} data-demo-item={item} id={`demo-${item}`} className="doc-example">{example}</Corners>}
    </div>
  )
}
