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
    { name: "HoverCardContent variant", type: '"name" | "entry" | "quote"', default: '"name"', description: "name: the name set large and cut by the card's top edge and its end. entry: a dictionary entry for the word you point at: the headword heavy and broken at its syllables, the stressed one reversed out of the ink, then the part of speech (.db-term), the senses as an <ol> numbered in the margin, and the word's history in HoverCardMeta. quote: what the person said, in a <blockquote>, set in the italic with the opening mark hung in the margin and cut by the card's edge; the attribution in HoverCardMeta." },
    { name: "HoverCardContent side / align / sideOffset", type: "Radix", default: '"bottom" / "start" / 12', description: "Where the card sits. It flips rather than leave the screen." },
    { name: "HoverCardName", type: "span", description: "The name, set large and cropped by the card's edge. Decorative; put the readable name in the trigger. Under entry, write the headword with its syllable points and stress mark (\"gro·ˈtesque\"): it breaks at each point and reverses the stressed syllable out of the ink." },
    { name: "HoverCardMeta", type: "span", description: "A last line in pencil." },
  ],
})
