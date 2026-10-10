# 0nlyType: grid

Extracted from DESIGN.md.

### db-grid (grid)
- Underneath: native. A server component; it never moves.
- Anatomy: `<div class="db-grid" data-variant="rules | dots" style="--db-grid-cell">` holding four `.db-grid-cross` (`data-corner="start-top | end-top | start-foot | end-foot"`), two `.db-grid-ticks` (`data-axis="columns | rows"`, `aria-hidden`), then the content.
- A quiet structure behind a section, drawn as a construction sheet. Rules (the default): a faint square grid in `--db-rule`, from "the silence that heals" and "Less is more.". Dots: the rules left out and a fine point on each crossing in `--db-rule-strong`, from Paul Rand's dotted sheet.
- A registration cross (two pencil hairlines, `--db-space-3` long) is centred on each corner of the box, as poster 4 marks its corners with + signs. The first row and column are the sheet's border: the columns numbered 01, 02, 03 along the top and the rows lettered A, B, C down the start edge (Rand's dimension letters), each label hugging the corner where its line begins, in `--db-pp` pencil tabular figures, clipped where the box ends (48 columns and 26 rows are labelled; the lines go on past them). The content has one cell of padding, so it stands on a line.
- `cell` sets the square (a number of pixels or any length, `--db-grid-cell`, default `--db-space-7`). Right to left, the grid, the numbers and the letters run from the right edge.

## Motion

No item-specific row is defined in DESIGN.md. Read the general rules in DESIGN-core.md and the contract above.

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Grid (`grid`) | "the silence that heals" faint grid; "Less is more."; the posters' + corner signs | A faint square grid with a cross on each corner and a lettered, numbered border |
| Dots grid (`grid`) | Paul Rand's dotted construction grid and dimension letters | A fine point on each crossing, the rules left out |
