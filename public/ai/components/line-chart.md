# 0dB: line-chart

Extracted from DESIGN.md.

### db-line-chart (line-chart)
- Underneath: chart's frame (`ChartFrame`), plus a hook. `LineChart` and `AreaChart` share `ChartLines`, which lays an SVG under chart's points.
- Anatomy: `<figure class="db-chart db-line-chart" data-variant="linear | smooth | step">` holding chart's `.db-chart-read`, then `.db-chart-plot` with `<svg class="db-line-chart-draw" aria-hidden>` (a `<g data-series>` per series, each a `.db-line-chart-line`) under chart's `<button class="db-chart-bar">` per point, then `.db-chart-axis`. Several series add chart's `.db-chart-mark`s and list readout.
- POINT and SPECTRA: tiny data against one giant number. One ink hairline runs through the points, drawn in pixels (measured with a ResizeObserver) so it stays a hairline at every width, and a paper ring sits on each point like a bead on a thread; now's ring is the one accent. The number above is chart's, as large as the chart allows. Pointing at a column, or focusing it, swells its ring, inks it, and drops the bar chart's own stem from the ring to the baseline (moderato, exhale), as if the line were the tops of the stems with the stems taken away; the number rolls to it and back to now when you leave. Before the plot is measured, only the rings show.
- Series: the second line is dotted graphite and the third dashed pencil; the readout becomes chart's short list, named roman, italic and pencil. Lines are not stacked.
- linear (the default): straight from point to point.
- smooth: the sweep of "Less stress. More creativity."'s script through its capitals, made honest: a monotone cubic (Fritsch and Carlson) through every point that never overshoots one, so the curve never claims a value the data doesn't have.
- step: Paul Rand's dimension lines, right angles only. Each point holds level across its own column and the line stands upright between columns, the draughtsman's line.
- Keyboard: chart's. Right to left the drawing is mirrored with the columns.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Line chart (`line-chart`) | Roll | The ring swells, a drop runs down from it to the baseline (moderato, exhale) and the number rolls; leaving, the drop withdraws |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Line chart (`line-chart`) | POINT / SPECTRA | One hairline with a ring per point; pointing drops the stem it stands for |
| Smooth line (`line-chart`) | "Less stress. More creativity." script | One monotone sweep through the points, never past them |
| Step line (`line-chart`) | Paul Rand's dimension lines | Right angles only, level across each column |
