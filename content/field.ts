import { defineComponent } from "./types"

export default defineComponent({
  name: "field",
  title: "Field",
  movement: "VI",
  contract: "ot-field",
  summary: "No box, only a baseline. Your words arrive in italic, focus draws the accent from where you touched, and an error hangs from the line as a callout. Or your words are overprinted on a heavy label, or signed on a form's line.",
  underneath: "native",
  props: [
    { name: "variant", type: '"line" | "overprint" | "signature"', default: '"line"', description: "How the label and your words share the line. line: a small label over a baseline. overprint: the label is set as a heavy condensed word and your italic is printed over it, knocked out of it by a paper outline, as in \"It has to be design.\"; arriving, the word draws in its width and your words take the accent. signature: a cross marks where to write and the label is a caption under the line, as on a printed form; arriving, the + turns to the × of \"sign here\" and inks, and once you've written it steps back to pencil." },
    { name: "label", type: "ReactNode", description: "Small sans label, wired to the control with htmlFor." },
    { name: "hint", type: "ReactNode", description: "A quiet line under the baseline. Linked with aria-describedby." },
    { name: "error", type: "ReactNode", description: "What to fix, in plain words. The baseline turns crimson, the control gets aria-invalid, and the message hangs from the line on a leader. A Form fills this in for you." },
    { name: "count", type: "boolean", default: "false", description: "Show how much is typed, such as 12 / 40, while the field has focus." },
    { name: "maxLength", type: "number", description: "Passed to the control, and the top of the count." },
    { name: "Input / Textarea", type: "native", description: "Real controls with every native prop. Textarea is ruled like paper. Both also work outside a Field." },
    { name: "FieldError", type: "component", description: "The callout on its own, for an error you place yourself." },
    { name: "id", type: "string", default: "generated", description: "The control's ID, used by the label and hint/error associations. Input and Textarea inherit it; a custom control must use the same ID." },
  ],
})
