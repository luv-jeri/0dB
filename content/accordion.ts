import { defineComponent } from "./types"

export default defineComponent({
  name: "accordion",
  title: "Accordion",
  movement: "VIII",
  contract: "db-disclose",
  summary: "Questions ruled off in a stack; a plus that turns into a cross as each one opens.",
  underneath: "native",
  props: [
    { name: "type", type: '"single" | "multiple"', default: '"multiple"', description: "On Accordion. Single opens one item at a time, using the native name attribute on its details elements." },
    { name: "AccordionItem", type: "details", description: "One question and its answer. Accepts the details props, such as onToggle." },
    { name: "AccordionItem.defaultOpen", type: "boolean", default: "false", description: "Start open. The browser keeps the state afterwards." },
    { name: "AccordionTrigger", type: "summary", description: "The question. Native, so Enter and Space open it." },
    { name: "AccordionContent", type: "div", description: "The answer, held to a readable measure." },
  ],
})
