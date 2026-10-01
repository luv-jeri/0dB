# 0dB: area-chart

Extracted from DESIGN.md.

### db-area-chart (area-chart)
- Underneath: line-chart's `ChartLines`, plus a hook.
- Anatomy: `<figure class="db-chart db-area-chart" data-variant="linear | smooth | step">`, as line-chart, each series' `<g>` also holding a `<pattern>` of one-pixel rules and a `.db-area-chart-drops` path filled with it.
- SPECTRA's barcode laid under a line. There is no fill: the volume is drawn as hairlines dropped from the line to the baseline at a close, even rhythm (one every three pixels, pencil), so the shape is made of the barcode's own marks and the space between them. The line along the top is ink; the rings and the pointed drop are line-chart's, and so is the rolling number.
- Series stack in order from the baseline, and each band keeps its own rhythm, three, six and twelve pixels apart (the second and third in rule-strong), so the bands read by density, not colour; the readout's swatches are samples of each rhythm. The readout lists each band, then a rule and the sum ("690 hours in all"). Written for up to three.
- The path styles are line-chart's. Stepped, the drops stand as a histogram.
- Keyboard: chart's. Forced colours: the drops are GrayText.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Area chart (`area-chart`) | Roll | As line-chart: the drop runs down through the barcode and the numbers roll |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Area chart (`area-chart`) | SPECTRA barcode | No fill: the volume is hairlines dropped at barcode rhythm; stacked bands differ by density |
