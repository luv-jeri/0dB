import { defineComponent } from "./types"

export default defineComponent({
  name: "swapy",
  title: "Swapy",
  movement: "X",
  contract: "ot-swap",
  summary: "Rows you put in order by hand. A move word is the handle; the row you hold reverses out of ink and travels with you, or a proofreader's loop marks where it went.",
  underneath: "native",
  props: [
    { name: "label", type: "string", description: "Names the list for screen readers: \"Running order\"." },
    { name: "items", type: "{ id: string; label: string; kind?: ReactNode; meta?: ReactNode }[]", description: "The rows. label is the name, set large, and what is said aloud as the row moves; kind is what it is, in graphite; meta is the quiet fact at the end (a length, a page count)." },
    { name: "order", type: "string[]", description: "The ids in order, when you hold the order. An id missing from it keeps its place at the end; an id no longer in items is dropped." },
    { name: "defaultOrder", type: "string[]", default: "the order of items", description: "The first order, when Swapy holds it." },
    { name: "onOrderChange", type: "(order: string[]) => void", description: "Called on every move, with the new order." },
    { name: "variant", type: '"default" | "transpose"', default: '"default"', description: "default: the row you hold reverses out of an ink block that prints across it, and its name sets heavier and tighter, after \"the uncreative\". transpose: the proofreader's transposition mark: no ink, the held name turns italic and the rest step back to pencil, and a hairline loop in the margin runs from where it was picked up to where it is, ending in a dot, with tr written by it. Set down, the mark fades." },
    { name: "disabled", type: "boolean", default: "false", description: "The rows stay where they are and step back to pencil." },
    { name: "defaultHeld", type: "string", description: "Starts with this row picked up, as if its move word had just been pressed." },
    { name: "Keyboard", type: "on the move word", description: "Space or Enter picks the row up and sets it down. Up and Down carry it (and pick it up if it wasn't), Home and End take it to the ends, Escape puts it back where it was, and leaving the word sets it down. Each step is said: \"Halden, 3 of 5.\"" },
  ],
})
