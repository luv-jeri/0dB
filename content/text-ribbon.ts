import { defineComponent } from "./types"

export default defineComponent({
  name: "text-ribbon",
  title: "Text ribbon",
  movement: "II",
  contract: "db-ribbon",
  summary: "A phrase laid along an arch or a wave by pretext and repeated round like a ribbon; it moves only when you drag it or scroll, and rests when you let go.",
  underneath: "hook",
  props: [
    { name: "children", type: "string", description: "The phrase, as plain text: pretext measures every letter, kerning included. It is read once; the repeats are for the eye." },
    { name: "variant", type: '"arc" | "wave"', default: '"arc"', description: "arc: after WOVE's figures on an arc; the phrase round an arch, in ink and at full size at the crest, where one ink dot marks the middle of the guide, shrinking and falling to pencil toward the ends. wave: the phrase rides a slow wave across the measure, every letter the same size, fading in and out at the edges." },
    { name: "label", type: "string", default: '"Move the phrase"', description: "The name of the slider you move it by." },
  ],
})
