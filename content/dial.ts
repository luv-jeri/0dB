import { defineComponent } from "./types"

export default defineComponent({
  name: "dial",
  title: "Dial",
  movement: "VI",
  contract: "db-dial",
  summary: "A radio for numbers, set on an arc. The whole dial rolls to what you choose: the number swells and turns italic, and the dot travels the arc.",
  underneath: "native",
  props: [
    { name: "name", type: "string", description: "Shared by every radio, so a form submits the choice." },
    { name: "legend", type: "ReactNode", description: "The question, as a small label over the dial." },
    { name: "options", type: "(string | number | { value, label? })[]", description: "Up to nine choices, laid out on the arc in order." },
    { name: "defaultValue", type: "string | number", description: "The choice to start on. Leave it out to start with none chosen." },
    { name: "unit", type: "string", description: "Small words under the arc, such as weeks." },
  ],
})
