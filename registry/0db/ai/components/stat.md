# 0dB: stat

Extracted from DESIGN.md.

### db-stat (stat)
- Underneath: native `<dl>`; each `Stat` is a `<div>` of `<dt>` (what it counts) and `<dd>`s (the figure, and a note).
- Anatomy: `<dl class="db-stats" data-variant="beside | grid" style="--row-len">` of `<div class="db-stat" style="--len">` holding `.db-stat-label`, `.db-stat-figure` (a `db-fraction` with no total, set in the stat's own face: roman, thin, the cell's size; its figures turn on their own wheels and it is read whole) and `.db-stat-note`.
- crop (the default): SPECTRA's giant thin figures (weight 200), set as large as the cell allows; one hairline runs under the whole row and cuts off their feet (text-box trimmed to the cap height), the name small beneath. A row shares one size, set by its longest figure (`--row-len`), so the figures stand on one line. Numbers are grouped by a thin space, as SI sets them, since the crop would cut a comma's tail.
- beside: WOVE's 03 and the "14/08" of "the silence that heals": the figure heavy (700) and whole, its name and a line about it set beside it, their caps on its cap line. The stats stand in a list, figures flush to one edge in tabular figures so the units line up, the words in one column.
- grid: "Less is more.": each stat a cell of a hairline grid, the lines between cells only; the name in the cell's first corner, the figure in the far one.
- A changed value turns over like a counter's wheels (the Fraction's): only the digits that changed turn, the units first and each carry one arpeggio behind, down for a smaller value and up for a larger; a figure that gains or loses a place turns over whole. Nothing moves until the value does.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Stat (`stat`) | Roll | A changed figure turns over like a counter's wheels, units first, only the digits that changed |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Stat (`stat`) | SPECTRA crop; POINT | Giant thin figures cut off by the one hairline under the row |
| Beside stat (`stat`) | WOVE's 03; "the silence that heals" 14/08 | A heavy figure with its name and a line set beside it |
| Grid stat (`stat`) | "Less is more." | A hairline grid, the name in one corner and the figure in the far one |
