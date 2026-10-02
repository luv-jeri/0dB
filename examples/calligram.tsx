"use client"

import { Calligram } from "@/registry/0db/ui/calligram"
import { State } from "@/components/site/state"

const text =
  "Zero decibels is not silence. It is the quietest sound a person can hear, the edge of the audible, and everything else in the world is measured upward from it. A room at zero has a pulse in it, a breath, a page turning three seats away. The threshold is a place you can stand and listen, and this is the shape it leaves when it is set down in words."

const short = "Zero decibels is not silence. It is the quietest sound a person can hear, and everything else is measured upward from it."

const rain = "It is raining the quietest sound there is, a hiss under everything, and a page turns three seats away, and nobody in the room looks up"

const frame = "Held in this frame the room goes quiet, the street and the voices and the hum fall away one by one, and what is left in the middle is the one thing you came here to do"

const startingPoints = [
  ["circle", "idea", "An idea to explore"],
  ["square", "product", "A product to improve"],
  ["arch", "website", "A website or store"],
  ["ring", "workflow", "A workflow"],
  ["diamond", "AI", "An AI question"],
  ["open", "other", "Something else"],
] as const

const split = (y: number): [number, number][] => y > 0.3 && y < 0.7 ? [[0, 0.3], [0.7, 1]] : [[0, 1]]

export default function Example() {
  return (
    <div className="grid gap-10">
      <p className="db-mf">Start with what you have.</p>
      <div className="flex flex-wrap items-start justify-between gap-6">
        {startingPoints.map(([shape, word, label]) => (
          <div key={shape} className="grid w-24 justify-items-center gap-4 text-center">
            <Calligram shape={shape} label={label} size="4rem">{Array(40).fill(word).join(" ")}</Calligram>
            <span className="db-pp">{label}</span>
          </div>
        ))}
      </div>
      <p>You can start in the middle.</p>
    </div>
  )
}

export function States() {
  return (
    <>
      {startingPoints.map(([shape, word, label]) => <State key={shape} label={label}><Calligram shape={shape} label={label} size="4rem">{Array(40).fill(word).join(" ")}</Calligram></State>)}
      <State label="Custom runs"><Calligram chord={split} size="16rem">{text}</Calligram></State>
      <State label="Circle"><Calligram size="20rem">{text}</Calligram></State>
      <State label="Fermata"><Calligram shape="fermata" size="20rem">{short}</Calligram></State>
      <State label="Wave"><Calligram shape="wave" size="20rem">{text}</Calligram></State>
      <State label="Rain"><Calligram variant="rain" size="20rem">{rain}</Calligram></State>
      <State label="Mirror"><Calligram variant="mirror" centre="listen" size="20rem">{frame}</Calligram></State>
    </>
  )
}
