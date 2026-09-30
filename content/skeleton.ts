import { defineComponent } from "./types"

export default defineComponent({
  name: "skeleton",
  title: "Skeleton",
  movement: "VII",
  contract: "db-skeleton",
  summary: "Baselines where the words will be. Still until something is loading, and still when motion is off.",
  underneath: "native",
  props: [
    { name: "Skeleton", type: "div", description: "The stack of lines. Hidden from assistive technology; put aria-busy on the region being loaded, and a pencil stroke reads along each line in turn while it is true. With reduced motion the lines stay still." },
    { name: "SkeletonLine", type: "i", description: "One baseline." },
    { name: "SkeletonLine.width", type: "string", default: '"100%"', description: "Any CSS width." },
    { name: "SkeletonLine.height", type: "string", default: '"1.7em"', description: "Any CSS height; a headline is about 2.8em." },
    { name: "SkeletonLine.index", type: "number", default: "0", description: "Position in the stack, so the stroke reads down the lines in turn." },
    { name: "SkeletonRing", type: "span", description: "Where an avatar or a mark will be. Set size for anything other than 2.75rem." },
  ],
})
