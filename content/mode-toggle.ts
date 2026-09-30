import { defineComponent } from "./types"

export default defineComponent({
  name: "mode-toggle",
  title: "Mode toggle",
  movement: "VI",
  contract: "db-mode-toggle",
  summary: "The way from day to night. One button, pressed at night, drawn eight ways: a disc sliding over a ring, a dot setting below a hairline, a word on a hairline that rolls to the other, the fermata as an eye, a sentence whose last word rolls, midday whose second half the ink falls over, a clock turning from noon to midnight, or one word resetting from Day to Nocturne letter by measured letter.",
  underneath: "native",
  props: [
    { name: "variant", type: '"eclipse" | "horizon" | "words" | "fermata" | "sentence" | "knockout" | "hour" | "typeset"', default: '"eclipse"', description: "How it is drawn. Eclipse is the smallest and reads anywhere; words and sentence carry their own label. Knockout reads midday by day, and at night the ink falls over the second half and night reverses out of it. Hour reads 12:00 by day and 00:00 at night, and the hour always turns forward, as a clock does. Typeset shows only the current word, Day or Nocturne, at the surrounding link size. Nocturne reserves the measure. Hover or focus pencils in two letters of the alternative; press resets the measured line in 320ms. The sequence follows the reading direction. Reduced motion swaps instantly." },
    { name: "mode", type: '"day" | "nocturne"', description: "The mode, when you hold it (controlled). The button is pressed when it is nocturne; typeset is a switch, checked for nocturne." },
    { name: "defaultMode", type: '"day" | "nocturne"', default: '"day"', description: "The mode to start in, when the toggle holds it." },
    { name: "onModeChange", type: "(mode, event) => void", description: "Called with the mode the person chose and the click that chose it. The toggle applies nothing itself: wire it to the page, e.g. onModeChange={(m) => { document.documentElement.dataset.mode = m }} for <html data-mode>. The site appearance hook uses a circular View Transition from this control, timed with the typeset reset; unsupported browsers and reduced motion swap the scheme instantly." },
    { name: "aria-label", type: "string", default: '"Night mode"', description: "The stable name a screen reader hears. Typeset uses role=switch and aria-checked; the other variants use aria-pressed. The state says whether night is on." },
  ],
})
