import { defineComponent } from "./types"

export default defineComponent({
  name: "progress",
  title: "Progress",
  movement: "VII",
  contract: "db-progress",
  summary: "How far something you started has got: a hairline and an italic percentage, the words themselves inking in, one ring per item, a pair of parentheses closing on the words, or a tally. Done, a full stop lands.",
  underneath: "native",
  props: [
    { name: "variant", type: '"hairline" | "sentence" | "count" | "parentheses" | "tally"', default: '"hairline"', description: "Hairline is a line that fills toward a ring while an italic percentage ticks up. Sentence is the label itself, inking in word by word in reading order. Count is a fraction of items and one ring per item, for things you can count (files, messages). Parentheses sets the label between two thin parentheses at the ends of the measure: the work still to do is the silence inside them, and they close on the words as it goes. Tally is a fraction and one stroke per item, gated in fives the way a hand counts." },
    { name: "value", type: "number | null", description: "How much is done, out of max. Leave it out (or pass null) while nobody knows yet: the bar is indeterminate and a stroke reads along it." },
    { name: "max", type: "number", default: "100", description: "The total. The hairline shows value as a percentage of it; a count shows one ring per item and a tally one stroke per item, up to 100." },
    { name: "label", type: "ReactNode", description: "What is being done, without a full stop, and keeping the action's name: Uploading 12 files, then Uploaded 12 files. It names the bar through a native label; without it the bar is named Progress." },
  ],
})
