# 0nlyType: tour

Extracted from DESIGN.md.

### ot-tour (tour)
- Underneath: native `<dialog>` with `showModal()`, through the dialog item.
- Anatomy: `<dialog class="ot-tour">` the size of the window and see-through (no backdrop), holding `<svg class="ot-tour-lead" aria-hidden="true">` (a `line.ot-tour-line` and a `circle.ot-tour-dot`) and `.ot-tour-callout`: `.ot-tour-head` (the `h2.ot-tour-title` and `.ot-tour-count`, "03/04" with "Step 3 of 4" for screen readers), `.ot-tour-text`, then `.ot-tour-actions` (End, Back, Next or Done).
- After the Weingart letter: each step is an ink callout, its head in bold and the count at its far end as a corner note, hung on a long leader line that ends in a dot on the thing it is about. The dot is the accent (look here), set on the target's edge facing the callout; the leader leans off it toward the roomier side of the window and the callout hangs a space-7 beyond, held inside the window. A step with no target stands alone in the middle with no leader. Each step arrives as the note does, in turn: the dot lands (spiccato), the leader draws out, the callout spreads from the leader's tip (`clip-path: circle()`).
- It moves only when the person does: Next, Back, or the arrow keys (swapped right to left); a target out of view is scrolled to the middle first. It never plays by itself. The last step's Next reads "Done." and closes; End or Escape stops it anywhere. Uncontrolled, it starts again from the first step each time it opens.
- Keyboard and screen readers: focus opens on Next and stays on the control that moved it (Back, or Next once Back is gone). The title names the dialog and the text describes it; Next and Back are described by the count, the title and the text, so each new step is read as focus lands. On the ink the focus ring is in the paper's colour.
- Reduced motion: each step appears whole, and the scroll jumps. Forced colours: the callout keeps a border in CanvasText, the leader is CanvasText and the dot Highlight.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Tour (`tour`) | Arpeggio | On Next or Back only: the dot lands, the leader draws out, the callout spreads from its tip |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Tour (`tour`) | Weingart letter | Ink callouts hung on leader lines that end in a dot on the thing they are about |
