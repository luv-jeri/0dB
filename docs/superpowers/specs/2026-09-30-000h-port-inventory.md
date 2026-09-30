# 000h to 0dB: port inventory

Date: 2026-09-30. Research only, no code. Source: https://000h.cojeev.com (registry index, each item's JSON source, and the reference guide at `/docs/reference-guide/`). Rules read: `INTENT.md`, `DESIGN.md` (Principles, Conventions, "Where each move comes from", "Skipped for now"), `docs/references/README.md`, and every file in `content/`.

## Summary

119 items on 000h have no same-named 0dB item. Each is in exactly one class.

| Class | Count | Meaning |
|---|---|---|
| A. Already covered | 33 | A 0dB item does the job. 16 of them name a capability to add to that 0dB item (Table A, "Add"). |
| B. Port | 20 | A real job 0dB lacks. Plus 1 derived item, `stat`, taken from 000h's `label` (not counted in the 119). |
| C. Conflicts with INTENT | 66 | The effect breaks an INTENT rule. 14 have a type-led reinterpretation; 52 have none. |
| Total | 119 | |

Worth knowing before building:

- **`text-reveal` and `scroll-reveal` are already covered.** 0dB's `gather` is a pretext line that settles in as it scrolls into view, which is the owner's own example for text-reveal. What is missing is small: a letter / word / line mode and a scroll-scrubbed mode. Both are extensions to `gather` (Table A).
- **Two B items already exist on the docs site as site-local code.** `components/site/page-rail.tsx` (reading-trail) and `components/site/theme-controls.tsx` (appearance) are not registry items. INTENT success criterion 2 says the docs must use the library's own parts, so promoting them is the cheapest B work.
- **Charts were a deliberate skip, now reopened.** DESIGN.md "Skipped for now" says charts other than one series of bars "wait for a real need". The owner's request is that need, so the charts are in B.
- **Some B-looking items are not B.** `dock` is icon magnification. The seven "organism" compositions are demos of cards and blobs. `item-adornment` is coloured shapes and icons.
- **Backgrounds split.** Two static hairline ones (`grid-background`, `dots-background`) are B, because posters 3, 11 and 14 draw a faint or dotted construction grid, and the brief allows "very simple lines". The other backgrounds are C.
- **0dB has no image item.** `image-masking` is C, but its type-led reinterpretation (`figure`) fills a real gap.

### Adapted-from marks

From the reference guide (it gives a source link per mapped reference) and item sources. Items with no mark are original to 000h.

- **React Bits:** particle-text, warp-text, text-reveal (Split Text), text-ribbon (Text Loop, Circular Text, Curved Loop), variable-proximity (and Text Pressure), falling-text, scroll-reveal, scroll-expand, ripple-distortion, elastic-mesh, swarm-cursor, pixel-swap, orbit-images, target-cursor, magic-rings, ghost-cursor, click-spark, strands, image-trail, meta-balls, infinite-spiral, accordion-gallery, option-wheel.
- **ThreeUI:** typography-vortex, portal-field, article-headings, semantic-bloom (its own description says so).
- **remocn:** word-stream, caret-swap, zoom-words, grain-dissolve, wave-wipe, dither-dissolve.
- **UI Layouts:** motion-drawer, linear-modal, image-masking (with Clip Path), buy-me-coffee, swapy.
- **Lucide:** icon (geometry only).

Adapted items carry the library name in the "Adapted from" column. 39 of the 119 are marked.

---

## Table A. Already covered (33)

"Add" names a capability the 0dB item lacks, to be built as a variant or prop on that item. "none" means the 0dB item is enough.

| 000h item | 0dB item that does it | Adapted from | Add to the 0dB item |
|---|---|---|---|
| accordion-gallery | `accordion` | React Bits | Horizontal variant, `orientation="horizontal"`: names stand as narrow columns and the chosen one widens to its story. No images. |
| action-dock | `button-group` |  | none (a recipe of icon buttons) |
| alert-dialog | `dialog` |  | none (`alert` prop gives role alertdialog) |
| animated-number | `fraction`, and the internal `lib/roll.ts` |  | Make `total` optional so `fraction` is also a standalone rolling figure. |
| bar-chart | `chart` |  | Horizontal, grouped and stacked layouts. Ships with the chart batch (3). |
| bubble | `message` |  | `MessageTyping`: three periods that breathe, as `button busy` does. Bubble's reactions already exist in `MessageReaction`. |
| chart-tooltip | `chart` |  | A readout for several series at one point: the one giant number becomes a short list. Ships with batch 3. |
| code-block | `source` |  | `wrap` prop and an optional language label in the margin. The terminal look is `command-line`. |
| compact-dashboard | `chart` + `item` + `progress` |  | none (recipe; 000h itself calls it a compatibility alias) |
| conversation-panel | `thread` + `message` + `field` |  | none (recipe) |
| direction | native `dir` (DESIGN already mirrors right to left) |  | Export a `Direction` wrapper that also sets Radix's `DirectionProvider`, so menus and tabs mirror inside it. |
| hero-button | `button` (overture, crescendo, stave, ink) |  | none (000h's twelve add keys, tickets and liquid; 0dB's four cover the job) |
| input | `field` (`Input`) |  | none |
| invite-card | `avatar` group + `button-group` + `item` |  | none (recipe; an RSVP is two bracket buttons) |
| label | `field` (label wired with `htmlFor`) |  | none. Its `Stat` parts become the new item `stat` in Table B. |
| living-link | `link` |  | none (highlighter stroke already; `external` gives ↗) |
| message-scroller | `thread` |  | none |
| milestone-path | `steps` |  | `Step` states complete / current / upcoming and a select handler (see `stepper`). |
| motion-drawer | `sheet` + `drawer` | UI Layouts | A multi-panel drawer: tabs inside one sheet. Floating and stack variants: no. |
| multi-select | `combobox` |  | `multiple` prop: chosen words sit on the line in italic, each removable with the badge's strike. |
| native-select | `select` (already a real `<select>`) |  | none |
| option-wheel | `dial` (arc and tuner) | React Bits | none |
| preview | `source` + the docs site's specimen frame |  | none (a docs tool, not a product part) |
| profile-card | `avatar` + `item` |  | none (recipe) |
| scroll-reveal | `gather` | React Bits | `scrub` prop: tie the settle to scroll position instead of a one-time settle. |
| separator | `marker` (divider) and `meta` |  | A wordless rule and a vertical orientation on `marker`. |
| stepper | `steps` |  | Controlled `value` / `onValueChange` and a compact "2 of 5" presentation on `steps`. |
| target-cursor | `corners` + statement `button` (corners close in on hover) | React Bits | Optional, low value: one `corners` frame that glides to the focused control in a group. |
| text-reveal | `gather` | React Bits | `by` set to letter, word or line. The owner's example, a pretext line that writes in as you scroll to it, is `gather` today. |
| textarea | `field` (`Textarea`, ruled like paper, with `count`) |  | none |
| theme-toggle | `mode-toggle` (five drawings) |  | none |
| variable-proximity | `wake` | React Bits | `weight` mode: the pointer swells the weight under it instead of parting the line. Needs a variable face in the pair. |
| work-side-panel | `sidebar` + `sheet` |  | none (recipe) |

## Table B. Port (20)

| 000h item | The job | How 0dB expresses it | Reference poster or convention | Adapted from |
|---|---|---|---|---|
| activity-feed | A history of what happened, grouped by day. | `marker` day dividers, `item` rows with actor (`avatar`), a timestamp in pencil, and one hairline down the margin with a dot per entry; the newest carries the accent; "and 4 more" loads the rest. | Contents pages; WOVE dates |  |
| agent-chat | Talk to an agent, with permissions and choices. | Compose existing parts: `thread` + `message` + `attachment` + `field` (composer), a permission as `dialog alert`, a choice as `radio-group`, work as `progress` sentence, status as `marker`. One new piece: the composer with attachments. Needs `MessageTyping` (Table A). | "It has to be design." (theirs roman, yours italic); Weingart callouts |  |
| appearance | Choose the look: palette, key, type pair, mode. | Promote the docs site's `components/site/theme-controls.tsx`: `picks` for scheme, key and pair, written back as a sentence, "Cotton, in ultramarine, set in Archivo and Bodoni." Only the four switches on `<html>`; no contrast dial. | Healthy habits (answers as one sentence); the score's pizzicato (picks) |  |
| area-chart | Volume over time. | No fill (fills are refused): drop hairlines from each point to the baseline, at barcode rhythm under the line. Multiple series are the italic/roman pair plus the one accent. | SPECTRA barcode rhythm |  |
| data-table | Records you can sort, filter and page. | `table` plus `pagination` (folio) plus `select`. Press a heading to sort: the column turns ink and its arrow turns. The filter is a sentence, "Show [open] items". Rows in tabular figures. | Renaissance two-colour (table); book folio (pager) |  |
| dots-background | A quiet structure behind a section. | Same item as `grid-background`: `variant="dots"`, fine points at the grid's crossings. Never animates. | Paul Rand dotted construction grid |  |
| dropzone | Drop files or choose them. | An area defined only by `corners`; drag over it and the corners close in. "Drop files here, or choose" is the control (a real file input). Accepted files list as `attachment` rows; a refused one says what to fix. | "the silence that heals" corners; SHAPES / GRADIENTS frame |  |
| focus-session | A countdown timer. | Huge `mm:ss` in tabular figures, a hairline ring that empties, Start / Pause / Reset as bracket buttons. Build as `timer`, not a card. | Dot calendar; SPECTRA numbers |  |
| grid-background | A quiet structure behind a section. | Static: a faint hairline grid (`--db-rule`) with corner crosses and tick labels; one prop, `cell`. Merge with `dots-background` as one `grid` item, `variant="rules" | "dots"`. | "the silence that heals" faint grid; Paul Rand dotted construction grid |  |
| line-chart | A value over time. | One hairline series with a dot per point, extending `chart`: the giant number rolls to the point under the pointer. Smooth and step are two path styles. Keyboard: arrows move the dot. | POINT / SPECTRA (tiny data, one giant number) |  |
| number-input | A number field with stepping and readable formatting. | A `field` baseline with the value in italic tabular figures; "less" and "more" as bracket words at the ends (or Arrow keys, Page keys); the figure rolls as it steps. Format with `Intl.NumberFormat`. Could ship as `type="number"` on `Input`. | Paul Rand dimension lines; the dial's tuner scale |  |
| pie-chart | Shares of a whole. | A ring cut into arcs with hairline gaps (no wedges, no fills); the total is the giant number in the middle and the arc you point at swaps it for its share. | Dot calendar; Eclipse |  |
| radar-chart | Several dimensions on one shape. | A hairline polygon on a dotted construction grid, each axis named in small caps at its end, the value read as a dimension line to the rim. | Paul Rand dotted construction grid and dimension lines |  |
| radial-chart | Progress against a maximum. | An arc or a full ring on a hairline circle, the number set large inside; several series are concentric hairline rings. Shares the `progress` ring vocabulary. | Dot calendar rings; Eclipse half-disc |  |
| reading-trail | Keep your place while reading a long page. | A spine of numbered section names (01, 02) on a hairline, the current one in the accent, dotted leaders to the progress. Promote the docs site's `components/site/page-rail.tsx`. The `scrollbar` rail marks sections but does not say which is current. | SPECTRA numbers; "Less is more" rules |  |
| scroll-expand | A framed block opens to full width as you scroll. | A frame drawn by `corners` grows from a small mark to the full measure as the page scrolls (scrubbed, so it stops when you stop); the caption sits in a `meta` row. | SHAPES / GRADIENTS frame; crop marks | React Bits |
| swapy | Reorder items by hand. | `rows` that swap places: a "move" word is the handle; Arrow keys move the held row and it inks; the new order is announced. No drag-ghost card. | "the uncreative" (rows reverse out of ink) | UI Layouts |
| text-ribbon | A phrase set along a curve. | Pretext lays the phrase on an arc or wave; it moves only when dragged or scrolled, and rests when let go. No auto-travel loop, no marquee. | WOVE (numbers along an arc); the fermata arc | React Bits |
| tree | A hierarchy of names that folds. | Names indented on one hairline with a dot at each branch; a folder's count is raised beside it; a trailing value joins by a dotted leader (`item`); "and 4 more" folds a long branch (`collapsible`). Selected row takes the accent dot. | Contents pages (dotted leader); Paul Rand dimension lines (the branch rule) |  |
| word-relay | A sentence whose one word changes. | `mode-toggle`'s sentence variant generalised: the last word rolls to the next option on press or Arrow key (`lib/roll.ts`). The chosen word is italic. | "It has to be design." (italic word); the score's slur |  |
| stat (derived from `label`'s `Stat` / `Stats`) | A named value: a figure and what it counts. | A giant figure cropped by a rule with a small caps label under it, several in a row on hairlines; the figure rolls when it changes (`lib/roll.ts`). The same idea as `chart`'s readout, standalone. | SPECTRA crop; POINT / SPECTRA (giant number, tiny data) | |

## Table C. Conflicts with INTENT (66)

"Type-led reinterpretation" keeps the job and drops the effect. 14 of 66 have one; "none" means the job is only the effect.

| 000h item | Adapted from | INTENT / DESIGN rule it breaks | Type-led reinterpretation |
|---|---|---|---|
| adjuster |  | "A theming engine." (INTENT, non-goal) | none. Editable motion profiles are a tuning tool, and 0dB's motion is fixed per component. |
| agent-state |  | "Nothing moves unless the person does." (INTENT, refused: motion that plays by itself); "Type is the only ornament." (DESIGN, Principles 2) | A status word in the voice with a dot: `marker` status plus `spinner`, states read as words (Ready, Thinking, Working, Needs your input, Done). |
| ambient-background |  | "Nothing moves unless the person does." (INTENT, refused: motion that plays by itself) | none |
| animated-icon |  | "Words say what an icon only suggests" (INTENT, refused: icons) | none |
| article-headings | ThreeUI | "Nothing moves unless the person does." (INTENT, refused: motion that plays by itself) | `gather` on prose headings, fired when you scroll to them: a `Typography` heading wrapper. |
| assembly-part |  | "a motion library" (INTENT, refused); "A box around content says the space failed." (INTENT, refused: cards, fills and shadows) | none |
| bento-builder |  | "A box around content says the space failed." (INTENT, refused: cards, fills and shadows) | none. A layout editor for rounded cards. |
| bento-grid |  | "A box around content says the space failed." (INTENT, refused: cards, fills and shadows) | Tiles divided only by hairlines on the 12-column grid, sized by span: a hairline tiling, no rounded cards (poster 14, "Less is more"). |
| buy-me-coffee | UI Layouts | "Type is the only ornament." (DESIGN, Principles 2) | none needed. A support link is a `link` with `external`, or a bracket `button`; document it as a recipe. |
| caret-swap | remocn | "Nothing moves unless the person does." (INTENT, refused: motion that plays by itself) | A phrase struck through and rewritten in place on press, the pen drawing the strike (checkbox and Weingart idea). |
| click-spark | React Bits | "Nothing moves unless the person does." (INTENT, refused: motion that plays by itself); "Type is the only ornament." (DESIGN, Principles 2) | A press draws a scribbled accent ring around the pressed word, once (poster 20). Low value. |
| contour-field |  | "Nothing moves unless the person does." (INTENT, refused: motion that plays by itself); "Type is the only ornament." (DESIGN, Principles 2) | none |
| contours-background |  | "Type is the only ornament." (DESIGN, Principles 2) | none |
| depth-background |  | "Nothing moves unless the person does." (INTENT, refused: motion that plays by itself) | none |
| dither-dissolve | remocn | "Nothing moves unless the person does." (INTENT, refused: motion that plays by itself) | none on its own. Scene changes are covered by the `wave-wipe` reinterpretation. |
| dither-sculpture |  | "Each dependency is a second opinion about how things should look." (INTENT; `three` / a motion library) | none |
| dock |  | "Words say what an icon only suggests" (INTENT, refused: icons) | none. A launcher of words is `menubar` or the folded `sidebar`. |
| elastic-mesh | React Bits | "Nothing moves unless the person does." (INTENT, refused: motion that plays by itself) | none |
| falling-text | React Bits | "Nothing moves unless the person does." (INTENT, refused: motion that plays by itself) | none |
| float-layer |  | "Nothing moves unless the person does." (INTENT, refused: motion that plays by itself) | none. Arriving on scroll is `gather`. |
| flow-sculpture |  | "Each dependency is a second opinion about how things should look." (INTENT; `three` / a motion library) | none |
| folds-background |  | "Type is the only ornament." (DESIGN, Principles 2) | none |
| ghost-cursor | React Bits | "Nothing moves unless the person does." (INTENT, refused: motion that plays by itself) | none |
| glass-sculpture |  | "Each dependency is a second opinion about how things should look." (INTENT; `three` / a motion library) | none |
| glyph-sculpture |  | "Each dependency is a second opinion about how things should look." (INTENT; `three` / a motion library) | none |
| grain-dissolve | remocn | "Nothing moves unless the person does." (INTENT, refused: motion that plays by itself) | none on its own. See `wave-wipe`. |
| guided-pointer |  | "Nothing moves unless the person does." (INTENT, refused: motion that plays by itself); "Words say what an icon only suggests" (INTENT, refused: icons) | A tour of callouts: a leader line ending in a dot hops between named targets on Next (Weingart callouts; `popover` already hangs on a leader). Steps on press only. |
| icon | Lucide (geometry) | "Words say what an icon only suggests" (INTENT, refused: icons) | none |
| image-masking | UI Layouts | "Type is the only ornament." (DESIGN, Principles 2) | `figure`: a greyscale photograph with `corners` crop marks and its caption in a `meta` row. Keeps the job of framing an image, drops the silhouettes. Fills the gap that 0dB has no image item. |
| image-trail | React Bits | "Nothing moves unless the person does." (INTENT, refused: motion that plays by itself) | none |
| infinite-spiral | React Bits | "Nothing moves unless the person does." (INTENT, refused: motion that plays by itself) | none |
| ink-sculpture |  | "Each dependency is a second opinion about how things should look." (INTENT; `three` / a motion library) | none |
| item-adornment |  | "Words say what an icon only suggests" (INTENT, refused: icons); "Type is the only ornament." (DESIGN, Principles 2) | Already built: the item's initial in a ring (`avatar`) or hung in the margin (`picks`). Nothing to add. |
| linear-modal | UI Layouts | "A box around content says the space failed." (INTENT, refused: cards, fills and shadows); "a motion library" (INTENT, refused) | A `rows` row opens into a `sheet` and its name grows into the page title (native `<dialog>` plus a view transition, no library). |
| magic-rings | React Bits | "Nothing moves unless the person does." (INTENT, refused: motion that plays by itself) | none |
| marquee |  | "Nothing moves unless the person does." (INTENT, refused: motion that plays by itself) | A band of words that travels only while the page scrolls and stands still when you stop (000h's own `respondToScroll`, with no idle speed). |
| meta-balls | React Bits | "Nothing moves unless the person does." (INTENT, refused: motion that plays by itself) | none |
| orbit-images | React Bits | "Nothing moves unless the person does." (INTENT, refused: motion that plays by itself) | none |
| organism-assembly |  | "Nothing moves unless the person does." (INTENT, refused: motion that plays by itself); "a motion library" (INTENT, refused) | none |
| organism-composition |  | "Nothing moves unless the person does." (INTENT, refused: motion that plays by itself); "A box around content says the space failed." (INTENT, refused: cards, fills and shadows) | none. Its seven compositions are recipes (Table A). |
| particle-sculpture |  | "Each dependency is a second opinion about how things should look." (INTENT; `three` / a motion library) | none |
| particle-text | React Bits | "Nothing moves unless the person does." (INTENT, refused: motion that plays by itself) | none. `gather` is already letters settling from dust. |
| pattern-background |  | "Type is the only ornament." (DESIGN, Principles 2) | Only the faint grid survives, as `grid` (Table B). The other seven patterns: none. |
| pebbles-background |  | "Type is the only ornament." (DESIGN, Principles 2) | none |
| pigment-field |  | "Cards, fills and shadows" (INTENT, refused) | none |
| pixel-swap | React Bits | "Nothing moves unless the person does." (INTENT, refused: motion that plays by itself) | none on its own. See `wave-wipe`. |
| portal-field | ThreeUI | "Cards, fills and shadows" (INTENT, refused) | none |
| presence |  | "a motion library" (INTENT, refused) | Native CSS exits (`@starting-style`, `transition-behavior: allow-discrete`, `data-state`). Dialogs already work this way; no item needed. |
| ripple-distortion | React Bits | "Nothing moves unless the person does." (INTENT, refused: motion that plays by itself) | none |
| scroll-organism |  | "Nothing moves unless the person does." (INTENT, refused: motion that plays by itself) | none |
| sculpture-orbit |  | "Each dependency is a second opinion about how things should look." (INTENT; `three` / a motion library) | none |
| semantic-bloom | ThreeUI | "Nothing moves unless the person does." (INTENT, refused: motion that plays by itself) | none |
| shape |  | "Type is the only ornament." (DESIGN, Principles 2); "Words say what an icon only suggests" (INTENT, refused: icons) | none |
| shape-artwork |  | "Cards, fills and shadows" (INTENT, refused) | none. It is built on a cast shadow and a rear outline. |
| shape-scene |  | "Each dependency is a second opinion about how things should look." (INTENT; `three` / a motion library) | none |
| sprouts-background |  | "Type is the only ornament." (DESIGN, Principles 2) | none |
| strands | React Bits | "Nothing moves unless the person does." (INTENT, refused: motion that plays by itself) | none |
| sunwash-background |  | "Cards, fills and shadows" (INTENT, refused) | none |
| swarm-cursor | React Bits | "Nothing moves unless the person does." (INTENT, refused: motion that plays by itself) | none |
| typography-vortex | ThreeUI | "Nothing moves unless the person does." (INTENT, refused: motion that plays by itself) | none |
| warp-text | React Bits | "Nothing moves unless the person does." (INTENT, refused: motion that plays by itself) | none |
| wave-wipe | remocn | "Nothing moves unless the person does." (INTENT, refused: motion that plays by itself) | One hairline crosses the page on press or scroll and the next scene's words settle behind it (`gather`). Covers dither-dissolve, grain-dissolve and pixel-swap too. |
| weave-background |  | "Type is the only ornament." (DESIGN, Principles 2) | none |
| word-stream | remocn | "Nothing moves unless the person does." (INTENT, refused: motion that plays by itself) | Words appearing one by one as you scroll: the `gather` `by="word"` and `scrub` extensions. No new item. |
| writing-caret |  | "Nothing moves unless the person does." (INTENT, refused: motion that plays by itself) | none. `field` already draws a native caret, and only while it has focus. |
| zoom-words | remocn | "Nothing moves unless the person does." (INTENT, refused: motion that plays by itself) | none |

---

## Proposed build order

Order is by usefulness to the agency page and the portfolio first, then by how many other items a piece unlocks. Each batch is two or three related items that share a file or a pattern. Dependencies are noted; batches without a dependency can run side by side.

### B: new items

| Batch | Items | Why this order | Depends on |
|---|---|---|---|
| 1. Forms | number-input, dropzone | Every form-heavy page needs both, and 0dB has no way to take a number or a file. `number-input` can ship as `type="number"` on `Input` in `field`. | `field`, `corners`, `attachment` |
| 2. Data display | stat, data-table, tree | `stat` is the smallest piece and the landing page needs it. `data-table` and `tree` are the two large gaps for any product screen. | `table`, `pagination`, `select`, `item`, `collapsible`, `lib/roll.ts` |
| 3. Chart series | line-chart, area-chart | First step past "one series of bars". Do the `chart` extensions (horizontal, grouped, stacked, multi-series readout) in the same batch. | `chart` |
| 4. History and wayfinding | activity-feed, reading-trail | Both are promotions or recombinations of parts 0dB has. `reading-trail` starts from the docs site's `page-rail.tsx`. | `marker`, `item`, `avatar`, `collapsible`, `scrollbar` |
| 5. Site chrome | appearance, grid (grid-background + dots-background as one item) | `appearance` starts from `theme-controls.tsx`. `grid` is static and small. Both make the docs site use the library's own parts. | `picks`, `mode-toggle` |
| 6. App surfaces | agent-chat, swapy | `agent-chat` is mostly composition; add `MessageTyping` to `message` first (batch E3). `swapy` brings the only reorder interaction. | `thread`, `message`, `attachment`, `field`, `dialog`, `rows` |
| 7. Rings | radial-chart, focus-session (as `timer`) | Both are one arc or ring with a large number inside. Build the ring once. | `progress`, `lib/roll.ts` |
| 8. Shares and shapes | pie-chart, radar-chart | Share the ring and the dotted grid from batches 5 and 7. | batches 5 and 7 |
| 9. Landing type | scroll-expand, text-ribbon, word-relay | Nice for the landing page, not needed to use the library. Each is pointer- or scroll-driven and rests when you stop. | `corners`, `meta`, pretext, `lib/roll.ts` |

The ten most valuable B items, in order: data-table, line-chart, stat, number-input, dropzone, tree, activity-feed, reading-trail, appearance, agent-chat.

### E: extensions to existing items (from Table A, "Add")

16 capabilities, grouped by the file they touch. They are small and can go beside the B batches.

| Batch | Item and capability |
|---|---|
| E1. Gather | `gather`: `by` set to letter, word or line (text-reveal) and `scrub` (scroll-reveal). Also covers word-stream (Table C). |
| E2. Choice | `combobox` `multiple` (multi-select); `steps` controlled `value` and compact presentation (stepper, milestone-path). |
| E3. Small parts | `message` `MessageTyping` (bubble); `marker` wordless rule and vertical (separator); `Direction` wrapper that sets Radix `DirectionProvider` (direction); `fraction` optional `total` (animated-number). |
| E4. Variants | `accordion` horizontal (accordion-gallery); `source` `wrap` and language label (code-block); `drawer` or `sheet` with panels (motion-drawer); `wake` `weight` mode (variable-proximity). Optional, low: `corners` glide (target-cursor). |
| With batch 3 | `chart` horizontal, grouped, stacked and multi-series readout (bar-chart, chart-tooltip). |

### R: type-led reinterpretations of C items

Only worth building if the owner wants them; they are not part of "B". Ordered by how much of a gap they fill.

| Batch | Items | Note |
|---|---|---|
| R1 | image-masking as `figure`; bento-grid as a hairline tiling | `figure` fills the image gap; the tiling is poster 14. |
| R2 | wave-wipe (one hairline scene change, also covers dither-dissolve, grain-dissolve, pixel-swap); marquee (a scroll-only band of words) | Person-driven only. |
| R3 | linear-modal (a row opens into a sheet); guided-pointer (a tour of callouts) | Native `<dialog>` and leader lines; no motion library. |
| R4 | article-headings (`gather` on prose headings); caret-swap (strike and rewrite); agent-state (a status word with a dot) | Small, each is a prop or recipe on existing parts. |
| Skip | click-spark (low value) | |
| No new build | item-adornment (`avatar`, `picks`), presence (native CSS), word-stream (E1), pattern-background (`grid`), buy-me-coffee (a `link`) | Already covered once the named item exists. |

The other 52 C items have no reinterpretation and should not be built.
