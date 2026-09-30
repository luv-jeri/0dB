import { defineComponent } from "./types"

export default defineComponent({
  name: "radial-chart",
  title: "Radial chart",
  movement: "X",
  contract: "db-radial",
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
  ],
})
