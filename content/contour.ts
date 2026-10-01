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
    { name: "shape", type: '"diminuendo" | "crescendo" | "hairpin"', default: '"diminuendo"', description: "Diminuendo narrows to the end, crescendo opens towards it, hairpin swells and closes, centred. For tale it shapes the size of the type instead of the width; cola ignores it." },
    { name: "least", type: "number", default: "0.3", description: "The narrowest a line may be, as a share of the measure. For tale, the smallest size, as a share of the inherited size (never under 10px)." },
    { name: "variant", type: '"edge" | "tale" | "cola"', default: '"edge"', description: "edge: each line but the last is spread to its width, so the contour's edge is a straight line. tale: the Mouse's Tale; each line holds half the measure in its own size, so the tail narrows as the type shrinks, and it winds down the page on a slow wave that the hand across it moves along. cola: a line to each phrase (broken after a comma, colon, full stop or dash), as texts were set to be read aloud; a phrase too long turns over, hung in, and pointing at one keeps it in ink while the rest rest in pencil." },
    { name: "fade", type: "boolean", default: "false", description: "Let the colour follow the shape: ink where it's loud, pencil where it's quiet." },
  ],
})
