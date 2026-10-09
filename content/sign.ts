import { defineComponent } from "./types"

export default defineComponent({
  name: "sign",
  title: "Sign",
  movement: "II",
  contract: "db-sign",
  summary: "An icon made of its own word with Pretext: ruled in middle-dot leaders, laid along its strokes, or filling its silhouette row by row. Pointed at, it says itself.",
  underneath: "hook",
  props: [
    { name: "shape", type: "SignShape", description: "The drawing and its word. Each sign item passes its own; you only pass one to make a sign of your own." },
    { name: "variant", type: '"dots" | "words" | "fill"', default: '"words"', description: "dots rules the strokes in middle-dot leaders at every size. words lays the word along the strokes from 40px up and draws the dots below, where letters would not read. fill sets the word in rows across the drawing's silhouette, as the calligram does. Each sign item fixes its own." },
    { name: "size", type: "number | string", default: "24", description: "The side of the square, in pixels or as a CSS length." },
    { name: "face", type: '"roman" | "italic"', default: '"roman"', description: "roman for what the interface offers; italic for what belongs to the person: their mail, their home." },
    { name: "label", type: "string", description: "What a reader hears. Defaults to the word. Pass an empty string when the sign sits beside text that already says it." },
  ],
})
