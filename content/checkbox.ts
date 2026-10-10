import { defineComponent } from "./types"

export default defineComponent({
  name: "checkbox",
  title: "Checkbox",
  movement: "VI",
  contract: "ot-check",
  summary: "No box. The words are the control, and checking strikes them through in the accent.",
  underneath: "native",
  props: [
    { name: "children", type: "ReactNode", description: "The words. They are the control." },
    { name: "variant", type: '"strike" | "stet" | "circled"', default: '"strike"', description: "How checking marks the words. strike: for things done; pointing pencils a hairline through them, checking inks an accent strike that overshoots both ends, and the words step back to pencil. stet: for things kept; the proofreader's \"let it stand\", a row of dots pencilled under the words on pointing and set down in the accent on checking, while the words turn italic. circled: for things chosen; one pen loop drawn round the words, in pencil on pointing and in the accent on checking, running on past where it began, and the words turn italic." },
    { name: "checked / defaultChecked / onChange", type: "native", description: "A real checkbox underneath, so every native prop works." },
    { name: "CheckboxGroup legend", type: "ReactNode", description: "The small label over the list." },
    { name: "CheckboxGroup tally", type: "boolean", default: "false", description: "Show how many are done, as a <Fraction>: each figure that changes turns over on its own wheel, the way the count went." },
    { name: "CheckboxGroup done", type: "(count, total) => ReactNode", description: "What the tally says after the fraction." },
    { name: "labelClassName", type: "string", description: "Classes for the visible label wrapper. className goes to the native checkbox." },
  ],
})
