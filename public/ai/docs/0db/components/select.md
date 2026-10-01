# 0dB: select

Extracted from DESIGN.md.

### db-select (select)
- Underneath: native `<select>`.
- Anatomy: `<p class="db-select">Sort by <span class="db-select-box"><select>…</select></span></p>`.
- Yours: the chosen option, italic over a hairline. A small ↓ follows it.
- Where `appearance: base-select` is supported, the open list is restyled: the current option has an accent dot beside it, and the hovered option is highlighted. The list drops in 6px and its options arrive in turn (`sibling-index()` × `--db-arpeggio`, where supported).
- Keyboard: native select.
- Variants go on `data-variant`: underline (the default), compose, ruby. Both drawn variants keep the native select for focus, keyboard and list; its own words are made transparent and a copy is set in the same place for script to move. The hairline moves to the box and stretches between the old word's width and the new one's.
- Compose, after the compositor distributing type back to the case: choosing a new word resets it letter by letter. Letters the two words share slide across to their new places; the rest of the old word falls away in pencil and the new letters drop in, spiccato, as sorts set into the stick. "newest" to "oldest" keeps its *e*, *s* and *t*.
- Ruby, after Japanese ruby and the posters' small notes hung by a large italic: the other choices ride small above the word, ours (roman, pencil) over yours (italic, ink), so every option is in view without opening anything. Clicking one sets it: the two words cross, the picked one down onto the line and the old one up into the ruby, while the others glide aside. The ruby is `aria-hidden`; the select is still the control. Pointing a ruby word draws a hairline under it.
- Drawn variants: reduced motion swaps words at once. Right to left the word keeps its own direction (`dir="auto"`) and the ruby hangs from the right. Forced colours drop the copy and show the select's own text.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Select (`select`) | Arpeggio | The options arrive in turn |
| Compose select (`select`) | Composing | Shared letters slide to their places; the others fall out in pencil and drop in with spiccato; the hairline stretches |
| Ruby select (`select`) | Interlinear | The picked word comes down onto the line as the old one goes up into the ruby; the rest glide aside |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Compose select (`select`) | The compositor distributing type | The word resets letter by letter; shared letters stay in the stick |
| Ruby select (`select`) | Japanese ruby; the small notes hung by a big italic | The other choices ride small above the word |
