import { defineComponent } from "./types"

export default defineComponent({
  name: "picks",
  title: "Picks",
  movement: "VI",
  contract: "db-picks",
  summary: "A list of choices that carry their own content. The one you took turns italic, and either a dot slides to it along a plucked string its initial hangs in the margin like a rubricated capital, its name lies faint behind the list, or two registration crosses mark its corners.",
  underneath: "native",
  props: [
    { name: "variant", type: '"pizzicato" | "rubric" | "watermark" | "register"', default: '"pizzicato"', description: "How the choice is marked. pizzicato: one accent dot in the margin; choosing another slides it along a hairline string that is plucked, rings and falls silent. rubric: the chosen title's initial hangs in the margin two lines deep, in the italic and the accent, and the rest of the name closes up beside it; a name without capitals keeps whole and an accent pilcrow hangs there instead. watermark: the chosen title lies behind the list, huge, faint and cropped at its foot, and choosing another fades one mark into the next. register: two printer's registration crosses stand off the chosen pick's far corners and travel to the next, turning a quarter as they go; pointing sketches the pair in pencil. Nothing around it reflows." },
    { name: "name", type: "string", description: "Shared by every radio so a form submits the choice. Generated if left out." },
    { name: "legend", type: "ReactNode", description: "The small label over the list. Without one, give the group an aria-label." },
    { name: "value / defaultValue", type: "string", description: "The chosen pick's value." },
    { name: "onValueChange", type: "(value: string) => void", description: "Called with the new value when the choice changes." },
    { name: "Pick value", type: "string", description: "What this choice stands for." },
    { name: "Pick children", type: "ReactNode", description: "Anything: a PickTitle and a PickDescription, a swatch, a specimen. Plain text is taken as the title." },
    { name: "PickTitle children", type: "ReactNode", description: "The pick's name. Plain text crosses into the italic when chosen, and it is the text rubric takes the initial from and watermark sets behind the list. A name in a script without capitals (Arabic, Hebrew, Devanagari, Han) isn't split; rubric hangs a pilcrow beside it. A name in the other direction from the page takes a dir attribute." },
    { name: "PickDescription", type: "span props", description: "A line under the title, in the pencil; graphite once chosen. Rubric's capital drops through its first line." },
  ],
})
