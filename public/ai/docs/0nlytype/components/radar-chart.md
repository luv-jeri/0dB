# 0nlyType: radar-chart

Extracted from DESIGN.md.

### db-radar (radar-chart)
- Underneath: the grid item (`variant="dots"`) as the sheet, an SVG drawn in pixels, plus a hook; the axis names are native buttons.
- Anatomy: `<figure class="db-radar" style="--n; --m">` holding a `db-grid[data-variant="dots"].db-radar-sheet`, inside it `.db-radar-plot` (`role="group"`, `aria-label`, square, `--r` the rim's radius) of `<svg class="db-radar-draw" aria-hidden>` (`.db-radar-build`: the construction polygons at the quarters and the spokes; a `.db-radar-series` per series, `data-series`, each a `.db-radar-line` and a `.db-radar-bead` per point; and, while an axis is measured, `.db-radar-dims`, one `.db-radar-dim` per series), `.db-radar-figure` (one series), and one `<button class="db-radar-axis" style="--c; --s">` per axis. With series, `<figcaption class="db-radar-key">` of `.db-radar-name`s, each after a `.db-radar-swatch`.
- Paul Rand's "design": a dotted construction sheet, lettered and numbered along its border, with registration crosses at its corners (the grid item's), and on it dotted construction polygons at each quarter and dotted spokes, the rim a step firmer. The shape is one ink hairline through the values, clockwise from the top, a paper bead on each point, as line-chart threads its rings. Each axis is named at its end in small caps (`all-small-caps`, pencil), hung off the spoke in the direction it runs. The rim's radius is a third of the plot, less where the plot is narrow, so the names keep 76px beside it and stay off the sheet's lettered border.
- Pointing at an axis (the nearest by angle) or at its name, or focusing its name, inks the name, fills its bead of the first series in the accent (the one accent in view, with spiccato), and measures the value off as Rand's dimension line: a hairline stepped a little off the spoke, from the centre to the point, ticked at both ends and drawn out from the centre (moderato, exhale). One series sets its figure beside the line, "9/10", the rim's value after it in pencil (SPECTRA's fractions). With series, each series has its own dimension line, one step further from the spoke, in its own line's voice, and the key gives each figure.
- Series (`series`): the second is dashed graphite and named in italic, the third dotted pencil (chart's voices: roman, italic, pencil). Written for up to three.
- Fewer than three axes draw no shape: a line says "A radar needs three measures or more; this one has 2."
- Keyboard: the names are one tab stop (`rove`, round); the arrows go round the axes and wrap, Home and End jump to the first and last. Right to left the drawing, the names and the arrows mirror. Screen readers: each name reads "Width range: 10 of 10" (with series, each series' figure). Forced colours: the lines CanvasText, the construction GrayText, the measured bead Highlight.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Radar chart (`radar-chart`) | Measure | The dimension line is drawn out from the centre to the point (moderato, exhale), its figure set on it; the bead lands in the accent with spiccato |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Radar chart (`radar-chart`) | Paul Rand's dotted construction grid and dimension lines | A hairline shape on a dotted sheet, the measured axis read as a ticked dimension line |
