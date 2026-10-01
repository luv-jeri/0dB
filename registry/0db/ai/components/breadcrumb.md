# 0dB: breadcrumb

Extracted from DESIGN.md.

### db-crumbs (breadcrumb)
- Underneath: native list.
- Anatomy: `<nav class="db-crumbs" aria-label="Breadcrumb"><ol>…</ol></nav>`. The dividers are drawn hairlines, leaning 24° like slashes. Pointing at a step darkens the hairlines on either side and leans them in (14° and −14°), so they hold it like a pair of brackets. Each hairline runs the whole line, descender to cap, so it reads as drawn, not typed. The current item is yours: the italic, in ink, with `aria-current="page"`.
- `variant` on the nav (`data-variant`): `slashes` (the default), `stack` or `elide`.
- stack: "It / has / to be / design." One step a line, each set 1.2em further in, the way here in a heavy narrow roman (700, width 75%) and where you are the large italic at the foot (`f` at the expression scale). No hairlines: the stair divides it. Pointing at a step, or focusing it, sets every step below it back in pencil: what you would leave.
- elide: for a long path. The first step and the last two stay; each step between is elided to a full stop in pencil, so the ellipsis counts what it holds, and the hairlines between them close. For a still pointer (a 240ms wait) or at once for focus, each stop opens back into its word, in turn. Every step stays a link in the page, so a screen reader hears the whole path and Tab reaches each one; the stops are drawn (`content: "." / ""`) and never read.
- Keyboard: Tab through the links. Right to left, the leans mirror and a stack steps in from the right.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Breadcrumbs (`breadcrumb`) | Lean | The hairlines either side hold the step you point at |
| Stack breadcrumbs (`breadcrumb`) | Recede | Pointing at a step sets every step below it back in pencil |
| Elided breadcrumbs (`breadcrumb`) | Arpeggio | For a still pointer or focus, each full stop opens back into its word, in turn |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Breadcrumbs (`breadcrumb`) | Swiss diagonals | Drawn, leaning hairlines |
| Stack breadcrumbs (`breadcrumb`) | "It has to be design." | The path as a stair, heavy narrow roman down to the large italic |
| Elided breadcrumbs (`breadcrumb`) | Elision in quotation (…) | A full stop for each step left out |
