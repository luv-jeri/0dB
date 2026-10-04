import { defineComponent } from "./types"

export default defineComponent({
  "name": "transcript",
  "title": "Transcript",
  "movement": "IX",
  "contract": "db-transcript",
  "summary": "A score for spoken words. The active cue opens in scale and space while its timestamp conducts from the margin.",
  "underneath": "native",
  "props": [
    {
      "name": "cues",
      "type": "TranscriptCue[]",
      "description": "Unique ids, strictly increasing finite non-negative starts, optional non-overlapping ends, plain text and optional speaker. End defaults to the next start, or the recording end externally."
    },
    {
      "name": "currentTime",
      "type": "number",
      "description": "The recording time in seconds. A gap has no current cue; a start is inclusive and an end exclusive."
    },
    {
      "name": "onSeek",
      "type": "(seconds: number) => void",
      "description": "When supplied from a client, cue rows are native buttons that request a seek. Otherwise the text renders on the server with no tab stops."
    },
    {
      "name": "label / formatTime / seekLabel",
      "type": "string / function",
      "description": "Accessible section name, timestamp formatter and full seek-button name."
    },
    {
      "name": "Native props",
      "type": "section props",
      "description": "Root ref, visibility, direction and language. No autonomous timer, forced scroll or live announcement on every spoken cue."
    }
  ]
})
