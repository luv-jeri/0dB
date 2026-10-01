# 0dB: link

Extracted from DESIGN.md.

### db-link (link)
- Underneath: native `<a>`. Its CSS lives in base.css, so every item may use it. `.db-prose a` is the same link.
- One link. At rest, a hairline under the words in the current colour, clear of the descenders. Pointing, focusing (`:focus-visible`) or holding its card open (`data-state="open"`, a hover card's trigger) draws the highlighter through the whole word, ascenders and descenders included, on from the left and off to the right (mirrored right to left), and the hairline gives way to it. The stroke runs 0.12em past each end, like a pen overshooting, while the words stay put. The letters turn `--db-on-mark` exactly where the stroke has reached (two layers clipped to the text), so they are never dark on dark in Nocturne. The hairline and the overshoot come back once the pen has passed.
- Focus: the stroke, with the accent line under it at `--db-stroke` in place of the outline box (forced colours keep the outline). Pressed (`:active`): the line snaps back under the stroke in ink, at `--db-stroke`. Read (`:visited`): the line fades to pencil; browsers let `:visited` change colour only, which is why the line is the box's bottom border and not a painted layer.
- `external` (the component prop): opens in a new tab, with "(opens in a new tab)" for screen readers, and a ↗ that hangs just past the end of the words, off the line, on the last line however the link wraps; the link keeps room for it, so it can't be stranded at the start of a line. Pointing sends it a step the way it points.
- `data-variant="quiet"`: the line in `--db-rule-strong`, for a run of links that already reads as links (an index, a programme), so the run isn't a barcode. `--db-link-line` sets the line's colour directly.
- `data-variant="reference"`: after the book's reference marks. No line; a raised mark after the words in the printer's order (* † ‡ § ‖ ¶, then doubled, a CSS counter with `@counter-style db-notes`), numbered down the page. The mark says there is more; pointing strokes the words and the mark together. The mark is generated content with empty alternative text, so screen readers read only the words. For sources and definitions in running text.
- `data-variant="address"`: after the printed page, where a link is spelled out so a reader can go there. Pointing or focusing writes where it goes, small, pencil and in parentheses (no scheme, no `www.`, no trailing slash), after the words from where they end, clear of the ↗ on an external link. A wrapping `.db-link-addressed` span holds the link and its `.db-link-address` sibling, reserving the address's measure even at rest so revealing it moves nothing. When there is no room beside the words, the address steps under; long addresses wrap. Use it for a link on its own line (a list, a footer). The address is `aria-hidden`; it isn't drawn with `asChild`.
- Docs rows pin states with `data-force`: `hover`, `focus`, `press`, `visited`.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Link (`link`) | Pass-through | The highlighter passes through the word and the line gives way; an external link's ↗ steps the way it points |
| Address link (`link`) | Written | Pointing writes the address in from where the words end; leaving, it's taken back the other way |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Link (`link`) | Weingart letter's highlighter | The highlighter passes through the word |
| Reference link (`link`) | The book's reference marks (* † ‡ § ‖ ¶) | No line; a raised mark says there is more |
| Address link (`link`) | The printed page's spelled-out address; 20(25) | Pointing writes where it goes, in parentheses, after the words |
