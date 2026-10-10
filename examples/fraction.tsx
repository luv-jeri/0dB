"use client"

import * as React from "react"

import { Button } from "@/registry/0nlytype/ui/button"
import { Fraction } from "@/registry/0nlytype/ui/fraction"
import { State } from "@/components/site/state"

/** Words written, grouped by a thin space as a printer groups them: 3 466. */
const words = (n: number) => String(1000 + n * 137).replace(/\B(?=(\d{3})+$)/g, "\u202f")

export default function Example() {
  const [done, setDone] = React.useState(18)
  return (
    <div className="flex flex-wrap items-end gap-x-8 gap-y-5">
      <p className="flex items-baseline gap-3" aria-live="polite">
        <Fraction count={done} total={24} />
        <span className="db-p">done</span>
      </p>
      <p className="flex items-baseline gap-3" aria-hidden="true">
        <Fraction variant="vinculum" count={done} total={24} />
        <span className="db-p">done</span>
      </p>
      <p className="flex items-baseline gap-3" aria-hidden="true">
        <Fraction variant="readout" count={done} total={24} />
      </p>
      <p className="flex items-baseline gap-3" aria-hidden="true">
        <Fraction count={words(done)} />
        <span className="db-p">words</span>
      </p>
      <p className="flex gap-5">
        <Button disabled={done === 0} onClick={() => setDone(done - 1)}>
          Undo one
        </Button>
        <Button disabled={done === 24} onClick={() => setDone(done + 1)}>
          Do one
        </Button>
      </p>
    </div>
  )
}

export function States() {
  return (
    <>
      <State label="Rest"><Fraction count={2} total={5} /></State>
      <State label="Pointed"><Fraction data-force="hover" count={2} total={5} /></State>
      <State label="Two figures"><Fraction count={12} total={40} /></State>
      <State label="None yet"><Fraction count={0} total={5} /></State>
      <State label="Vinculum"><Fraction variant="vinculum" count={2} total={5} /></State>
      <State label="Vinculum, pointed"><Fraction variant="vinculum" data-force="hover" count={12} total={40} /></State>
      <State label="Vinculum, all done"><Fraction variant="vinculum" count={5} total={5} /></State>
      <State label="Readout"><Fraction variant="readout" count={1} total={3} /></State>
      <State label="Readout, pointed"><Fraction variant="readout" data-force="hover" count={12} total={40} /></State>
      <State label="Alone"><Fraction count={18} /></State>
      <State label="Alone, grouped"><Fraction count="12 480" /></State>
    </>
  )
}
