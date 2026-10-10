import { defineComponent } from "./types"

export default defineComponent({
  name: "meta",
  title: "Meta",
  movement: "IV",
  contract: "ot-meta",
  summary: "A frame row: small words held apart by hairlines that stretch to fill the row.",
  underneath: "native",
  props: [
    { name: "children", type: "ReactNode", description: "The words. A hairline goes between each child. The row never wraps: where the words don't fit, each stacks in its own place." },
    { name: "variant", type: '"proportional" | "credits"', description: "proportional makes each hairline as long as the interval between its neighbours in at, as the score's space notation makes distance time. credits drops the hairlines for one rule over small labelled columns: give it MetaItems." },
    { name: "at", type: "number[]", description: "For proportional: where each child stands (a year, a minute), one number per child." },
    { name: "MetaItem label", type: "ReactNode", description: "The small pencil label set over the item's value, in credits." },
  ],
})
