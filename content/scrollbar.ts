import { defineComponent } from "./types"

export default defineComponent({
  name: "scrollbar",
  title: "Scrollbar",
  movement: "IX",
  contract: "db-scrollbar",
  summary: "A scrollbar as a ruler: a hairline, a mark where each section begins, and an ink thumb as long as the view.",
  underneath: "hook",
  props: [
    { name: "variant", type: '"inner" | "page"', default: '"inner"', description: "Inner pins to the edge of the scroll container it sits in (as its last child). Page fixes it to the window and measures the document." },
    { name: "min", type: "number", default: "24 (page: 40)", description: "The thumb is never shorter than this many pixels, so it can be held." },
    { name: "sections", type: "{ id, num, name }[]", description: "Marks on the rail that scroll to the element with that id. Point at the rail and their numbers arrive; point at a mark to read its name." },
    { name: "Accessibility", type: "note", description: "The rail is hidden from assistive technology and the native bar is only hidden for a fine pointer; keyboard scrolling is unchanged. Offer the sections elsewhere too, such as a table of contents." },
  ],
})
