import { defineComponent } from "./types"

export default defineComponent({
  "name": "transfer-list",
  "title": "Transfer list",
  "movement": "VI",
  "contract": "db-transfer",
  "summary": "Two open margins with oversized counts. Selected words cross their real distance and settle into a new, personal setting.",
  "underneath": "native",
  "props": [
    {
      "name": "items",
      "type": "TransferItem[]",
      "description": "Unique, non-empty ids, readable labels and optional per-item disabled state. Source order is retained on both sides."
    },
    {
      "name": "value / defaultValue",
      "type": "string[]",
      "description": "Included ids, controlled or initially empty. Removed source items are omitted from the displayed and submitted membership."
    },
    {
      "name": "onValueChange",
      "type": "(ids: string[]) => void",
      "description": "Reports membership in source order after Include or Remove. Picking checkboxes does not itself transfer items."
    },
    {
      "name": "name / disabled",
      "type": "string / boolean",
      "description": "Repeated hidden fields submit included ids; disabled disables selection, movement and submission."
    },
    {
      "name": "availableLabel / includedLabel / includeLabel / removeLabel / emptyLabel",
      "type": "string",
      "description": "Names of the two sets, their real actions and an empty set."
    },
    {
      "name": "Native props",
      "type": "div props",
      "description": "Root ref, dir, lang and hidden pass through. Transfer focuses the destination heading and announces the number moved."
    }
  ]
})
