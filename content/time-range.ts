import { defineComponent } from "./types"

export default defineComponent({
  "name": "time-range",
  "title": "Time range",
  "movement": "VI",
  "contract": "db-time-range",
  "summary": "A typographic day caliper: two native time readings position and stretch the actual interval across a full day.",
  "underneath": "native",
  "props": [
    {
      "name": "label",
      "type": "ReactNode",
      "description": "Native legend for the time interval."
    },
    {
      "name": "value / defaultValue",
      "type": "TimeRangeValue",
      "description": "Start and end as HH:mm, or empty. Controlled or initially empty. Minute precision; native time inputs preserve their keyboard editor."
    },
    {
      "name": "onValueChange",
      "type": "(value: TimeRangeValue) => void",
      "description": "Reports either endpoint edit without changing the other."
    },
    {
      "name": "overnight",
      "type": "boolean",
      "description": "Defaults to false. Explicitly permit an end before the start to mean the following day. Equal endpoints mean zero, not 24 hours."
    },
    {
      "name": "startProps / endProps",
      "type": "input props",
      "description": "Names, required, min/max, ref, form and native handlers on each input. Type and minute step are owned by the component."
    },
    {
      "name": "formatDuration / startLabel / endLabel / invalidLabel / emptyLabel",
      "type": "function / string",
      "description": "Localize duration and interface text. End-before-start sets native custom validity and names what to fix."
    },
    {
      "name": "Native props",
      "type": "fieldset props",
      "description": "Root ref and presentation. These are civil minutes, without a date, timezone or daylight-saving calculation."
    }
  ]
})
