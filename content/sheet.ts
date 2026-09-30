import { defineComponent } from "./types"

export default defineComponent({
  name: "sheet",
  title: "Sheet",
  movement: "IX",
  contract: "db-sheet",
  summary: "A page slid in from the edge, its title running up the spine like a book's.",
  underneath: "native",
  props: [
    { name: "Sheet", type: "Dialog props", description: "The same open, defaultOpen, onOpenChange and alert as Dialog. Built on the native dialog, so focus and Escape are the browser's." },
    { name: "SheetContent side", type: '"start" | "end" | "top" | "bottom"', default: '"end"', description: "Which edge it slides from. Start and end follow the reading direction." },
    { name: "SheetSpine", type: "p", description: "The sheet's name, running up its spine. Decorative; SheetTitle is the readable heading." },
    { name: "data-autofocus", type: "attribute", description: "Put it on the control that should take focus when the sheet opens." },
  ],
})
