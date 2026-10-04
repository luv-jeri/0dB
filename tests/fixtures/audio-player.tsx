"use client"

import * as React from "react"
import { createRoot } from "react-dom/client"
import { AudioPlayer } from "@/registry/0db/ui/audio-player"

function Fixture() {
  const [source, setSource] = React.useState("/one.wav")
  return <>
    <button type="button" onClick={() => setSource("/one.wav")}>Source A</button>
    <button type="button" onClick={() => setSource("/two.wav")}>Source B</button>
    <AudioPlayer src={source} label="Reading" audioProps={{ preload: "none" }} />
  </>
}

createRoot(document.getElementById("fixture")!).render(<Fixture />)
