# 0nlyType: mode-toggle

Extracted from DESIGN.md.

### ot-mode-toggle (mode-toggle)
- Underneath: native `<button>` with `aria-pressed` (pressed means Nocturne), except stop, dimmer and noon, which are real switches: `role="switch"` with `aria-checked` for Nocturne. Its name is "Night mode" and never changes; the state says which.
- Anatomy: `<button class="ot-mode" data-variant="eclipse | horizon | words | fermata | sentence | knockout | hour | stop | dimmer | noon" aria-pressed aria-label="Night mode"><span class="ot-mode-art" aria-hidden="true">…</span></button>`. For the switches, `role="switch"` and `aria-checked` replace `aria-pressed`, and `data-scene` names the scene change (`ot-dissolve`, `ot-dim`, `ot-fall`). Sizes are in `em`, so it takes the size of the text around it; the hit area is 0.4em wider than the drawing, and in a bar (`.bar-mode`) at least 44px tall.
- It only reports the choice: `mode` / `defaultMode` / `onModeChange(mode, event)`. The page applies it (`document.documentElement.dataset.mode = mode`). The site's `useTheme()` does, through a view transition: the appearance hook reads the pressed control's `data-scene` and passes it as the transition's type (`startViewTransition({ update, types })`), and the sidecar draws that scene change under `:active-view-transition-type()`, with the body's colour transition off so the new sheet is final at once and the overlay catching no pointer. Without view transitions, or under reduced motion, the scheme swaps instantly; a browser without transition types gets the appearance's circle.
- Each switch is one pair, a toggle and its scene change, answering the press and then resting. After a press the pointing sketch rests (`data-rested`) until the pointer leaves or focus moves on. Both words are always set (stop) or the word never changes width (dimmer, noon's initial cell is as wide as its M), so nothing in a bar moves; all three fit a 320px bar.
- Stop, with dissolve: after the calendar's month set over its year, and the full stop of "Renaissance.". Day over Night, flush to the inline end, and the full stop after the one you read by; the other word steps back to pencil. Pressing sets the stop down one line to Night, or raises it back to Day (moderato, spiccato). Pointing pencils a hairline ring where it would land and lifts the other word to graphite. The page dissolves: the new sheet comes up through the still old one at allegro, so the grey middle is only a glance and the stop lands after the page has turned.
- Dimmer, with dim: a lamp's fader in one word. Night stands in pencil by day and in ink at night. Pressing brings the ink up through the letters in reading order, one arpeggio apart, or lowers it from the last letter; pointing moves the fader one notch (N inks by day, t steps back to pencil at night). The page follows like a light: going to night the day sheet dims (`brightness`) and the night comes up through it; going to day the day sheet arrives dim and its light is raised. Both ways the page passes through the same dimmed day, whose type stays legible. Moderato.
- Noon, with fall: Noon and Moon are one letter apart, so only the initial rolls and "oon" never moves: the N sets below the line and the M comes down from above as night falls, and the N rises back at dawn. The new sheet falls from the top edge, where the switch is, on one straight line (moderato), both ways, so the answer starts at the press and reads down the page.
- Eclipse: a ring and a disc that fills it; by day the whole sun, and at night a mask bites the disc from the upper right and leaves a crescent on the moon's rim (registered `--ot-mode-x`, mirrored in RTL). The disc meets the ring: with a gap between them, day read as a checked radio. Horizon: a hairline; the dot stands above it filled by day and sets below it as a ring at night, landing with spiccato. Words: drawn like a select, since it sits in sentences beside them. The word you read by stands in the italic on a hairline, with ↕ in the pencil where a select has ↓; pointing inks both and nudges the arrow toward the other word. Choosing rolls it the way the sun goes: night comes down from above, day comes up from below, and the hairline narrows or widens to the new word. Fermata: the sign as an eye; the lid arc comes down over the dot at night and closes. Sentence: "Read by light." / "Read by night."; the last word rolls (light in from below, night in from above) and the full stop is a dot or a ring.
- Knockout: after "the uncreative", where part of a word is reversed out of an ink block. It reads "midday": `mid` in heavy roman on the paper, the half you chose in the italic (`.ot-mode-block`). At night the ink falls over the second half from above, the way Nocturne falls over the page, and "night" reverses out of it; at dawn the ink lifts back up. Pointing lets a sliver of ink fall by day, or lifts it a little at night.
- Hour: after the numbers used as data in "the silence that heals". Noon by day and midnight at night: 12:00 and 00:00, the hour yours in the italic and the minutes ours in pencil, in tabular figures and always left to right. A clock only goes forward, so whichever way you choose, the hour turns forward, out at the top and in from below, the units first and the tens one step behind like a carry. It turns only after the mode has changed (`data-turned`), so nothing rolls on first paint.
- States: rest (graphite; stop and dimmer carry the state in ink against pencil), hover (ink, or the switch's sketch), focus (accent outline), disabled. Right to left, stop's words and full stop mirror to the inline end; dimmer and noon keep the English word left to right. Reduced motion (also `data-force="reduced"`) changes at once. Forced colours restate every part in system colours: stop's stop and ring in ButtonText, the word not in use and dimmer's day word in GrayText.
- Keyboard: Space or Enter.
- The site's bar uses dimmer; Tune uses sentence.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Mode toggle (`mode-toggle`) | Legato | The disc slides, the dot sets, the lid closes, the word rolls |
| Knockout mode toggle (`mode-toggle`) | Dusk and dawn | The ink falls over the second half from above and night reverses out; at dawn it lifts |
| Hour mode toggle (`mode-toggle`) | Carry | The hour turns forward either way, the units first and the tens one step behind |
| Stop mode toggle (`mode-toggle`) | Set | The full stop sets one line, landing with spiccato; the page dissolves at allegro; reduced motion swaps instantly |
| Dimmer mode toggle (`mode-toggle`) | Fader | The ink comes up through the letters in reading order, or drains from the last; the page dims to night or is raised to day, moderato |
| Noon mode toggle (`mode-toggle`) | Nightfall | Only the initial rolls, N down and M from above; the new sheet falls from the top edge on one straight line, moderato |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Mode toggle (`mode-toggle`) | The fermata sign; "28 December" dots | A disc, a dot or an eyelid crosses from day to night |
| Knockout mode toggle (`mode-toggle`) | "the uncreative" | Midday to midnight: the second half reversed out of the ink |
| Hour mode toggle (`mode-toggle`) | "the silence that heals" numbers as data | Noon and midnight as 12:00 and 00:00 |
| Stop mode toggle (`mode-toggle`) | The calendar's month over its year; "Renaissance." full stop | Day over Night; the full stop sets from one to the other |
| Dimmer mode toggle (`mode-toggle`) | "the silence that heals" (the page as a lit room); a lamp's fader | One word taking the ink letter by letter; the page's light lowered |
| Noon mode toggle (`mode-toggle`) | "It has to be design." (one letter carries the change) | Noon and Moon, one letter apart; the new sheet falls from the top |
