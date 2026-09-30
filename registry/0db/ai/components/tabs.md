# 0dB: tabs

Extracted from DESIGN.md.

### db-tabs (tabs)
- Underneath: Radix Tabs.
- Anatomy: `<div class="db-tabs-root" data-variant="line | rubato | open">` (Radix Root) holding `<div class="db-tabs" role="tablist">`, then `<button role="tab" aria-selected>` for each tab, with an optional count in `<sup>`, then `<span class="db-tabs-line">`; then the panels.
- line (the default): the ink line follows the selected tab through `--x` (left), `--r` (right inset) and `--y`, like an inchworm: script sets `data-dir="left | right"`, and the leading edge moves first while the trailing edge follows 110ms later.
- Optional `.db-tabs-count` (aria-hidden) sets the number showing huge and thin, cropped by the rule it sinks into. It rolls when the number changes (up when it grows, down when it shrinks), and hides below 700px.
- rubato: "robbed time", the performer's give and take inside a bar that keeps its length. No line: the chosen word is the mark. It widens and thickens (font-stretch 75% to 125%, weight 300 to 600, andante, breath) while the others condense and lighten to give it the room, and the words are spread to both ends of a bar held to 26 `mp` ems, so the bar keeps its length while they give and take. Pointing leans a word a little wider (90%, 350) in pencil. Voices without a width axis change weight only.
- open: the words stacked large (`mf`, 300; `mp` below 40rem) like a headline beside the panel, with one hairline standing between the two columns ("Less is more."). The hairline breaks beside the chosen word, so the word opens onto its panel: the choice is marked by a missing line. The hairline overhangs the stack by space-4 at both ends, so the first or last word breaks it too. The break moves as the line does, leading edge first (`data-dir="up | down"`, the trailing segment 110ms behind), from `--t` and `--b`, the chosen tab's insets. It sets `orientation="vertical"` unless you pass one. Forced colours draw the lines in CanvasText.
- Keyboard: roving tabindex. Left and Right arrows (Up and Down in open) move and select, Home / End go to the ends. Radix writes `dir` on the root, so without a `dir` the tabs take the direction of the page around them as they mount: on a right-to-left page the words run from the right and Left and Right swap. It reads the page's direction once, at mount, as the menus do: a page that changes `dir` afterwards passes `dir` itself, or remounts the tabs.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Tabs (`tabs`) | Inchworm | The leading edge first; the count rolls |
| Tabs, rubato (`tabs`) | Rubato | The chosen word widens and thickens as the others give way |
| Tabs, open (`tabs`) | Inchworm | The break in the rule moves to the chosen word, leading edge first |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Tabs (`tabs`) | POINT / SPECTRA | A giant, cropped count |
| Tabs, rubato (`tabs`) | The performer's rubato | The chosen word takes its width from the others; the bar keeps its length |
| Tabs, open (`tabs`) | "Less is more." | The rule beside the stacked words breaks at the chosen one |
