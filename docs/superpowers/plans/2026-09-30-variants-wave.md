# Variants wave: 2–3 new variants for every component

Owner, 2026-09-30: "Add more variants for each of the components we have, 2-3 more variants of all the things. This time I want you to be more creative, more artistic and more clever + intelligent while building the component. Literally just go into deepest thoughts, bring out the creativity, something new, out of the box, something that is very beautiful and polished."

Starts after the calendar redesign, the melody/fraction review and the shared-menu fix land. Queue after this wave, in order:
1. Port the components 000h (https://000h.cojeev.com) has and 0dB lacks, redesigned in 0dB's language (owner, 2026-09-30). The inventory is `docs/superpowers/specs/2026-09-30-000h-port-inventory.md`. Owner decision, 2026-09-30, on the items that conflict with 0dB's rules: "Type-only versions". Build every B gap (the 20 plus stat), the 16 A extensions and the 14 type-led reinterpretations of C items. Leave out the 52 that have no type-only version, and list them in INTENT.md's refusals.
2. The site-wide separation pass (`.tmp/briefs/separation.md`), so it covers the new variants and ports too.
3. One full `npm run check` and a final look at the running app.

## Batches (one builder each, at most ten running at once; the next starts as one finishes)

| # | Components |
|---|---|
| 1 | checkbox, switch, slider (also: switch the checkbox tally to `<Fraction>` so it gets the counter wheels) |
| 2 | button, button-group, mode-toggle |
| 3 | field, input-group, input-otp |
| 4 | select, combobox, form |
| 5 | radio-group, picks, dial |
| 6 | toggle, toggle-group |
| 7 | alert, toast, dialog |
| 8 | empty, skeleton, progress, spinner |
| 9 | accordion, tabs, steps |
| 10 | breadcrumb, navigation-menu, sidebar |
| 11 | badge, note, rows |
| 12 | calendar, date-picker |
| 13 | command, pagination |
| 14 | card, aspect-ratio, carousel |
| 15 | collapsible, drawer, sheet, resizable |
| 16 | popover, hover-card, tooltip |
| 17 | menubar, dropdown-menu, context-menu |
| 18 | scroll-area, scrollbar |
| 19 | avatar, item, table |
| 20 | chart, typography, source, command-line |
| 21 | message, thread, attachment |
| 22 | marker, questionnaire |
| 23 | calligram, contour, gather |
| 24 | measure, melody, reverb |
| 25 | wake, waterfall, fraction |
| 26 | kbd, link, corners, meta |

## Builder brief

Read, in order: `.tmp/briefs/common.md` (anatomy, tokens, locks, checks), `.tmp/briefs/finish-wave.md` ("Done means" and "The bar" apply in full; the "resuming" section doesn't, but its never-revert rule does), `docs/references/README.md`, and open every image in `docs/references/`. Use the `frontend-design:frontend-design` skill. Run `npm run -s check:examples` only while holding `.tmp/examples.lock` (mkdir), because every run shares `.tmp/examples-check`.

For each of your components:

1. **See what exists.** Read its four files and its DESIGN.md contract. Shoot its docs page at 1440 and 390, day and nocturne.
2. **Judge it against the posters.** Would the owner recognise a poster in it? If an existing variant is generic, say so in your report and fix it first. This is the poster check the calendar showed was needed.
3. **Think before building.** Write down at least five distinct ideas for new variants. Each must come from a named poster in `docs/references/`, or from a named musical, typographic, book or print convention. Throw away the obvious ones. Keep the two or three that are most beautiful, most surprising and most true to 0dB. A variant has to be a new idea, not a restyle: a different relation between type, space and the person's action.
4. **Stay inside the system.** Type is the only ornament; the shapes are only hairline, dot, ring, arc, cross, corner marks, parentheses, pill (tags only), and arrows only for direction. There is one accent in view. Ours is roman; yours is italic. Nothing moves unless the person acts. Each variant has one move and one motion.
5. **Don't repeat ideas already in the library** unless you transform them: fermata, slur, tenuto, pizzicato, rubric, legato, glissando, crescendo hairpin, stave, overture, bracket, ink fill, highlighter, strike-through, roll, half-moon, dimension line, callout pill, corner marks, the pen-stroke solidus, tuner, metronome, round, breath, arpeggio, the fold (menubar), the folio.
6. **Build it properly.** Each variant goes on `data-variant` and gets:
   - a `States` row, and a place in the Example;
   - its `variant` prop documented in the content file;
   - a paragraph in the DESIGN.md contract, a Motion row if it moves, and a row in "Where each move comes from", all under the design lock;
   - working keyboard and screen-reader behaviour, reduced motion, right-to-left where there's a direction, and forced colours.
7. **Verify it.** Everything in finish-wave.md "Done means". Then compare your shots with the source poster and keep refining until it is polished.

Report, per component: the existing-look verdict and what you fixed, then per new variant its name, its source, and two plain sentences on the idea. Then files, checks and exit codes, and check-running time.

## Follow-ups found by builders (for the final pass)
- Radix sets its own `dir` on tabs and navigation-menu, so they don't mirror in an RTL page unless `dir` is passed. Decide: read the page's direction (as the menus now do) or document the prop. Navigation-menu RTL layout is not yet confirmed.
- The mode-toggle day look changed (a full sun), which also changes the site bar's toggle; check it on the final look.
- Picks `rubric` still splits wrongly when a Latin-script name sits on a right-to-left page (predates the wave). (resolved: on an RTL page a cased name stays whole as an isolated LTR run and the pilcrow hangs in the margin; dir="ltr" picks hang the capital as before)
- Two items now share the name and idea `dynamics` (slider: label weight follows value; dial: number size follows loudness). Review whether both earn their place or one should be renamed/rethought. (resolved: kept as a shared move in DESIGN.md "Shared moves"; slider carries it in weight and width, dial in size)
- Rows `trail`: the visited fill uses `:visited`, which headless Playwright doesn't draw; confirm it in the built-in browser on the final look.
- RTL: a Fraction reads denominator first, and the carousel count reads "05 / 01" (numbers need `dir="ltr"` isolation). Hand to the fraction builder (batch 25).
- Two items share the name `gloss` for the sidenote idea (accordion: answer beside question; source: comments in the margin). Review. (resolved: kept as the shared sidenote move in DESIGN.md "Shared moves")

## 000h port queue (brief: `.tmp/briefs/port.md`; the refusals are now in INTENT.md)
Start each batch when a builder slot frees up and its dependency has landed.
- P1 number-input, dropzone: done
- P2 stat, data-table, tree: done
- P3 (done) line-chart, area-chart, plus the chart extensions (horizontal, grouped, stacked, multi-series readout)
- P4 (done; page-rail now renders ReadingTrail rail; sidebar labels bdi-wrapped for RTL) activity-feed, reading-trail (promote components/site/page-rail.tsx; the site then uses it)
- P5 (done) appearance (promote components/site/theme-controls.tsx), grid (rules and dots)
- E3 (done; Direction answered by tabs/nav reading the page dir at mount, no new item) message MessageTyping; marker wordless and vertical rule; Direction wrapper (Radix DirectionProvider, which also answers the tabs/nav RTL follow-up); fraction `total`. Wait for batches 21, 22 and 25.
- P6 (done) agent-chat, swapy. E3 landed; agent-chat composes R4 agent-state when it exists.
- P7 (done) radial-chart, timer (focus-session)
- P8 (done; shared keyboard helper registry/0db/lib/rove.ts) pie-chart, radar-chart. Wait for P5 and P7.
- P9 (done) scroll-expand, text-ribbon, word-relay
- E1 (done, also covers R4 article-headings) gather: `by` letter/word/line, `scrub`. Wait for batch 23.
- E2 (done) combobox `multiple`; steps controlled `value` and compact mode
- E4 (done; panels went on sheet, not drawer; corners glide done) accordion horizontal; source `wrap` and language label; drawer/sheet panels (wait for batch 15); wake `weight` mode (wait for batch 25)
- R1 (done; bento named `tiling`; figure has no filter per "no filters") figure (image-masking); bento as hairline tiling
- R2 (done; wave-wipe named `segue`) wave-wipe (hairline scene change); marquee (scroll-only band of words)
- R3 (done; guided-pointer is `tour`; linear-modal is sheet `fold`) linear-modal (a row opens into a sheet); guided-pointer (a tour of callouts)
- R4 (done; caret-swap is note `revise`; click-spark refused in INTENT, now 53) article-headings; caret-swap; agent-state; click-spark (type-only, low value)
- Message default write-in wipes from the left in RTL pages (predates the wave). (resolved: an RTL keyframe wipes from the inline start)
- Marker `lapse` (a pause as pure space, from `minutes`) and thread `rests` (a long pause drawn as a rest with "3 h") both mark pauses. Decide whether both earn their place, or whether rests should use lapse. (resolved: both stay, since lapse is a marker you place and rests measures every gap; rests' drawn rest bar is replaced by the lapse's words, "3 hours later", tracked on the lapse's scale)
- Name and idea repeats across batches, to review in one pass: `quote` (message, hover-card); the dictionary entry (hover-card `entry`, questionnaire `definition`); `catchword` (scroll-area, collapsible); `shelf` (carousel, sheet); `fit` (avatar, resizable); `dynamics` (slider, dial); `gloss` (accordion, source); `circled` (checkbox, which radio-group avoided). Keep the repeat only where it is the same idea on purpose, and write it in DESIGN.md as a shared move; otherwise rename or rethink one. (resolved: all eight are the same idea on purpose, so none renamed; each is written in DESIGN.md "Shared moves")
- Coordinator fix: `scripts/build-registry.mjs` now builds into `.tmp/r-build` and swaps it into `public/r`, so the dev server no longer 500s mid-build.
- Coordinator fix: the carousel count and the avatar "+3" are now isolated LTR in RTL pages (carousel.css, avatar.css).
- Measure: in RTL the English readout reads "characters a line 30"; the alphabets ruler is Latin-only (documented). (resolved: the count and verdict are dir="ltr" runs, start-aligned, and the contract says so)
- The docs Tune panel (appearance) shows three accent dots at once, one per picks list. Decide: a single accent on the list being changed, or accept it on the settings surface. (resolved: only the list you're in or last touched, data-here, keeps the accent dot; the others are ink)
- The db-combo anatomy line in DESIGN.md still describes an <input>, but the default trigger is a button. Fix the contract. (resolved: the anatomy now describes the button trigger, the command panel, and pencil's own input)
- stat.tsx copies Fraction's figure-roll code; switch it to `<Fraction count>` (no total) now that E3 added it. (resolved: Stat renders <Fraction count>, restyled in stat.css; its example looks pixel-identical and the duplicate roll code is gone)
- Tabs and navigation-menu read the page direction once, at mount (like the menus); switching `dir` later doesn't update them. Document it or accept it. (resolved: documented in the tabs, navigation-menu and Direction contracts)
- Attachment's "Remove" button and the CSS-set "Encl." text are fixed English; add label props (found by P6).
- 390px overflows found by the separation pass: swapy (594px), attachment "Enclosure" state, link "Address" state, radial-chart ring heads. agent-chat logged one React "state update before mount" error on a first run.
