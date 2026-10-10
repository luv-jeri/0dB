import { defineComponent } from "./types"

export default defineComponent({
  name: "empty",
  title: "Empty",
  movement: "VII",
  contract: "ot-empty",
  summary: "An invitation to act, not an apology: what is missing, and the one thing to do about it. Under half a zero, under the score's tacet, or on a page left blank on purpose.",
  underneath: "native",
  uses: ["button"],
  props: [
    { name: "Empty", type: "div", description: "The root. Stacks its parts; the figure answers when you reach for the action." },
    { name: "variant", type: '"arc" | "tacet" | "blank"', default: '"arc"', description: "arc: a zero cropped to its top half, which lifts as you reach for the action. tacet: the word a score prints on a part with nothing to play, set large in the italic; reaching for the action is your entry, so it dies away. blank: the page left blank on purpose; the title, the direction and the action spread to its corners, and one small line stands in the middle of the silence, loosening as you reach for the action." },
    { name: "EmptyFigure", type: "p", default: '"0"', description: "Decorative, so it is hidden from assistive technology. In arc, a number cropped to its top half. In tacet, pass the term: Tacet. In blank, pass the small line for the middle of the page, such as This space is left blank on purpose." },
    { name: "EmptyTitle", type: "p", description: "Says what is missing, in a short sentence." },
    { name: "EmptyDescription", type: "p", description: "One or two lines on what to do next. Plain direction." },
    { name: "EmptyActions", type: "div", description: "Holds the action, set as a Button." },
  ],
})
