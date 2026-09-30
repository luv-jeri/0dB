import { defineComponent } from "./types"

export default defineComponent({
  name: "radio-group",
  title: "Radio group",
  movement: "VI",
  contract: "db-choice",
  summary: "Words in a row. The one you choose turns italic, because it's yours now, and one dot glides beneath it, stretching as it travels.",
  underneath: "native",
  props: [
    { name: "name", type: "string", description: "Shared by every radio so a form submits the choice. Generated if left out." },
    { name: "legend", type: "ReactNode", description: "The small label over the words. Without one, give the group an aria-label." },
    { name: "value / defaultValue", type: "string", description: "The chosen item's value." },
    { name: "onValueChange", type: "(value: string) => void", description: "Called with the new value when the choice changes." },
    { name: "RadioGroupItem value", type: "string", description: "What this word stands for." },
    { name: "RadioGroupItem children", type: "string", description: "The word. Plain text, because the italic copy is drawn from it." },
    { name: "RadioGroupItem disabled", type: "boolean", default: "false", description: "The word steps back and can't be chosen." },
  ],
})
