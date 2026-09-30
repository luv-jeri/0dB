import { defineComponent } from "./types"

export default defineComponent({
  name: "slider",
  title: "Slider",
  movement: "VI",
  contract: "db-ruler",
  summary: "A ruler with a hand. The value is drawn as a dimension: a line from zero to the hand, with your number, in italic, in the gap.",
  underneath: "hook",
  props: [
    { name: "label", type: "ReactNode", description: "What is being measured. It labels the range." },
    { name: "min / max / step", type: "number", default: "0 / 100 / 1", description: "The range. Ticks fall every 5%, labelled every 25%." },
    { name: "value / defaultValue", type: "number", description: "The current value." },
    { name: "onValueChange", type: "(value: number) => void", description: "Called with the new value as the hand moves." },
    { name: "unit", type: "string", description: "Set after the number as written: \" kg\" with its space, \"%\" without." },
    { name: "disabled", type: "boolean", default: "false", description: "The ruler fades and the hand stays put." },
  ],
})
