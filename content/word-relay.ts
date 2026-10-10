import { defineComponent } from "./types"

export default defineComponent({
  name: "word-relay",
  title: "Word relay",
  movement: "VI",
  contract: "ot-relay",
  summary: "A sentence whose last word rolls on every 2.4 seconds, in the italic. Press or use the keys to take over, or pause to hold a word.",
  underneath: "native",
  props: [
    { name: "autoplay", type: "boolean", default: "true", description: "Play between interactions. Pause on hover, focus within, off-screen or in a hidden tab; resume after 1.6 seconds of rest. Always off under reduced motion. False keeps only person-driven changes and hides the pause control." },
    { name: "defaultPaused", type: "boolean", default: "false", description: "Start paused with a visible play control. The person can resume it." },
    { name: "pauseLabel", type: "string", default: '"pause"', description: "The visible word on the pause button, also its accessible name. Parentheses are drawn around it." },
    { name: "playLabel", type: "string", default: '"play"', description: "The visible word when explicitly paused. Hover and focus still hold autoplay after play is pressed." },
    { name: "interval", type: "number", default: "2400", description: "Milliseconds between words; at least 1000. A person-driven change resets the interval. Controlled relays request the next index through onIndexChange; automatic changes are not live-announced." },
    { name: "children", type: "ReactNode", description: "The sentence up to the word that changes, ours, in the roman." },
    { name: "words", type: "string[]", description: "The words it can end on, in order, each with its own punctuation (\"design.\"). Pressing goes round them; the last wraps to the first." },
    { name: "index", type: "number", description: "The chosen word's place, when you hold it (controlled)." },
    { name: "defaultIndex", type: "number", default: "0", description: "The word to start on, when the relay holds it." },
    { name: "onIndexChange", type: "(index: number) => void", description: "Called with the next index, for both person-driven and automatic changes. A controlled relay moves only when its owner updates index." },
    { name: "variant", type: '"sentence" | "statement"', default: '"sentence"', description: "sentence: after mode-toggle's sentence; the word stands in the italic on a hairline that hugs it at the end of the line. statement: after \"It has to be design.\"; the sentence heavy and narrow in ink, and the word half again as large under it, in the italic and the accent, rising into the line above with a halo of the paper so it cuts the roman where they cross." },
    { name: "--ot-relay-ground", type: "CSS colour", default: "var(--ot-paper)", description: "The halo round the statement's word, if it sits on something other than the paper." },
  ],
})
