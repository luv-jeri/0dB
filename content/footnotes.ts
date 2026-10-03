import { defineComponent } from "./types"

export default defineComponent({
  "name": "footnotes",
  "title": "Footnotes",
  "movement": "X",
  "contract": "db-footnotes",
  "summary": "A citation opens its margin: the called number grows into a coordinate while the note answers beside it. Return restores the exact reading place.",
  "underneath": "native",
  "props": [
    {
      "name": "Footnotes label",
      "type": "ReactNode",
      "description": "The heading for the note list; defaults to Notes. Native section props and ref reach the root."
    },
    {
      "name": "FootnoteReference noteId / number",
      "type": "string / string | number",
      "description": "The destination id and visible reference. Give the reference an id when its note should link back."
    },
    {
      "name": "Footnote id / number",
      "type": "string / string | number",
      "description": "Unique note target and its coordinate. Native li props and ref pass through."
    },
    {
      "name": "Footnote referenceId / returnLabel",
      "type": "string",
      "description": "The exact reference to return to and its accessible label. Supports repeated citations with separately authored return links."
    },
    {
      "name": "FootnoteReference native props",
      "type": "a props",
      "description": "id, ref, accessible label and other anchor props. Fragment ids are encoded; links work without JavaScript."
    }
  ]
})
