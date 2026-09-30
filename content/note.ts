import { defineComponent } from "./types"

export default defineComponent({
  name: "note",
  title: "Note",
  movement: "VIII",
  contract: "db-note",
  summary: "Marginalia: a dotted term, and a leader line that draws out to its note.",
  underneath: "native",
  props: [
    { name: "children", type: "ReactNode", description: "The term being annotated. It is a button, so the keyboard reaches it." },
    { name: "note", type: "ReactNode", description: "The note itself: a sentence or two of phrasing content. Linked to the term with aria-describedby. Point at the term or focus it and it appears; Escape puts it away." },
  ],
})
