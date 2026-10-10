# 0nlyType: radial-chart

Extracted from DESIGN.md.

### ot-radial (radial-chart)
- Underneath: our own markup, plus a hook.
- Anatomy: `<figure class="ot-radial" data-variant="ring | horizon" style="--n: 3" aria-label>` holding `.ot-radial-face` (`aria-hidden`) of one `ot-ring` per series (`style="--i"`, and `data-shown` on the one the number reads), `<figcaption class="ot-radial-read">` (`.ot-radial-value`, a large rolling number, then `.ot-radial-words`: `.ot-radial-name` and `.ot-radial-of`), and, with more than one series, `<ul class="ot-radial-key">` of one `<button>` per series.
- The ring, exported as `Ring` so the timer and the pie chart stand on it: `<span class="ot-ring" data-head="end | start" style="--ot-ring-p; --ot-ring-from" aria-hidden="true">` holding `.ot-ring-head`, a zero-width radius rotating about the ring's centre so its invisible box never projects beyond the circle. The calendar's vocabulary: a hairline ring in rule-strong for the room still to go, the arc inked on it at `--ot-stroke` for what was had, and a dot at one end of the arc. Both strokes are inset box-shadows cut by a conic mask, as the dot calendar sweeps its days, so they stay one hairline and one stroke at any size. `--ot-ring-p` (how much, 0–1) and `--ot-ring-from` (where the arc begins, 0–1) are registered numbers eased at andante. The parent sets `--ot-ring-sweep` (the share of a turn the ring spans, 1 by default) and `--ot-ring-start` (0deg is the top; it runs clockwise); `--ot-ring-inset`, `--ot-ring-ink`, `--ot-ring-track` and `--ot-ring-head` step it in and colour it. A pie is several rings on one circle, each with its own `from`, and `head="none"`.
- ring (the default): "28 December". One ring per series, concentric, the first outermost, each starting at the top and running clockwise. The number stands inside the innermost ring as large as it allows (weight 200: SPECTRA's scale against the small print), the series' name and "of 30 days" under it. The dot of the series the number reads is the one accent; the others are ink.
- horizon: the Eclipse. Half rings stand on a hairline horizon that runs a step past them on both sides, and everything else is said below it: the number stands on the line (its baseline trimmed to it), its words under the line. Right to left, the half rings rise from the right.
- Pointing at a ring (the nearest by radius) or pointing at or focusing its name in the key inks it: the other rings step back to rule-strong, the accent dot moves to its ring and the number rolls to it, up if it is larger. Leaving rolls it back to now. A changed value glides at andante; nothing draws itself in on arrival.
- Screen readers: the figure is named by `label` and the readout is its caption; each key button reads its name, value and "of 30 days". Keyboard: native buttons. Forced colours: the track is GrayText, the arc CanvasText, the dot Highlight.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Radial chart (`radial-chart`) | Roll | The pointed ring inks, the others step back, the accent dot moves to it and the number rolls; a changed value glides at andante |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Radial chart (`radial-chart`) | "28 December" rings; SPECTRA | A ring per series, inked as far as it has got, one giant number inside |
| Horizon radial chart (`radial-chart`) | Eclipse | Half rings on a horizon; the number on the line, its words below it |
