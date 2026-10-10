import { defineComponent } from "./types"

export default defineComponent({
  name: "button-group",
  title: "Button group",
  movement: "VI",
  contract: "ot-btn-group",
  summary: "A set of actions, drawn three ways: one pair of parentheses with hairlines between, a narrow column with a dash hung in the margin, or a list written into the sentence around it.",
  underneath: "native",
  uses: ["button"],
  props: [
    { name: "aria-label", type: "string", description: "Names the set for a screen reader, such as Share Halden. The group is role=group." },
    { name: "variant", type: '"parentheses" | "column" | "sentence"', default: '"parentheses"', description: "Parentheses hold the set and hairlines stand between. Column stacks the actions as a narrow ragged column; pointing hangs a short heavy dash in the margin beside one. Sentence writes them into running text as a list (copy the link, email it, or export a PDF), each on a pencil hairline that the ink passes through." },
    { name: "conjunction", type: "string", default: '"or"', description: "In a sentence, the word before the last action. Use and, or the page's own language." },
    { name: "children", type: "Button[]", description: "The actions. Each Button gives up its own brackets inside the group." },
  ],
})
