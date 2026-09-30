import { defineComponent } from "./types"

export default defineComponent({
  name: "attachment",
  title: "Attachment",
  movement: "XI",
  contract: "db-attach",
  summary: "A file's extension is its picture; a ring counts it in and fills to a dot when it's safe.",
  underneath: "native",
  props: [
    { name: "name", type: "string", description: "The file name. Its extension is set wide and thin as the picture." },
    { name: "size", type: "string", description: "The size as it should read, in tabular figures, such as 2.4 MB." },
    { name: "status", type: "string", description: "Says what is happening or what went wrong in place of the size." },
    { name: "state", type: '"idle" | "uploading" | "processing" | "done" | "error"', default: '"done"', description: "The ring's state: it turns while processing, fills to a dot when done, and turns crimson on error." },
    { name: "progress", type: "number", description: "How far an upload has got, 0 to 1." },
    { name: "onRemove", type: "() => void", description: "Shows a bracket Remove button labelled with the file's name." },
    { name: "AttachmentList", type: "ul props", description: "The list the files sit in." },
  ],
})
