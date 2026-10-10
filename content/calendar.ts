import { defineComponent } from "./types"

export default defineComponent({
  name: "calendar",
  title: "Calendar",
  movement: "VIII",
  contract: "ot-month",
  summary: "A month drawn as time, after the \"28 December\" poster: a huge numeral, then a large disc for every day, ink for the days gone, the accent for today, rings for the days to come, and half-moons for the wait. The ruler draws the same month as one measured line; the ghost sets the days against the date huge and faint behind them; the parenthesis runs the month as a line of figures with the wait in parentheses.",
  underneath: "hook",
  props: [
    { name: "value / defaultValue / onValueChange", type: "Date, (date) => void", description: "The chosen day, controlled or not." },
    { name: "month / defaultMonth / onMonthChange", type: "Date, (month) => void", description: "Any date in the month on show. Left out, it's the chosen day's month, else today's." },
    { name: "today", type: "Date", description: "Which day counts as today. Left out, it's the device's, read once the page has loaded so the server and the browser agree." },
    { name: "disablePast", type: "boolean", default: "false", description: "Days before today can't be chosen." },
    { name: "variant", type: '"dots" | "ruler" | "ghost" | "parenthesis"', default: '"dots"', description: "How time is drawn. dots, the poster: a disc a day, the number reversed out of the ink; the wait as half-moons; yours circled, in italic. ruler: the month as one line with a tick a day, inked as far as today; the numeral stands over the chosen tick and the wait is measured under the line as a dimension. Drag along the ruler to choose. ghost: the days as figures only, read through the chosen day (else today) set over its month's number, huge and faint behind them. parenthesis: the month as one running line of figures, a wider space closing each week, with the time from today to your day enclosed in parentheses." },
    { name: "caption", type: "ReactNode | null", description: "The tracked line at the foot. Left out, it counts the days in English (12 days to go, The last day of September); pass your own words for another language, or null for none." },
    { name: "locale", type: "string", default: '"en-GB"', description: "Month and weekday names. Weeks start on Monday." },
    { name: "Keyboard", type: "note", description: "One tab stop. Arrow keys move by day and week, Page Up and Page Down by month, Home and End to the ends of the week; Enter or Space chooses. Each day is read in full, such as Wednesday 30 September 2026, today." },
  ],
})
