import { defineComponent } from "./types"

export default defineComponent({
  name: "toggle",
  title: "Toggle",
  movement: "VI",
  contract: "ot-toggle",
  summary: "A word you can hold down. Held, it's yours and turns italic: under a fermata's arc and dot, behind a pen that inks the tenuto's line, with a small note hung beside it, or set on its drawn guides.",
  underneath: "radix",
  props: [
    { name: "variant", type: '"fermata" | "tenuto" | "aside" | "guides"', default: '"fermata"', description: "The sign a held word wears. fermata: pointing sketches an arc over the word from its start foot; held, the arc inks, a dot lands under it, and the word leans into the italic. tenuto: pointing sketches a pencil line under the word; held, a pen runs along it from the start, inking the line and rewriting the word in the italic as it passes, and released, it passes again and gives the word back. aside: pointing sketches a hairline arrow beside the word; held, it inks, its head lands against the word, and a small note in our voice (note) is written at its tail, on the word's baseline. guides: pointing sketches the baseline under the word in dots; held, the x-height line is drawn from the other side, the two pass through the word, and it leans into the italic between them. fermata, aside and guides centre and end their marks on the face showing, roman or italic." },
    { name: "note", type: "string", default: '"on"', description: "aside only: the note written beside the held word, a word or two in our voice (\"muted\", \"pinned\"). It's decoration; aria-pressed already says the word is held." },
    { name: "pressed / defaultPressed", type: "boolean", description: "Whether the word is held. Controlled or not." },
    { name: "onPressedChange", type: "(pressed: boolean) => void", description: "Called when the word is pressed or released." },
    { name: "disabled", type: "boolean", default: "false", description: "Dimmed to pencil; no mark sketches." },
  ],
})
