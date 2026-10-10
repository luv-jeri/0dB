# Opus review of the motion revamp plan (2026-10-10)

Verdict: revise. Careful and well sourced (14 file:line claims checked, all hold; the browser matrix is right: Chrome 115, Safari 26, Firefox preview/flag), but it predates the Lenis removal, misses performance costs, is too timid, and hides owner decisions behind "none".

## Findings, most severe first

1. Lenis is already gone (fix/native-scroll, commits 781a5de and 6072bab, PR #17). Drop the plan's Lenis tasks (lines ~62, 240, W1 ~384). In W2, rewrite every contract and comment that says "after a smooth scroller's frame" to native scroll: DESIGN.md 645, 682, 705, 730, 742, 745, 884, 1159; gather.tsx:8 and :156-168, scroll-expand.tsx:43, :52, segue. Keep `data-lenis-prevent` marks.
2. Too timid. The technique map covers only the 24 text-only/partial Cadence entries; the other 50 are unmapped, yet D2 exists to translate image techniques. Map all 74 (one row each, many may be "covered by row X" or "refuse because"). Plane flight and orbit refusals (lines ~122-124) are caution, not reason: D3 allows travel/orbit that moves only with scroll or drag. z-flight, sphere and video-on-load refusals are sound.
3. Performance (the owner says the site already feels slow; this is a first-class requirement):
   - gather splits by letter by default (gather.tsx:37). gather/ink and gather/rise on paragraphs = one span per letter. Default to word for both, cap pieces around 200, and make the motion check fail above it.
   - The JS rAF fallback puts main-thread work in every Firefox scroll, the same class of cost that removed Lenis. Decorative effects (type-parallax, gather/ink) stay static without native timelines; only type-sequence keeps a JS fallback.
   - Keyframes: lines ~271-273 imply about 8,400 runtime keyframe stops. Cap at 5-9 stops per run and add a style-recalc budget to the checks.
   - Line ~226 puts both helpers into the base, so every install pays. Ship them item-local. (The signs branch already adds registry/0db/lib/sign-shapes.ts there.)
4. Owner decisions hidden behind "none". List each with a recommended default:
   a. Deleting the hero and toy Noise canvas (lines ~176, 196). Default: keep it, as the overture's arrival swell, inside the cap.
   b. Turning off docs demo autoplay for 57 items (line ~206), reversing 06c56e8. Default: accept (D3).
   c. Moving The pieces from 2nd to 5th on the landing (lines ~172-175). Default: keep 2nd.
   d. Scope: 2 items vs the larger set below. Default: larger set.
   e. Waiting for signs to merge (line ~375). Default: start item waves now; they touch only their own files.
   f. Firefox: JS fallback or static. Default: static (except type-sequence).
   Removing the docs title tracking animation (line ~200) is fine: letter-spacing breaks D4.
5. Signs ownership list is stale: branch is past 46689ff, adds components/site/sign-still.tsx, changes app/site.css, and adds registry/0db/lib/sign-shapes.ts. Re-read `git -C ~/Developer/0db-icons log origin/main..feat/type-icons --stat` and protect all of them.
6. Waves: demo-example.tsx and tests/demo-player.browser.mjs are owned by both W1 and W5; give them to W1. Split W5 into W5a (landing story) and W5b (docs motion page and examples).
7. Minor: layout.d.ts types start around line 20, not 25.

## Items to add (names checked against registry.json and the signs registry, no clash)
- type-orbit: a finite ring of word-shapes turned by scroll or drag; browsing a short set (Image Ring, Circular Gallery).
- type-flight: a perspective plane of word-shapes that settles into a readable index with scroll (Field Flight, Scroll Flight).
- type-zoom: Telescope Zoom in type: one word scales open into its paragraph, transform only.
- type-slice: a headline cut into strips that slide into register with scroll, clip-path (Slice Slider, Film Letters).
- leader: hairline leaders from labels to parts of a specimen (Annotation Lines); check against marker's contract first.
- specimen-index: promote the landing PieceIndex (a wall of names driving one live stage) to an item (Hover Preview List).
- hush: promote the hero Noise (Pretext words that swell, hush and part for a pointer) to an item, depends on decision a.
