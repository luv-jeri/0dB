import { defineComponent } from "./types"

export default defineComponent({
  name: "hover-card",
  title: "Hover card",
  movement: "IX",
  contract: "db-peek",
  summary: "Point at a name and wait a moment: a card opens with the name set large and cropped by its edge.",
  underneath: "radix",
  props: [
    { name: "openDelay / closeDelay", type: "number", default: "450 / 300", description: "How long a still pointer waits before the card opens, and how long it lingers. Focus opens it at once." },
    { name: "HoverCardContent side / align / sideOffset", type: "Radix", default: '"bottom" / "start" / 12', description: "Where the card sits. It flips rather than leave the screen." },
    { name: "HoverCardName", type: "span", description: "The name, set large and cropped by the card's edge. Decorative; put the readable name in the trigger." },
    { name: "HoverCardMeta", type: "span", description: "A last line in pencil." },
  ],
})
