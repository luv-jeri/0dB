import { defineComponent } from "./types"

export default defineComponent({
  name: "card",
  title: "Card",
  movement: "IX",
  contract: "db-card",
  summary: "A column under a rule, not a box. Point at it and an ink stroke passes along the rule.",
  underneath: "native",
  props: [
    { name: "variant", type: '"rule" | "epigraph" | "ledger"', default: '"rule"', description: "rule: a column under a rule, the giant letter hanging from it with its top cut off, the way SPECTRA's line cuts its word. epigraph: for someone else's words about the work; the quotation stands first, indented to the end of the column in the italic a book gives an epigraph, with its attribution after a short rule, and the rule moves down to open the title like a chapter's head. ledger: for what something costs; CardSum's figures add up in a column as wide as the total, which is ruled off the way an account is, a single rule over it and a double rule under it." },
    { name: "CardFigure", type: "p", description: "One giant letter, cropped by the rule like a poster's headline. Decorative, so it's hidden from screen readers." },
    { name: "CardLink", type: "a", description: "Goes inside CardTitle. Its hit area stretches over the whole card, so the card is a single target with one focus ring." },
    { name: "CardSum", type: "dl", description: "For ledger: a <div> of <dt> and <dd> per line, the last one the total. The figures are tabular, so the column adds up by eye." },
    { name: "CardFooter", type: "div", description: "A frame row: each child is a small fact, with a hairline between them." },
  ],
})
