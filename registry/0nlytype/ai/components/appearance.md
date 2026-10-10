# 0nlyType: appearance

Extracted from DESIGN.md.

### db-appearance (appearance)
- Underneath: native, through `picks` and `mode-toggle`, plus a hook that reads and writes the four switches on `<html>`.
- Anatomy: `<div class="db-appearance">` holding `<p class="db-appearance-answer"><output>…</output> <button class="db-mode" data-variant="sentence">…</button></p>` and `<div class="db-appearance-picks">` with three `db-picks` (pizzicato): Scheme (cotton, blueprint, statue, silence, riso), Key ("its own", its description naming the scheme's own accent, then ultramarine, viridian, ember, violet) and Pair (parma, press, paris, salon, each with its faces as the description).
- The move, after "Healthy habits → for creatives", where the voice runs into the italic on one line of thought: the choice is written back as one sentence over the lists, "Cotton, in ultramarine, set in Archivo and Bodoni.", and the night toggle finishes it, "Read by light." Ours in roman and graphite; yours, the three words you chose, in the italic and ink. The sentence is an `<output>` for the three lists, so a reader hears the new sentence after each choice. No key reads the scheme's own accent by name (cotton ultramarine, blueprint orange, statue gold, silence cobalt, riso magenta).
- Layout: the lists stand two across with the pair under them, or three across once the control is 36rem wide (a container query); the answer steps up from `--db-mp` to `--db-mf` there. The picks are set at `--db-p`, closer than a standalone list. One accent in view: only the list you're in, or were last in (`data-here`, the scheme to begin with), marks its choice with the accent dot; the others set theirs in ink, and their italic titles still say what's chosen.
- It writes only the four switches (`data-mode`, `data-scheme`, `data-key`, `data-pair`; cotton and parma are no attribute) and keeps them together as one JSON object under `0nlytype-theme` in localStorage. `useAppearance()` reads `<html>` through a MutationObserver, so a head script, the page and every control agree. With `value` it holds nothing and writes nothing: `onValueChange(value, from)` reports.
- Motion: the new appearance opens over the old as a circle from the control you touched (a view transition, andante, breath; `--db-appearance-x`, `--db-appearance-y` on `<html>`). Reduced motion, or no view transitions, changes it at once. The page restores the stored choice before first paint with a one-line script in `<head>` (the docs site's `theme-script.tsx`).
- States: those of picks and the mode toggle. Keyboard: Tab through the toggle and the three groups; arrow keys move each choice.
- The site's bar opens it from Tune, in a popover, beside the dimmer toggle.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Appearance (`appearance`) | Opening | The new page opens over the old as a circle from the control you touched |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Appearance (`appearance`) | "Healthy habits → for creatives"; the score's pizzicato (picks) | The choice written back as one sentence, yours in the italic; the night toggle finishes it |
