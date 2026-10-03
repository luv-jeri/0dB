import { defineComponent } from "./types"

export default defineComponent({
  "name": "masked-value",
  "title": "Masked value",
  "movement": "VI",
  "contract": "db-masked",
  "summary": "A private reading between oversized parentheses. Reveal opens the aperture and unfolds your words; Hide removes them immediately.",
  "underneath": "native",
  "props": [
    {
      "name": "label / value",
      "type": "string",
      "description": "What the reading is, and its personal text. The value is not rendered while closed; no length is disclosed by the mask."
    },
    {
      "name": "revealed / defaultRevealed",
      "type": "boolean",
      "description": "Controlled or initial visibility, false by default."
    },
    {
      "name": "onRevealedChange",
      "type": "(revealed: boolean) => void",
      "description": "Reports Reveal or Hide. Focus stays on the stable native trigger."
    },
    {
      "name": "mask / revealLabel / hideLabel",
      "type": "string",
      "description": "Localized closed reading and action words. Defaults to Not shown, Reveal, Hide."
    },
    {
      "name": "buttonProps",
      "type": "button props",
      "description": "Native trigger ref, disabled, focus handlers, accessible name and click handler. Preventing click cancels the built-in action."
    },
    {
      "name": "Native props",
      "type": "span props",
      "description": "Root ref, className, style, hidden, dir and lang. This provides screen privacy; values remain in application data and client code."
    }
  ]
})
