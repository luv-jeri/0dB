# 0dB: passage

Extracted from DESIGN.md.

### db-passage (passage)
- Underneath: native paragraph or div, Pretext and Web Animations. API: `as="p" | "div"`, string children, `announce`, `onSettled`.
- Anatomy: `.db-passage` holds real `.db-passage-text` and an aria-hidden `.db-passage-art` with at most two measured readings. Without measurement, the real paragraph stays visible.
- The four personalised portfolio slots re-set when their words change: measure old and new at the current content width, old lines exhale toward inline-end and new lines enter from inline-start, an arpeggio apart. Height moves between measured readings over andante. The thought takes its own room, after Healthy habits' narrow columns (2.jpg).
- A newer reading cancels previous animations and stale font work; layers never stack. Resize or face changes settle the current reading. `onSettled` runs once for the latest changed reading, including fallback, never for an interrupted reading or initial render.
- Pretext loads inside the effect; computed font, document.fonts.load, clientWidth ResizeObserver and the four-attribute html observer follow Contour. `announce` adds polite, atomic live text; artwork is never read. Plain text remains selectable at rest. No controls and no hover dependency.
- Reduced motion: crossfade only, snapped height. Forced colours: CanvasText. RTL reverses inline travel.
- **Why it is type-only:** Owner decision 2026-10-02 approves 2.5D depth, type-made images, shapes made of words and opt-in sound because type is the material and carries meaning. This item carries the portfolio story, never an effect-only depth-background, particle-text, typography-vortex or warp-text: no blur, shadows, gradients, fills or particles; distance is scale, ink to pencil and plane angle only, with one accent in view.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Passage (`passage`) | Re-set | Lines exhale inline-end and enter inline-start, an arpeggio apart; height follows over andante |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Passage (`passage`) | Healthy habits narrow columns (2.jpg) | A changed thought is re-set line by line and takes its own room |
