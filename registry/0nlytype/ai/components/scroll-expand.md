# 0nlyType: scroll-expand

Extracted from DESIGN.md.

### db-expand (scroll-expand)
- Underneath: native, plus a hook that reads the scroll from the real layout; made of `corners` and `meta`.
- Anatomy: `<figure class="db-expand" data-variant="horizon">` holding `.db-expand-frame` (a `db-corners`) round `.db-expand-plate` (the content), then `figcaption.db-expand-caption` with a `db-meta` row: the caption's words, then `.db-expand-share` (aria-hidden). The hook sets `--p`, 0 to 1.
- mark (the default): after the printer's crop marks and the frame of SHAPES / GRADIENTS. The plate is cropped (a clip-path) to a small square in the middle (`--db-expand-mark`, `--db-space-8`), and the four corner marks, `--db-space-4` long, stand a step (`--db-space-2`) outside the crop, as crop marks stand outside the trim. As the page scrolls the crop opens to the whole plate. The caption's row is as wide as the crop (never narrower than 20rem or its space), so its hairlines draw out as it opens, the rule that carries the date and the name; the row ends on the share of the measure the crop has reached, in pencil tabular figures (0.42), as SPECTRA sets 0.13.
- Scrubbed: `--p` is 0 as the plate's top comes in at the foot of the view and 1 once its middle is at the middle of the view (or as far as the page can scroll). It is read from the real layout in a frame asked for by the scroll event, which runs after a smooth scroller (Lenis) has moved the page, so the crop and the page move in the same frame. Nothing eases: it stops when you stop and closes when you scroll back. `progress` pins it.
- horizon: after Eclipse, the disc standing on one line. The crop starts as a hairline across the whole measure (the horizon, drawn in `--db-rule-strong` while it's shut, and gone by a quarter open) and opens up and down from it; the caption stays full width.
- The whole plate is in the flow and read from the start; only the view of it is cropped. Nothing to focus. Reduced motion, or no script: it stands open. It is symmetric, so right to left changes nothing. Forced colours: the marks and the horizon in CanvasText.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Scroll expand (`scroll-expand`) | Rubato (the reader's tempo) | The crop and its marks open only as far as the scroll has gone, forwards or back |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Scroll expand (`scroll-expand`) | The printer's crop marks; SHAPES / GRADIENTS frame | Crop marks open from a small mark to the measure as you scroll; the caption's rule draws out with them |
| Horizon scroll expand (`scroll-expand`) | Eclipse | The plate opens up and down from a hairline horizon |
