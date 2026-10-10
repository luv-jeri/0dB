# 0nlyType: meta

Extracted from DESIGN.md.

### db-meta (meta)
- Underneath: native. Its CSS lives in base.css, so every item may use it.
- A frame row of words held apart by flexing hairlines, level on the first line's baseline. The row never wraps, so no hairline is left at the end of a line pointing at nothing: where the words don't fit, each one stacks in its place (balanced), tops level, as the corner notes of "Healthy habits" do.
- `data-variant="proportional"` with `at`: after the score's proportional (space) notation, where distance is time. Each hairline is as long as the interval between its neighbours (`--db-span`, set from `at`), in `--db-rule-strong` because here the line is data. Where the row is too narrow, the hairlines fall to their shortest.
- `data-variant="credits"` with `MetaItem label`: after Ikeda's SPECTRA credits. No hairlines between; one rule over small columns hung from it, each a pencil label over its value in ink, figures tabular. The columns wrap.

## Motion

No item-specific row is defined in DESIGN.md. Read the general rules in DESIGN-core.md and the contract above.

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Meta (`meta`) | SHAPES / GRADIENTS frame row; "Healthy habits" corner notes | Words held apart by hairlines; stacked where they don't fit |
| Proportional meta (`meta`) | The score's proportional notation | Each hairline as long as the interval it stands for |
| Credits meta (`meta`) | SPECTRA credits | One rule, small columns of label over value |
