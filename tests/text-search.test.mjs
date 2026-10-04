import { test } from "node:test"
import assert from "node:assert/strict"
import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { TextSearch, findTextMatches } from "../registry/0db/ui/text-search.tsx"

const render = (component, props, children) => renderToStaticMarkup(React.createElement(component, props, children))

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
