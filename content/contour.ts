import { defineComponent } from "./types"

export default defineComponent({
  name: "contour",
  title: "Contour",
  movement: "II",
  contract: "db-contour",
  summary: "A paragraph set to a contour, the way a score draws a swell: each line laid to its own width, so the words taper, open or swell and close.",
  underneath: "hook",
  props: [
    { name: "children", type: "string", description: "The paragraph, as plain text: pretext measures it." },
    { name: "shape", type: '"diminuendo" | "crescendo" | "hairpin"', default: '"diminuendo"', description: "Diminuendo narrows to the end, crescendo opens towards it, hairpin swells and closes, centred." },
    { name: "least", type: "number", default: "0.3", description: "The narrowest a line may be, as a share of the measure." },
    { name: "fade", type: "boolean", default: "false", description: "Let the colour follow the shape: ink where it's loud, pencil where it's quiet." },
  ],
})
