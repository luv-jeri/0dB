import { defineComponent } from "./types"

export default defineComponent({
  name: "mode-toggle",
  title: "Mode toggle",
  movement: "VI",
  contract: "db-mode-toggle",
  summary: "The way from day to night. One button, pressed at night, drawn seven ways: a disc sliding over a ring, a dot setting below a hairline, a word on a hairline that rolls to the other, the fermata as an eye, a sentence whose last word rolls, midday whose second half the ink falls over, or a clock turning from noon to midnight.",
  underneath: "native",
  props: [
    { name: "variant", type: '"eclipse" | "horizon" | "words" | "fermata" | "sentence" | "knockout" | "hour"', default: '"eclipse"', description: "How it is drawn. Eclipse is the smallest and reads anywhere; words and sentence carry their own label. Knockout reads midday by day, and at night the ink falls over the second half and night reverses out of it. Hour reads 12:00 by day and 00:00 at night, and the hour always turns forward, as a clock does." },
    { name: "mode", type: '"day" | "nocturne"', description: "The mode, when you hold it (controlled). The button is pressed when it is nocturne." },
    { name: "defaultMode", type: '"day" | "nocturne"', default: '"day"', description: "The mode to start in, when the toggle holds it." },
    { name: "onModeChange", type: "(mode, event) => void", description: "Called with the mode the person chose and the click that chose it. The toggle applies nothing itself: wire it to the page, e.g. onModeChange={(m) => { document.documentElement.dataset.mode = m }} for <html data-mode>." },
    { name: "aria-label", type: "string", default: '"Night mode"', description: "The name a screen reader hears; the pressed state says whether night is on." },
  ],
})
