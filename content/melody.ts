import { defineComponent } from "./types"

export default defineComponent({
  name: "melody",
  title: "Melody",
  movement: "II",
  contract: "db-melody",
  summary: "A sentence set on a stave, each word a note. Point at one and the phrase plays from it.",
  underneath: "hook",
  props: [
    { name: "children", type: "string", description: "The sentence, as plain text: pretext measures each word." },
    { name: "contour", type: "number[]", default: "from the words", description: "The staff step of each word. 0 is the bottom line, 2 the next, 8 the top, and odd numbers the spaces between. By default the sentence writes its own tune from its word lengths." },
  ],
})
