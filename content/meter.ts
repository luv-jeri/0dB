import { defineComponent } from "./types"

export default defineComponent({
  name: "meter",
  title: "Meter",
  movement: "X",
  contract: "ot-meter",
  summary: "A bounded reading: your figure in large italic above a dimension line, one accent index locating it between its limits. Space remains space; nothing fills it in.",
  underneath: "native",
  props: [
    { name: "label", type: "ReactNode", description: "What is measured. A native label names the meter." },
    { name: "value", type: "number", description: "The reading, clamped to the range in both the display and the native meter. Must be finite. Use Progress for work being completed, and Slider for a value the reader can set." },
    { name: "min / max", type: "number", default: "0 / 100", description: "Finite limits with max greater than min. Negative ranges work. Invalid ranges throw a RangeError rather than displaying a misleading scale." },
    { name: "unit", type: "string", default: '""', description: 'Written as supplied after every figure: " GB" with its space, "%" without. The reading is italic; its unit and the scale limits are roman.' },
    { name: "format", type: "(value: number) => string", default: "en-GB, up to two decimals", description: "Formats the reading and both limits, such as a localized number or currency. Long figures scale down to the mf step, then wrap if needed. Choose the precision and locale explicitly when they matter." },
    { name: "note", type: "ReactNode", description: "Context beneath the scale, also included in the native meter's accessible description." },
    { name: "Native meter props", type: "meter props", description: "id, ref, low, high, optimum and aria attributes reach the native meter. aria-valuetext can supply a more descriptive reading; aria-describedby is joined with the note. className, style, hidden, dir and lang apply to the outer div." },
  ],
})
