import { defineComponent } from "./types"

export default defineComponent({
  name: "waterfall",
  title: "Waterfall",
  movement: "II",
  contract: "ot-waterfall",
  summary: "A type specimen waterfall: one sentence at every dynamic, loudest first, each line filled to the measure with as many whole words as the size holds.",
  underneath: "hook",
  props: [
    { name: "children", type: "string", description: "The words, as plain text: pretext measures how many each size holds. Begin with a short word so the loudest line has one to show." },
    { name: "from", type: '"pp" | "p" | "mp" | "mf" | "f" | "ff" | "fff" | "ffff"', default: '"ffff"', description: "The loudest dynamic to show." },
    { name: "to", type: '"pp" | "p" | "mp" | "mf" | "f" | "ff" | "fff" | "ffff"', default: '"pp"', description: "The quietest dynamic to show." },
    { name: "italic", type: "boolean", default: "false", description: "Set the specimen in the expression italic." },
    { name: "variant", type: '"specimen" | "decay" | "solo"', default: '"specimen"', description: "How the lines relate. specimen: the same words at every size, as a foundry's specimen shows a face. decay: the sentence is read once and falls away as it goes, as a note does after its attack; each line takes up where the one above stopped, a dynamic quieter, and the quietest says the rest and wraps. solo: the mixing desk's solo button; pointing at a line keeps it in ink and sends the others back to a rule, so you hear one size alone." },
  ],
})
