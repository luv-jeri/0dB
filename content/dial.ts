import { defineComponent } from "./types"

export default defineComponent({
  name: "dial",
  title: "Dial",
  movement: "VI",
  contract: "db-dial",
  summary: "A number you turn to. The arc sets a few on a half circle and rolls to your choice; the tuner is a long scale on the rim of a wheel you turn by hand, by scroll or by key, and your number reads above it in italic. Dynamics sets the number at the size of its loudness, from niente to fff; the tumbler sets a whole number figure by figure, like the wheels of a lock.",
  underneath: "hook",
  props: [
    { name: "variant", type: '"arc" | "tuner" | "dynamics" | "tumbler"', default: '"arc"', description: "The arc: up to nine choices on a half circle, native radios, no script. The tuner: any number of steps on a wheel that turns. Dynamics: the numeral grows from the quiet size to the loudest as you drag, scroll or press the arrows, and its dynamic marking (niente, ppp to fff) reads under it in the accent. The tumbler: whole numbers set one figure at a time; up and down turn the figure held in parentheses, left and right move to another, and a typed digit sets it and steps on." },
    { name: "name", type: "string", description: "The form field's name, so a form submits the choice." },
    { name: "legend", type: "ReactNode", description: "The question, as a small label over the dial. It names the range too." },
    { name: "options", type: "(string | number | { value, label? })[]", description: "The choices in order. The arc takes up to nine; the tuner any number." },
    { name: "min / max / step", type: "number", default: "0 / 100 / 1", description: "Tuner without options, and dynamics: the scale runs from min to max by step. Tumbler: whole numbers from min (at least 0) to max; max sets how many figures there are, and the leading zeros stand in pencil." },
    { name: "major", type: "number", default: "10", description: "Tuner: a numbered tick every this many steps, and a half-length one halfway between. Page Up / Page Down jump by it." },
    { name: "value / defaultValue", type: "string | number", description: "The choice. Leave both out and the arc starts with none chosen, the tuner and dynamics at their first step, the tumbler at min." },
    { name: "onValueChange", type: "(value: string | number) => void", description: "Called with each new choice; on the tuner, with every step the wheel passes under your hand." },
    { name: "unit", type: "string", description: "Small words for the number, such as weeks: under the arc, after the reading on the others." },
    { name: "disabled", type: "boolean", default: "false", description: "The dial fades and won't turn. It disables the fieldset, so every radio or the range goes with it." },
  ],
})
