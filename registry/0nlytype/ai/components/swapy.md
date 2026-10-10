# 0nlyType: swapy

Extracted from DESIGN.md.

### db-swap (swapy)
- Underneath: native buttons on `rows`, plus a hook.
- Anatomy: `<div class="db-swap" data-variant="transpose">` holding a `db-rows` list (`aria-label`), each `<li data-id data-held>` holding `.db-swap-n` (the place, aria-hidden), `.db-rows-title`, `.db-rows-kind`, `.db-rows-meta` and `<button class="db-swap-move" aria-pressed>` (the words move and moving in one cell, then `.db-swap-arrow`); a hint and a polite status in `.db-sr`. Transpose adds `svg.db-swap-arc` and `.db-swap-tr`, both aria-hidden. `data-holding` on the root while a row is held; `data-dragging` while the pointer carries it.
- Rows you put in order by hand. A word is the handle: "move ↕", graphite, the arrow pencil; pointing inks both and nudges the arrow. Press it and the row is held, the word says moving, the arrow keys carry it, and pressing again sets it down. Or drag the word: the held row goes to the place under your hand, read from the layout so nothing jitters, and is set down where you let go. There is no drag ghost: the row itself travels.
- Default, after "the uncreative": the held row reverses out of an ink block that prints across it from the inline start, the words turn to paper, and the name steps forward and sets heavier and tighter (300 to 560, -0.035em). Every row that changes place glides there (moderato, breath) and its number turns over the way it went, the numbers being data (01, 02 in pencil tabular figures, always left to right). Only the held row inks, so one block travels with your hand.
- Transpose, after the proofreader's transposition mark: no ink. The held name turns italic (yours now, at the expression scale on the row's own line height, so nothing reflows) and the others step back to pencil. In the margin (`--db-swap-margin`, space-7, space-6 below 40rem) a hairline loop runs from the place it was picked up to the place it is now, ending in an ink dot, with a pencil italic tr by its middle. Set down, the mark fades: the correction is made.
- Screen readers hear each step once, politely: "Halden picked up, 2 of 5.", "Halden, 3 of 5.", "Halden set down, 3 of 5.", "Halden put back, 2 of 5.". The word's name says the row and its place.
- States: rest, pointed at (`data-force="hover"` pins the first row's word), held, disabled (pencil, no handles). Right to left the block prints from the right, the loop hangs in the right margin and the figures still read left to right. Forced colours: the held row is `Highlight` with `HighlightText`, the loop `CanvasText`. Reduced motion: rows and numbers change place without travel.
- Keyboard on the word: Space or Enter picks up and sets down; Up and Down carry the row (picking it up if needed); Home and End take it to the ends; Escape puts it back; leaving the word sets it down.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Swapy (`swapy`) | Glide | Held, the ink prints across the row; the rows glide to their new places and their numbers turn over |
| Transpose swapy (`swapy`) | Mark | The loop follows the held row through the margin, and fades when it is set down |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Swapy (`swapy`) | "the uncreative" | The row you hold reverses out of ink and travels with your hand |
| Transpose swapy (`swapy`) | The proofreader's transposition mark | A loop in the margin from where the row was to where it is, the held name in italic |
