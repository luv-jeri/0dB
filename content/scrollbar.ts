import { defineComponent } from "./types"

export default defineComponent({
  name: "scrollbar",
  title: "Scrollbar",
  movement: "IX",
  contract: "db-scrollbar",
  summary: "A scrollbar as a ruler: a hairline, a mark where each section begins, and an ink thumb as long as the view.",
  underneath: "hook",
  props: [
    { name: "variant", type: '"inner" | "page"', default: '"inner"', description: "Inner pins to the edge of the scroll container it sits in (it finds the nearest scroller around it). Page fixes it to the window and measures the document." },
    { name: "axis", type: '"y" | "x"', default: '"y"', description: "x is the same rail along the bottom of a box that scrolls sideways (a wide table). Inner only." },
    { name: "min", type: "number", default: "24 (page: 40)", description: "The thumb is never shorter than this many pixels, so it can be held." },
    { name: "sections", type: "{ id, num, name }[]", description: "Marks on the rail that scroll to the element with that id. Point at the rail and their numbers arrive; point at a mark to read its name." },
    { name: "Accessibility", type: "note", description: "The rail is hidden from assistive technology and the browser's own bar is hidden only for a fine pointer, and only once the rail is running; keyboard scrolling is unchanged. Offer the sections elsewhere too, such as a table of contents." },
  ],
})
