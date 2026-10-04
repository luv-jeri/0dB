import { test } from "node:test"
import assert from "node:assert/strict"
import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { Footnotes, Footnote, FootnoteReference } from "../registry/0db/ui/footnotes.tsx"

const render = (component, props, children) => renderToStaticMarkup(React.createElement(component, props, children))

test("footnotes connect exact, encoded targets in both reading directions", () => {
  const reference = render(FootnoteReference, { id: "ref", noteId: "note with space", number: 2 })
  const notes = render(Footnotes, { dir: "rtl", label: "Notes" }, React.createElement(Footnote, { id: "note with space", referenceId: "ref", number: 2 }, "The source"))
  assert.match(reference, /href="#note%20with%20space"/)
  assert.match(reference, /aria-label="Read note 2"/)
  assert.match(notes, /<ol/)
  assert.match(notes, /tabindex="-1"[^>]*id="note with space"/)
  assert.match(notes, /href="#ref" aria-label="Return to reference 2"/)
})
