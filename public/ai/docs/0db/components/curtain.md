# 0dB: curtain

Extracted from DESIGN.md.

### db-curtain (curtain)
- Underneath: the existing native Dialog approach, portalled to body so the menu does not inherit the page transform. Parts: Curtain, CurtainTrigger (asChild), CurtainContent (label, default Menu), CurtainLink (native anchor, optional number and description).
- Anatomy: `dialog.db-curtain`, caption and Close button, then `nav.db-curtain-links` with `.db-curtain-link`, a small isolated folio, display-size name and optional one-line reading-grade italic description (wrapping when necessary).
- WOVE (9.jpg) gives distance its meaning: the page marked `[data-curtain-page]` tilts back, scales down and takes pencil; absent a marker, direct body children except the dialog and nonvisual nodes recede. The paper backdrop arrives without blur. Destinations then come forward to a flat reading plane, one arpeggio apart. Closing reverses the planes. Below 40rem the page tilt is shallower and names use f instead of ff.
- Opening focuses Close. Native modal focus trapping, Escape, and focus return are preserved; html and body scrolling lock while open and their previous styles restore on close/unmount. Normal destination activation closes; modified clicks keep ordinary anchor behavior. All actions work on touch.
- Reduced motion: composed flat state and crossfade. Forced colours: system paper, CanvasText and LinkText. Number remains isolated LTR inside RTL; placement is logical.
- **Why it is type-only:** Owner decision 2026-10-02 approves 2.5D depth, type-made images, shapes made of words and opt-in sound because type is the material and carries meaning. This item carries the portfolio story, never an effect-only depth-background, particle-text, typography-vortex or warp-text: no blur, shadows, gradients, fills or particles; distance is scale, ink to pencil and plane angle only, with one accent in view.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Curtain (`curtain`) | Near plane | Page tilts back into pencil; destinations come forward an arpeggio apart, reversing on close |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Curtain (`curtain`) | WOVE near and distant type (9.jpg) | The reading page recedes and the destinations become the near plane |
