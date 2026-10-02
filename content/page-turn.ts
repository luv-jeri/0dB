import { defineComponent } from "./types"

export default defineComponent({
  name: "page-turn",
  title: "Page turn",
  movement: "IX",
  contract: "db-page-turn",
  summary: "One reading recedes and the next comes forward: depth marks a change of attention, then rests.",
  underneath: "native",
  props: [
    { name: "children", type: "ReactNode", description: "The page or element to carry. Wrap each page, not its persistent layout; a changed key creates an in-page enter/exit pair." },
    { name: "share", type: "string", description: "Optional shared element name. Matching names on outgoing and incoming elements preserve continuity; keep each name unique in a mounted tree." },
    { name: "forward / back", type: "transition types", description: "Call addTransitionType inside startTransition, or use a Next Link's transitionTypes. Back reverses the plane angle. Unnamed transitions use the forward depth turn." },
  ],
})
