import { defineComponent } from "./types"

export default defineComponent({
  name: "pie-chart",
  title: "Pie chart",
  movement: "X",
  contract: "ot-pie",
  summary: "Shares of a whole: one hairline ring cut into arcs with paper between them, numbered round the rim, and the total as one very large number inside that rolls to the share of the arc you point at.",
  underneath: "hook",
  props: [
    { name: "data", type: "{ label: string; value: number }[]", description: "One arc per entry, clockwise from the top in this order, each as long as its share of the total. Values at or below zero have no arc. The key under the ring names each one." },
    { name: "label", type: "string", description: "Names the chart for assistive tech, such as Where visits came from, September. The key is a group of that name, one button per share." },
    { name: "unit", type: "string", description: "What the values count. At rest the number reads visits in all; on an arc, 1,240 of 2,950 visits." },
    { name: "format", type: "(value: number) => string", description: "Formats the total and the figures in the key. Defaults to en-GB grouping." },
    { name: "variant", type: '"ring" | "horizon"', default: '"ring"', description: "ring: a whole ring, clockwise from the top, the total inside. horizon: a half ring standing on a horizon hairline that runs past it, as in the Eclipse poster; the total stands on the line and its words sit under it. Right to left, the arcs run the other way." },
  ],
})
