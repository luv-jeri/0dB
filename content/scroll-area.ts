import { defineComponent } from "./types"

export default defineComponent({
  name: "scroll-area",
  title: "Scroll area",
  movement: "IX",
  contract: "db-scroll",
  summary: "A rule appears at an edge only while there's more beyond it, and leaves when you reach the end.",
  underneath: "native",
  props: [
    { name: "aria-label", type: "string", description: "Names what the box holds. It takes focus so the keyboard can scroll it, and a name makes it a region." },
    { name: "className", type: "string", description: "Give the box a height or max-height; it scrolls when its content is taller." },
  ],
})
