import { defineComponent } from "./types"

export default defineComponent({
  name: "fraction",
  title: "Fraction",
  movement: "II",
  contract: "ot-fraction",
  summary: "A count set as a display fraction: yours large in italic, the total small beside it, a pen stroke between. A changed number turns over.",
  underneath: "native",
  props: [
    { name: "count", type: "ReactNode", description: "The part that's yours, in italic." },
    { name: "total", type: "ReactNode", description: "What it counts toward. Optional: left out, the stroke and the total go and the count stands alone as a rolling figure of yours, turning over figure by figure as it changes (a streak, a score). A figure that isn't the person's, a metric or a total, is a stat. Numbers grouped or pointed (1 284, 0.75) turn figure by figure too, the marks between staying put." },
    { name: "variant", type: '"solidus" | "vinculum" | "readout"', default: '"solidus"', description: "How the two numbers relate. solidus: side by side on a leaning pen stroke. vinculum: the built-up fraction, the count stacked over a level bar and the total under it; the bar is a gauge that inks the share done from its start and eases along as the count moves. readout: after Ikeda's 1/3 beside 0.13, the share hung small after the total as a decimal (0.75), which turns over with the count. In every variant the figures read left to right, in a right-to-left page too." },
  ],
})
