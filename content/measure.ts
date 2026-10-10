import { defineComponent } from "./types"

export default defineComponent({
  name: "measure",
  title: "Measure",
  movement: "II",
  contract: "ot-measure",
  summary: "A paragraph whose measure you set by dragging its right edge, with the number of characters a line and a verdict on it.",
  underneath: "hook",
  props: [
    { name: "children", type: "string", description: "The paragraph, as plain text: pretext lays its lines again on every move." },
    { name: "defaultMeasure", type: "number", default: "62", description: "Characters a line, to begin with." },
    { name: "min", type: "number", default: "20", description: "The shortest measure the handle allows, in characters." },
    { name: "max", type: "number", default: "110", description: "The longest measure the handle allows, in characters. The page's own width may stop it sooner." },
    { name: "variant", type: '"track" | "alphabets" | "columns"', default: '"track"', description: "track: the handle rides a hairline with the comfortable range in the accent, its ends marked 45 and 75. alphabets, after a type specimen's alphabet length: the track is a ruler of lowercase alphabets in the paragraph's own face, graphite inside the measure and a rule's grey beyond, the letter the edge cuts in the accent, and the measure is read in alphabets (2½ alphabets a line). columns, after the narrow ragged columns of the posters: the paragraph takes as many columns of the measure as its space holds, two ems apart, so narrowing the line brings another column in, and the verdict says how many." },
  ],
})
