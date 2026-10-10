import { defineComponent } from "./types"

export default defineComponent({
  name: "breadcrumb",
  title: "Breadcrumb",
  movement: "VIII",
  contract: "ot-crumbs",
  summary: "The path, divided by drawn hairlines leaning like slashes; or a stair that ends in the large italic of where you are; or a long path with a full stop for each step left out.",
  underneath: "native",
  props: [
    { name: "Breadcrumb variant", type: '"slashes" | "stack" | "elide"', default: '"slashes"', description: "slashes: one line, and pointing at a step leans the hairlines either side in to hold it. stack: one step a line, each set further in, in a heavy narrow roman; where you are is the large italic at the foot, and pointing at a step sets every step below it back in pencil. elide: the first step and the last two stay; each step between is a full stop, and they open back into words for a still pointer or for focus." },
    { name: "BreadcrumbLink asChild", type: "boolean", default: "false", description: "Render your own link (Next's Link, say) with the crumb's look." },
    { name: "BreadcrumbPage", type: "span", description: "Where you are: italic, ink, aria-current=\"page\"." },
    { name: "BreadcrumbSeparator", type: "li", description: "The leaning hairline. Place one between each pair of items; it is hidden from screen readers. A stack draws none; elide closes the ones between elided steps." },
    { name: "elide: what is elided", type: "note", description: "Every step stays a link in the page, so a screen reader hears the whole path and Tab reaches each one (focus opens the path). The full stops are drawn, not read." },
  ],
})
