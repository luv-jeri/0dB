import { defineComponent } from "./types"

export default defineComponent({
  name: "text-ribbon",
  title: "Text ribbon",
  movement: "II",
  contract: "db-ribbon",
  summary: "A phrase travelling along an arch or a wave, measured by pretext. Drag, keys and scroll take over; pause holds it in place.",
  underneath: "hook",
  props: [
    { name: "autoplay", type: "boolean", default: "true", description: "Play between interactions. Pause on hover, focus within, off-screen or in a hidden tab; resume after 1.6 seconds of rest. Always off under reduced motion. False keeps only person-driven changes and hides the pause control." },
    { name: "defaultPaused", type: "boolean", default: "false", description: "Start paused with a visible play control. The person can resume it." },
    { name: "pauseLabel", type: "string", default: '"pause"', description: "The visible word on the pause button, also its accessible name. Parentheses are drawn around it." },
    { name: "playLabel", type: "string", default: '"play"', description: "The visible word when explicitly paused. Hover and focus still hold autoplay after play is pressed." },
    { name: "children", type: "string", description: "The phrase, as plain text: pretext measures every letter, kerning included. It is read once; the repeats are for the eye." },
    { name: "variant", type: '"arc" | "wave"', default: '"arc"', description: "arc: after WOVE's figures on an arc; the phrase round an arch, in ink and at full size at the crest, where one ink dot marks the middle of the guide, shrinking and falling to pencil toward the ends. wave: the phrase rides a slow wave across the measure, every letter the same size, fading in and out at the edges." },
    { name: "label", type: "string", default: '"Move the phrase"', description: "The name of the slider you move it by." },
  ],
})
