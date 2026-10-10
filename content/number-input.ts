import { defineComponent } from "./types"

export default defineComponent({
  name: "number-input",
  title: "Number input",
  movement: "VI",
  contract: "ot-number",
  summary: "A number on a baseline, yours in italic and formatted; less and more step it, and each step turns the changed figures over like a counter. Or it stands over a small ruler you can drag.",
  underneath: "hook",
  props: [
    { name: "variant", type: '"line" | "scale"', default: '"line"', description: "line: your figure on a field's baseline, with less and more in brackets at the line's end, the words of \"Less is more.\". scale: the dial's tuner drawn small, after Paul Rand's dimension ticks; your figure stands over an index, and the baseline is the edge of a ruler whose ticks hang from it, one per step and a longer one every ten. Stepping slides the ruler a tick; drag it sideways and it follows the hand, the number with it." },
    { name: "value / defaultValue", type: "number | null", default: "null", description: "The number, controlled or not. null is nothing written yet." },
    { name: "onValueChange", type: "(value: number | null) => void", description: "Called with each new number, as you type (once it reads as a number) and as you step." },
    { name: "min / max", type: "number", description: "The ends. Leaving the field clamps what you typed to them; less or more goes pencil at its end; Home and End go there." },
    { name: "step", type: "number", default: "1", description: "One step, counted from min (or zero), so decimals land exactly: 0.1 + 0.2 is 0.3." },
    { name: "format", type: "Intl.NumberFormatOptions", description: "How the number reads when you're not typing it: grouping, decimals, a currency or a unit. Typing shows the plain figures." },
    { name: "locale", type: "string", default: '"en"', description: "The locale that reads and writes the figures. Fixed by default, so the server and the browser print the same thing." },
    { name: "unit", type: "string | { one, other, … }", description: "Ours, after your figure, upright in pencil. Forms by plural category agree with the number: 1 guest, 3 guests. Read out with the value." },
    { name: "name", type: "string", description: "Submits the plain number with a form, through a hidden input." },
    { name: "…input props", type: "native", description: "id, placeholder, disabled, readOnly, aria-* and the rest go to the real input, a spinbutton. Inside a Field it takes the Field's id, hint and error." },
  ],
})
