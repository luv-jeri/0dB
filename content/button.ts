import { defineComponent } from "./types"

export default defineComponent({
  name: "button",
  title: "Button",
  movement: "VI",
  contract: "db-btn",
  summary: "One family of three (a statement in an ink block, a bracket that steps apart, a quiet line that redraws) and four heroes for the big call to action: overture, fermata, stave and ink. Nothing moves its neighbours.",
  underneath: "native",
  props: [
    { name: "variant", type: '"statement" | "bracket" | "quiet" | "overture" | "fermata" | "stave" | "ink"', default: '"bracket"', description: "The family: statement is reversed type in an ink block, one per view; bracket holds a secondary action; quiet is only a line. The heroes: overture swells from light to heavy and ends in a full stop; fermata draws an arc over the word; stave sets the word in italic between two staves that run out to the edges; ink is an outlined block that fills from the side you came in." },
    { name: "size", type: '"m" | "l"', default: '"m"', description: "Large sets the label one step up (the heroes, two). On a phone the heroes step down one size so the widest still fits." },
    { name: "busy", type: "boolean | string", default: "false", description: "The button says what it's doing. A string replaces the label while busy (Save becomes Saving); the periods breathe after it." },
    { name: "asChild", type: "boolean", default: "false", description: "Render the child element, such as a link, with the button's look." },
  ],
})
