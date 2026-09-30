import { defineComponent } from "./types"

export default defineComponent({
  name: "calligram",
  title: "Calligram",
  movement: "II",
  contract: "db-calligram",
  summary: "A paragraph that fills a shape, as Apollinaire's calligrams did: each line is as wide as the shape is at that height, so the outline is only implied.",
  underneath: "hook",
  props: [
    { name: "children", type: "string", description: "The paragraph, as plain text: pretext measures it." },
    { name: "shape", type: '"circle" | "fermata" | "wave"', default: '"circle"', description: "The circle is the 0 of 0dB, the fermata is an arc over an accent dot, the wave swells and narrows like a sound wave." },
    { name: "size", type: "string", default: '"34rem"', description: "The shape's diameter as a CSS length. It never grows wider than the space it's in." },
    { name: "fade", type: "boolean", default: "false", description: "Let the colour follow the shape: ink at its centre, pencil at its edge." },
  ],
})
