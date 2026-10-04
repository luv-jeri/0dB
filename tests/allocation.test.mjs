import { test } from "node:test"
import assert from "node:assert/strict"
import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { Allocation } from "../registry/0db/ui/allocation.tsx"

const render = (component, props, children) => renderToStaticMarkup(React.createElement(component, props, children))
const items = [{ id: "a", label: "Research" }, { id: "b", label: "Type" }]

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
  for (const [component, props] of [[Allocation, { label: "Hours", items, total: 40, name: "hours" }]]) {
    const html = render(component, { ...props, form: "settings" })
    const inputs = [...html.matchAll(/<input\b[^>]*>/g)].map((m) => m[0])
    assert.ok(inputs.length)
    inputs.forEach((input) => assert.match(input, /form="settings"/))
  }
})
