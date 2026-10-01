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
    { name: "TooltipContent variant", type: '"whisper" | "initials" | "beside"', default: '"whisper"', description: "whisper: a few words in thin, tall parentheses above the control. initials: the same, for a key or an abbreviation; wrap each letter the control shows in <b> and it is reversed out of the ink inside its word (Lays the <b>g</b>rid over the page). beside: the words on the control's own line, after it, on a hairline that runs from the control; at the right, or at the left on a right-to-left page." },
    { name: "TooltipContent side / sideOffset", type: "Radix", default: '"top" / 8 (beside: the line\'s end / 10)', description: "Where it sits. Keep a whisper above unless there's no room; flipped above or below, beside drops its line." },
  ],
})
