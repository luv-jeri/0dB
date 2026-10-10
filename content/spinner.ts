import { defineComponent } from "./types"

export default defineComponent({
  name: "spinner",
  title: "Spinner",
  movement: "VII",
  contract: "ot-dots",
  summary: "The wait, written the way a score writes it: periods, a round, a metronome, a fermata, a breath, a rising chord, or the word itself being inked.",
  underneath: "native",
  props: [
    {
      name: "variant",
      type: '"dots" | "round" | "metronome" | "fermata" | "breath" | "arpeggio" | "word"',
      default: '"dots"',
      description:
        "dots: three periods lift in turn. round: three voices chase round a ring. metronome: a pendulum swings a slow beat. fermata: the hold is drawn, held and lifted. breath: a dot opens into a ring and closes. arpeggio: four notes rise, struck in turn. word: the label, inked letter by letter.",
    },
    { name: "size", type: '"m" | "l"', default: '"m"', description: "m takes the size of the text around it; l stands alone at the section-heading size." },
    {
      name: "label",
      type: "string",
      description:
        'Leave it out when the words beside it say what\'s happening ("Saving"), as in a busy button: the spinner stays silent. Given, it\'s a polite status read once. word writes it, "Loading" by default, and is always read.',
    },
    { name: "className", type: "string", description: "Merged onto the root span. Show it only while something the person started is running." },
  ],
})
