import { defineComponent } from "./types"

export default defineComponent({
  "name": "audio-player",
  "title": "Audio player",
  "movement": "IX",
  "contract": "db-audio",
  "summary": "A monumental media clock above a seekable score. Play lifts the held playhead; the browser supplies every second.",
  "underneath": "native",
  "props": [
    {
      "name": "src / label",
      "type": "string",
      "description": "Recording source and readable title. The supplied source must be accessible to the browser."
    },
    {
      "name": "audioProps",
      "type": "audio props",
      "description": "Native media ref, preload, loop, muted, crossOrigin and media events pass through. No autoplay or native controls override."
    },
    {
      "name": "onTimeChange",
      "type": "(seconds: number) => void",
      "description": "Real media updates, suitable for a transcript. The audio ref permits external seeks."
    },
    {
      "name": "playLabel / pauseLabel / seekLabel / errorLabel",
      "type": "string",
      "description": "Localized control names and a useful playback error."
    },
    {
      "name": "disabled",
      "type": "boolean",
      "description": "Disables play and seek and pauses playback. Unknown or infinite duration disables seeking."
    },
    {
      "name": "Native props",
      "type": "div props",
      "description": "Root ref, hidden, dir and lang. The browser owns playback; rejected Play promises produce a visible status."
    }
  ]
})
