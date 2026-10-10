import { defineComponent } from "./types"

export default defineComponent({
  name: "typography",
  title: "Typography",
  movement: "X",
  contract: "ot-prose",
  summary: "Long text, set to be read: it styles plain HTML by element, and punctuation hangs in the margin.",
  underneath: "native",
  props: [
    { name: "asChild", type: "boolean", default: "false", description: "Set the child element instead of rendering an article." },
    { name: "ProseLead", type: "p props", description: "An opening paragraph at the lead size, in ink." },
    { name: "variant", type: '"swiss" | "book" | "run-on"', default: '"swiss"', description: "swiss: space between paragraphs and punctuation hung in the margin. book: a book's page; paragraphs follow on without a space, each indented, justified and hyphenated, the opening line in spaced capitals, old-style figures, and a break is three dots instead of a rule. run-on: a passage's paragraphs run on as one block, a pilcrow standing where each begins." },
  ],
})
