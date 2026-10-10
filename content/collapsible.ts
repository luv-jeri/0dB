import { defineComponent } from "./types"

export default defineComponent({
  name: "collapsible",
  title: "Collapsible",
  movement: "IX",
  contract: "ot-collapse",
  summary: "A list that ends in the rest of itself: the words \"and 4 more\" are the control.",
  underneath: "native",
  uses: ["button"],
  props: [
    { name: "Collapsible", type: "details", description: "Holds the control and the rest. Put the rows that always show before it." },
    { name: "Collapsible.variant", type: '"tail" | "catchword" | "sotto"', default: '"tail"', description: "How the list says there is more. tail: the words \"and 4 more\" are the control, set as a caption straight under the last rule. catchword: the first name of the rest waits at the foot, flush to the far edge, as a printer set the next page's first word under the last line; opening, it steps back to the start and becomes the first row, and the rest follow. Its label is that name, so give the trigger an aria-label (\"Show 4 more, from Tidewater\") and put the other names in the content. sotto: the rest is never hidden, only said under the breath, as one line of fine print in pencil that is itself the control; opening says each name in full, in turn. The trigger's words are read aloud, not shown." },
    { name: "CollapsibleTrigger", type: "summary", description: "The control, set as a quiet Button. Its label is what the closed state says (and 4 more)." },
    { name: "CollapsibleTrigger.openLabel", type: "ReactNode", description: "What it says once open (Hide these 4). Defaults to the closed words." },
    { name: "CollapsibleContent", type: "div", description: "The rest. It opens at the speed of reading." },
    { name: "CollapsibleList", type: "ul", description: "Rows ruled off with hairlines; inside the content, its rows arrive in turn as it opens." },
  ],
})
