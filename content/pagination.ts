import { defineComponent } from "./types"

export default defineComponent({
  name: "pagination",
  title: "Pagination",
  movement: "VIII",
  contract: "db-pager",
  summary: "Numbers with a dot beneath each. The current page's dot is the accent, and weight falls away with distance from it.",
  underneath: "native",
  props: [
    { name: "PaginationLink href / isActive", type: "string / boolean", description: "A page. isActive sets aria-current=\"page\", which draws the accent dot. Give it an aria-label such as \"Page 3\"." },
    { name: "PaginationLink asChild", type: "boolean", default: "false", description: "Render your own link (Next's Link, say) with the pager's look." },
    { name: "PaginationPrevious / PaginationNext href", type: "string", description: "Where the step goes. Omit it on the first or last page and the step shows, unavailable." },
    { name: "PaginationPrevious / PaginationNext children", type: "ReactNode", default: '"Previous" / "Next"', description: "Pass a neighbour's name instead (Halden). The arrow is drawn for you, and the accessible name gains its direction." },
    { name: "PaginationEllipsis", type: "span", description: "Pages left out. Read out as \"More pages\"." },
  ],
})
