import { defineComponent } from "./types"

export default defineComponent({
  name: "tour",
  title: "Tour",
  movement: "VIII",
  contract: "ot-tour",
  summary: "A tour of callouts: each step an ink callout hung on a leader line that ends in a dot on the thing it is about, one step at a time, only when you press on.",
  underneath: "native",
  props: [
    { name: "Tour", type: "open, defaultOpen, onOpenChange", description: "The same as Dialog. Built on the native dialog, so focus, Escape and the top layer are the browser's." },
    { name: "Tour value / defaultValue / onValueChange", type: "number, (value) => void", default: "1", description: "The step you're on, counted from 1. Uncontrolled, the tour starts again from the first step each time it opens." },
    { name: "TourTrigger", type: "button", description: "Opens the tour. With asChild, your own button." },
    { name: "TourContent", type: "dialog", description: "The window-wide, see-through dialog. Its children are the TourSteps, in order. Next and Back (the arrow keys too, swapped right to left) move a step; Escape or End stops; the last step's Next reads Done and closes. Focus stays on the control that moved it." },
    { name: "TourContent labels", type: "{ back, next, done, end }", default: '"Back", "Next", "Done", "End"', description: "The words on the callout's controls." },
    { name: "TourStep target", type: "string | RefObject<Element>", description: "What the step is about: a selector or a ref. Scrolled into view when it isn't. Left out, the callout stands alone in the middle of the window, with no leader: an opening or a closing word." },
    { name: "TourStep title", type: "ReactNode", description: "The step's name, bold at the head of the callout. It names the dialog." },
    { name: "TourStep children", type: "ReactNode", description: "A sentence or two, phrasing content. It describes the dialog, and Next and Back, so it is read when focus lands." },
  ],
})
