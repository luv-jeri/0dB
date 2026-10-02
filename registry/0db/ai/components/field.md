# 0dB: field

Extracted from DESIGN.md.

### db-field (field)
- Underneath: native input and textarea, plus a hook for the counter. The count and filled state follow controlled values, child changes and native form resets as well as input events.
- Anatomy: `.db-field` holding a `.db-label`, an optional `.db-field-count`, then the `input` or `textarea`, then an optional `.db-field-hint` or `.db-field-error`. The counter stays at the inline end and reads count / limit, isolated left to right even on an RTL page.
- No box, only a baseline. Focus draws the accent line outward from where the pointer touched it (script sets `--o`, a percentage) or from the left for the keyboard, and shows the counter. The placeholder steps back to half strength on focus.
- Yours: the typed value, in the italic. The placeholder stays in the voice, in pencil.
- Textarea: ruled like paper, with lines every `--lh` (2.25rem) that scroll with the text.
- `Textarea grow` makes room for the visitor’s thought: Pretext counts the native value at the content width, using the computed italic font and its tracking, after document.fonts.load. Blank lines and a final newline count. Optional minRows (4) and maxRows (unbounded) clamp whole ruled lines; beyond the maximum it scrolls. Controlled/uncontrolled changes, form reset, clientWidth resize and the four html face attributes remeasure. It never replaces the textarea or writes its value, so caret and selection stay native. There is no height travel while typing. The existing italic and baselines are unchanged. Source: Paul Rand’s measured construction sheet (11.jpg), giving each line its exact room.
- **Why it is type-only:** Owner decision 2026-10-02 approves 2.5D depth, type-made images, shapes made of words and opt-in sound because type is the material and carries meaning. This item carries the portfolio story, never an effect-only depth-background, particle-text, typography-vortex or warp-text: no blur, shadows, gradients, fills or particles; distance is scale, ink to pencil and plane angle only, with one accent in view.
- States: rest, focus, filled, error (`aria-invalid="true"` turns both lines crimson; the message in `.db-field-error` is linked with `aria-describedby`), disabled (dotted baseline).
- The error is a callout, after Weingart: a crimson hairline pill hung from the baseline by a leader line, with a dot where it meets the line. A textarea's ruled lines turn crimson too. It arrives in order: the dot lands, the leader drops, then the pill and its words.
- Error copy says what to fix: "Check the address. It needs a domain after the @, like studio.com."
- Variant `overprint` (after "It has to be design."): the label is set in the voice as a heavy condensed word at `--db-f`, and your italic is printed over its lower half, knocked out of it by a paper outline (`-webkit-text-stroke` in `--db-paper`, painted under the fill). There's no placeholder; the label is the prompt. Arriving, the word draws in its width (Inhale) and your words and caret take the accent, so the baseline stays a hairline.
- Variant `signature` (the printed form's signature line): a cross (`.db-field-mark`) stands at the start of the line and the label becomes a caption under it. Your words are set larger, at `--db-mf`. Arriving, the + turns a quarter to the × of "sign here" and inks; once written (`data-filled`) it stays × in pencil. The caption holds the start under the line, so the error callout hangs from the end.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Growing textarea (`field`) | Making room | Height snaps to the measured whole-line count; caret and baselines remain still |
| Field (`field`) | From the touch | The accent line grows out from where you touched it |
| Field error (`field`) | Arpeggio | Dot, leader, pill, in that order |
| Overprint field (`field`) | Inhale | Arriving, the label draws in its width and your words take the accent |
| Signature field (`field`) | Spiccato | Arriving, the + turns to × and inks; written, it steps back to pencil |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Growing textarea (`field`) | Paul Rand measured construction sheet (11.jpg) | Each typed line earns exactly one ruled baseline |
| Field error (`field`) | Weingart callouts | Pill on a leader line from the baseline |
| Overprint field (`field`) | "It has to be design." | Your italic printed over a heavy condensed label, knocked out in paper |
| Signature field (`field`) | The printed form's signature line | A cross where you write; the label a caption under the line |
