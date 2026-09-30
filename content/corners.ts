import { defineComponent } from "./types"

export default defineComponent({
  name: "corners",
  title: "Corners",
  movement: "IV",
  contract: "db-corners",
  summary: "Four corner marks: a frame that doesn't close.",
  underneath: "native",
  props: [
    { name: "asChild", type: "boolean", default: "false", description: "Put the corners on the child element instead of a new div." },
    { name: "--db-corner", type: "CSS length", default: "8px", description: "The length of each mark." },
    { name: "--db-corner-inset", type: "CSS length", default: "0", description: "How far the marks sit inside the edge." },
    { name: "--db-corner-colour", type: "CSS colour", default: "var(--db-ink)", description: "The marks' colour." },
  ],
})
