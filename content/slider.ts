import { defineComponent } from "./types"

export default defineComponent({
  name: "slider",
  title: "Slider",
  movement: "VI",
  contract: "ot-ruler",
  summary: "A ruler with a hand. The value is drawn as a dimension from zero with your number in italic in the gap, or runs through the label's spread letters, or makes the label as loud as the value.",
  underneath: "hook",
  props: [
    { name: "label", type: "ReactNode", description: "What is being measured. It labels the range. spread and dynamics draw it, so pass a string there." },
    { name: "variant", type: '"dimension" | "spread" | "dynamics"', default: '"dimension"', description: "How the value is drawn. dimension: a dimension line from zero to the hand with your number in its gap, and past the far tick when the gap is too short for it. spread: the label's letters, in capitals, are the ruler's marks, spread across its length; the hand inks every letter it passes, splitting the one it stands in, and your number waits in the far corner. dynamics: the label is as loud as the value, its weight and width following the hand, over a scale from pp to ff whose nearest marking inks." },
    { name: "min / max / step", type: "number", default: "0 / 100 / 1", description: "The range. Ticks fall every 5%, labelled every 25%." },
    { name: "value / defaultValue", type: "number", description: "The current value." },
    { name: "onValueChange", type: "(value: number) => void", description: "Called with the new value as the hand moves." },
    { name: "unit", type: "string", description: "Set after the number as written: \" kg\" with its space, \"%\" without." },
    { name: "disabled", type: "boolean", default: "false", description: "The ruler fades and the hand stays put." },
    { name: "className", type: "string", description: "Classes for the ruler's outer div; the input props apply to the native range inside it." },
  ],
})
