# 0nlyType: dialog

Extracted from DESIGN.md.

### ot-dialog (dialog)
- Underneath: native `<dialog>` with `showModal()`, plus a hook.
- Anatomy: `<dialog class="ot-dialog" closedby="any">` holding `<form method="dialog">`, the `.ot-dialog-title` question, `.ot-dialog-body`, then `.ot-dialog-actions` with a bracket (safe, `autofocus`) and a statement (the action).
- It's set like a poster: corner marks instead of a box (`ot-corners`), an `ot-meta` row of facts along the top (`.ot-dialog-meta`), and the question set large, with the item as yours ("Delete *Spring notes*?"). The backdrop is paper at 86% with a blur. Opening is one short phrase: the corners open out into place, the meta rule draws from the left, and the question breathes out from weight 500 and width 88%.
- Keyboard: focus goes to the safe answer; Escape closes; a click outside closes. Smooth scrolling pauses while it's open.
- `variant` on DialogContent. `reply` (after "It has to be design."): the question is ours, heavy (800) and narrow (width 72%); the answers are yours, bare `DialogClose` buttons set large in the italic. The answer you point at, or that holds focus, inks and takes a full stop in the accent (`content: "." / ""`, so it isn't read out); pointing at one takes the stop from the other, so only one is ever in view. Opening focuses the safe answer, so it opens with its stop. `ruled` (after "Less is more."): a grid of ink hairlines to the dialog's edges. The meta's two facts go to the top corners; the question is set at `--ot-ff` in the left cell, each of its lines standing on a hairline that draws across from the start as it opens; the detail sits ragged on the far side, set to the end; the answers take the cells below, the safe one at the start, the action at the far end. Below 40rem the grid folds to one column.
- Alert dialog: for what can't be undone, `role="alertdialog" closedby="closerequest"` with `aria-describedby` on the body. It closes only with Escape or an answer, never a stray click. Any dialog can carry a form (the specimen's rename); `[data-close]` buttons close it without submitting.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Dialog (`dialog`) | Breath out | The corners open out, the rule draws, the question exhales |
| Reply dialog (`dialog`) | Spiccato | The answer you point at inks and its accent full stop lands |
| Ruled dialog (`dialog`) | Drawn | The rules under the question draw across from the start |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Dialog (`dialog`) | SHAPES / GRADIENTS frame | Corners and a metadata row |
| Reply dialog (`dialog`) | "It has to be design." | Heavy roman question, the answers yours in large italic |
| Ruled dialog (`dialog`) | "Less is more." | The question on ruled lines in a grid of hairlines |
