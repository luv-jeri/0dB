import { defineComponent } from "./types"

export default defineComponent({
  name: "steps",
  title: "Steps",
  movement: "VIII",
  contract: "ot-steps",
  summary: "A real sequence. Numbered in large thin figures in the margin; or the figures stand on one line and rise out of it as you reach them; or the titles step across the page like a broken headline; or, compact, the whole sequence folded into one fraction beside the step you're on.",
  underneath: "native",
  props: [
    { name: "variant", type: '"margin" | "rise" | "cascade" | "folio"', default: '"margin"', description: "On Steps. margin: two-figure numerals, large and thin, in the margin; done ink, current the accent. rise: the numerals stand huge on one hairline across the page; a step to come is sunk into the line with only its top showing, and when it is reached its numeral rises out whole in the accent. Below 40rem the steps stack. cascade: no numerals; the titles step across the page like a broken headline, behind you in pencil and ahead in graphite, and where you are in ink with an accent arrow pointing on (a full stop on the last step). folio is the compact one: the sequence folds into one fraction (\"02/05\", where you are in the accent italic), and only the step you're on is shown beside it, its title on the figure's baseline; the others stay in the list for screen readers. Moving on, the figure turns over." },
    { name: "value / defaultValue / onValueChange", type: "number, (value) => void", description: "On Steps. The step you're on, counted from 1 as the numerals are, controlled or not; the steps before it are done, and one past the last means all done. Left out, each Step's current and done say where you are. With onValueChange, the titles of the steps behind you become buttons back to them (not in folio, which hides them; give it your own Back button)." },
    { name: "Step current", type: "boolean", description: "The step the person is on. Its numeral is the view's one accent. Left out, Steps' value decides." },
    { name: "Step done", type: "boolean", description: "A finished step: its numeral turns ink. Left out, Steps' value decides." },
  ],
})
