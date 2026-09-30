# 0dB: steps

Extracted from DESIGN.md.

### db-steps (steps)
- Underneath: native `<ol>`.
- Anatomy: `<ol class="db-steps" data-variant="margin | rise | cascade">` of `<li class="db-step">`, each with an `h3.db-step-title` and its text. `data-current` marks where the person is and sets `aria-current="step"`; `data-done` marks what's behind them.
- margin (the default): the numbers are a real sequence, so they are set large and thin at `--db-f` in the margin, in two figures as the posters number ("Less is more." 01), in pencil. Done steps' numbers go to ink; the current number takes the accent and lands with spiccato. A hairline stands between steps.
- rise: the numerals stand huge and thin (`--db-ff`, weight 100) on one rule-strong hairline running across the page, a column to each step, like letters cut by a line in SPECTRA and Paul Rand's grid. A step to come is sunk into the line, only the top of its figures showing; reached, its numeral rises out whole in the accent (andante, exhale), and it stays standing in ink once done. Below 40rem the steps stack, each on its own line, at `--db-f`.
- cascade: no numerals. The titles (`mf`, 300) are set as one broken headline that steps across the page a space-8 at a time (space-5 below 40rem; the stair stops at the fifth step), the way "Healthy habits → for creatives" breaks its line, so the order is read in the space itself. Behind you in pencil, ahead in graphite; where you are in ink, with the accent arrow after the title pointing on to the next (it steps forward into place with spiccato when the sequence moves on; ← right to left). The last step, reached, closes the headline with an accent full stop instead.
- folio: the compact one, after SPECTRA's large 1/3 beside its small notes and "Less is more."'s 01. The sequence folds into one `db-fraction` at `--db-ff` (`--db-f` below 40rem) in `.db-steps-folio`: where you are in the accent italic ("02"), of how many small and upright after the pen stroke ("/05"), in two figures. Only the step you're on is shown beside it (`data-shown`), its title on the figure's baseline and its text under it in graphite; the other steps stay in the `<ol>`, visually hidden, so a screen reader hears the whole order and `aria-current`. Moving on, the figure turns over figure by figure (the fraction's roll). All done, the figure goes to ink.
- `value` / `defaultValue` / `onValueChange` on Steps: the step you're on, counted from 1 as the numerals are; the steps before it are done, and one past the last means all done. A Step's own `current` and `done` win when given. With `onValueChange`, a done step's title is a `<button class="db-step-back">` back to it (not in folio, whose done steps are hidden); pointing or focus draws a hairline under it.
- Only for real sequences. A list that isn't an order is `db-rows` or plain prose.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Steps (`steps`) | Spiccato | The current numeral lands |
| Steps, rise (`steps`) | Rise | The reached numeral rises out of the line |
| Steps, cascade (`steps`) | Onward | The arrow steps forward into place |
| Steps, folio (`steps`) | Roll | The figure turns over to the new step, figure by figure |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Steps (`steps`) | "Less is more." 01 | Large thin figures in the margin |
| Steps, rise (`steps`) | SPECTRA; Paul Rand's grid | Numerals sunk into a line rise out as you reach them |
| Steps, cascade (`steps`) | "Healthy habits → for creatives" | The titles step across the page; an arrow points on |
| Steps, folio (`steps`) | SPECTRA's 1/3; "Less is more." 01 | The whole sequence folded into one fraction beside the step you're on |
