import { defineComponent } from "./types"

export default defineComponent({
  name: "switch",
  title: "Switch",
  movement: "VI",
  contract: "db-switch",
  summary: "A sentence whose last word you can change. The state rolls between on and off in italic, and the full stop answers: a dot when on, a ring when off.",
  underneath: "native",
  props: [
    { name: "children", type: "ReactNode", description: "The sentence, up to its last word: \"Email me when someone replies:\"." },
    { name: "checked / defaultChecked", type: "boolean", description: "Whether it's on." },
    { name: "onCheckedChange", type: "(checked: boolean) => void", description: "Called with the new state." },
    { name: "on", type: "string", default: "\"on\"", description: "The word for on, in italic." },
    { name: "off", type: "string", default: "\"off\"", description: "The word for off." },
  ],
})
