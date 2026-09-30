import { defineComponent } from "./types"

export default defineComponent({
  name: "gather",
  title: "Gather",
  movement: "II",
  contract: "db-gather",
  summary: "A line whose letters start as dust and settle into place as it scrolls into view, then give way to the real text.",
  underneath: "hook",
  props: [
    { name: "children", type: "string", description: "The line, as plain text: pretext measures where each letter belongs." },
    { name: "as", type: '"h2" | "h3" | "p"', default: '"p"', description: "The element. Pass a dynamic class such as db-f or db-mf for the size." },
  ],
})
