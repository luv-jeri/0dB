import { defineComponent } from "./types"

export default defineComponent({
  name: "navigation-menu",
  title: "Navigation menu",
  movement: "VIII",
  contract: "ot-navmenu",
  summary: "Small words open a panel of large names, the scale contrast of a poster; or a contents page with one name set as the headline; or the names opened into the line itself.",
  underneath: "radix",
  props: [
    { name: "NavigationMenu variant", type: '"names" | "lead" | "inline"', default: '"names"', description: "names: a panel of large names hung under the menu. lead: the names small in a narrow column, and the one you point at or focus (the first, at first) set beside them as the headline with its <small> line; below 40rem the names keep their lines instead. inline: a press (not a passing pointer) opens the names into the line after the word, larger, on one baseline; the words after make room and the others step back to pencil." },
    { name: "NavigationMenu dir", type: '"ltr" | "rtl"', description: "Left out, the menu takes the direction of the page around it as it mounts, so on a right-to-left page its words run from the right and the arrow keys follow." },
    { name: "NavigationMenuTrigger", type: "button", description: "A small word. Its ↓ turns over while the panel is open. Opens on pointing after a short wait, or on Enter and Space." },
    { name: "NavigationMenuContent", type: "div", description: "The panel, hung under the whole menu. Its children are NavigationMenuLinks, each a large name with an optional <small> line. Its rule draws across and the names arrive in turn." },
    { name: "NavigationMenuLink", type: "a", description: "Inside a panel, a large name. Directly in an item, a small word like a trigger. asChild renders your own link." },
    { name: "delayDuration / skipDelayDuration", type: "number", description: "Radix's pointer waits, on NavigationMenu." },
  ],
})
