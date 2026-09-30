import { defineComponent } from "./types"

export default defineComponent({
  name: "aspect-ratio",
  title: "Aspect ratio",
  movement: "IX",
  contract: "db-ratio",
  summary: "A frame kept to a ratio and marked the way a printer marks a crop: short lines outside each corner, never a border.",
  underneath: "native",
  props: [
    { name: "ratio", type: "number", default: "16 / 9", description: "Width over height. Change it and the frame eases to the new ratio." },
    { name: "label", type: "true | ReactNode", description: "true sets the ratio in the middle as a fraction, which rolls when the ratio changes. Any other node is shown as given." },
  ],
})
