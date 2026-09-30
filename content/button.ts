import { defineComponent } from "./types"

export default defineComponent({
  name: "button",
  title: "Button",
  movement: "VI",
  contract: "db-btn",
  summary: "Three voices: a statement in an ink block, a bracket that steps apart, and a quiet line that redraws.",
  underneath: "native",
  props: [
    { name: "variant", type: '"statement" | "bracket" | "quiet"', default: '"bracket"', description: "Statement is reversed type in an ink block, one per view. Bracket holds a secondary action. Quiet is only a line." },
    { name: "size", type: '"m" | "l"', default: '"m"', description: "Large sets the label at the lead size." },
    { name: "busy", type: "boolean | string", default: "false", description: "The button says what it's doing. A string replaces the label while busy (Save becomes Saving); the periods breathe after it." },
    { name: "asChild", type: "boolean", default: "false", description: "Render the child element, such as a link, with the button's look." },
  ],
})
