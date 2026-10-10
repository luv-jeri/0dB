# 0nlyType: text-ribbon

Extracted from DESIGN.md.

### ot-ribbon (text-ribbon)
- Underneath: native, plus a hook that measures every letter with pretext (`@chenglou/pretext`, loaded when it's needed); the stage is a `role="slider"`.
- Anatomy: `<div class="ot-ribbon" data-variant="wave">` holding the phrase once for readers (`.ot-sr`) and `.ot-ribbon-stage` (the slider, one focus stop), followed by the `.ot-ribbon-pause` word button beneath it. The stage holds `.ot-ribbon-plain` (the phrase, until it's laid), an aria-hidden `svg.ot-ribbon-guide` and an aria-hidden `.ot-ribbon-letters`: one span per letter and a `.ot-ribbon-dot` between each repeat, each placed by the hook and carrying `--d`, its distance from the middle of the curve, 0 to 1.
- arc (the default): after WOVE, figures set round an arc with dots on it, fading and shrinking by distance. The phrase is repeated round an arch that spans 100°, each letter at its place in the real line (kerning included) and turned to the curve. At the crest it stands at full size in ink; toward the ends it shrinks (to 58%) and falls to pencil, and it fades out at the very ends. A hairline guide (`--ot-rule`) runs 0.55em inside the letters, carrying a pencil dot between each repeat and one ink dot fixed at the crest, the "here" of WOVE's dial. The stage's height is reserved from its width in CSS (container units), so nothing moves when it's laid.
- The phrase drifts at 0.6em per second. Drag it along (sideways; on touch the page still scrolls up and down), use the keys, or scroll the page to take over. Scroll carries it 0.6 of the page's movement, read from the real layout after a smooth scroller (Lenis) has moved it. Person-driven changes have no inertia; autoplay resumes after a short rest.
- wave: after the script that sweeps through the capitals of "Less stress. More creativity.". The phrase rides a slow wave across the measure (0.6em high, a swell every 12em or more), every letter the same size and in ink, fading in and out only at the edges; the dots ride a guide under it.
- Keyboard: Left and Right move it an em, Page Up and Page Down four, Home back to where it began. `aria-valuenow` is how far round the repeat it has gone, 0 to 100. Focus draws the accent outline and turns the crest dot to the accent. The letters are aria-hidden and the phrase is read once.
- Under reduced motion neither autoplay nor scroll carries it: it shows the still curve; the drag and the keys still work. It lays out again when its width changes or `<html>` changes face (it watches the pair, scheme, mode and key attributes, not `class`, which smooth scrolling toggles on every scroll). Before that, or without script, it's the plain phrase. The letters are placed left to right one by one, so it is for Latin phrases; the drag and the arrows follow the screen, not the page's direction. Forced colours: the letters and dots in CanvasText, the guide in GrayText.
- Autoplay (owner-approved exception, 2026-10-01): `autoplay` defaults to true; false keeps only person-driven behaviour and omits the pause control. `defaultPaused` starts it paused. The small roman `( pause )` / `( play )` button sits beneath the item at inline start, with `pauseLabel` / `playLabel` for its visible and accessible words. Explicit pause persists until play. Hover, focus within, an off-screen IntersectionObserver entry and a hidden tab suspend it; the person's scroll, drag, key or press takes over, and leaving interaction gives it 1600ms of rest before resuming. Reduced motion disables autoplay entirely and hides the unused control; `data-force="reduced"` shows that still state in docs. The clock uses rAF time deltas, cancels on unmount and never catches up hidden time.
- Autoplay states: autoplaying, paused (play available), reduced motion (still); the pause button is a separate keyboard stop with visible accent focus and native Enter/Space activation.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Text ribbon (`text-ribbon`) | Carried | A 0.6em/s drift yields to drag, keys and scroll; pausable, off under reduced motion (owner-approved 2026-10-01) |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Text ribbon (`text-ribbon`) | WOVE (figures along an arc); the fermata arc | The phrase round an arch, largest at the crest and fading by distance |
| Wave text ribbon (`text-ribbon`) | "Less stress. More creativity." sweeping script | The phrase rides a slow wave across the measure |
