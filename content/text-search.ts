import { defineComponent } from "./types"

export default defineComponent({
  "name": "text-search",
  "title": "Text search",
  "movement": "X",
  "contract": "db-text-search",
  "summary": "A large italic query and a travelling margin coordinate locate the chosen occurrence inside its full passage.",
  "underneath": "native",
  "props": [
    {
      "name": "text",
      "type": "string",
      "description": "The plain-text passage; whitespace and literal punctuation are retained. No HTML parsing."
    },
    {
      "name": "query / defaultQuery",
      "type": "string",
      "description": "Controlled or initial query, case-insensitive and literal. Empty query marks nothing."
    },
    {
      "name": "onQueryChange",
      "type": "(query: string) => void",
      "description": "Reports typing. A changed passage or query starts at the first match."
    },
    {
      "name": "label / previousLabel / nextLabel / countLabel",
      "type": "string / (current: number, total: number) => string",
      "description": "Localized field, navigation and result-count wording. Enter moves forward; Shift+Enter moves back."
    },
    {
      "name": "Native props",
      "type": "section props",
      "description": "Root ref, hidden, dir, lang and presentation props. Typing never scrolls; explicit match navigation scrolls the match only if needed."
    }
  ]
})
