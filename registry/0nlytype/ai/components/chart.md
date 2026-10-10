# 0nlyType: chart

Extracted from DESIGN.md.

### db-chart (chart)
- Underneath: our own markup, plus a hook.
- Anatomy: `<figure class="db-chart" data-variant="stems | spark | isotype" style="--n: 9; --m: 1">` holding `.db-chart-read` (`.db-chart-value`, a large rolling number, and its label), `.db-chart-plot` of `<button class="db-chart-bar" style="--v: 0–1" aria-label>`, then `.db-chart-axis`. `data-now` marks the current bar. Spark renders spans instead (phrasing content, so it can sit in a `<p>`), the plot first and the reading after it; isotype's bars each hold `<i>` dots (`data-on`, `data-top`) and it ends with `.db-chart-key`.
- stems (the default): hairlines and dots against one very large number, as the posters set tiny data beside giant type. The number is as large as the chart allows (16% of its width, between `--db-ff` and `--db-fff`), so the scale contrast is SPECTRA's. Pointing at or focusing a bar inks its line, swells its dot and rolls the number to it; leaving rolls it back to now. The current month is the accent.
- spark: Tufte's sparkline, a chart the size of a word, set inside the sentence that talks about it. The stems stand on the baseline as tall as a capital, spanning the data's own range so the shape shows at that size; the accent dot sits on now, as Tufte marks the last point in red, and the number follows in the text's own size at weight 500, with "visits in September" after it as part of the line. Pointing rolls the number, as in stems. The stems are small targets, which the inline exception allows; each is still a labelled button for the keyboard.
- isotype: Otto Neurath's rule, count, don't scale. Each bar is a column of dots and one dot is a fixed amount (`each`, by default a tenth of the ceiling): what was had in ink, the room left to the ceiling in hairline rings, so the grid of discs is the picture, as in "28 December". Now's top dot is the one accent. A key under the axis says what a dot counts ("One dot, 500 visits"). Pointing at a column sets every other column back to rule-strong and counts its dots up from the bottom, one after another, as the number rolls.
- Series (`series`, stems): two or more read at once, each its own voice. The stems are solid, dotted and dashed, topped by a ring, a disc and a ring; the readout names them roman, italic and pencil, as "It has to be design." pairs the faces, each name after a short swatch of its line. Grouped (the default), a column's stems stand side by side a `--db-space-2` apart, now's first dot the accent; `stacked`, one stem per column is cut into a length per series with a dot at every joint, and the top joint is the accent. Each is a `.db-chart-mark` (`data-series`, `--b` and `--v` from 0 to 1) inside the column's button. Written for up to three.
- The readout for several series: the one giant number becomes a short list (`.db-chart-read[data-list]`: `.db-chart-at`, then `.db-chart-list` of `.db-chart-row`s, each a `.db-chart-value` and a `.db-chart-name`). The figures stand flush right in one column at `--db-mf` to `--db-f`, weight 200, as on a ledger, and each rolls on its own, only if it changed. Stacked, a hairline is ruled under the figures and the sum stands beneath it ("39 enquiries in all"), a sum set as on paper.
- Horizontal (`orientation`, stems; `data-orientation="horizontal"`): a ledger. The whole names stand in a column at the start, pencil, and each line runs out from an ink baseline on the start edge to its dot, one row (`--db-space-6`) each, rules at the quarters; the name the number reads is inked. Series stack or group along the row the same way.
- Keyboard: Tab enters the plot at the bar the number is on (one tab stop, a roving tabindex); Left and Right, or Up and Down, move to the next bar, Home and End jump to the ends. Right to left, Left and Right follow the page. Focus rolls the number as pointing does.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Chart (`chart`) | Roll | The number rolls to the month you point at, and back |
| Spark chart (`chart`) | Roll | The number in the sentence rolls to the stem you point at, and back |
| Isotype chart (`chart`) | Count | The other columns step back; the pointed column's dots pop up from the bottom in turn with spiccato as the number rolls |
| Series chart (`chart`) | Roll | Each figure in the list that changed rolls its own way; the stems ink |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Chart (`chart`) | POINT / SPECTRA | Tiny data against one giant number |
| Spark chart (`chart`) | Tufte's sparklines; "Healthy habits →" one line of thought | A chart the size of a word, set in the sentence |
| Isotype chart (`chart`) | Neurath's Isotype; "28 December" dots | Count, don't scale: a column of dots per month, rings for the room left |
| Series chart (`chart`) | "It has to be design." two faces; a ledger's sum | Each series its own line and voice; the giant number becomes a ruled list, the sum under the rule |
| Horizontal chart (`chart`) | A ledger, contents-page names | Names in a column at the start, lines run out from the start edge |
