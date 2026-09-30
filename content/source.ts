import { defineComponent } from "./types"

export default defineComponent({
  name: "source",
  title: "Source",
  movement: "X",
  contract: "db-source",
  summary: "Code, set as type. Weight is the only highlighting, what someone wrote is italic, and a bracket joins the lines like a system in a score.",
  underneath: "hook",
  props: [
    { name: "code", type: "string", description: "The source to show. Highlighted with sugar-high, about one kilobyte." },
    { name: "title", type: "ReactNode", description: "The file's name. Wide, it stands in the margin; narrow, above the lines." },
    { name: "noCopy", type: "boolean", default: "false", description: "Hide the Copy action." },
    { name: "CopyButton text", type: "string", description: "What Copy puts on the clipboard. A quiet button that rolls to Copied and back." },
    { name: "CopyButton onCopied", type: "() => void", description: "Called once the text is on the clipboard." },
  ],
})
