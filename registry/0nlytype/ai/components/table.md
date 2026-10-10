# 0nlyType: table

Extracted from DESIGN.md.

### ot-table (table)
- Underneath: native `<table>`.
- Anatomy: `<table class="ot-table">` with header `<button>`s inside `<th aria-sort>`, numeric cells marked `data-num`, `.ot-table-name` for the row's name, and `<input type="checkbox" class="ot-table-pick">` per row plus one to choose all.
- Hairline rows and tabular figures. The sorted column is set in ink (`data-sorted`). Re-sorting, the rows glide to their new places (FLIP: `TableBody` measures each row's `offsetTop` after every render and animates the difference, andante on the breath; still under reduced motion). Choosing a row fills its ring with spiccato and its name turns italic (`data-picked`); the foot counts the picks.
- `variant` on the table (`data-variant`): `ink` (the default), `forte` or `cross`.
- forte: SPECTRA's giant type against tiny data. The sorted column is also set loud, in large thin figures (`mf`, weight 250; `mp` below 40rem), on the same baselines as the small print of the rest. Re-sorted, the loudness passes from one column to the next (moderato, breath) as the rows glide.
- cross: a road atlas's distance chart. Point at a cell, or focus something inside it, and its row and its column cross in ink, their headings too; the cell where they meet is the accent, the one place you are; the rest steps back to pencil. It is a reading aid only: every figure reads in full without it, and screen readers get the table's own headers. Written for up to eight columns (one rule each); below 30rem the chart steps down to small print so it keeps its columns. Forced colours: the meeting cell is Highlight.
- Keyboard: native buttons and checkboxes; in a cross chart, focus inside a cell crosses it.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Table (`table`) | Glide | The rows glide to their new order; a pick's ring lands |
| Forte table (`table`) | Crescendo | Re-sorted, the old column falls quiet as the new one swells, while the rows glide |
| Cross table (`table`) | Ink follows | The crossing inks under the pointer, allegro, and the rest falls to pencil |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Table (`table`) | Renaissance two-colour | Only the sorted column in ink |
| Forte table (`table`) | SPECTRA; the score's forte | The sorted column set loud, in large thin figures, against small print |
| Cross table (`table`) | A road atlas's distance chart; "Renaissance." two colours | The row and column you point at cross in ink, the meeting cell the accent |
