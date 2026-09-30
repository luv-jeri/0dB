import { defineComponent } from "./types"

export default defineComponent({
  name: "dropzone",
  title: "Dropzone",
  movement: "VI",
  contract: "db-drop",
  summary: "Files, dropped or chosen. The area is only its corner marks, and files carried over it close them in; the sentence is a real file input, and what you hold is listed as attachments.",
  underneath: "native",
  props: [
    { name: "variant", type: '"corners" | "ghost"', default: '"corners"', description: "corners: the corner marks of \"the silence that heals\" frame the area; pointing sketches them in pencil, files carried over close them in and ink them, focus sets them in the accent. ghost: the same, and the number of files you carry stands huge and faint behind the words, after the poster's ghost numerals; once dropped it stays as the number held, turning over as it changes." },
    { name: "accept", type: "string", description: "The file input's accept, such as .pdf,.png or image/*. A file that doesn't match is listed in crimson and says what the area takes." },
    { name: "maxSize", type: "number", description: "The largest file, in bytes. A larger one is refused with its size and the limit." },
    { name: "multiple", type: "boolean", default: "true", description: "Take several files. Each drop or choice adds to what's held; the same file isn't held twice." },
    { name: "name", type: "string", description: "Submits the files with a form. The real input always holds exactly what's listed, removals included." },
    { name: "prompt", type: "string", default: '"Drop files here"', description: "The start of the sentence; \", or choose\" follows it." },
    { name: "hint", type: "ReactNode", description: "What it takes, in pencil under the sentence. Describes the input." },
    { name: "defaultFiles", type: "File[]", description: "Files held from the start, such as a saved draft's." },
    { name: "onFilesChange", type: "(files: File[]) => void", description: "Called with every file held after each drop, choice or removal." },
    { name: "list", type: "boolean", default: "true", description: "List what's held as attachment rows, each with Remove. Turn it off to list them yourself, with their upload progress." },
    { name: "disabled", type: "boolean", default: "false", description: "The corners and words go pencil and nothing is taken." },
  ],
})
