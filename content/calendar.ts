import { defineComponent } from "./types"

export default defineComponent({
  name: "calendar",
  title: "Calendar",
  movement: "VIII",
  contract: "db-month",
  summary: "A month of dots: past days filled, today in the accent, days to come as rings. The day you choose shows its number in italic.",
  underneath: "hook",
  props: [
    { name: "value / defaultValue / onValueChange", type: "Date, (date) => void", description: "The chosen day, controlled or not." },
    { name: "month / defaultMonth / onMonthChange", type: "Date, (month) => void", description: "Any date in the month on show. Left out, it's the chosen day's month, else today's." },
    { name: "today", type: "Date", description: "Which day counts as today. Left out, it's the device's, read once the page has loaded so the server and the browser agree." },
    { name: "disablePast", type: "boolean", default: "false", description: "Days before today can't be chosen." },
    { name: "locale", type: "string", default: '"en-GB"', description: "Month and weekday names. Weeks start on Monday." },
    { name: "Keyboard", type: "note", description: "One tab stop. Arrow keys move by day and week, Page Up and Page Down by month, Home and End to the ends of the week; Enter or Space chooses." },
  ],
})
