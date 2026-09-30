import { defineComponent } from "./types"

export default defineComponent({
  name: "sheet",
  title: "Sheet",
  movement: "IX",
  contract: "db-sheet",
  summary: "A page slid in from the edge, its title running up the spine like a book's; or a row that unfolds into its page.",
  underneath: "native",
  props: [
    { name: "Sheet", type: "Dialog props", description: "The same open, defaultOpen, onOpenChange and alert as Dialog. Built on the native dialog, so focus and Escape are the browser's." },
    { name: "SheetContent side", type: '"start" | "end" | "top" | "bottom"', default: '"end"', description: "Which edge it slides from. Start and end follow the reading direction." },
    { name: "SheetContent variant", type: '"spine" | "shelf" | "rag" | "fold"', default: '"spine"', description: "spine: the title runs up the spine, in its own column. shelf: a sheet opened from inside it stands in front, one spine narrower, so this one's spine stays in view like a book on a shelf; pointing at it, or Escape, puts the front one away. rag: the words stand flush to the window's edge and the paper is cut to the rag of their lines; keep it to a title, a sentence or two and one action. Start and end only. fold: the row that opened it unfolds into the page: its two hairlines part to the window's top and foot, and its name (the row's RowTitle, or the trigger's words) grows into the page's title; the rest arrives once there is room. Put away, it folds back into the row. A reversed row opens from its ink. Open it from `<Row asChild><SheetTrigger>`, one Sheet round the whole Rows (a dialog can't sit in a list); side is ignored." },
    { name: "SheetTrigger", type: "button", description: "Opens the sheet, and remembers itself, so a fold grows out of it. Without one (opened by state alone), a fold parts from a line across the middle." },
    { name: "SheetPanels", type: "div", description: "Pages inside one sheet (spine or shelf). Its spine is the trail: the panel you are in written large up the spine, the ones you came through small in the pencil below it, and they are the way back. Put it in SheetContent in place of SheetSpine." },
    { name: "SheetPanels defaultValue", type: "string", description: "The panel it opens on, the root of the trail. Each opening of the sheet starts there again." },
    { name: "SheetPanels onValueChange", type: "(value: string) => void", description: "Called with the panel you arrive at." },
    { name: "SheetPanel", type: "section", description: "One page, a direct child of SheetPanels, with value and title (its heading and its name on the spine). Only the one you are in is shown; the root's title names the sheet." },
    { name: "SheetPanelLink to", type: "string", description: "Steps into the panel with that value; focus moves to its heading, and going back returns focus here. Bare, a line of type with an arrow; asChild lends the move to your own control." },
    { name: "SheetSpine", type: "p", description: "The sheet's name, running up its spine. Decorative; SheetTitle is the readable heading." },
    { name: "data-autofocus", type: "attribute", description: "Put it on the control that should take focus when the sheet opens." },
  ],
})
