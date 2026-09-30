import { defineComponent } from "./types"

export default defineComponent({
  name: "switch",
  title: "Switch",
  movement: "VI",
  contract: "db-switch",
  summary: "A sentence whose last word you can change. The state rolls between on and off in italic, and the full stop answers: a dot when on, a ring when off.",
  underneath: "native",
  props: [
    { name: "children", type: "ReactNode", description: "The sentence, up to its last word: \"Email me when someone replies:\". For question, the whole sentence without its last mark." },
    { name: "variant", type: '"sentence" | "either" | "question"', default: '"sentence"', description: "How the sentence says its state. sentence: the last word rolls between on and off in italic, and the full stop is a dot when on and a ring when off. either: both words stand, \"on / off\", as a printed form offers them; the one that doesn't apply is struck out and steps back to pencil, and switching lifts the strike off one and draws it through the other. question: off, the sentence asks, ending on a pencil question mark; on, the hook is wiped away down to its dot, which stays as the full stop, and the sentence inks." },
    { name: "checked / defaultChecked", type: "boolean", description: "Whether it's on." },
    { name: "onCheckedChange", type: "(checked: boolean) => void", description: "Called with the new state." },
    { name: "on", type: "string", default: "\"on\"", description: "The word for on, in italic." },
    { name: "off", type: "string", default: "\"off\"", description: "The word for off." },
  ],
})
