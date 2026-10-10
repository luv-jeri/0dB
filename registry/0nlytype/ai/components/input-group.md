# 0nlyType: input-group

Extracted from DESIGN.md.

### ot-input-group (input-group)
- Underneath: native.
- Anatomy: `.ot-input-group` holding `.ot-input-group-text` (prefix), the `input`, then optional suffix text or a quiet `ot-btn`. It sits inside an `ot-field`.
- Ours and yours on one line: the prefix and suffix stay upright in pencil, the typed part is italic between them. The accent line draws only under your part (the input is its anchor), from where you touched it.
- A suffix follows your words (the input is as wide as what's in it, `field-sizing: content`), so an address reads as one phrase. A touch on the empty part of the line writes in the input.
- `InputGroupText` takes `agree`, the forms of a unit by plural category, and agrees with the number typed: 1 night, 3 nights.
- Variant `legend` (after the "28 December" calendar and the 14 / 08 of "the silence that heals"): your figure is set large, at `--ot-ff`, and our words stand stacked beside it in two small lines, the first in ink, the second in pencil. The input comes first.
- Variant `arrow` (after "It has to be design.": "Watch this space."): a hairline arrow (the group's `::before`, drawn by a mask) runs from your words to the action at the end. The shaft gives way as you write, inks once what you wrote is valid, and steps forward when you point at the action. It turns round right to left.
- A search input draws no native clear mark, as in `ot-field`.
- States: rest, focus, error (`aria-invalid="true"`), disabled.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Input group (`input-group`) | From the touch | The accent line grows only under your part |
| Arrow input group (`input-group`) | Give way | The shaft shortens as you write, inks when it's ready, and steps toward the action you point at |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Input group (`input-group`) | "It has to be design." | Ours upright, yours italic, on one line |
| Legend input group (`input-group`) | "28 December" dots; "the silence that heals" 14 / 08 | Your figure large, our words stacked beside it, the unit agreeing |
| Arrow input group (`input-group`) | "It has to be design.": "Watch this space." | A hairline arrow from your words to the action |
