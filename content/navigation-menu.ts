import { defineComponent } from "./types"

export default defineComponent({
  name: "navigation-menu",
  title: "Navigation menu",
  movement: "VIII",
  contract: "db-navmenu",
  summary: "Small words open a panel of large names, the scale contrast of a poster.",
  underneath: "radix",
  props: [
    { name: "NavigationMenuTrigger", type: "button", description: "A small word. Its ↓ turns over while the panel is open. Opens on pointing after a short wait, or on Enter and Space." },
    { name: "NavigationMenuContent", type: "div", description: "The panel, hung under the whole menu. Its children are NavigationMenuLinks, each a large name with an optional <small> line. Its rule draws across and the names arrive in turn." },
    { name: "NavigationMenuLink", type: "a", description: "Inside a panel, a large name. Directly in an item, a small word like a trigger. asChild renders your own link." },
    { name: "delayDuration / skipDelayDuration", type: "number", description: "Radix's pointer waits, on NavigationMenu." },
  ],
})
