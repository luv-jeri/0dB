import { defineComponent } from "./types"

export default defineComponent({
  name: "score",
  title: "Score",
  movement: "II",
  contract: "db-score",
  summary: "Silence until asked for. Chapters add voices to an unfinished chord; a thought made workable lets it resolve.",
  underneath: "hook",
  props: [
    { name: "ScoreProvider.children", type: "ReactNode", description: "A page's sound boundary. Off by default; the preference is stored as on/off under 0db-score. A remembered on never autoplays: switch off and on to activate audio in a new document." },
    { name: "ScoreToggle", type: "button attributes", description: "Text only: Sound off / Sound on, with aria-pressed. Only pressing the toggle to enable sound creates an AudioContext. Without a provider it is disabled." },
    { name: "useScore().on", type: "boolean", description: "The remembered sound preference. Calls remain silent until this document has an activated audio context." },
    { name: "useScore().cue", type: '(name: "set") => void', description: "A soft landing pluck, throttled to one every 120ms." },
    { name: "useScore().voice", type: "(i: number) => void", description: "Adds one of five sustained voices, indexed 0–4. Repeated indices do nothing. The opening starts with voices 0 and 2 in a suspended voicing." },
    { name: "useScore().resolve", type: "() => void", description: "Moves the suspended voices to a major chord over 1.4 seconds, once. Later voices join the resolved chord." },
    { name: "useScore().letter", type: "(ch: string) => void", description: "A quiet pitched tick mapped to the chord, at most once every 75ms. Empty text is silent. All sound calls do nothing while off or hidden." },
  ],
})
