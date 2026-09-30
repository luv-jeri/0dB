import { defineComponent } from "./types"

export default defineComponent({
  name: "note",
  title: "Note",
  movement: "VIII",
  contract: "db-note",
  summary: "Marginalia: a dotted term, and a leader line that draws out to its note; or a gloss set over the word; an abbreviation that opens into its words; or a word struck through and rewritten.",
  underneath: "native",
  props: [
    { name: "children", type: "ReactNode", description: "The term being annotated. It is a button, so the keyboard reaches it." },
    { name: "note", type: "ReactNode", description: "The note itself: a sentence or two of phrasing content. Linked to the term with aria-describedby. Point at the term or focus it and it appears; Escape puts it away." },
    { name: "variant", type: '"leader" | "ossia" | "expand" | "revise"', default: '"leader"', description: "leader: the leader line and the ink pill. ossia: the note (a few words) is always there, small in pencil, in the line space above the term; the term's line opens to hold it, and pointing inks it. It is plain text, read as \"term (note)\". expand: for an abbreviation. children and note are strings; pressing it (Enter or Space) moves its letters apart and each word grows out of its initial, a letter matching the start of a word or a capital inside one (HyperText). Pressing again, or Escape, closes it. It is a span with role=\"button\" and aria-expanded, since a button can't break across lines. If the letters can't be found in order, it falls back to leader. revise: the editor's correction. children is the word or phrase in the text, note is what replaces it (a word or a short phrase; it doesn't break). Pointing sketches a strike in pencil; pressing (Enter or Space) strikes it in ink and writes the replacement in after it, in the italic. Pressing again, or Escape, lifts both. A span with role=\"button\" and aria-expanded; a screen reader hears the change as a deletion and an insertion." },
  ],
})
