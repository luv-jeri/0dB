# 0dB: number-input

Extracted from DESIGN.md.

### db-number (number-input)
- Underneath: a native text input with `role="spinbutton"`, plus a hook.
- Anatomy: `<div class="db-number" data-variant="line | scale">` holding `.db-number-reading` (`.db-number-cell`, which stacks the `input.db-number-input` and `.db-number-figures` of `.db-number-figure` spans, `aria-hidden`, in one grid cell; then an optional `.db-number-unit`), a bracket `db-btn.db-number-less` and `.db-number-more` (`tabIndex -1`), for scale `.db-number-tape` (`aria-hidden`, `style="--at"`, the value in steps), and with `name` a hidden input that submits the plain number. `data-editing` while you type, `data-held` while the ruler is dragged.
- A field's baseline, and the accent line grows from where you touched it. Yours: the figure, in italic tabular figures, formatted by `Intl.NumberFormat` (`format`, `locale`, fixed to `en` so the first paint agrees). What you see is the figures layer; the input underneath holds the plain figures (the locale's decimal mark, no grouping), and a touch or a keystroke shows them to edit, with the caret in the accent. Leaving, Enter or a step reads what you typed (locale digits and decimal marks are normalized; grouping, currency and spaces are ignored), clamps it to `min` and `max`, and shows it formatted again; Escape puts back the value. Something that isn't a number goes back to the last number.
- `unit` is ours, upright in pencil after the figure, and follows it (`field-sizing: content`), so the line reads as one phrase; forms by plural category agree with the number (1 guest, 3 guests), and screen readers hear it in `aria-valuetext`.
- Line (the default): less and more stand in brackets at the line's end, the words of "Less is more."; at an end the word that can't go further goes pencil and is disabled. Each step turns the figures over like a counter's wheels: if the number keeps its length only the figures that changed turn, the units first and each place one `--db-arpeggio` later, up as it grows and down as it shrinks; otherwise it turns over whole. Steps count from `min` (or zero) in whole steps, so 0.1 + 0.2 lands on 0.3.
- Scale: the dial's tuner drawn small, and Paul Rand's dimension ticks. Your figure is set at `--db-f` over the index, less and more at the two ends of its line, and the baseline is the edge of a ruler whose ticks hang from it, one per step (`--db-number-pitch`, 10px) and a longer one every ten, fading at both ends. The index is an ink stroke standing through the ruler; focus draws the accent along its edge. Stepping slides the ruler a tick (moderato, spiccato); drag it sideways and it follows the hand, a step a tick, and the figures change without turning while it's held. The row always reads left to right, as the tumbler's figures do.
- States: empty (the placeholder in our voice, in pencil), rest, focus, typing, at an end, error (`aria-invalid`, from a Field: the line crimson), disabled (the dotted baseline, pencil figures). Forced colours restate the tokens in system colours.
- Keyboard: Up and Down step, Page Up and Page Down step ten, Home and End go to `min` and `max`, Enter commits, Escape puts back. Less and more are for the hand and keep focus where it was.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Number input (`number-input`) | Counter | A step turns the changed figures over, units first, each place an arpeggio later |
| Scale number input (`number-input`) | Slide | A step slides the ruler a tick and lands with spiccato; dragged, it follows the hand |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Number input (`number-input`) | "Less is more."; the counter's wheels | Less and more in brackets at the line's end; the changed figures turn over |
| Scale number input (`number-input`) | The dial's tuner; Paul Rand dimension ticks | Your figure over the index of a ruler that hangs from the baseline |
