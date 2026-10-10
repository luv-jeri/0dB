import { defineComponent } from "./types"

export default defineComponent({
  name: "link",
  title: "Link",
  movement: "II",
  contract: "ot-link",
  summary: "One link: a hairline underline at rest, and pointing at it, focusing it or holding its card open draws a highlighter stroke through the whole word, on from the left and off to the right.",
  underneath: "native",
  props: [
    { name: "asChild", type: "boolean", default: "false", description: "Render the child element, such as your router's link, with the link's look." },
    { name: "external", type: "boolean", default: "false", description: "Opens in a new tab and adds the ↗ after the words, clear of the underline; pointing sends it a step the way it points." },
    { name: "variant", type: '"quiet" | "reference" | "address"', description: "quiet sets the underline in rule rather than the text's colour, for a run of links that already reads as links (an index, a programme). reference drops the line for a raised reference mark after the words, numbered down the page in the printer's order (* † ‡ § ‖ ¶). address writes where the link goes, in parentheses after the words, when you point at or focus it; its measure is reserved at rest, and it steps under when the line is full. Use it for a link on its own line, and not with asChild." },
    { name: "href / …", type: "native", description: "A real anchor, so every native prop works." },
  ],
})
