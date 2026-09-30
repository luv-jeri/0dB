import { defineComponent } from "./types"

export default defineComponent({
  name: "source",
  title: "Source",
  movement: "X",
  contract: "db-source",
  summary: "Code, set as type: what someone wrote is italic, keywords are ink, and nothing else takes colour.",
  underneath: "hook",
  props: [
    { name: "code", type: "string", description: "The source to show. Highlighted with sugar-high, about one kilobyte." },
    { name: "title", type: "ReactNode", description: "The file's name, in the frame row." },
    { name: "noCopy", type: "boolean", default: "false", description: "Hide the Copy action." },
  ],
})
