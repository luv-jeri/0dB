# 0nlyType: resizable

Extracted from DESIGN.md.

### db-resize (resizable)
- Underneath: hook (a separator you can drag or move with the arrow keys).
- Anatomy: `.db-resize` holding two `.db-resize-pane`, `<div class="db-resize-handle" role="separator" tabindex="0" aria-valuenow>` between them, and `.db-resize-dim` (aria-hidden). Script sets `--split` (a percentage) and `data-dragging`.
- Take the rule and it inks; while held, each pane's share is drawn as a dimension, after Paul Rand.
- Keyboard: Left and Right move it by 5, Home and End go to 20 and 80.
- The frame is a construction line, dotted in rule-strong, after Rand's working drawings: it marks where the panes may go rather than boxing them.
- Variants go on `data-variant` (`ResizablePanelGroup variant`): rule (the default), fit, flow.
- Fit, after "It has to be design." set heavy and condensed, and wood type locked up to the measure: each pane's `<h3 class="db-resize-title" data-slot="resizable-title"><span>` is set in 800 to fill its pane edge to edge. The script moves Archivo's width axis first (62% as the pane narrows, 125% as it widens), and changes the size only past those ends, so narrowing a pane condenses its word before it shrinks it. It sets `data-set` once measured, and re-sets on every resize and when `<html>` changes its face.
- Flow, after the newspaper's continued column: the group's `text` runs through the panes as `.db-resize-flow` paragraphs of `.db-resize-line` lines (aria-hidden; the whole text once, in the first, as `.db-sr`). The first pane holds as many lines as its height does, and the rest carry on at the top of the next, at its measure, the first of them in ink; move the rule and the break moves. pretext lays the lines; until it has, the first pane holds the plain paragraph. The group takes a fixed height (17rem).
- Forced colours: the rules and dimensions are drawn in CanvasText (Highlight when taken).

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Resizable (`resizable`) | Measure | The rule inks; the dimensions appear while held |
| Fit resizable (`resizable`) | Measure | The titles condense and extend with the rule, frame by frame |
| Flow resizable (`resizable`) | Measure | The lines re-break under the hand as the rule moves |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Resizable, aspect ratio (`resizable`, `aspect-ratio`) | Paul Rand dimension lines | Shares measured; a printer's crop marks |
| Fit resizable (`resizable`) | "It has to be design." heavy condensed; wood type locked to the measure | The title fills its pane, condensing before it shrinks |
| Flow resizable (`resizable`) | The newspaper's continued column | One paragraph runs through the panes; the rule moves the break |
