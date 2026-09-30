# 0dB: combobox

Extracted from DESIGN.md.

### db-combo (combobox)
- Underneath: cmdk inside a Radix Popover.
- Anatomy: `.db-field.db-combo-field` holding the label and the trigger, `<button class="db-combo" role="combobox" aria-haspopup="listbox" aria-expanded aria-controls>`, whose `.db-combo-value` shows the chosen label, or the placeholder with `data-placeholder`. It opens `.db-combo-pop` (the popover) holding a `db-command`: its input to narrow the list, then `.db-command-list` (`role="listbox"`) of `.db-command-option` rows (`role="option"`); `.db-command-empty` says what to try when nothing matches. Pencil has no trigger and no panel: `.db-combo-pencil` holds its own `<input role="combobox">` on the line, `<ul class="db-combo-list" role="listbox">` of `<li role="option">` under it, and `.db-combo-empty`.
- In each suggestion, the letters you typed are wrapped in `<mark>` (the highlighter), and the suggestions arrive in turn. The active option carries a dot (`aria-selected`). The picked value is yours, in italic.
- Keyboard: Down and Up move through the list, Enter takes one, Escape closes it.
- Variants go on `data-variant`: list (the default), concordance, pencil.
- Concordance, after the concordance's keyword-in-context column and Rand's grid: the suggestions are set so what you typed lines up in one column, highlighted, with each word's start set to the left of it and the rest running on to the right. As you type, the rows glide sideways to keep the match on that axis. A long suggestion ends in an ellipsis.
- Pencil, after the letter-cutter's pencilled layout ("pointing sketches in pencil, choosing inks"): no panel. The rest of the best match is pencilled after your words, in place, and the few others are listed in flow under the line. Tab (or the arrow toward the end, at the end of the line) inks the pencilled rest; Down and Up change which match is pencilled; Enter takes it; Escape puts back what was there. Choosing turns the word from pencil to ink. Its own input is the combobox, with `aria-activedescendant` on its own listbox. Forced colours set the pencilled rest in `GrayText`.
- `multiple` (with list or concordance): any number of choices, `value` an array in the order they were chosen. The line (`.db-combo-many`, a `PopoverAnchor`) writes them as one sentence with the badge's series tags ("*Didot*, *Futura* and *Univers*"): yours in the italic, ours the commas and the "and". Each word is a removable tag: pressing it strikes it and the sentence closes up round the gap, focus moving to the next word, or to the line after the last. The rest of the line, after the last word, is the trigger (it reads "3 chosen" to a screen reader); the baseline runs under the whole line and takes the accent on focus. The list stays open while you choose, Enter toggles the row under the dot, and a chosen row turns into the italic instead of taking the accent (many choices, one accent); rows carry `aria-checked` in a list marked `aria-multiselectable`. With `name`, each chosen value is sent as its own hidden input. The pencil stays single.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Combobox (`combobox`) | Arpeggio | The suggestions arrive in turn |
| Concordance combobox (`combobox`) | Glide to the axis | As you type, each row glides sideways to keep the match in its column |
| Pencil combobox (`combobox`) | Pencil, then ink | Chosen, the word inks from pencil |
| Multiple combobox (`combobox`) | Close-up | A word taken out is struck, then the sentence closes up and re-sets its commas |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Combobox, menu, command (`combobox`, `dropdown-menu`, `context-menu`, `command`) | Weingart letter | The highlighter marks what matches |
| Concordance combobox (`combobox`) | The concordance's keyword column; Paul Rand's grid | What you typed stands in one column down the list |
| Pencil combobox (`combobox`) | The letter-cutter's pencilled layout | The rest of the name pencilled after your words; Tab inks it |
| Multiple combobox (`combobox`) | The written list (serial punctuation); ours roman, yours italic | The choices written on the line as one sentence; a chosen row turns italic |
