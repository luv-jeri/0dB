# 0dB: folio

Extracted from DESIGN.md.

### db-folio (folio)
- Underneath: a native article, heading and definition list, with Pretext for title lines.
- Anatomy: `Folio` (`.db-folio`, data-variant="plate | type | live"), `FolioTitle` (h3, plain text), `FolioLedger` (dl, `rows` of label and value), and `FolioPlate`. Parts accept native attributes. The ledger sits at inline-start like an imprint; the title and plate share the inline-end edge. A narrow container stacks the parts in DOM order.
- The project spread follows SPECTRA (10.jpg): large type carries the work while small print carries authorship. `plate` holds an image or Halftone; `type` holds only the project's name at display italic scale; `live` holds working components. No fabricated screenshot stands for missing evidence. Ledger labels are roman, personal values use the expression's reading grade.
- The title opens line by line from the plate edge when the plate enters, once via IntersectionObserver. Pretext is dynamically imported in the effect, waits for document.fonts.load using the computed font, and measures with the computed tracking. The accessible real title stays in the DOM; measured lines are aria-hidden. ResizeObserver watches clientWidth and the html MutationObserver filters data-pair, data-scheme, data-mode and data-key. Resize or theme changes remeasure without replaying the entrance.
- Keyboard and touch: the spread adds no focus stops; live children retain their own controls. No hover dependency. Logical columns mirror in RTL; title lines rise from the same baseline edge in either direction. Without measurement the plain title remains. Reduced motion shows the composed final state immediately, with no travel. Forced colours use CanvasText.
- Why it is type-only: owner decision 2026-10-02 approves 2.5D depth, type-made images, shapes made of words and opt-in sound because type is the material and carries meaning. These are never the refused effect-only depth-background, particle-text, typography-vortex or warp-text: no blur, shadows, gradients, fills or particles; distance uses scale, ink-to-pencil colour and plane angle only; one accent in view. The spread pairs evidence with Sanjay's role; scale, line breaks and the imprint carry that meaning even with all motion removed.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Folio (`folio`) | Open | The measured title opens from the plate edge, line by line once; reduced motion is the composed final state |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Folio (`folio`) | SPECTRA, 10.jpg | A large title opens from its plate edge; the maker’s role sits small in the margin |
