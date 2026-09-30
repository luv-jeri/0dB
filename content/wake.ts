import { defineComponent } from "./types"

export default defineComponent({
  name: "wake",
  title: "Wake",
  movement: "II",
  contract: "db-wake",
  summary: "A paragraph that parts around your pointer like water around a hand: the lines it crosses split in two and the words move on.",
  underneath: "hook",
  props: [
    { name: "children", type: "string", description: "The paragraph, as plain text: pretext measures it." },
    { name: "radius", type: "number", default: "3.2", description: "How far the text gives way around the pointer, in em." },
    { name: "mark", type: "boolean", default: "false", description: "Draw a hairline ring where the text has parted." },
  ],
})
