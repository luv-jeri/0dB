# 0dB: segue

Extracted from DESIGN.md.

### db-segue (segue)
- Underneath: native, plus a hook. With `scrub`, it reads the scroll.
- Anatomy: `<div class="db-segue" data-variant="horizon" data-scrub>` holding one `.db-segue-scene` per scene (`data-current` on the one showing, `data-label` its name; during a crossing `data-part="from | to"`), each around a `SegueScene` (`.db-segue-body`, a named group when it has a `label`); then an aria-hidden `.db-segue-line` with its `.db-segue-caption` (the number, then the name), and a polite `.db-sr` that says "2 of 3: Theme" when the scene changes. While crossing the root carries `data-phase="cross | scrub"`, `data-edge` (`left | right | bottom | top`, the edge the line comes in from) and `--db-segue-p` (0 to 1, registered, so the pressed crossing is one transition).
- One scene at a time, as a film cuts from shot to shot with a wipe. The scenes stand in one cell, so the frame is as tall as its tallest scene and nothing below it moves. Change `value` and one hairline in ink crosses the frame (`--db-andante`, `--db-breath`), carrying the next scene's number and name in small type on its trailing side, as the SHAPES / GRADIENTS rule carries a date and a name. Behind the line the next scene is already there, drifting its last `--db-segue-drift` (27px) into place; ahead of it the last scene is pushed on by as much. Going back, the line crosses the other way. A second change mid-crossing arrives at once and crosses again from there. At rest there is no line, no frame and no chrome: only the scene.
- It is the one hairline scene change for every dissolve (wave-wipe, dither-dissolve, grain-dissolve, pixel-swap): the change is the line, and it moves only when the person does.
- horizon (`data-variant="horizon"`): after Eclipse, the soft side of one level line. The line rises from the foot and the next scene comes up under it, its name just under the line at the start; going back, it sets from the head.
- scrub (`scrub`, `data-scrub`): the crossings follow the scroll, after the scrub gather. As the frame's middle rises from four fifths of the way down the view to one fifth (or as far as the page can scroll), it passes through every scene in turn; the line stands as far across as the scroll has gone, stops when the scroll stops and goes back when you scroll back. The scene past halfway is the current one. It is read from the real layout in a frame asked for by the scroll event, which runs after a smooth scroller's own frame, so the line and the page move together. Every scene stays with readers, in order (the hidden ones are transparent, not removed), and there is no announcement.
- Keyboard: the scenes hold their own controls; the ones not showing are `inert` and hidden from readers outside a scrub. In a scrub all text remains readable in order, but inactive scenes accept no pointer activation and their controls leave the tab order. If focus is in a scene as it becomes inactive, it moves to the current scene's wrapper without scrolling. The control that changes the scene is yours: a quiet button, a key, an answer.
- Right to left, the wipe comes in from the right. Reduced motion: the scene changes at once and nothing travels; a scrub changes halfway. Forced colours: the line is CanvasText and the caption drops its halo.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Segue (`segue`) | Wipe | The hairline crosses carrying the next scene's number and name; the next scene drifts in behind it and the last is pushed on; back, it crosses the other way |
| Horizon segue (`segue`) | Sunrise | The line rises from the foot and the next scene comes up under it; back, it sets |
| Scrub segue (`segue`) | Rubato (the reader's tempo) | The line travels only as far as the scroll has gone, forwards or back |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Segue (`segue`) | The film editor's wipe; SHAPES / GRADIENTS (a hairline carrying a date and a name) | One hairline crosses and the next scene is behind it, its name carried on the line |
| Horizon segue (`segue`) | Eclipse | The line rises like a horizon and the next scene comes up under it |
| Scrub segue (`segue`) | The reader's own pace (the scrub gather) | The line stands as far across as the scroll has gone |
