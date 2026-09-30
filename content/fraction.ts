import { defineComponent } from "./types"

export default defineComponent({
  name: "fraction",
  title: "Fraction",
  movement: "II",
  contract: "db-fraction",
  summary: "A count set as a display fraction with a leaning hairline. The part that's yours is italic.",
  underneath: "native",
  props: [
    { name: "count", type: "ReactNode", description: "The part that's yours, in italic." },
    { name: "total", type: "ReactNode", description: "What it counts toward." },
  ],
})
