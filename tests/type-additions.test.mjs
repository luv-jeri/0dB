import { test } from "node:test"
import assert from "node:assert/strict"
import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"

import { Footnotes, Footnote, FootnoteReference } from "../registry/0db/ui/footnotes.tsx"
import { TextDiff, diffWords } from "../registry/0db/ui/text-diff.tsx"
import { TextSearch, findTextMatches } from "../registry/0db/ui/text-search.tsx"
import { TransferList } from "../registry/0db/ui/transfer-list.tsx"
import { ShortcutRecorder } from "../registry/0db/ui/shortcut-recorder.tsx"
import { TimeRange, timeRangeMinutes } from "../registry/0db/ui/time-range.tsx"
import { Transcript, transcriptCueAt } from "../registry/0db/ui/transcript.tsx"
import { AudioPlayer } from "../registry/0db/ui/audio-player.tsx"
import { Allocation } from "../registry/0db/ui/allocation.tsx"
import { MaskedValue } from "../registry/0db/ui/masked-value.tsx"

const render = (component, props, children) => renderToStaticMarkup(React.createElement(component, props, children))
const items = [{ id: "a", label: "Research" }, { id: "b", label: "Type" }]

test("footnotes connect exact, encoded targets in both reading directions", () => {
  const reference = render(FootnoteReference, { id: "ref", noteId: "note with space", number: 2 })
  const notes = render(Footnotes, { dir: "rtl", label: "Notes" }, React.createElement(Footnote, { id: "note with space", referenceId: "ref", number: 2 }, "The source"))
  assert.match(reference, /href="#note%20with%20space"/)
  assert.match(reference, /aria-label="Read note 2"/)
  assert.match(notes, /<ol/)
  assert.match(notes, /tabindex="-1"[^>]*id="note with space"/)
  assert.match(notes, /href="#ref" aria-label="Return to reference 2"/)
})

test("diff projects each exact original and revision, including whitespace and Unicode", () => {
  const cases = [["", ""], ["", "Only added"], ["Only removed", ""], ["A  word\nwith a pause.", "A word\nwith a longer pause."], ["نص قديم", "نص جديد"], ["one two one", "one one two"], ["a\r\nb\t", "a\nb  "]]
  for (const [original, revised] of cases) {
    const parts = diffWords(original, revised)
    assert.equal(parts.filter((part) => part.kind !== "added").map((part) => part.text).join(""), original)
    assert.equal(parts.filter((part) => part.kind !== "removed").map((part) => part.text).join(""), revised)
  }
})

test("diff keeps bounded large-passage fallback honest", () => {
  const original = `shared ${"old ".repeat(1000)}end`
  const revised = `shared ${"new ".repeat(1000)}end`
  const parts = diffWords(original, revised)
  assert.equal(parts.filter((part) => part.kind !== "added").map((part) => part.text).join(""), original)
  assert.equal(parts.filter((part) => part.kind !== "removed").map((part) => part.text).join(""), revised)
  assert.ok(parts.length <= 4)
})

test("diff exposes real ins and del and names the kinds without injecting markup", () => {
  const html = render(TextDiff, { original: "old <script>", revised: "new <script>" })
  assert.match(html, /<del/)
  assert.match(html, /<ins/)
  assert.match(html, /Removed:/)
  assert.match(html, /Added:/)
  assert.match(html, /&lt;script&gt;/)
  assert.doesNotMatch(html, /<script>/)
  for (const view of ["original", "revised"]) assert.doesNotMatch(render(TextDiff, { original: "old", revised: "new", view }), /Removed:|Added:|<del|<ins/)
})

test("search treats punctuation as literal and retains original case and UTF-16 coordinates", () => {
  assert.deepEqual(findTextMatches("a.*b A.*B", ".*"), [{ start: 1, end: 3 }, { start: 6, end: 8 }])
  assert.deepEqual(findTextMatches("🦋 A a", "a"), [{ start: 3, end: 4 }, { start: 5, end: 6 }])
  assert.deepEqual(findTextMatches("aaaa", "aa"), [{ start: 0, end: 2 }, { start: 2, end: 4 }])
  assert.deepEqual(findTextMatches("İ I i", "i"), [{ start: 2, end: 3 }, { start: 4, end: 5 }])
  assert.deepEqual(findTextMatches("a", ""), [])
})

test("search disables navigation with no hits and preserves literal text", () => {
  const html = render(TextSearch, { text: "No <em> markup", query: "absent" })
  assert.equal((html.match(/<button[^>]*disabled=""/g) ?? []).length, 2)
  assert.match(html, /0 of 0 matches/)
  assert.match(html, /No &lt;em&gt; markup/)
})

test("transfer submits membership in source order, excludes vanished ids and uses native disabled selection", () => {
  const html = render(TransferList, { items, value: ["b", "removed", "a", "a"], name: "parts", disabled: true })
  const hidden = [...html.matchAll(/<input[^>]*type="hidden"[^>]*>/g)].map((m) => m[0])
  assert.equal(hidden.length, 2)
  assert.match(hidden[0], /value="a"/)
  assert.match(hidden[1], /value="b"/)
  hidden.forEach((input) => assert.match(input, /disabled=""/))
  assert.equal((html.match(/type="checkbox"[^>]*disabled=""/g) ?? []).length, 2)
})

test("transfer rejects ambiguous identities", () => {
  assert.throws(() => render(TransferList, { items: [items[0], items[0]] }), /unique/)
  assert.throws(() => render(TransferList, { items: [{ id: "", label: "Empty" }] }), /unique/)
})

test("shortcut keeps native fieldset, a named capture button and an exact JSON form value", () => {
  const html = render(ShortcutRecorder, { label: "Find", defaultValue: { key: "K", modifiers: ["Control", "Shift"] }, name: "binding", disabled: true })
  assert.match(html, /<fieldset[^>]*disabled=""/)
  assert.match(html, /<legend[^>]*>Find/)
  assert.match(html, /aria-pressed="false"/)
  assert.match(html, /name="binding" value="\{&quot;key&quot;:&quot;K&quot;/)
  assert.doesNotMatch(html, /autofocus/)
})

test("civil intervals distinguish incomplete, reversed, overnight and equal times", () => {
  for (const [value, overnight, expected] of [[{ start: "09:00", end: "17:30" }, false, 510], [{ start: "22:00", end: "02:00" }, false, null], [{ start: "22:00", end: "02:00" }, true, 240], [{ start: "09:00", end: "09:00" }, true, 0], [{ start: "24:00", end: "02:00" }, true, null], [{ start: "", end: "02:00" }, false, null]])
    assert.equal(timeRangeMinutes(value, overnight), expected)
})

test("time inputs retain native names, required and the joined descriptions", () => {
  const html = render(TimeRange, { label: "Hours", value: { start: "22:00", end: "02:00" }, startProps: { name: "from", required: true, "aria-describedby": "policy" }, endProps: { name: "until" } })
  assert.match(html, /<input[^>]*required=""[^>]*name="from"/)
  assert.match(html, /aria-describedby="policy [^"]+-duration"/)
  assert.match(html, /type="time" step="60"[^>]*value="22:00"/)
  assert.match(html, /Set the end after the start/)
  assert.match(html, /aria-invalid="true"/)
})

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

test("audio uses real media without autoplay, disables an unknown-duration seek and forwards native props", () => {
  const html = render(AudioPlayer, { src: "reading.wav", label: "Reading", audioProps: { preload: "none", loop: true, muted: true, crossOrigin: "anonymous" } })
  assert.match(html, /<audio[^>]*preload="none"[^>]*loop=""[^>]*muted=""/)
  assert.doesNotMatch(html, /autoplay|controls=""/i)
  assert.match(html, /aria-label="Play Reading"/)
  assert.match(html, /type="range"[^>]*disabled=""/)
})

test("allocation computes only the allowance remainder and does not normalize excess away", () => {
  const html = render(Allocation, { label: "Hours", items, total: 20, value: { a: 15, b: 10 }, name: "hours" })
  assert.match(html, /Over allowance/)
  assert.match(html, /aria-invalid="true"/)
  assert.match(html, />5<\/bdi>/)
  assert.match(html, /name="hours\[a\]" value="15"/)
  assert.match(html, /name="hours\[b\]" value="10"/)
})

test("allocation handles decimal dust and prototype-looking item names", () => {
  const html = render(Allocation, { label: "Shares", total: 1, items, value: { a: 0.1, b: 0.2 } })
  assert.match(html, />0.7<\/bdi>/)
  const full = render(Allocation, { label: "Shares", total: 0.3, items, value: { a: 0.1, b: 0.2 }, step: 0.1 })
  assert.doesNotMatch(full, /Over allowance|aria-invalid="true"/)
  assert.match(full, /max="0.1"/)
  assert.match(full, /max="0.2"/)
  assert.match(full, />0<\/bdi>/)
  assert.match(render(Allocation, { label: "Shares", total: 1, items: [{ id: "toString", label: "One" }] }), /value="0"/)
})

test("allocation rejects impossible numeric inputs", () => {
  for (const props of [{ total: Infinity }, { total: -1 }, { total: 10, step: 0 }, { total: 10, value: { a: NaN } }, { total: 10, value: { a: -1 } }, { total: 10, items: [items[0], items[0]] }]) assert.throws(() => render(Allocation, { label: "Hours", items, ...props }), RangeError)
})

test("external fieldset form ownership reaches the actual submitted inputs", () => {
  for (const [component, props] of [[Allocation, { label: "Hours", items, total: 40, name: "hours" }], [ShortcutRecorder, { label: "Binding", name: "binding" }], [TimeRange, { label: "Hours", startProps: { name: "start" }, endProps: { name: "end" } }]]) {
    const html = render(component, { ...props, form: "settings" })
    const inputs = [...html.matchAll(/<input\b[^>]*>/g)].map((m) => m[0])
    assert.ok(inputs.length)
    inputs.forEach((input) => assert.match(input, /form="settings"/))
  }
})

test("masked readings are absent from closed SSR and accessible descriptions", () => {
  const html = render(MaskedValue, { label: "Recovery phrase", value: "a-secret-reading" })
  assert.doesNotMatch(html, /a-secret-reading/)
  assert.match(html, /Not shown/)
  assert.match(html, /aria-label="Reveal Recovery phrase"/)
  assert.match(html, /aria-expanded="false"/)
})

test("revealed readings are escaped and bidi-isolated, with a stable Hide control", () => {
  const html = render(MaskedValue, { label: "Reading", value: "<value>", revealed: true, dir: "rtl", hidden: true })
  assert.match(html, /hidden="" dir="rtl"|dir="rtl" hidden=""/)
  assert.match(html, /<bdi[^>]*>&lt;value&gt;<\/bdi>/)
  assert.match(html, /aria-label="Hide Reading"/)
  assert.match(html, /aria-expanded="true"/)
  assert.doesNotMatch(html, /data-acted/)
})
