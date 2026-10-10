import { defineComponent } from "./types"

export default defineComponent({
  name: "reading-trail",
  title: "Reading trail",
  movement: "VIII",
  contract: "ot-trail",
  summary: "Keep your place on a long page: its sections by number and name, set as a contents page, the one you are in carrying the accent while its dotted leader inks as you read. Or the page's own rail, with that section running down it like the title on a spine.",
  underneath: "hook",
  props: [
    { name: "sections", type: "{ id, name, num? }[]", description: "One per section, in page order: the id of the element it begins at, its name, and its number (01, 02 by default). The links are the page's own anchors." },
    { name: "variant", type: '"contents" | "rail"', default: '"contents"', description: "contents: a contents page for the margin. Each line is the number, the name, a dotted leader and where on the page the section is reached (00 to 100); what you've read keeps its leader in ink, the one you are in inks its leader as you read, what is to come waits on a rule. rail: the page's scrollbar at the window's edge (the scrollbar's page rail, with a mark per section), and beside it, set vertically like a spine's title, the section you are in. The contents stay in the page for the keyboard and screen readers, and come out beside the rail when focus reaches them." },
    { name: "label", type: "string", default: '"On this page"', description: "Names the trail for assistive technology, and heads the contents." },
    { name: "pinned", type: "{ now: number; read?: number }", description: "Pins where you are (the section's place, and how much of it is read, 0 to 1) instead of reading the page. For documentation." },
    { name: "--ot-trail-top", type: "CSS length", default: "0px", description: "Rail only: keeps the rail and its head clear of a fixed bar at the top of the window." },
  ],
})
