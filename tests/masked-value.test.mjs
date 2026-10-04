import { test } from "node:test"
import assert from "node:assert/strict"
import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { MaskedValue } from "../registry/0db/ui/masked-value.tsx"

const render = (component, props, children) => renderToStaticMarkup(React.createElement(component, props, children))

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
