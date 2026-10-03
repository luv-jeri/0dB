import { defineComponent } from "./types"

export default defineComponent({
  "name": "text-diff",
  "title": "Text diff",
  "movement": "X",
  "contract": "db-text-diff",
  "summary": "A living proof sheet: small struck roman gives way to large replacement italic as you turn between three exact readings.",
  "underneath": "native",
  "props": [
    {
      "name": "original / revised",
      "type": "string",
      "description": "The exact passages, including whitespace. Word comparison uses a bounded longest-common-subsequence; very large changes keep shared ends and show one honest replacement."
    },
    {
      "name": "view / defaultView",
      "type": "changes | original | revised",
      "description": "Controlled or initial reading; defaults to changes."
    },
    {
      "name": "onViewChange",
      "type": "(view: DiffView) => void",
      "description": "Reports a request to change the reading; native buttons keep focus."
    },
    {
      "name": "label / labels",
      "type": "string / Partial<Record<DiffView | added | removed, string>>",
      "description": "Accessible group name and localized interface words, including spoken Added and Removed annotations."
    },
    {
      "name": "Native props",
      "type": "section props",
      "description": "ref, direction, language, visibility and presentation props reach the section."
    }
  ]
})
