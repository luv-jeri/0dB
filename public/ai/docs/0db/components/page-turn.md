# 0dB: page-turn

Extracted from DESIGN.md.

### db-page-turn (page-turn)
- Underneath: React 19.3 ViewTransition. PageTurn wraps children without adding DOM. `share` supplies an optional matching name for continuity; names must be unique in each mounted tree.
- Wrap each page rather than a persistent layout; in-page examples change the wrapper key inside startTransition. `addTransitionType("forward" | "back")` selects the enter and exit class maps; without a type the forward turn is the default. A shared child keeps its identity through the turn.
- WOVE (9.jpg): the outgoing reading recedes in perspective and the new reading comes forward from slight depth. Back reverses the plane angles. The browser snapshots are images: their ink falls toward pencil by transparency against paper as they recede, rather than a filter attempting to recolour individual glyphs. No blur, shadow or decoration is added.
- Installed Next App Router guidance requires no configuration; next.config is unchanged. With no browser View Transition support, React changes content normally. Only user navigation or a transition-driven update starts the turn.
- Reduced motion: a crossfade, with group size/position travel removed; forced colours also crossfade. The plane angle has no inline direction, so RTL keeps its spatial meaning. Focus and semantics belong to the unchanged real child DOM.
- **Why it is type-only:** Owner decision 2026-10-02 approves 2.5D depth, type-made images, shapes made of words and opt-in sound because type is the material and carries meaning. This item carries the portfolio story, never an effect-only depth-background, particle-text, typography-vortex or warp-text: no blur, shadows, gradients, fills or particles; distance is scale, ink to pencil and plane angle only, with one accent in view.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Page turn (`page-turn`) | Near plane | The old reading recedes, the next comes forward; back reverses the plane angle |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Page turn (`page-turn`) | WOVE near and distant type (9.jpg) | The next reading moves from distance into clarity |
