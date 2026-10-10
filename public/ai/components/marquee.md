# 0nlyType: marquee

Extracted from DESIGN.md.

### db-marquee (marquee)
- Underneath: native, plus a hook that reads scroll and an elapsed-time animation clock.
- Anatomy: `<div class="db-marquee" data-variant="ticker | counter">` holding `.db-marquee-frame` (overflow clip, a zero minimum inline size, inside a `minmax(0, 1fr)` grid column) and the `.db-marquee-pause` word button beneath it. The frame holds one `.db-marquee-row` (two for counter; `data-back` on the one that runs towards the start), each a `.db-marquee-track` of `.db-marquee-words` lists. The first list of the first row is the one readers get (`aria-label` from `label`); the copies that fill the band are aria-hidden and inert. `--o` is how far it has travelled, wrapped to one run (`--period`).
- A band of words that drifts at 24px per second by default. Scrolling takes over immediately: its position is the accumulated drift plus how far the band has risen through the view times `speed` (0.4), read after a smooth scroller's frame. It runs back when you scroll back and resumes drifting after a short rest. Scrolling down it reads along, the words coming in at the end and leaving at the start; `reverse` turns both drift and scroll round. The duplicated track is clipped by its own frame and can never set the page's width.
- band (the default): after "Renaissance." and "Less is more.", every word a statement closed by its own full stop, and after SPECTRA, set so large in a light weight that the frame's ends crop it. Pass a dynamic class (`db-fff`, `db-ff`) for the size.
- ticker: small capitals, widely spaced (`--db-space-7`), in graphite between two hairlines, after the Renaissance poster's top row and the SHAPES / GRADIENTS frame row. No full stops: these are labels, not statements.
- counter: after SPECTRA's two rows. The band twice, the upper row cut at its head and the lower at its feet, meeting on one hairline and running opposite ways during drift and scroll.
- It measures again when its width or one run's width changes (a new face or size), so it needs no watch on `<html>`. Right to left the words read and travel the other way. Reduced motion: the words stand still and wrap as one list, the copies and the second row gone.
- Autoplay (owner-approved exception, 2026-10-01): `autoplay` defaults to true; false keeps only person-driven behaviour and omits the pause control. `defaultPaused` starts it paused. The small roman `( pause )` / `( play )` button sits beneath the item at inline start, with `pauseLabel` / `playLabel` for its visible and accessible words. Explicit pause persists until play. Hover, focus within, an off-screen IntersectionObserver entry and a hidden tab suspend it; the person's scroll, drag, key or press takes over, and leaving interaction gives it 1600ms of rest before resuming. Reduced motion disables autoplay entirely and hides the unused control; `data-force="reduced"` shows that still state in docs. The clock uses rAF time deltas, cancels on unmount and never catches up hidden time.
- Autoplay states: autoplaying, paused (play available), reduced motion (still); the pause button is a separate keyboard stop with visible accent focus and native Enter/Space activation.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Marquee (`marquee`) | Rubato (the reader's tempo) | A 24px/s drift yields to scroll; pausable, off under reduced motion (owner-approved 2026-10-01) |
| Counter marquee (`marquee`) | Contrary motion | The two clipped rows drift or scroll opposite ways, sharing the same pause and reduced-motion rules |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Marquee (`marquee`) | "Renaissance."; SPECTRA crop | Huge light words, each closed by a full stop, cropped by the frame, drifting until the reader takes over |
| Ticker marquee (`marquee`) | The Renaissance top row; SHAPES / GRADIENTS frame row | Small capitals running between two hairlines |
| Counter marquee (`marquee`) | SPECTRA's two cropped rows | Two rows cut at head and feet, meeting on a hairline, running opposite ways |
