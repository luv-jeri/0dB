"use client"

import * as React from "react"

import { WordRelay } from "@/registry/0db/ui/word-relay"
import { State } from "@/components/site/state"

const ends = ["design.", "type.", "silence.", "yours."]

export default function Example() {
  const [pace, setPace] = React.useState(1)
  return (
    <div className="grid w-full grid-cols-[minmax(0,1fr)] justify-items-start gap-(--db-space-8)">
      <p className="db-ff" style={{ margin: 0, fontSize: "clamp(36px, 10vw, var(--db-ff))" }}>
        <WordRelay variant="statement" words={ends}>It has to be</WordRelay>
      </p>
      <div className="grid gap-(--db-space-3)">
        <p className="db-mp" style={{ margin: 0 }}>
          <WordRelay words={["slowly.", "at a walk.", "at a run."]} index={pace} onIndexChange={setPace}>Read the page</WordRelay>
        </p>
        <p className="db-pp" style={{ margin: 0, color: "var(--db-pencil)" }}>Press the sentence, or use the arrow keys once it has focus.</p>
      </div>
    </div>
  )
}

export function States() {
  return (
    <>
      <State label="Rest"><p className="db-mp" style={{ margin: 0 }}><WordRelay words={ends}>It has to be</WordRelay></p></State>
      <State label="Hover"><p className="db-mp" style={{ margin: 0 }}><WordRelay words={ends} data-force="hover">It has to be</WordRelay></p></State>
      <State label="Focus"><p className="db-mp" style={{ margin: 0 }}><WordRelay words={ends} data-force="focus">It has to be</WordRelay></p></State>
      <State label="Disabled"><p className="db-mp" style={{ margin: 0 }}><WordRelay words={ends} disabled>It has to be</WordRelay></p></State>
      <State label="Statement"><p className="db-f" style={{ margin: 0 }}><WordRelay variant="statement" words={ends} defaultIndex={2}>It has to be</WordRelay></p></State>
      <State label="Statement, hover"><p className="db-f" style={{ margin: 0 }}><WordRelay variant="statement" words={ends} data-force="hover">It has to be</WordRelay></p></State>
    </>
  )
}
