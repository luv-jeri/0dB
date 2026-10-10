import { defineComponent } from "./types"

export default defineComponent({
  name: "alert",
  title: "Alert",
  movement: "VII",
  contract: "ot-alert",
  summary: "A double bar: in a score, the sign that something changes here.",
  underneath: "native",
  uses: ["button"],
  props: [
    { name: "variant", type: '"default" | "error" | "cue" | "errata"', default: '"default"', description: "Default: the double bar, role=status, said when the reader is next free. error: the final bar (thin, then thick) in the signal colour, role=alert, said at once; use it for what failed and say what to fix. cue: a hairline arrow runs in from the margin and stops at the first word, for a notice that stands across a page. errata: a correction, set with AlertCorrection as the printer's slip, for one fact that changed." },
    { name: "arriving", type: "boolean", default: "false", description: "Draw the sign (the bar, or the cue's arrow; errata writes in the new word) and bring the lines in one by one. Set it when the alert appears because of something the person did." },
    { name: "AlertTitle", type: "p", description: "The headline, in a full sentence." },
    { name: "AlertDescription", type: "p", description: "One or two lines of detail." },
    { name: "AlertCorrection", type: "{ was: ReactNode; now: ReactNode }", description: "Errata only. \"for was read now\": the two in large italic, the old one stepped back to pencil, the small upright words between. Marked del and ins, so a screen reader hears the change." },
    { name: "AlertActions", type: "div", description: "A row for the next step, set as Buttons." },
  ],
})
