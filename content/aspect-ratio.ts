import { defineComponent } from "./types"

export default defineComponent({
  name: "aspect-ratio",
  title: "Aspect ratio",
  movement: "IX",
  contract: "db-ratio",
  summary: "A frame kept to a ratio and marked the way a printer marks a crop: short lines outside each corner, never a border.",
  underneath: "native",
  props: [
    { name: "variant", type: '"crop" | "diagonal" | "square"', default: '"crop"', description: "crop: only the printer's trim marks outside the corners. diagonal: the paste-up artist's scaling line, from the foot of the start edge to the head of the end edge, with the ratio written along it, standing on it; every frame whose corner lies on that line has the same ratio, and as the ratio changes the line and the words swing together. square: the largest square is ruled off from the start, or from the head when the frame stands tall, and what's left is named by its own ratio in the pencil (16 : 9 leaves 7 : 9); the rule glides as the ratio eases, and at 1 : 1 there is nothing left." },
    { name: "ratio", type: "number", default: "16 / 9", description: "Width over height. Change it and the frame eases to the new ratio." },
    { name: "label", type: "true | ReactNode", description: "true sets the ratio in the middle as a fraction, which rolls when the ratio changes. Any other node is shown as given." },
  ],
})
