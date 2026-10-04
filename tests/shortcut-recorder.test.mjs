import { test } from "node:test"
import assert from "node:assert/strict"
import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { ShortcutRecorder } from "../registry/0db/ui/shortcut-recorder.tsx"

const render = (component, props, children) => renderToStaticMarkup(React.createElement(component, props, children))

test("shortcut keeps native fieldset, a named capture button and an exact JSON form value", () => {
  const html = render(ShortcutRecorder, { label: "Find", defaultValue: { key: "K", modifiers: ["Control", "Shift"] }, name: "binding", disabled: true })
  assert.match(html, /<fieldset[^>]*disabled=""/)
  assert.match(html, /<legend[^>]*>Find/)
  assert.match(html, /aria-pressed="false"/)
  assert.match(html, /name="binding" value="\{&quot;key&quot;:&quot;K&quot;/)
  assert.doesNotMatch(html, /autofocus/)
})

test("external fieldset form ownership reaches the actual submitted inputs", () => {
  for (const [component, props] of [[ShortcutRecorder, { label: "Binding", name: "binding" }]]) {
    const html = render(component, { ...props, form: "settings" })
    const inputs = [...html.matchAll(/<input\b[^>]*>/g)].map((m) => m[0])
    assert.ok(inputs.length)
    inputs.forEach((input) => assert.match(input, /form="settings"/))
  }
})
