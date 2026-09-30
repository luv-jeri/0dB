import { defineComponent } from "./types"

export default defineComponent({
  name: "mode-toggle",
  title: "Mode toggle",
  movement: "VI",
  contract: "db-mode-toggle",
  summary: "The way from day to night, drawn ten ways. Three are switches with a scene change of their own: Day over Night with the full stop setting from one to the other while the page dissolves; Night taking the ink letter by letter while the page's light is lowered; Noon turning to Moon while night falls from the top. The other seven are buttons: a disc sliding over a ring, a dot setting below a hairline, a word on a hairline that rolls, the fermata as an eye, a sentence whose last word rolls, midday whose second half the ink falls over, and a clock turning from noon to midnight.",
  underneath: "native",
  props: [
    { name: "variant", type: '"eclipse" | "horizon" | "words" | "fermata" | "sentence" | "knockout" | "hour" | "stop" | "dimmer" | "noon"', default: '"eclipse"', description: "How it is drawn. Stop, dimmer and noon are switches, each paired with a scene change it asks the page for through data-scene. Stop: Day over Night, flush to the end, the full stop after the one you read by; pressing sets the stop one line (moderato, spiccato) and the page dissolves at allegro. Dimmer: Night, pencil by day and ink at night; pressing brings the ink up through the letters in reading order, or lowers it from the last, and the page's light is lowered or raised (moderato). Noon: Noon and Moon, one letter apart; only the initial rolls, and the new sheet falls from the top edge (moderato). Pointing previews the first step until you press; then it rests. Eclipse is the smallest button and reads anywhere; words and sentence carry their own label. Knockout reads midday, and at night the ink falls over the second half. Hour reads 12:00 and 00:00 and always turns forward. Reduced motion changes at once." },
    { name: "mode", type: '"day" | "nocturne"', description: "The mode, when you hold it (controlled). The button is pressed when it is nocturne; stop, dimmer and noon are switches, checked for nocturne." },
    { name: "defaultMode", type: '"day" | "nocturne"', default: '"day"', description: "The mode to start in, when the toggle holds it." },
    { name: "onModeChange", type: "(mode, event) => void", description: "Called with the mode the person chose and the click that chose it. The toggle applies nothing itself: wire it to the page, e.g. onModeChange={(m) => { document.documentElement.dataset.mode = m }} for <html data-mode>. The site's appearance hook reads the pressed control's data-scene (db-dissolve, db-dim, db-fall) and passes it as the View Transition's type, so each switch's scene change is drawn by the sidecar; on your own page, document.startViewTransition({ update, types: [scene] }). Browsers without view transitions, and reduced motion, change the page at once." },
    { name: "aria-label", type: "string", default: '"Night mode"', description: "The stable name a screen reader hears. Stop, dimmer and noon use role=switch and aria-checked; the other variants use aria-pressed. The state says whether night is on." },
  ],
})
