import { defineComponent } from "./types"

export default defineComponent({
  name: "marquee",
  title: "Marquee",
  movement: "II",
  contract: "db-marquee",
  summary: "A band of words that travels only as far as the page scrolls: it stands still when you stop and runs back when you scroll back.",
  underneath: "hook",
  props: [
    { name: "children", type: "ReactNode", description: "The words: each child is one word or phrase in the band. Readers get them once, as a list; the copies that fill the band are hidden from them." },
    { name: "variant", type: '"band" | "ticker" | "counter"', default: '"band"', description: "band: after \"Renaissance.\" and SPECTRA's crop, display words in a light weight, each closed by a full stop, cut off by the frame's ends. ticker: small capitals, widely spaced, running between two hairlines, after the Renaissance poster's top row. counter: after SPECTRA's two rows, the band twice, the upper row cut at its head and the lower at its feet, meeting on a hairline and running opposite ways." },
    { name: "speed", type: "number", default: "0.4", description: "How far the words travel for each pixel the page scrolls." },
    { name: "reverse", type: "boolean", default: "false", description: "Run towards the start as you scroll down instead of reading along. In counter it swaps which row does." },
    { name: "label", type: "string", description: "Names the list of words for readers." },
    { name: "className", type: "string", description: "Pass a dynamic class (db-fff, db-ff…) for the band's size; the ticker keeps its own." },
  ],
})
