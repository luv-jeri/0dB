import { defineComponent } from "./types"

export default defineComponent({
  name: "melody",
  title: "Melody",
  movement: "II",
  contract: "ot-melody",
  summary: "A sentence set on a stave, each word a note. Point at one and the phrase plays from it; or sing along discs on the staff; or draw the staff only where there are words.",
  underneath: "hook",
  props: [
    { name: "children", type: "string", description: "The sentence, as plain text: pretext measures each word." },
    { name: "contour", type: "number[]", default: "from the words", description: "The staff step of each word. 0 is the bottom line, 2 the next, 8 the top, and odd numbers the spaces between. By default the sentence writes its own tune from its word lengths." },
    { name: "variant", type: '"stave" | "noteheads" | "cutaway"', default: '"stave"', description: "stave: each word is a note, its baseline on its step, under slurs. noteheads, after the calendar poster's discs: the tune is a disc on the staff for each word (a staff space across, no stems), and the words are sung under it on one lyric line. Point at a word or its disc, or step with the arrows, and the discs fill in turn: sung in ink, the one you're at in the accent, the rest still rings; Enter sings it through, Escape lets it go. cutaway, after the cutaway score: the five lines are drawn only under the words, so the silences between them are paper, and the slurs carry across." },
  ],
})
