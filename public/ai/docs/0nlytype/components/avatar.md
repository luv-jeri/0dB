# 0nlyType: avatar

Extracted from DESIGN.md.

### ot-avatar (avatar)
- Underneath: native.
- Anatomy: `<span class="ot-avatar" role="img" aria-label="Name">` holding an initial; `data-size="s | l"`, `data-here` for presence. A group is `<span class="ot-avatars" role="group">`, ending in an optional `data-count` avatar ("+3").
- A person is a ring and their initial, in italic, since a name is theirs. Someone here carries the accent dot. A group overlaps, and steps apart when pointed at.
- `variant` on the avatar (`data-variant`): `ring` (the default), `monogram` or `fit`. Both drop the ring: the type is the whole mark. Each carries `dir="auto"`, so its letters follow the name's own script, not the page's.
- monogram: "It has to be design." The given initial in the large italic (`opsz` 12, so its hairlines hold) printed over the family initial in a heavy narrow roman (800, width 62%), cut out of it by a paper outline (`paint-order: stroke fill`), as "has" crosses "It". Here now, the italic takes the accent, as "design." does, and there is no dot. Pointed at, the italic steps off the roman toward the start (spiccato) so both letters read. A group of monograms stands side by side instead of overlapping. One name gives one letter.
- fit: "Less is more.", big type set to its measure. The given name alone (or `fallback`), measured in its own face on a canvas and set to fill one width (1.8 times the avatar's size), capped at 1.1 times the size, so "Ada" stands large and "Wolfgang" small. It re-measures when the pair changes; until measured it shows at half the size. Pending font measurements stop when the avatar is released; a failed font load keeps the fallback size. Here now hangs an accent full stop outside the measure, as hanging punctuation does. A group stacks fitted names between hairlines, a count last in small voice.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Avatar (`avatar`) | Spiccato | A group steps apart to be counted |
| Monogram avatar (`avatar`) | Spiccato | Pointed at, the italic steps off the roman and rebounds into place |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Avatar (`avatar`) | "28 December" dots | A ring, an initial, the presence dot |
| Monogram avatar (`avatar`) | "It has to be design."; the stationer's monogram | The given initial in italic cut over the family initial in heavy roman; here, the italic is the accent |
| Fit avatar (`avatar`) | "Less is more."; type set to its measure | The given name set to fill one width; a group stacks between hairlines |
