# 0nlyType: alert

Extracted from DESIGN.md.

### ot-alert (alert)
- Underneath: native.
- Anatomy: `<div class="ot-alert" role="status">` (or `role="alert"` for errors) holding `.ot-alert-title`, a sentence, and optional `.ot-alert-actions`. `data-variant="error"` for what went wrong. `data-arriving` plays the entrance.
- A double bar, the sign in a score that something changes here. It draws down the margin, then the words arrive beside it in turn. Crimson only for an error, and then it says what to do. An error wears the final bar instead, thin then thick: what was happening stopped here.
- `cue` (after "It has to be design."'s "Watch this space."): a hairline arrow runs in from the margin, `clamp(40px, 12vw, 135px)` long, and stops at the first word of the title, at its x-height. Arriving, the line draws from the start, the head lands, then the words arrive. Right to left, it comes in from the right. For a notice that stands across a page.
- `errata`: the printer's errata slip. `AlertCorrection` sets "for *was* read *now*": the two in large italic (`del` and `ins`, so a screen reader hears the change), the one withdrawn stepped back to pencil, "for" and "read" small and upright between them on the same baseline. Arriving, the old words fade from ink to pencil and the new ones write in from the start. No bar.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Alert (`alert`) | Double bar | The bars draw down, then the words arrive |
| Cue alert (`alert`) | Cue | The line draws in from the margin, the head lands, the words arrive |
| Errata alert (`alert`) | Written | The old words step back to pencil; the new ones write in |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Alert (`alert`) | The score's double bar | Two bars down the margin; an error, the final bar |
| Cue alert (`alert`) | "It has to be design.": Watch this space | A hairline arrow runs from the margin to the words |
| Errata alert (`alert`) | A book's errata slip | "for *was* read *now*" |
