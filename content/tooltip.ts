import { defineComponent } from "./types"

export default defineComponent({
  name: "tooltip",
  title: "Tooltip",
  movement: "IX",
  contract: "db-tip",
  summary: "A whisper in parentheses above the thing it names.",
  underneath: "radix",
  props: [
    { name: "delayDuration", type: "number", default: "400", description: "How long a still pointer waits before the whisper. Focus shows it at once." },
    { name: "TooltipContent side / sideOffset", type: "Radix", default: '"top" / 8', description: "Where it sits. Keep it above unless there's no room." },
  ],
})
