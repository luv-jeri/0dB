import { defineComponent } from "./types"

export default defineComponent({
  name: "strata",
  title: "Strata",
  movement: "II",
  contract: "db-strata",
  summary: "Depth becomes clarity: type planes come forward from pencil, flatten and set in ink. Once the thought is clear, it rests.",
  underneath: "hook",
  props: [
    { name: "trigger", type: '"scroll" | "load"', default: '"scroll"', description: "Scroll follows the section’s travel through the view, using a native view timeline where available. Load is one adagio arrival. Both end flat; reduced motion starts flat." },
    { name: "children", type: "ReactNode", description: "Direct StrataPlane children. Their DOM reading order stays unchanged; the deepest arrives first." },
    { name: "StrataPlane.depth", type: "number", description: "Distance from 0 to 1, clamped. Distance is scale, pencil colour and plane angle only." },
    { name: "StrataPlane.tilt", type: '"x" | "y" | "none"', default: '"y"', description: "The axis that flattens as the plane comes forward." },
    { name: "StrataPlane.from", type: '"start" | "end" | "above" | "below"', default: '"start"', description: "The direction the plane arrives from. Start and end mirror in right-to-left." },
  ],
})
