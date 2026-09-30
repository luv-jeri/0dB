import { defineComponent } from "./types"

export default defineComponent({
  name: "field",
  title: "Field",
  movement: "VI",
  contract: "db-field",
  summary: "No box, only a baseline. Your words arrive in italic, focus draws the accent from where you touched, and an error hangs from the line as a callout.",
  underneath: "native",
  props: [
    { name: "label", type: "ReactNode", description: "Small sans label, wired to the control with htmlFor." },
    { name: "hint", type: "ReactNode", description: "A quiet line under the baseline. Linked with aria-describedby." },
    { name: "error", type: "ReactNode", description: "What to fix, in plain words. The baseline turns crimson, the control gets aria-invalid, and the message hangs from the line on a leader. A Form fills this in for you." },
    { name: "count", type: "boolean", default: "false", description: "Show how much is typed, such as 12 / 40, while the field has focus." },
    { name: "maxLength", type: "number", description: "Passed to the control, and the top of the count." },
    { name: "Input / Textarea", type: "native", description: "Real controls with every native prop. Textarea is ruled like paper. Both also work outside a Field." },
    { name: "FieldError", type: "component", description: "The callout on its own, for an error you place yourself." },
  ],
})
