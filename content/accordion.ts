import { defineComponent } from "./types"

export default defineComponent({
  name: "accordion",
  title: "Accordion",
  movement: "VIII",
  contract: "ot-disclose",
  summary: "Questions you open. Ruled off, with a plus that winds into a cross as the question swells into a heading; or run in with their answers like a book's paragraphs; glossed in the outer column; or stood side by side as columns that widen.",
  underneath: "native",
  props: [
    { name: "type", type: '"single" | "multiple"', default: '"multiple"', description: "On Accordion. Single opens one item at a time, using the native name attribute on its details elements." },
    { name: "variant", type: '"cross" | "run-in" | "gloss"', default: '"cross"', description: "On Accordion. cross: questions ruled off; the + winds into × and the open question swells a fifth into the heading of its answer. run-in: the book's run-in head; no rules, the question set heavy with an ellipsis trailing it, and opened, the answer runs on along the same line, written outward from the question. gloss: the answer is hung beside its question in the outer column, flush to the outer edge, as a sidenote glosses a line; below 40rem it drops under the question." },
    { name: "orientation", type: '"vertical" | "horizontal"', default: '"vertical"', description: "On Accordion. horizontal: the questions stand side by side as narrow columns between hairlines, each name stacked a word to a line; the open one widens and its name steps up onto one line over its answer, which arrives once the column has made room. Left and Right walk the columns (mirrored right to left), Home and End go to the ends. The variant is set aside; below 40rem the columns stack." },
    { name: "AccordionItem", type: "details", description: "One question and its answer. Accepts the details props, such as onToggle." },
    { name: "AccordionItem.defaultOpen", type: "boolean", default: "false", description: "Start open. The browser keeps the state afterwards." },
    { name: "AccordionTrigger", type: "summary", description: "The question. Native, so Enter and Space open it." },
    { name: "AccordionContent", type: "div", description: "The answer, held to a readable measure." },
  ],
})
