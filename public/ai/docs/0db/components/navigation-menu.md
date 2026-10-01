# 0dB: navigation-menu

Extracted from DESIGN.md.

### db-navmenu (navigation-menu)
- Underneath: Radix NavigationMenu.
- Anatomy: `<nav class="db-navmenu">` of small trigger buttons (`aria-expanded`, `aria-controls`) and `.db-navmenu-panel` panels of large links.
- Small words open a panel of large names, the scale contrast of a poster. The panel's rule draws across, the names arrive in turn, and the trigger's arrow turns. It opens on pointing (after a short wait) or pressing, and closes on leaving.
- `variant` on the root (`data-variant`): `names` (the default), `lead` or `inline`.
- lead: a magazine's contents page, and WOVE's "03 Ambient". The names stand small (`mp`, graphite) in a narrow column; the one pointed at or focused (the first, at first) is inked there and set beside the column as the headline at `ff` 200, its `<small>` line under it in graphite. The headline is an aria-hidden copy (`.db-navmenu-lead`); the links keep their own names. Below 40rem the headline stands down and the names keep their lines.
- inline: "Healthy habits → for creatives", one line of thought. The trigger's arrow is → (← right to left). A press, never a passing pointer, opens the names into the line after the word, larger (`mf` 200) on the same baseline; the words after it make room, and the other words step back to pencil. The `<small>` lines stay for screen readers only. Below 40rem the names drop to `mp` and may wrap.
- Keyboard: Enter or Space toggles a panel; Escape closes it and returns focus to its trigger. Tab moves from an open trigger into its names. Without a `dir`, the menu takes the direction of the page around it as it mounts, so it mirrors on a right-to-left page. It reads it once, at mount, as the menus do: a page that changes `dir` afterwards passes `dir` itself, or remounts the menu.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Navigation menu (`navigation-menu`) | Arpeggio | The rule draws across; the names arrive; the arrow turns |
| Lead navigation menu (`navigation-menu`) | Step up | The name you point at steps up into the headline |
| Inline navigation menu (`navigation-menu`) | Opening | The line opens after the word and the words after it make room; the arrow inks and leans toward the names |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Navigation menu (`navigation-menu`) | POINT / SPECTRA | Small words open large names |
| Lead navigation menu (`navigation-menu`) | WOVE; a magazine's contents page | The name you point at stands as the headline beside the list |
| Inline navigation menu (`navigation-menu`) | "Healthy habits → for creatives" | The names open into the line of thought |
