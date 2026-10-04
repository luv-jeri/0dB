import { test } from "node:test"
import assert from "node:assert/strict"
import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { TextDiff, diffWords } from "../registry/0db/ui/text-diff.tsx"

const render = (component, props, children) => renderToStaticMarkup(React.createElement(component, props, children))

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
