import { test } from "node:test"
import assert from "node:assert/strict"
import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { TransferList } from "../registry/0db/ui/transfer-list.tsx"

const render = (component, props, children) => renderToStaticMarkup(React.createElement(component, props, children))
const items = [{ id: "a", label: "Research" }, { id: "b", label: "Type" }]

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
