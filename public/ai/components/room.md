# 0dB: room

Extracted from DESIGN.md.

### db-room (room)
- Underneath: native, with Pretext loaded inside an effect, computed font and `document.fonts.load`. ResizeObserver watches clientWidth and the shape's dimensions; the html observer filters pair, scheme, mode and key.
- Anatomy: `.db-room` contains `.db-room-shape`, the real selectable paragraph `.db-room-plain`, and aria-hidden `.db-room-lines`. The real paragraph remains in DOM reading order and becomes transparent while the measured runs show, as in wake. The layer cannot intercept selection. Import or font failure leaves the shape above the complete ordinary paragraph.
- Props: string `children`, `shape` ReactNode, `outline="box" | "ellipse" | chord-function`, `travel="set" | "pointer" | "scroll"`, `side="start" | "end" | "centre"`, and `gap` in em (0.75). A chord returns a centred width fraction or `[start, end][]` fractions for y in 0..1. The outline is sampled over each row's line box, expanded by the gap and subtracted from the measure. `layoutNextLine` carries one cursor through every free interval, right first in RTL. Narrow runs wait for a readable width; words are never masked by the thought.
- Move: the text makes room for the visitor's thought, after Healthy habits' narrow notes (2.jpg) and Paul Rand's measured spaces between type (11.jpg). Shape dimensions come from the supplied content, bounded to 35% of the desktop measure. Below a 480px room width it sits above ordinary text, including on touch; its meaning never depends on hovering.
- Motion: set is still. Pointer answers only a fine pointer, arrives with exhale over moderato and stops its frame loop when it lands. Scroll maps the room's passage through the viewport, bounded by the page's available scroll, through exhale from the top to the bottom; it schedules a layout only for a changed position. There is no idle loop. The paragraph reserves its original height plus the obstacle and clearance, keeping the next content still.
- Reduced motion: the shape stays at its initial side and top, and the text is set once, then only resized or remeasured for a face change. Keyboard: no added stop; the paragraph reads and selects normally and supplied controls keep their native behaviour. Forced colours: CanvasText, preserving the invisible original so text is not painted twice. No live region: the words do not change.
- Why it is type-only: owner decision 2026-10-02 approves word-shapes because the type is the material and carries meaning. The page making room is Sanjay's work accommodating an unfinished thought. No blur, shadows, gradients, fills or particles; this is not an effect-only depth-background, particle-text, typography-vortex or warp-text. One accent in view, owned by any supplied choice.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Room (`room`) | Exhale | The thought travels with scroll or a fine pointer; the paragraph yields and rests with it |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Room (`room`) | Healthy habits (2.jpg); Paul Rand (11.jpg), the spaces between type | The paragraph makes room for the thought, continuing on both sides |
