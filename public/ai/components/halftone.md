# 0dB: halftone

Extracted from DESIGN.md.

### db-halftone (halftone)
- Underneath: native image, hidden canvas sampling and Pretext, dynamically imported inside an effect.
- Anatomy: `.db-halftone` contains a real `<img alt>` and an aria-hidden `.db-halftone-type`, rows of measured glyphs. The real artifact never leaves the DOM. The example is an explicitly labelled, example-only type specimen, not a claimed project capture.
- Evidence arriving: after the engraved statue (18.jpg), where fine strokes carry an entire image. The image is sampled into `cols` columns (64 by default, bounded 8–120) and aspect-correct rows (bounded 160). Candidates use the computed voice at weights 400, 500, 600, 700 and 800 and the expression italic at 400: Archivo and Bodoni Moda in the house pair. Fonts load before Pretext measures each advance; a hidden canvas measures each glyph's ink density. Brightness error and width error choose each cell's glyph, then its measured width centres and fits it to the grid. `word` limits candidates to its unique non-space characters (up to 64); empty falls back to the ordinary alphabet. Glyphs are ink or pencil only.
- `resolve="scroll"` (default) follows the plate from 90% to 25% of the viewport, reversible with scrolling; `load` resolves once over adagio after sampling; `none` keeps the type. Rows thin in reading order while the real image comes up. ResizeObserver watches clientWidth; the html MutationObserver watches only data-pair, data-scheme, data-mode and data-key. Async revisions and cleanup discard stale work.
- Keyboard and touch: ordinary page scrolling; no hover dependency and no invented focus stop. Before measurement, without script, or when loading, canvas or CORS sampling fails, the real image stays. Cross-origin sampling uses a separate anonymous image so it cannot break the real image. Reduced motion and forced colours show the final real image directly, with no travel. The image grid preserves its physical orientation in RTL.
- Why it is type-only: owner decision 2026-10-02 approves 2.5D depth, type-made images, shapes made of words and opt-in sound because type is the material and carries meaning. These are never the refused effect-only depth-background, particle-text, typography-vortex or warp-text: no blur, shadows, gradients, fills or particles; distance uses scale, ink-to-pencil colour and plane angle only; one accent in view. Here the letters carry project evidence, and may literally be the project's own name; removing the resolve leaves a meaningful artifact.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Halftone (`halftone`) | Resolve | Scroll or one load adagio thins glyphs row by row as the real image comes up; reduced motion shows the image directly |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Halftone (`halftone`) | Engraved statue, 18.jpg | Fine-to-dense measured letters carry the evidence, then give way to its real artifact |
