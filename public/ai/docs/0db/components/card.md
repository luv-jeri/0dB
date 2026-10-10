# 0nlyType: card

Extracted from DESIGN.md.

### db-card (card)
- Underneath: native.
- Anatomy: `<article class="db-card" data-variant="rule | epigraph | ledger">` holding an optional `.db-card-figure` (one giant letter, aria-hidden), `.db-card-title` with `.db-card-link`, `.db-card-body`, `.db-card-foot`, and for the ledger `<dl class="db-card-sum">` (a `<div>` of `<dt>` and `<dd>` per line, the last the total).
- A column under a rule, not a box. The giant letter hangs from the rule with its top cut off by it, the way SPECTRA's line cuts its word, so the stroke that passes along the rule when you point at the card passes over the cut. The link's hit area covers the card; focus rings the whole card in the accent.
- Epigraph: someone else's words about the work, set before its name the way a book sets a quotation before a chapter. The quotation stands first, indented to the end of the column, in the expression italic (italic here by the book's convention for epigraphs, like `.db-term`, not because the reader typed it), its attribution flush to the end after a short rule, as the em dash would stand. The rule leaves the top of the card and opens the title below instead, like a chapter's head, and pointing passes the stroke along it there.
- Ledger: for what something costs. The lines of `.db-card-sum` add up in tabular figures, in a column as wide as the total; the total, large and light, is ruled off the way an account is, a single rule over it and a double rule under it, both only as wide as the figures. Nothing else changes: it keeps the rule and its stroke.
- Forced colours: the rule becomes a border, since background images are dropped.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Card (`card`) | Pass-through | An ink stroke passes along the rule, over the letter's cut |
| Epigraph card (`card`) | Pass-through | The stroke passes along the rule over the title |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Card (`card`) | SPECTRA crop | A giant letter hanging from the rule, cut off by it |
| Epigraph card (`card`) | A book's epigraph | Their words before the name, indented to the end, the rule opening the title |
| Ledger card (`card`) | The accountant's ruled-off total | A single rule over the total and a double rule under it |
