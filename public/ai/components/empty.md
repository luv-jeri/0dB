# 0nlyType: empty

Extracted from DESIGN.md.

### ot-empty (empty)
- Underneath: native.
- Anatomy: `.ot-empty` (`data-variant="arc | tacet | blank"`) holding an optional `.ot-empty-figure` (aria-hidden, its text in a `<span>`), then `.ot-empty-title`, one sentence of direction, and one action.
- An invitation to act, not a mood. Every variant answers the person reaching for the action (pointing at or focusing it; `data-force="hover"` on the button pins it for the docs).
- `arc` (default): the zero is thin, wide and cropped to its top half, so "nothing" reads as the fermata's arc. Reaching for the action raises the arc a little.
- `tacet`: what a score prints on a part with nothing to play, "it is silent". The figure is the term (pass `Tacet`), set in the expression italic, as musical terms are, at the movement-title size. Reaching for the action is your entry, so the word dies away (morendo): it fades to the rule and its letters loosen a little.
- `blank`: the printer's page left blank on purpose. The words spread to the corners, as the posters' labels do: what is missing at the top start, what to do at the top end in a narrow ragged column, the action at the foot's end. The middle is silence with one small pencil line in it (the figure: "This space is left blank on purpose."). Reaching for the action, that line pales and loosens: it makes room. The region is at least `min(34rem, 80vh)` tall; right to left, the corners mirror.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Empty state (`empty`) | Rise | The arc lifts as you reach for the action |
| Tacet empty state (`empty`) | Morendo | The word dies away to the rule and loosens as you reach for the action |
| Blank empty state (`empty`) | Making room | The middle line pales and loosens as you reach for the action |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Empty state (`empty`) | SPECTRA crop | Half a zero, which is an arc |
| Tacet empty state (`empty`) | The score's tacet; "It has to be design." | The part's word for silence, set large in the italic |
| Blank empty state (`empty`) | A page left blank on purpose; "Renaissance." corners | The words at the corners, silence in the middle |
