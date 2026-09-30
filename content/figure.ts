import { defineComponent } from "./types"

export default defineComponent({
  name: "figure",
  title: "Figure",
  movement: "IX",
  contract: "db-figure",
  summary: "A picture cropped to a ratio and marked like a printer's proof, its number, caption and credit set in type underneath or in the margin beside it.",
  underneath: "native",
  props: [
    { name: "src", type: "string", description: "The picture. A real <img>, lazily loaded; srcSet and sizes pass through." },
    { name: "alt", type: "string", description: "What the picture shows. Read aloud, and if the picture can't be loaded, set in the frame in its place, inside the trim marks." },
    { name: "variant", type: '"plate" | "margin"', default: '"plate"', description: "plate: the caption row under the picture, the number first, the credit spread to the far end on the same baseline. margin: a side caption, standing in the margin columns beside the picture (3 of 12), the number at the head level with its top and the caption and credit at the foot level with its foot; where the two can't stand side by side the caption falls under the picture." },
    { name: "ratio", type: "number", default: "3 / 2", description: "The crop, width over height; 3 : 2 is the 35mm negative. Change it and the frame eases to the new ratio, the picture recropping inside it." },
    { name: "position", type: "string", default: '"50% 50%"', description: "Where the crop holds the picture, as CSS object-position, so the subject stays in the frame at every ratio." },
    { name: "number", type: "ReactNode", description: "The figure's number, set as data before the caption (01). Read as \"Figure 01\"." },
    { name: "caption", type: "ReactNode", description: "What the picture is, in the voice." },
    { name: "credit", type: "ReactNode", description: "Who made it, in the pencil, at the far end of the caption row." },
  ],
})
