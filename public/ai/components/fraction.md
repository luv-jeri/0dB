# 0nlyType: fraction

Extracted from DESIGN.md.

### db-fraction (fraction)
- Underneath: native. Its CSS lives in base.css, so every item may use it.
- `<span class="db-fraction"><span class="db-yours">2</span><i><span class="db-sr"> of </span></i><span>5</span></span>`. A display fraction, read aloud as "2 of 5".
- The part that's yours stands large in the italic, up on the left; what it counts toward sits small, light and a little wide, down on the right, on the same baseline, so the words after it ("done") read on one line with both. Between them the solidus is a pen stroke: a leaning hairline that thins out at both ends and dips just under the line. Pointing inks the stroke and the total.
- `<Fraction count total>` turns a changed number over the way the count went (up as it grows, down as it shrinks), figure by figure like a counter's wheels: only the figures that changed turn, the units first and the carry one `--db-arpeggio` behind (19 to 20 turns both, 12 to 13 only the 3). A number that gains or loses a figure, or changes shape, or a word, turns over whole. Each figure is a `.db-fraction-figure`; the number is read aloud whole. The stroke ticks once, like a pen. Without motion the number simply changes.
- The figures read left to right in every direction: the fraction is its own isolated left-to-right run (`direction: ltr; unicode-bidi: isolate`), so in a right-to-left page it still reads "18/24", never "42/81"; only the words around it change sides.
- Alone: `total` is optional. Without one the stroke and the total go, and the count stands by itself, a rolling figure of yours at the same size in the italic (a streak, a score, words written); a figure that isn't the person's is a `stat`. Numbers grouped or pointed (3 466, 0.75) turn figure by figure as whole numbers do, the marks between them staying put; the readout does too.
- `variant` (`data-variant`; none for the default, `solidus`): `vinculum` or `readout`. Only the solidus ticks. Without a total there is nothing to relate, and every variant is the count alone.
- vinculum: the built-up fraction, as a printer sets one. The count stands over a level bar and the total under it, centred; the bar is a gauge, inked from its start for the share done (`--share`, set by the component from count over total) and a rule for the rest, from the right in a right-to-left page. As the count moves the ink eases along the bar (`--db-andante`), while the figures turn on their wheels. A total of nothing leaves the bar a rule.
- readout: after SPECTRA, where Ikeda prints 1/3 beside 0.13. The share as a decimal to two places (0.75), in the voice, pp, pencil, hung at the top after the total (`.db-fraction-readout`, aria-hidden: the fraction already says it). It turns over with the count; pointing takes it to graphite with the total.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Fraction (`fraction`) | Spiccato | A changed number turns over the way the count went, only the figures that changed, the carry one step behind; the stroke ticks once and settles |
| Vinculum fraction (`fraction`) | Breath | The ink eases along the bar to the new share while the figures turn |
| Readout fraction (`fraction`) | Roll | The decimal turns over with the count |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Fraction (`fraction`) | 20(25); a display fraction | Yours large in italic, the total small, a pen stroke between; or yours alone, turning over |
| Vinculum fraction (`fraction`) | The printer's built-up fraction; the dot calendar's gone and to come | The count over a bar that is also a gauge of the share |
| Readout fraction (`fraction`) | SPECTRA's 1/3 beside 0.13 | The share hung small after the total as a decimal |
