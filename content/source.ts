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
    { name: "variant", type: '"system" | "gloss" | "passage"', default: '"system"', description: "system: a bracket joins every line. gloss: a line that is only a comment becomes a note; when the frame is 46rem or wider it leaves the code for the outer margin and stands level with the line it explains, notes queue rather than overlap, and pointing at either inks the other. passage: the bracket gathers to the lines named in passage and inks; the rest recede to pencil." },
    { name: "passage", type: "[number, number]", description: "passage: the first and last line to mark, counted from 1." },
    { name: "wrap", type: "boolean", default: "true", description: "Turn long lines over, hanging a step in, like verse. false keeps every line whole: it runs on past the frame's end and the lines scroll sideways, while the numbers and the bracket keep their place; the lines take focus so the arrow keys scroll them." },
    { name: "language", type: "string", description: "The language, named in the margin under the file's name in the pencil's small capitals, the way a score marks its key. Shown only when given." },
  ],
})
