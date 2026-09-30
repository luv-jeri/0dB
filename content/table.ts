import { defineComponent } from "./types"

export default defineComponent({
  name: "table",
  title: "Table",
  movement: "X",
  contract: "db-table",
  summary: "Hairline rows in tabular figures; the column you sort by is set in ink.",
  underneath: "native",
  props: [
    { name: "TableHead sort", type: '"ascending" | "descending"', description: "Marks the sorted column with aria-sort and turns its heading ink. Put a button inside the heading to make it sortable; the arrow turns with the direction." },
    { name: "TableHead numeric", type: "boolean", default: "false", description: "Right-aligns a column of figures. Set the same on its cells." },
    { name: "TableCell sorted", type: "boolean", default: "false", description: "The cell is in the sorted column, so it is set in ink." },
    { name: "TableCell primary", type: "boolean", default: "false", description: "The row's name. It turns italic when the row is picked." },
    { name: "TableRow picked", type: "boolean", default: "false", description: "A chosen row." },
    { name: "TablePick", type: "checkbox input props", description: "A ring that fills when chosen, and half fills when some are. Give it an aria-label naming the row." },
    { name: "TableCaption", type: "caption props", description: "Names the table for screen readers; visually hidden." },
  ],
})
