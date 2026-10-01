# 0dB: date-picker

Extracted from DESIGN.md.

### db-date (date-picker)
- Underneath: Radix Popover holding the calendar.
- Anatomy: `<button class="db-date" popovertarget="id" aria-haspopup="dialog">` inside a sentence, opening an `db-pop` that holds an `db-month`. `data-set` marks a chosen date.
- A date inside a sentence, like the select. The month hangs from it on a leader line; choosing a day writes it into the sentence in italic and closes the popover.
- `variant` passes to the month (dots, ruler, ghost or parenthesis); each holds at popover size (the ghost is sized to the month's width, the parenthesis line wraps to it), where `--big` steps the numeral down to `--db-ff`. Opening focuses the day that holds the month's tab stop (the chosen day, else today).
- Keyboard: the month's own (arrows move by day or week, Enter chooses); Escape closes.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Date picker (`date-picker`) | Spiccato | The month hangs from the sentence; the date writes in |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Date picker, popover (`date-picker`, `popover`) | Weingart callouts | Hung from the opener on a leader line |
