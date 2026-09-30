import { defineComponent } from "./types"

export default defineComponent({
  name: "empty",
  title: "Empty",
  movement: "VII",
  contract: "db-empty",
  summary: "An invitation to act, not an apology: what is missing, and the one thing to do about it.",
  underneath: "native",
  uses: ["button"],
  props: [
    { name: "Empty", type: "div", description: "The root. Stacks its parts and lifts the zero when you reach for the action." },
    { name: "EmptyFigure", type: "p", default: '"0"', description: "A zero cropped to its top half, which is a fermata's arc. Decorative, so it is hidden from assistive technology. Pass children to change the figure." },
    { name: "EmptyTitle", type: "p", description: "Says what is missing, in a short sentence." },
    { name: "EmptyDescription", type: "p", description: "One or two lines on what to do next. Plain direction." },
    { name: "EmptyActions", type: "div", description: "Holds the action, set as a Button." },
  ],
})
