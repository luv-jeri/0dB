# Signs: icons made of their own word (proposal, 2026-10-10)

A prototype for the owner's request of 2026-10-10: icons for 0dB, built with Pretext, with a hover micro-interaction, 400+ icons, each variant counted as its own item. Nothing here is registered or published yet; INTENT.md and DESIGN.md are unchanged until the owner picks.

## The concept

A sign is an icon made of its own word, the way the ampersand is the word "et" worn down into a mark, and the way Apollinaire's calligrams draw a rain or a heart out of the poem itself. Pretext measures the word letter by letter, kerning included, and sets it along the drawing's strokes (`line`) or row by row through its silhouette (`fill`), so type stays the only ornament and no second visual language arrives. Pointing at the sign, at the control it sits in, or tabbing to that control makes the drawing say its word: the letters leave the drawing in reading order, one `--ot-arpeggio` apart, and stand up as the plain word; leaving winds them back.

## What is built

| File | What it is |
|---|---|
| `registry/0nlytype/ui/sign.tsx` | The `Sign` primitive: Pretext layout, optical cuts, the said word |
| `registry/0nlytype/styles/sign.css` | Rest and said states, all motion on 0dB tempo tokens |
| `registry/0nlytype/lib/sign-shapes.ts` | The shape table: word, strokes and silhouette on a 24-unit grid. Data only. |
| `app/lab/signs/page.tsx`, `lab.css` | The preview route, `/ui/lab/signs/` (noindex) |

Five signs: `search`, `arrow-right` (word "next"), `close`, `mail`, `home`.

Optical cuts, as a punchcutter would cut them:

- **Line under 40px, the text cut.** Each stroke is ruled in middle-dot leaders, pitched by the dot's own ink so Archivo and Bodoni rule a stroke equally dark. The word's letters wait unseen at the dots and rise out of them when said.
- **Line at 40px and over.** The word runs along each stroke in whole words, closed up or spread to reach both ends, turned to the stroke. A short stroke sets the word smaller (down to three fifths); shorter still it is ruled in leaders, because part of a word is no longer the word. Where a later stroke meets an earlier one it starts where it comes clear, so crossings never clot.
- **Fill.** Ten rows across the silhouette at every size. At 16 to 24px it reads as a halftone of type; at 120px as a calligram.

Motion articulation, "Said": letters travel to the word on `--ot-moderato` with `--ot-breath`, staggered by `--ot-arpeggio`; echoes sketch out to `--ot-pencil`. Reduced motion collapses the tempo tokens, so the word and the drawing change places without travel. Forced colours use `CanvasText`.

## The variant axis and the count

Two axes, both already in the design system:

- `variant`: `line` | `fill` (stroke or silhouette).
- `face`: `roman` | `italic`. "Ours roman, yours italic": the italic sign marks something that belongs to the person (my mail, my home).

That is 4 items per sign: `sign-search`, `sign-search-fill`, `sign-search-italic`, `sign-search-fill-italic`.

| Signs | Items |
|---|---|
| 5 (this prototype) | 20 |
| 125 | 500 |
| 400 | 1,600 |

Flag, once: AGENTS.md says the directory ranks distinct items and "never add aliases or splits to raise the count". Per-variant items are the owner's instruction (2026-10-10) and are followed here; the risk is that the shadcn directory reads four near-identical items per sign as splits. A safer route is one item per sign with `variant`/`face` props (400 items) if the directory penalises splits.

## How the set is generated at scale

1. **One table, grown by hand and script.** `sign-shapes.ts` holds each sign as data: the word, `line` strokes (`M`, `L`, `O` arc moves on a 24-unit grid) and `fill` add/cut polygons. Adding a sign is adding a row, never layout code. Words and drawings can be drafted in batches of 50 from a word list grouped by job (navigation, actions, files, media, people, status), then reviewed at 16, 24 and 120px on the preview page.
2. **Generated items.** `scripts/build-registry.mjs` would gain a step that reads the table and writes, per sign and variant, `registry/0nlytype/ui/sign-<name>[-fill][-italic].tsx` (a three-line wrapper over `Sign` with the shape inlined), plus `content/sign-<name>….ts` and `examples/sign-<name>….tsx` from one template. Each item declares `registryDependencies: ["sign"]` so the primitive ships once. The generated files join the "never hand-edit" list.
3. **Gates.** A check renders every sign at 16, 24 and 120px in both faces and fails on: any sign that does not lay out, a line stroke left with a partial word, a fill under a minimum glyph count, and a said word wider than three times the box.

## Risks, measured where possible

- **16px legibility.** The text cut makes 16 to 24px read as dotted drawings, but at those sizes the word itself is not visible until it is said; the sign is a drawing of type, not readable type. Roman and italic look almost the same below 40px; the face shows only at 48px and up and in the said word.
- **48px is the awkward size.** Big enough for letters, small enough that short strokes (arrow heads, mail flap) fall back to leaders or smaller type. It reads, but it is the least handsome cut.
- **Fill at large sizes** has ragged edges and runs that break mid-word; it is a calligram, not a crisp silhouette.
- **The said word overflows the box.** At 24px the said word ("search" at 13px) is about twice as wide as the sign and sits over its neighbours. In a button with a label it is hidden (`label=""`) but still animates; for icon-only buttons the overflow needs room or a clip rule.
- **No server rendering.** Pretext measures with canvas, so nothing is laid out on the server; a sign is blank until fonts load and Pretext imports (136 KB unminified across its dist files, loaded once, dynamically). Fix: precompute glyph positions per sign, size band and face at build time in a headless browser and ship them as data, so items render on the server and Pretext is needed only for custom words.
- **DOM weight.** Each sign is one span per glyph: 12 to 36 for `line`, 48 to 175 for `fill` (mail fill is the heaviest). Twenty fill signs on a page is about 2,000 spans.
- **Font loading.** Layout waits for `document.fonts.load`; a fallback face would lay out differently, so the sign re-lays on font or theme change (MutationObserver on the html attributes, as `calligram` does).
- **Right to left.** Placement uses physical coordinates; the drawings are not mirrored for `rtl`, and arrow-right should become a logical "next" that flips.
- **Not yet run:** `npm run registry:build` and `npm run check` (the prototype is not registered). `tsc --noEmit` and eslint on the new files pass.
- **INTENT.md** refuses Icons and lists `icon` and `animated-icon` among refused effects. If the owner adopts signs, the Icons row would become: "Signs: icons made of their own word. A drawing set in its word, never a second visual language." DESIGN.md would gain a `### ot-sign (sign)` contract, a Motion row for "Said", and a references row (the ampersand; Apollinaire, *Calligrammes*, 1918).

## Preview files

- `day-*.png`, `nocturne-*.png`: each variant set at 16, 20, 24, 48 and 120px at rest, plus 24 and 120px said (pinned with `data-force="hover"`), and the in-use row.
- `zoom-line.png`, `zoom-fill.png`: the grids at 1x, to judge small sizes pixel by pixel.
- `hover-frames.png`: six frames across the said transition for search (line, 120 and 24px) and home (fill, 120px).
- `hover-search-line-120.webm`, `hover-home-fill-120.webm`: real pointer hover, three times, at normal speed.

Run: `cd ~/Developer/0db-icons && npx next dev -p 3917`, then open http://localhost:3917/ui/lab/signs/.
