# 0nlyType: slider

Extracted from DESIGN.md.

### db-ruler (slider)
- Underneath: native range, plus a hook for the readout.
- Anatomy: `.db-ruler[data-variant="dimension | spread | dynamics"]` holding a label, an `<output>`, `.db-ruler-hand` (the `<input type="range">`, and for spread `.db-ruler-letters`) and `.db-ruler-scale` of `<span style="--n: 0…1">`. Script sets `--p` (0–1). Spread and dynamics need a string label; they keep it in the DOM as `.db-sr` and draw it `aria-hidden`.
- The track is a ruler: minor ticks every 5%, major every 25%, and the filled part in ink. The thumb is an ink hairline topped by the accent dot (`--h` tall).
- Dimension (the default). Yours: the value, a large italic numeral set in the gap of a dimension line (after Paul Rand), `.db-ruler-value`. The line runs from zero to the thumb, with a tick at each end, and always stays true to the hand: when the gap is too short for the figure, script sets `data-outside` and the figure stands outside, past the far tick, as a draughtsman sets it.
- Spread. After "Renaissance.", whose words are spread to the edges: the label's letters, in capitals, are the ruler's marks, set out across its whole length over a single baseline (`--h: 64px`). The hand stands through them and inks every letter it has passed, splitting the one it stands in, as "the uncreative" splits its word (`background-clip: text`). Your number, `.db-ruler-corner`, waits in the far corner; the scale keeps only its two ends.
- Dynamics. The score marks loudness pp to ff in italic under the notes. Here the label, `.db-ruler-loud`, is as loud as the value: its weight runs 100 to 900 and its width 62% to 125% with the hand (as far as the pair's voice allows), with your number after it; its size is set from its letter count and the ruler's width (a size container), so at its heaviest it still fits one line and nothing reflows while you drag. The scale reads pp p mp mf f ff as `.db-term`, and the nearest marking inks (`data-on`).
- The value and unit are one text node, isolated left to right; a shorter number never shifts a separate unit node. The ruler and the figure's placement still follow the page direction.
- While the thumb is held (`:active`), the value lifts 5px, and it drops back with spiccato when you let go.
- States: rest, focus (outline 8px out), disabled (45% opacity). Right to left, zero is on the right, the fill, the ink through the letters and the outside figure follow. Forced colours: the ruler restates its tokens in system colours (`CanvasText`, `GrayText`, `Highlight` for the dot).
- Keyboard: arrows step, Page Up / Page Down jump, Home / End go to the ends.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Slider (`slider`) | Lift | The value rises while the hand is on it |
| Spread slider (`slider`) | Ink follows | The ink runs through the letters with the hand |
| Dynamics slider (`slider`) | Swell | The word grows heavier and wider with the hand |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Slider (`slider`) | Paul Rand dimension lines | Value set in a dimension from zero |
| Spread slider (`slider`) | "Renaissance."; "the uncreative" | The label's letters are the ruler's marks; the hand inks them |
| Dynamics slider (`slider`) | The score's dynamics | The label is as loud as the value |
