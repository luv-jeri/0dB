import { defineComponent } from "./types"

export default defineComponent({
  name: "card",
  title: "Card",
  movement: "IX",
  contract: "db-card",
  summary: "A column under a rule, not a box. Point at it and an ink stroke passes along the rule.",
  underneath: "native",
  props: [
    { name: "CardFigure", type: "p", description: "One giant letter, cropped by the rule like a poster's headline. Decorative, so it's hidden from screen readers." },
    { name: "CardLink", type: "a", description: "Goes inside CardTitle. Its hit area stretches over the whole card, so the card is a single target with one focus ring." },
    { name: "CardFooter", type: "div", description: "A frame row: each child is a small fact, with a hairline between them." },
  ],
})
