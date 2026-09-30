# 0dB: mode-toggle

Extracted from DESIGN.md.

### db-mode-toggle (mode-toggle)
- Underneath: native `<button>` with `aria-pressed` (pressed means Nocturne). Its name is "Night mode" and never changes; the state says which.
- Anatomy: `<button class="db-mode" data-variant="eclipse | horizon | words | fermata | sentence | knockout | hour" aria-pressed aria-label="Night mode"><span class="db-mode-art" aria-hidden="true">…</span></button>`. Sizes are in `em`, so it takes the size of the text around it; the hit area is 0.4em wider than the drawing.
- It only reports the choice: `mode` / `defaultMode` / `onModeChange(mode, event)`. The page applies it (`document.documentElement.dataset.mode = mode`). The site's `useTheme()` does, through a view transition that opens from the toggle.
- Eclipse: a ring and a disc that fills it; by day the whole sun, and at night a mask bites the disc from the upper right and leaves a crescent on the moon's rim (registered `--db-mode-x`, mirrored in RTL). The disc meets the ring: with a gap between them, day read as a checked radio. Horizon: a hairline; the dot stands above it filled by day and sets below it as a ring at night, landing with spiccato. Words: drawn like a select, since it sits in sentences beside them. The word you read by stands in the italic on a hairline, with ↕ in the pencil where a select has ↓; pointing inks both and nudges the arrow toward the other word. Choosing rolls it the way the sun goes: night comes down from above, day comes up from below, and the hairline narrows or widens to the new word. Fermata: the sign as an eye; the lid arc comes down over the dot at night and closes. Sentence: "Read by light." / "Read by night."; the last word rolls (light in from below, night in from above) and the full stop is a dot or a ring.
- Knockout: after "the uncreative", where part of a word is reversed out of an ink block. It reads "midday": `mid` in heavy roman on the paper, the half you chose in the italic (`.db-mode-block`). At night the ink falls over the second half from above, the way Nocturne falls over the page, and "night" reverses out of it; at dawn the ink lifts back up. Pointing lets a sliver of ink fall by day, or lifts it a little at night.
- Hour: after the numbers used as data in "the silence that heals". Noon by day and midnight at night: 12:00 and 00:00, the hour yours in the italic and the minutes ours in pencil, in tabular figures and always left to right. A clock only goes forward, so whichever way you choose, the hour turns forward, out at the top and in from below, the units first and the tens one step behind like a carry. It turns only after the mode has changed (`data-turned`), so nothing rolls on first paint.
- States: rest (graphite), hover (ink), focus (accent outline), disabled. Forced colours restate every part in system colours.
- Keyboard: Space or Enter.
- The site's bar uses eclipse (the smallest, and it reads without a label); Tune uses sentence.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Mode toggle (`mode-toggle`) | Legato | The disc slides, the dot sets, the lid closes, the word rolls |
| Knockout mode toggle (`mode-toggle`) | Dusk and dawn | The ink falls over the second half from above and night reverses out; at dawn it lifts |
| Hour mode toggle (`mode-toggle`) | Carry | The hour turns forward either way, the units first and the tens one step behind |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Mode toggle (`mode-toggle`) | The fermata sign; "28 December" dots | A disc, a dot or an eyelid crosses from day to night |
| Knockout mode toggle (`mode-toggle`) | "the uncreative" | Midday to midnight: the second half reversed out of the ink |
| Hour mode toggle (`mode-toggle`) | "the silence that heals" numbers as data | Noon and midnight as 12:00 and 00:00 |
