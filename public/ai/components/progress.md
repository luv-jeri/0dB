# 0dB: progress

Extracted from DESIGN.md.

### db-progress (progress)
- Underneath: native `<progress>`, named by a native `<label>` (or `aria-label="Progress"` without one). Leave out `value` (or pass `null`) and it is indeterminate.
- Anatomy: `.db-progress` (`data-variant`, `data-state="loading|complete|indeterminate"`) holding `.db-progress-label`, the variant's figure (`aria-hidden`), and `<progress>`. One number, `--db-progress-p` (0–1, a registered property), is eased at andante, so the fill, the numeral and the ink glide together.
- The label keeps the action's name: "Uploading 12 files", then "Uploaded 12 files". It carries no full stop; every variant ends the same way: when it's done, a full stop lands (spiccato).
- `hairline` (default): a line fills in ink toward a ring, and the percentage, `.db-progress-value`, is set as a large italic numeral that ticks through every number on its way (a CSS counter on the eased value, rounded down, so it never says 100 early). Done, the ring fills into a full stop.
- `sentence`: the words are the bar. The label is set large and inks in from pencil, in reading order, with a soft wet edge, sliced across lines so a wrapped sentence inks line after line. Yours (italic) inks in with it. Done, a full stop drops onto the baseline. The native bar is visually hidden.
- `count`: for things you can count. A `db-fraction` (count of total) rolls as each item lands, and `.db-progress-units` shows one ring per item, like days on the calendar: done is a dot (`data-done`, spiccato pop), the one under way an ink ring (`data-now`), the rest pencil rings. Up to 100 rings; past that each ring stands for a share. Screen readers hear "4 of 8" (`aria-valuetext`).
- `parentheses`: from 20(25). The label stands in the middle of the measure between two thin parentheses (`.db-progress-paren`, weight 100), and the work still to do is the silence inside them. Two `.db-progress-rest` spacers share the free space by (1 − p) (`flex-grow`, fed by the eased number), so as the work goes the parentheses close on the words from both ends; done, they hold them and the full stop lands inside. Flex, so right to left mirrors, and the glyphs mirror themselves. The native bar is visually hidden.
- `tally`: how a hand counts. A `db-fraction` as in count, and `.db-progress-tally`: one stroke per item in gates of five (`<b>`), four standing and the fifth crossing them, so the count reads in fives at a glance. To come, a stroke is a pencil hairline; as its item lands, ink draws down it (the fifth, across it); the next one waits in ink (`data-now`). Done, a dot lands after the last gate. Up to 100 strokes. Screen readers hear "7 of 12".
- Indeterminate: the number stands back and a stroke reads along, only while it runs: a segment passes along the line, a band of ink passes through the words, the rings and the strokes ink in turn, and the parentheses listen, drawing a little way in and back. Reduced motion: no pass, a still rule, the parentheses at the ends. Right to left: the line fills and the words ink from the right; the gates mirror.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Progress (`progress`) | Andante, then spiccato | The line, the ticking italic numeral and the inked words glide on one eased value; each ring and the closing full stop pop as they land |
| Parentheses progress (`progress`) | Closing | The parentheses glide in on the words from both ends on the eased value; unknown, they draw a little way in and back |
| Tally progress (`progress`) | Written | Ink draws down each stroke as its item lands, and across the fifth; the full stop lands after the last gate |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Progress (`progress`) | Dot calendar | A ring per item fills; the words ink in; done lands a full stop |
| Parentheses progress (`progress`) | 20(25) | The work still to do is the silence inside the parentheses |
| Tally progress (`progress`) | The hand's tally; Basquiat sheet | One stroke per item, the fifth crossing the four |
