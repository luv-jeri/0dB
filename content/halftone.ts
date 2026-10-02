import { defineComponent } from "./types"

export default defineComponent({
  name: "halftone",
  title: "Halftone",
  movement: "II",
  contract: "db-halftone",
  summary: "Evidence arriving. An image set in measured letters gives way, row by row, to the artifact itself.",
  underneath: "hook",
  props: [
    { name: "src", type: "string", description: "The real image. Same-origin or CORS-enabled images can be sampled; otherwise the image stays visible." },
    { name: "alt", type: "string", description: "The artifact's description. The real image stays in the DOM; measured letters are hidden from assistive technology." },
    { name: "word", type: "string", description: "Restrict the glyph alphabet to these characters, for an image made of its project's own name." },
    { name: "cols", type: "number", default: "64", description: "Grid columns, bounded to 8–120. Proportional glyphs are selected by brightness and Pretext width across voice weights 400–800 and the expression italic." },
    { name: "resolve", type: '"scroll" | "load" | "none"', default: '"scroll"', description: "Scroll follows the reading plane in either direction. Load resolves once over adagio; none holds the type image. Reduced motion and forced colours show the real image directly." },
  ],
})
