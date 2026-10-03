import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"

type TranscriptCue = { id: string; start: number; end?: number; text: string; speaker?: string }
function transcriptCueAt(cues: TranscriptCue[], time: number): number {
  if (!Number.isFinite(time) || time < 0) return -1
  let result = -1
  for (let i = 0; i < cues.length; i++) {
    if (time >= cues[i].start && time < (cues[i].end ?? cues[i + 1]?.start ?? Infinity)) result = i
  }
  return result
}
const clock = (n: number) => `${Math.floor(n / 60)}:${String(Math.floor(n % 60)).padStart(2, "0")}`
type TranscriptProps = Omit<React.ComponentProps<"section">, "children"> & {
  cues: TranscriptCue[]
  currentTime?: number
  onSeek?: (seconds: number) => void
  label?: string
  formatTime?: (seconds: number) => string
  seekLabel?: (cue: TranscriptCue) => string
}

/** Can render as static server text. Add onSeek from a client to connect it to any recording. */
function Transcript({ cues, currentTime = 0, onSeek, label = "Transcript", formatTime = clock, seekLabel = (cue) => `Seek to ${clock(cue.start)}: ${cue.speaker ? `${cue.speaker}: ` : ""}${cue.text}`, className, ...props }: TranscriptProps) {
  if (new Set(cues.map((cue) => cue.id)).size !== cues.length || cues.some((cue, i) => !cue.id || !Number.isFinite(cue.start) || cue.start < 0 || (i > 0 && cue.start <= cues[i - 1].start) || (cue.end !== undefined && (!Number.isFinite(cue.end) || cue.end <= cue.start || (i + 1 < cues.length && cue.end > cues[i + 1].start)))))
    throw new RangeError("Transcript needs unique ids and ordered, finite, non-overlapping cue times")
  const active = transcriptCueAt(cues, currentTime)
  return <section {...props} data-slot="transcript" className={cn("db-transcript", className)} aria-label={props["aria-label"] ?? label}>
    <ol data-slot="transcript-cues">
      {cues.map((cue, i) => {
        const content = <><time data-slot="transcript-time" dateTime={`PT${cue.start}S`}><bdi dir="ltr">{formatTime(cue.start)}</bdi></time><span data-slot="transcript-words">{cue.speaker ? <span data-slot="transcript-speaker" className="db-reading">{cue.speaker}</span> : null}{cue.text}</span></>
        return <li key={cue.id} data-slot="transcript-cue" data-current={active === i ? "" : undefined}>{onSeek ? <button type="button" aria-current={active === i ? "true" : undefined} aria-label={seekLabel(cue)} onClick={() => onSeek(cue.start)}>{content}</button> : <div aria-current={active === i ? "true" : undefined}>{content}</div>}</li>
      })}
    </ol>
  </section>
}

export { Transcript, transcriptCueAt, type TranscriptProps, type TranscriptCue }
