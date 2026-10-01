import { defineComponent } from "./types"

export default defineComponent({
  name: "scroll-area",
  title: "Scroll area",
  movement: "IX",
  contract: "db-scroll",
  summary: "A rule appears at an edge only while there's more beyond it, and leaves when you reach the end.",
  underneath: "native",
  props: [
    { name: "aria-label", type: "string", description: "Names what the box holds. It takes focus so the keyboard can scroll it, and a name makes it a region." },
    { name: "className", type: "string", description: "Give the box a height or max-height; it scrolls when its content is taller." },
    { name: "sections", type: "{ id, num, name }[]", description: "Marks on the rail, one per section inside (by its id). Point at the rail and their numbers arrive down it; point at a mark to read its name, press it to scroll there. Sideways content gets the same marks along the bottom." },
    { name: "variant", type: '"ruled" | "catchword" | "wheel"', default: '"ruled"', description: "ruled: a rule at an edge while there's more beyond it. catchword, after the printer's: while there's more below, the first word the foot cuts off waits on the foot rule at the far end, and turns in as each new one arrives; press it and the box turns to that line. wheel, after WOVE: the children of what you put inside (the rows of one list) ride an arc as the box scrolls, the one in the middle at the start edge in ink, the rest falling back toward the rail in pencil; with reduced motion only the ink changes." },
    { name: "Accessibility", type: "note", description: "The box takes focus, so arrow keys, Page Up and Down, Home and End scroll it. The rail and its marks, and the catchword, are pointer aids hidden from assistive technology (the words they repeat are in the box), so give the sections headings too." },
  ],
})
