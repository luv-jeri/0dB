import { test } from "node:test"
import assert from "node:assert/strict"
import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { Transcript, transcriptCueAt } from "../registry/0db/ui/transcript.tsx"

const render = (component, props, children) => renderToStaticMarkup(React.createElement(component, props, children))
const cues = [{ id: "a", start: 1, end: 2, text: "One" }, { id: "b", start: 4, end: 6, text: "Two" }]

test("transcript endpoints are half-open and gaps have no current cue", () => {
  for (const [time, expected] of [[0, -1], [1, 0], [1.9, 0], [2, -1], [3, -1], [4, 1], [6, -1], [NaN, -1], [Infinity, -1]]) assert.equal(transcriptCueAt(cues, time), expected)
})

test("a static transcript has no artificial tab stops; seekable cues are named buttons", () => {
  const html = render(Transcript, { cues, currentTime: 4 })
  assert.doesNotMatch(html, /<button|tabindex/)
  assert.match(html, /dateTime="PT4S"|datetime="PT4S"/)
  assert.match(html, /aria-current="true"/)
  assert.match(render(Transcript, { cues, onSeek: () => {} }), /aria-label="Seek to 0:01: One"/)
  const speakers = [{ ...cues[0], speaker: "Sanjay" }]
  assert.match(render(Transcript, { cues: speakers, onSeek: () => {} }), /aria-label="Seek to 0:01: Sanjay: One"/)
  assert.match(render(Transcript, { cues: speakers, onSeek: () => {}, seekLabel: (cue) => `Read ${cue.speaker}` }), /aria-label="Read Sanjay"/)
})

test("transcript rejects unordered, overlapping and invalid cues", () => {
  for (const bad of [[cues[1], cues[0]], [cues[0], cues[0]], [{ ...cues[0], start: NaN }], [{ ...cues[0], end: 5 }, cues[1]]]) assert.throws(() => render(Transcript, { cues: bad }), RangeError)
})
