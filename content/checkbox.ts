import { defineComponent } from "./types"

export default defineComponent({
  name: "checkbox",
  title: "Checkbox",
  movement: "VI",
  contract: "db-check",
  summary: "No box. The words are the control, and checking strikes them through in the accent.",
  underneath: "native",
  props: [
    { name: "children", type: "ReactNode", description: "The words. They are the control." },
    { name: "checked / defaultChecked / onChange", type: "native", description: "A real checkbox underneath, so every native prop works." },
    { name: "CheckboxGroup legend", type: "ReactNode", description: "The small label over the list." },
    { name: "CheckboxGroup tally", type: "boolean", default: "false", description: "Show how many are done, as a fraction whose count rolls the way it moves." },
    { name: "CheckboxGroup done", type: "(count, total) => ReactNode", description: "What the tally says after the fraction." },
  ],
})
