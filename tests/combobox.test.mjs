import { test } from "node:test"
import assert from "node:assert/strict"
import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { Combobox } from "../registry/0nlytype/ui/combobox.tsx"

const options = [{ value: "a", label: "Alpha" }, { value: "b", label: "Beta" }]

test("pencil forwards native input attributes and caller accessibility associations", () => {
  const html = renderToStaticMarkup(React.createElement(Combobox, {
    variant: "pencil", options, defaultValue: "a", "aria-label": "Choice",
    "aria-describedby": "help", "aria-invalid": true, name: "choice", required: true,
    maxLength: 20, inputMode: "search", autoComplete: "on", spellCheck: true, "data-consumer": "kept",
  }))
  const input = html.match(/<input\b[^>]*>/)?.[0]
  assert.ok(input)
  for (const attr of ['aria-describedby="help"', 'aria-invalid="true"', 'name="choice"', 'required=""', 'maxLength="20"', 'inputMode="search"', 'autoComplete="on"', 'spellCheck="true"', 'data-consumer="kept"', 'value="Alpha"']) assert.ok(input.includes(attr), attr)
})

test("multiple combobox disables every submitted hidden value", () => {
  for (const disabled of [true, false]) {
    const html = renderToStaticMarkup(React.createElement(Combobox, { options, multiple: true, name: "choice", defaultValue: ["a", "b"], disabled }))
    const inputs = html.match(/<input\b[^>]*type="hidden"[^>]*>/g)
    assert.equal(inputs?.length, 2)
    for (const input of inputs) assert.equal(input.includes('disabled=""'), disabled)
  }
})
