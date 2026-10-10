import { defineComponent } from "./types"

export default defineComponent({
  name: "scroll-expand",
  title: "Scroll expand",
  movement: "IV",
  contract: "ot-expand",
  summary: "A plate cropped by four corner marks that open with the scroll, from a small mark to the full measure, and stop when you stop.",
  underneath: "hook",
  props: [
    { name: "children", type: "ReactNode", description: "What the plate holds. It is all in the flow and read from the start; only the view of it is cropped." },
    { name: "caption", type: "ReactNode | ReactNode[]", description: "The words of the meta row under the plate, held apart by hairlines. The row is as wide as the crop, so its hairlines draw out as it opens; the share of the measure reached (0.42) closes it, in pencil." },
    { name: "variant", type: '"mark" | "horizon"', default: '"mark"', description: "mark: the crop opens from a small square in the middle to the whole plate, its corner marks a step outside it like a printer's crop marks. horizon: after Eclipse; the crop starts as a hairline across the whole measure and opens up and down from it, the line fading as it goes." },
    { name: "progress", type: "number", description: "Pins how far it has opened, 0 to 1, instead of following the scroll." },
    { name: "--ot-expand-mark", type: "CSS length", default: "var(--ot-space-8)", description: "The size of the mark it opens from." },
  ],
})
