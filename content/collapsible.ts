import { defineComponent } from "./types"

export default defineComponent({
  name: "collapsible",
  title: "Collapsible",
  movement: "IX",
  contract: "db-collapse",
  summary: "A list that ends in the rest of itself: the words \"and 4 more\" are the control.",
  underneath: "native",
  uses: ["button"],
  props: [
    { name: "Collapsible", type: "details", description: "Holds the control and the rest. Put the rows that always show before it." },
    { name: "CollapsibleTrigger", type: "summary", description: "The control, set as a quiet Button. Its label is what the closed state says (and 4 more)." },
    { name: "CollapsibleTrigger.openLabel", type: "ReactNode", description: "What it says once open (Hide these 4). Defaults to the closed words." },
    { name: "CollapsibleContent", type: "div", description: "The rest. It opens at the speed of reading." },
    { name: "CollapsibleList", type: "ul", description: "Rows ruled off with hairlines; inside the content, its rows arrive in turn as it opens." },
  ],
})
