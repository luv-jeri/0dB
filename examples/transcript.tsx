"use client"

import * as React from "react"

import { Transcript } from "@/registry/0db/ui/transcript"
import { State } from "@/components/site/state"

const cues = [{ id: "one", start: 0, end: 2.217, speaker: "The studio", text: "Silence gives the next word its weight." }, { id: "two", start: 2.717, end: 4.656, text: "Space holds two ideas apart." }, { id: "three", start: 5.156, end: 7.035, text: "Type carries everything else." }]

export default function Example() {
  const [time, setTime] = React.useState(0)
  return <div className="grid w-full max-w-2xl gap-12">
    <Transcript cues={cues} currentTime={time} onSeek={setTime} />
  </div>
}

export function States() {
  return <>
    <State label="Reading the second cue"><Transcript className="w-72" cues={cues} currentTime={4} /></State>
    <State label="In a gap"><Transcript className="w-72" cues={cues} currentTime={-1} /></State>
    <State label="No cues"><Transcript className="w-72" cues={[]} /></State>
    <State label="RTL"><Transcript className="w-72" dir="rtl" cues={[{ id: "ar", start: 0, text: "الصمت يمنح الكلمة وزنها." }]} /></State>
  </>
}
