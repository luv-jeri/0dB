import { defineComponent } from "./types"

export default defineComponent({
  name: "input-group",
  title: "Input group",
  movement: "VI",
  contract: "db-input-group",
  summary: "Ours in roman, yours in italic, on one line. The accent draws only under the part you type.",
  underneath: "native",
  props: [
    { name: "InputGroupText", type: "ReactNode", description: "What we supply, a prefix or a suffix, upright in pencil." },
    { name: "InputGroupInput", type: "native", description: "What you type, in italic. A real input; it takes a surrounding Field's id, hint and error." },
    { name: "InputGroupButton", type: "Button props", default: 'variant="quiet"', description: "An action at the end of the line." },
  ],
})
