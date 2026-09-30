import { defineComponent } from "./types"

export default defineComponent({
  name: "typography",
  title: "Typography",
  movement: "X",
  contract: "db-prose",
  summary: "Long text, set to be read: it styles plain HTML by element, and punctuation hangs in the margin.",
  underneath: "native",
  props: [
    { name: "asChild", type: "boolean", default: "false", description: "Set the child element instead of rendering an article." },
    { name: "ProseLead", type: "p props", description: "An opening paragraph at the lead size, in ink." },
  ],
})
