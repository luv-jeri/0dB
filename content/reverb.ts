import { defineComponent } from "./types"

export default defineComponent({
  name: "reverb",
  title: "Reverb",
  movement: "II",
  contract: "ot-reverb",
  summary: "A phrase that echoes into silence: each line quieter, more open and a dynamic smaller, drifting right like a canon, answering from either wall, or losing its consonants first; it ends on a rest.",
  underneath: "hook",
  props: [
    { name: "children", type: "string", description: "The phrase, as plain text. Readers get it once; the echoes are for the eye." },
    { name: "echoes", type: "number", default: "5", description: "How many times it comes back." },
    { name: "from", type: '"ffff" | "fff" | "ff" | "f" | "mf" | "mp" | "p" | "pp"', default: '"mf"', description: "The dynamic the phrase is set in. Each echo steps one down, and stays at pp." },
    { name: "variant", type: '"canon" | "antiphon" | "vowels"', default: '"canon"', description: "canon: each echo drifts on by the width of the last one's first word. antiphon, after the two choirs of San Marco: the echoes answer from either wall of the measure in turn, the first from the far one; pointing opens their letters. vowels, after a live room, where reverberation masks the consonants first: every echo keeps the phrase's size and lies letter for letter under it, and loses its consonants, then its vowels, until about a tenth is left; pointing sketches the lost letters back in pencil." },
  ],
})
