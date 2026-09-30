import { defineComponent } from "./types"

export default defineComponent({
  name: "breadcrumb",
  title: "Breadcrumb",
  movement: "VIII",
  contract: "db-crumbs",
  summary: "The path, divided by drawn hairlines leaning like slashes. Point at a step and the two beside it lean in to hold it.",
  underneath: "native",
  props: [
    { name: "BreadcrumbLink asChild", type: "boolean", default: "false", description: "Render your own link (Next's Link, say) with the crumb's look." },
    { name: "BreadcrumbPage", type: "span", description: "Where you are: italic, ink, aria-current=\"page\"." },
    { name: "BreadcrumbSeparator", type: "li", description: "The leaning hairline. Place one between each pair of items; it is hidden from screen readers." },
  ],
})
