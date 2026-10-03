import { defineComponent } from "./types"

export default defineComponent({
  "name": "shortcut-recorder",
  "title": "Shortcut recorder",
  "movement": "VI",
  "contract": "db-shortcut",
  "summary": "A chord held in typographic tension: the final key stands large, Record cants the setting, and a complete chord releases it into place.",
  "underneath": "native",
  "props": [
    {
      "name": "label",
      "type": "ReactNode",
      "description": "Native fieldset legend, naming the shortcut being assigned."
    },
    {
      "name": "value / defaultValue",
      "type": "Shortcut | null",
      "description": "Controlled or initial chord: key plus an ordered modifier array. Null means unassigned."
    },
    {
      "name": "onValueChange",
      "type": "(value: Shortcut | null) => void",
      "description": "Reports a captured chord or Clear. No document listener or global shortcut registration."
    },
    {
      "name": "requireModifier",
      "type": "boolean",
      "description": "Defaults to true: Control, Alt or Meta must accompany the key. Shift alone is not enough."
    },
    {
      "name": "name / disabled",
      "type": "string / boolean",
      "description": "A hidden field submits JSON; disabled uses native fieldset semantics."
    },
    {
      "name": "recordLabel / cancelLabel / clearLabel / emptyLabel / hint",
      "type": "string",
      "description": "Interface wording. Escape cancels, Tab leaves, blur cancels; repeats, composition and bare modifiers never commit."
    },
    {
      "name": "Native props",
      "type": "fieldset props",
      "description": "ref, direction, language, form and visibility. Some system shortcuts are reserved by the operating system and cannot be recorded."
    }
  ]
})
