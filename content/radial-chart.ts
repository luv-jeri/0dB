import { defineComponent } from "./types"

export default defineComponent({
  name: "radial-chart",
  title: "Radial chart",
  movement: "X",
  contract: "ot-radial",
  summary: "Progress against one maximum: a hairline ring per series with its arc inked as far as it has got, and one very large number inside that rolls to the ring you point at.",
  underneath: "hook",
  props: [
    { name: "data", type: "{ label: string; value: number }[]", description: "One ring per entry, the first outermost. With more than one, a key names each ring and each name is a button." },
    { name: "label", type: "string", description: "Names the chart for assistive tech, such as Reading goals, 2026." },
    { name: "max", type: "number", default: "100", description: "What a closed ring means, shared by every series. Values past it close the ring." },
    { name: "unit", type: "string", description: "What the values count. The readout reads of 100 pages." },
    { name: "now", type: "number", default: "0", description: "Index of the series the number rests on. Its dot carries the accent." },
    { name: "format", type: "(value: number) => string", description: "Formats the number and the key. Defaults to en-GB grouping." },
    { name: "variant", type: '"ring" | "horizon"', default: '"ring"', description: "ring: full concentric rings, each starting at the top and running clockwise, the number inside the innermost. horizon: half rings standing on a horizon hairline that runs past them, as in the Eclipse poster; the number stands on the line and its words sit under it. Right to left, the half rings rise from the right." },
    { name: "data-force", type: "string", description: "On RadialChart: hover pins the pointed-at treatment on the series selected by now, for documentation." },
    { name: "Ring", type: "RingProps", description: "The decorative ring shared by Timer and PieChart, exported from radial-chart. Place it inside a positioned parent with an explicit size and provide its meaning as text outside the aria-hidden ring. Accepts native span props, including ref, className and style, but no children." },
    { name: "Ring value", type: "number", description: "Required share of the ring covered by the arc, from 0 to 1. Values outside that range are clamped; non-finite values become 0." },
    { name: "Ring from", type: "number", default: "0", description: "Where the arc begins, as a share of the turn from the ring's start. Clamped to 0–1; non-finite values become 0." },
    { name: "Ring head", type: '"end" | "start" | "none"', default: '"end"', description: "Which end of the arc carries the dot. none omits the dot, as in a pie chart." },
  ],
})
