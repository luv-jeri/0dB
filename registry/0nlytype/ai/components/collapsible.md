# 0nlyType: collapsible

Extracted from DESIGN.md.

### ot-collapse (collapsible)
- Underneath: native `<details>`.
- Anatomy: `<details class="ot-collapse">` whose `<summary>` is the tail of a list ("and 4 more"), then `.ot-collapse-list`.
- A list that ends in the rest of itself. The rest opens at reading speed through `::details-content`, and its lines arrive in turn.
- Keyboard: native.
- Variants go on `data-variant` (`Collapsible variant`): tail (the default), catchword, sotto. Tail's words are set as the list's caption, pp, straight under the last rule. Catchword and sotto set their summary as `.ot-collapse-cue` with two spans (the words, then `openLabel`).
- Catchword, after the printer's catchword: the first name of the rest waits at the foot, flush to the far edge, as the next page's first word waits under the last line. Opening, it steps back to the start (the summary is a container, so it travels `100cqi` less its own width) and grows into the first row of the rest, which follow it. Give the summary an `aria-label` that says what it does ("Show 4 more, from Tidewater").
- Sotto, after SPECTRA's fine print and the score's sotto voce: the rest is never hidden, only said under the breath, as one run of pp pencil fine print; the whole run is the control and inks when pointed at. Opening says it in full: each name grows into its own row, in turn, and the words to set it small again follow. The summary lies over the run in the same grid cell; its words are visually hidden while closed.
- Reduced motion: it opens at once. Right-to-left: the catchword waits at the left. Forced colours: rules and text keep their system colours.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Collapsible (`collapsible`) | Arpeggio | The rest opens at reading speed, line by line |
| Catchword collapsible (`collapsible`) | Arpeggio | The catchword steps back to the start and grows; the rows follow in turn |
| Sotto collapsible (`collapsible`) | Crescendo | Each name grows from fine print into its row, in turn |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Collapsible (`collapsible`) | "the silence that heals" captions | "and 4 more" is the control |
| Catchword collapsible (`collapsible`) | The printer's catchword | The rest's first name waits at the foot, then steps up into its row |
| Sotto collapsible (`collapsible`) | SPECTRA's fine print; the score's sotto voce | The rest is said small, never hidden; opening says it in full |
