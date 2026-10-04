import { test } from "node:test"
import assert from "node:assert/strict"
import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { TimeRange, timeRangeMinutes } from "../registry/0db/ui/time-range.tsx"

const render = (component, props, children) => renderToStaticMarkup(React.createElement(component, props, children))

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

test("external fieldset form ownership reaches the actual submitted inputs", () => {
  for (const [component, props] of [[TimeRange, { label: "Hours", startProps: { name: "start" }, endProps: { name: "end" } }]]) {
    const html = render(component, { ...props, form: "settings" })
    const inputs = [...html.matchAll(/<input\b[^>]*>/g)].map((m) => m[0])
    assert.ok(inputs.length)
    inputs.forEach((input) => assert.match(input, /form="settings"/))
  }
})
