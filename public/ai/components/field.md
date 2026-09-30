# 0dB: field

Extracted from DESIGN.md.

### db-field (field)
- Underneath: native input and textarea, plus a hook for the counter.
- Anatomy: `.db-field` holding a `.db-label`, an optional `.db-field-count`, then the `input` or `textarea`, then an optional `.db-field-hint` or `.db-field-error`.
- No box, only a baseline. Focus draws the accent line outward from where the pointer touched it (script sets `--o`, a percentage) or from the left for the keyboard, and shows the counter. The placeholder steps back to half strength on focus.
- Yours: the typed value, in the italic. The placeholder stays in the voice, in pencil.
- Textarea: ruled like paper, with lines every `--lh` (2.25rem) that scroll with the text.
- States: rest, focus, filled, error (`aria-invalid="true"` turns both lines crimson; the message in `.db-field-error` is linked with `aria-describedby`), disabled (dotted baseline).
- The error is a callout, after Weingart: a crimson hairline pill hung from the baseline by a leader line, with a dot where it meets the line. A textarea's ruled lines turn crimson too. It arrives in order: the dot lands, the leader drops, then the pill and its words.
- Error copy says what to fix: "Check the address. It needs a domain after the @, like studio.com."
- Variant `overprint` (after "It has to be design."): the label is set in the voice as a heavy condensed word at `--db-f`, and your italic is printed over its lower half, knocked out of it by a paper outline (`-webkit-text-stroke` in `--db-paper`, painted under the fill). There's no placeholder; the label is the prompt. Arriving, the word draws in its width (Inhale) and your words and caret take the accent, so the baseline stays a hairline.
- Variant `signature` (the printed form's signature line): a cross (`.db-field-mark`) stands at the start of the line and the label becomes a caption under it. Your words are set larger, at `--db-mf`. Arriving, the + turns a quarter to the × of "sign here" and inks; once written (`data-filled`) it stays × in pencil. The caption holds the start under the line, so the error callout hangs from the end.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Field (`field`) | From the touch | The accent line grows out from where you touched it |
| Field error (`field`) | Arpeggio | Dot, leader, pill, in that order |
| Overprint field (`field`) | Inhale | Arriving, the label draws in its width and your words take the accent |
| Signature field (`field`) | Spiccato | Arriving, the + turns to × and inks; written, it steps back to pencil |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Field error (`field`) | Weingart callouts | Pill on a leader line from the baseline |
| Overprint field (`field`) | "It has to be design." | Your italic printed over a heavy condensed label, knocked out in paper |
| Signature field (`field`) | The printed form's signature line | A cross where you write; the label a caption under the line |
