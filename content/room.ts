import { defineComponent } from "./types"

export default defineComponent({
  name: "room",
  title: "Room",
  movement: "II",
  contract: "db-room",
  summary: "Your thought takes shape, and the paragraph makes room for it. One reading order flows through the space on both sides, then rests when you do.",
  underneath: "hook",
  props: [
    { name: "children", type: "string", description: "The paragraph. Its real text stays selectable and available to readers." },
    { name: "shape", type: "ReactNode", description: "The thought inside the room, sized by its own content. On a narrow screen it stands above the text." },
    { name: "outline", type: '"box" | "ellipse" | ((y: number) => number | [number, number][])', default: '"ellipse"', description: "The space the shape needs at each row. A function returns a centred width fraction or [start, end] runs in 0..1; y runs top to bottom. Define it in a client component." },
    { name: "travel", type: '"set" | "pointer" | "scroll"', default: '"set"', description: "Set stays still. Pointer follows a fine pointer and rests. Scroll carries the shape from top to bottom with exhale, reflowing only when its position changes. Reduced motion sets it at its start." },
    { name: "side", type: '"start" | "end" | "centre"', default: '"centre"', description: "The shape’s initial inline position; start and end follow the reading direction." },
    { name: "gap", type: "number", default: "0.75", description: "Space around the shape’s outline, in em." },
  ],
})
