import { sitePath } from "@/lib/site/config.mjs"
import { AudioPlayer } from "@/registry/0db/ui/audio-player"
import { State } from "@/components/site/state"

export default function Example() {
  return <AudioPlayer className="w-full max-w-2xl" label="On silence, space and type" src={sitePath("/audio/studio-reading.wav")} />
}

export function States() {
  return <>
    <State label="Ready"><AudioPlayer className="w-72" label="A short studio reading" src={sitePath("/audio/studio-reading.wav")} /></State>
    <State label="Disabled"><AudioPlayer className="w-72" label="A short studio reading" src={sitePath("/audio/studio-reading.wav")} disabled /></State>
    <State label="Long title, RTL"><AudioPlayer className="w-72" dir="rtl" label="A recording about the silence between one idea and the next" src={sitePath("/audio/studio-reading.wav")} /></State>
  </>
}
