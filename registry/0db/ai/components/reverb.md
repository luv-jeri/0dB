# 0dB: reverb

Extracted from DESIGN.md.

### db-reverb (reverb)
- Underneath: native, plus a hook that measures the echoes' drift with pretext (`@chenglou/pretext`, loaded when it's needed).
- Anatomy: `<p class="db-reverb">` holding the phrase as `.db-reverb-line`, then an aria-hidden `.db-reverb-echoes` with one `.db-reverb-echo` per echo and a closing `.db-reverb-rest`.
- A phrase that echoes into silence. Each echo is quieter: the colour steps from ink through graphite to pencil and then fades by opacity, the letters open a little each time, and the size steps down a dynamic (`from`, mf by default: mf, mp, p, pp, and it stays at pp).
- Each echo is shifted right by the width of the previous echo's first word, measured in that echo's own type, so they drift like a canon. The last thing is a rest: a hairline at pp in pencil.
- Pointing at it lets the echoes breathe out: each drifts a little further, one `--db-arpeggio` after the last, and settles back on leave. Arriving isn't a move: the shifts are placed before the easing switches on.
- The phrase is read once. The echoes and the rest are aria-hidden and can't be selected. Before pretext has measured, or without script, the echoes simply stack.
- `variant` (`data-variant`): `canon` (the default), `antiphon` or `vowels`.
- antiphon: after cori spezzati, the two choirs Gabrieli set on opposite sides of San Marco to answer each other. The echoes don't drift: they come back from either wall of the measure in turn (`data-side`), the first from the far one, each a dynamic quieter and fading as the canon's do, and the rest waits at the wall the next answer would come from. Pointing opens every echo's letters by as much again, one `--db-arpeggio` after the last. Right to left, the walls swap with the text.
- vowels: after a live room, where the reverberation masks the short consonants first and the vowels ring on. Every echo keeps the phrase's size and tracking, so it lies letter for letter under it, and each loses letters in a fixed order (consonants and punctuation first, then vowels, hashed from their place) until the last keeps about a tenth. A lost letter (`.db-reverb-lost`) keeps its place and goes silent, so what is left stands in columns; spaces are never lost, and letters are split by grapheme, so a mark stays with its letter. The echoes wrap where the phrase wraps, so the columns hold on every line. Pointing sketches the lost letters back in pencil, one echo after another.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Reverb (`reverb`) | Decay | The echoes drift a little further while pointed at |
| Antiphon reverb (`reverb`) | Decay | The echoes' letters open while pointed at, one after another |
| Vowels reverb (`reverb`) | Sketch | The lost letters come back in pencil while pointed at |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Reverb (`reverb`) | The score's dynamics | The phrase echoes quieter and drifts, ending on a rest |
| Antiphon reverb (`reverb`) | Gabrieli's cori spezzati at San Marco; the Renaissance poster's labels spread to the walls | The echoes answer from either wall in turn |
| Vowels reverb (`reverb`) | A live room, where the consonants are lost first; "the silence that heals" grid | Each echo loses its consonants in place; the vowels ring on in columns |
