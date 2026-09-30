import { defineComponent } from "./types"

export default defineComponent({
  name: "measure",
  title: "Measure",
  movement: "II",
  contract: "db-measure",
  summary: "A paragraph whose measure you set by dragging its right edge, with the number of characters a line and a verdict on it.",
  underneath: "hook",
  props: [
    { name: "children", type: "string", description: "The paragraph, as plain text: pretext lays its lines again on every move." },
    { name: "defaultMeasure", type: "number", default: "62", description: "Characters a line, to begin with." },
    { name: "min", type: "number", default: "20", description: "The shortest measure the handle allows, in characters." },
    { name: "max", type: "number", default: "110", description: "The longest measure the handle allows, in characters. The page's own width may stop it sooner." },
  ],
})
