import { defineComponent } from "./types"

export default defineComponent({
  name: "select",
  title: "Select",
  movement: "VI",
  contract: "db-select",
  summary: "A choice set inside a sentence: the chosen word is yours, italic over a hairline, with a small arrow that drops when you point at it.",
  underneath: "native",
  props: [
    { name: "label", type: "ReactNode", description: "The words before the choice, such as Sort by. They label the select, and clicking them opens it." },
    { name: "children", type: "<option>[]", description: "The choices. A real select underneath, so keyboard, forms and autofill are the browser's own." },
    { name: "value / defaultValue / onChange", type: "native", description: "Every native select prop passes through." },
  ],
})
