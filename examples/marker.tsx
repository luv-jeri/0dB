"use client"

import * as React from "react"

import { Button } from "@/registry/0db/ui/button"
import { Marker } from "@/registry/0db/ui/marker"

export default function Example() {
  const [played, setPlayed] = React.useState(0)
  return (
    <div className="grid max-w-[36rem] justify-items-stretch gap-(--db-space-5)">
      <Marker key={played} variant="divider" arriving>Today</Marker>
      <Marker dot>Ada joined the thread</Marker>
      <Marker>Edited at 09:52</Marker>
      <Button variant="quiet" className="justify-self-start" onClick={() => setPlayed((n) => n + 1)}>Draw it again</Button>
    </div>
  )
}
