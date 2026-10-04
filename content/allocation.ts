import { defineComponent } from "./types"

export default defineComponent({
  "name": "allocation",
  "title": "Allocation",
  "movement": "VI",
  "contract": "db-allocation",
  "summary": "An allowance held in balance: a large remainder answers independent numbered dimensions, with no silent redistribution.",
  "underneath": "native",
  "props": [
    {
      "name": "items / total",
      "type": "AllocationItem[] / number",
      "description": "Unique ids, readable labels, optional disabled state, and one finite non-negative allowance."
    },
    {
      "name": "value / defaultValue",
      "type": "Record<string, number>",
      "description": "Controlled or initial finite non-negative amounts by id. Missing shares are zero. A reduced allowance can display an existing over-allocation without silently rewriting it."
    },
    {
      "name": "onValueChange",
      "type": "(value: Record<string, number>) => void",
      "description": "Reports a single edited share clamped between zero and what the other shares leave. No redistribution."
    },
    {
      "name": "step / unit / format",
      "type": "number / string / function",
      "description": "Positive native number step, literal display unit and balance formatter. Default step is 1."
    },
    {
      "name": "name / disabled",
      "type": "string / boolean",
      "description": "Named amounts submit as name[id]. Native fieldset and per-item disabled semantics."
    },
    {
      "name": "remainingLabel / excessLabel / label",
      "type": "string / ReactNode",
      "description": "Names the remainder or excess and the allowance. The balance describes every input."
    },
    {
      "name": "Native props",
      "type": "fieldset props",
      "description": "Root ref, form, hidden, dir and lang. Use charts to read a distribution; Allocation edits its constrained shares."
    }
  ]
})
