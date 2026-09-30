import { defineComponent } from "./types"

export default defineComponent({
  name: "skeleton",
  title: "Skeleton",
  movement: "VII",
  contract: "db-skeleton",
  summary: "Where the words will be: their baselines, the guides a letterer rules for them, or their rhythm. Still until something is loading, and still when motion is off.",
  underneath: "native",
  props: [
    { name: "Skeleton", type: "div", description: "The stack of lines. Hidden from assistive technology; put aria-busy on the region being loaded, and a pencil stroke reads along each line in turn while it is true. With reduced motion the lines stay still." },
    { name: "Skeleton.variant", type: '"baseline" | "metrics" | "words"', default: '"baseline"', description: "baseline: the hairline each line of words will stand on; while loading a pencil stroke reads along each in turn. metrics: the letterer's guides, a baseline and a dotted line one real x-height of the voice above it; while loading the dotted line is ruled out along each line in turn. words: each line broken at word spaces, as a layout dummy greeks its text; while loading the pencil stroke reads word by word." },
    { name: "SkeletonLine", type: "i", description: "One line of words to come." },
    { name: "SkeletonLine.width", type: "string", default: '"100%"', description: "Any CSS width." },
    { name: "SkeletonLine.height", type: "string", default: '"1.7em"', description: "Any CSS height; a headline is about 2.8em." },
    { name: "SkeletonLine.index", type: "number", default: "0", description: "Position in the stack, so the stroke reads down the lines in turn." },
    { name: "SkeletonRing", type: "span", description: "Where an avatar or a mark will be. Set size for anything other than 2.75rem." },
  ],
})
