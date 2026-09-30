import { defineComponent } from "./types"

export default defineComponent({
  name: "word-relay",
  title: "Word relay",
  movement: "VI",
  contract: "db-relay",
  summary: "A sentence whose last word is yours to change: press it and the word rolls on to the next, in the italic, and the line follows it.",
  underneath: "native",
  props: [
    { name: "children", type: "ReactNode", description: "The sentence up to the word that changes, ours, in the roman." },
    { name: "words", type: "string[]", description: "The words it can end on, in order, each with its own punctuation (\"design.\"). Pressing goes round them; the last wraps to the first." },
    { name: "index", type: "number", description: "The chosen word's place, when you hold it (controlled)." },
    { name: "defaultIndex", type: "number", default: "0", description: "The word to start on, when the relay holds it." },
    { name: "onIndexChange", type: "(index: number) => void", description: "Called with the place of the word the person moved to." },
    { name: "variant", type: '"sentence" | "statement"', default: '"sentence"', description: "sentence: after mode-toggle's sentence; the word stands in the italic on a hairline that hugs it at the end of the line. statement: after \"It has to be design.\"; the sentence heavy and narrow in ink, and the word half again as large under it, in the italic and the accent, rising into the line above with a halo of the paper so it cuts the roman where they cross." },
    { name: "--db-relay-ground", type: "CSS colour", default: "var(--db-paper)", description: "The halo round the statement's word, if it sits on something other than the paper." },
  ],
})
