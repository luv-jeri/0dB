# Fermata

A design system for type and silence. Two typefaces, one accent, and a great deal of space.

- Specimen: `fermata/index.html` (run `python3 -m http.server 4173 --directory fermata`)
- Tokens: `fermata/tokens.css` (becomes the library's `registry:base` item)
- Base and components: `fermata/fermata.css`, fenced `/* ── f-<name> ── */` so each fence becomes a `styles/<name>.css` sidecar

Status: version 0.1, phase 1 of 4. The next phases are the React component library (built the way 000h is: a shadcn registry, cva variants, CSS sidecars), then the agency landing page, then the portfolio.

## Principles

1. **Silence is structure.** Space does the layout. A hairline appears only where space alone can't hold two things apart.
2. **Type is the only ornament.** Weight, width, size, tracking and order carry every level of hierarchy. No icons, fills or shadows.
3. **Ours in roman, yours in italic.** Interface text is the voice, upright. Anything the person chose, typed or set turns into the expression italic at `--f-expression-scale`: a picked option, a typed value, a switch state, a slider value, a named item they own. Musical and foreign terms are italic too (`.f-term`), by book convention.
4. **One note of colour.** One accent marks where you are: the current page, the chosen option, focus. At most one accent mark in view. Crimson is only for errors. The highlighter is only for reading marks.
5. **Nothing moves unless you do.** Motion answers an action, then rests. The overture is the only motion that plays by itself, and it plays once.

## Conventions

- Tokens are `--f-*`. Component classes are `f-<name>`.
- States live on native attributes (`:checked`, `:disabled`, `[aria-selected]`, `[aria-invalid]`, `[aria-current]`, `[aria-pressed]`, `[aria-busy]`). Variants live on `data-variant`, and size on `data-size`.
- `[data-force~="hover"]` and `[data-force~="focus"]` pin a state for documentation rows.
- Every control is built on the right native element, so the React port can use native elements or Radix without changing the look.
- Four switches on `<html>`, all optional:
  - `data-mode="day | nocturne"`
  - `data-scheme="blueprint | statue | silence | riso"` (no attribute means cotton)
  - `data-key="ultramarine | viridian | ember | violet"`, which overrides the scheme's accent and is declared last so it always wins
  - `data-pair="press | paris | salon"` (no attribute means parma)
- One creative move per component, and only one, drawn from the poster references (see "Where each move comes from").
- Copy: sentence case, active verbs. An action keeps its name through the flow (Upload, Uploading, Uploaded). Errors say what to fix and never apologise.

## Tokens

### Colour

| Token | Day | Nocturne | Role |
|---|---|---|---|
| `--f-paper` | `#f2f3f0` | `#10111c` | The page |
| `--f-ink` | `#000` | `#e9eaec` | Display type, the statement block |
| `--f-graphite` | `#4a4b50` | `#b4b5bc` | Body text |
| `--f-pencil` | `#6b6c71` | `#83848c` | Placeholders, captions, done or off |
| `--f-rule` | ink at 14% (`color-mix`) | same | Hairlines |
| `--f-rule-strong` | ink at 42% (`color-mix`) | same | Baselines, ticks, rings |
| `--f-accent` | `#2b2bee` | `#8c8cff` | Where you are |
| `--f-signal` | `#c8102e` | `#ff6b7f` | Errors only |
| `--f-mark` | `#ffe45a` | same | Selection, `<mark>`, link hover |
| `--f-on-mark` | `#000` | same | Text on the highlighter |

Keys (`--f-accent`, day / nocturne): ultramarine `#2b2bee` / `#8c8cff`, viridian `#0b6e4f` / `#4fd1a5`, ember `#b83d00` / `#ff8a4c`, violet `#6a1b9a` / `#c58cf2`. Every key clears 4.5:1 on every scheme's paper (lowest: ember on silence, 4.56).

Schemes move paper, ink, graphite, pencil, accent and signal together. The rules follow the ink. Values are listed as day, then Nocturne.

| Scheme | Paper | Ink | Pencil | Accent | From |
|---|---|---|---|---|---|
| cotton (house) | `#f2f3f0` / `#10111c` | `#000` / `#e9eaec` | `#6b6c71` / `#83848c` | `#2b2bee` / `#8c8cff` | "It has to be design." |
| blueprint | `#edf0f7` / `#0a1766` | `#0c1b8f` / `#f0f2ff` | `#58608f` / `#929ad0` | `#c23d00` / `#ff9557` | The calendar posters' one orange dot |
| statue | `#ebeae5` / `#0d1528` | `#14213d` / `#eee7d7` | `#5f687e` / `#938d80` | `#875600` / `#e3b04f` | The Renaissance and Greek statue prints |
| silence | `#e2e8e3` / `#0c1c18` | `#0e2a23` / `#e1ebe6` | `#4f6962` / `#7a918a` | `#1b3de0` / `#93a6ff` | "the silence that heals" |
| riso | `#f6f5f2` / `#1a1537` | `#25286b` / `#f8eef5` | `#636591` / `#9d92ab` | `#b8005f` / `#ff62b0` | Two-drum risograph prints |

All text colours (ink, graphite, pencil, accent, signal) clear 4.5:1 on their paper in both modes. Checked with a script, and live on the specimen's palette.

### Type

- `--f-voice`: a grotesque. Everything the interface says.
- `--f-expression`: an italic serif. Everything the person says back.
- `--f-expression-scale`: lifts the italic until the two x-heights meet. It's set per pair.

| Pair | Voice | Expression | Scale |
|---|---|---|---|
| parma (house) | Archivo (width 62–125, weight 100–900) | Bodoni Moda (optical size 6–96) | 1.15 |
| press | Schibsted Grotesk (weight 400–900) | Newsreader (optical size 6–72) | 1.1 |
| paris | Instrument Sans (width 75–100, weight 400–700) | EB Garamond | 1.24 |
| salon | Bricolage Grotesque (optical size, width 75–100, weight 200–800) | Cormorant | 1.26 |

The width moves (the title's exhale, the statement button, the disclosure) only travel as far as each voice's width axis allows. Schibsted has no width axis, so under press they change weight only.
- `--f-measure`: 62ch.

Dynamics: text steps by a fourth, headings by a fifth. Each size has `-lh` (leading) and `-tr` (tracking) companions.

| Token | Size | Leading | Tracking | Use |
|---|---|---|---|---|
| `--f-pp` | 13px | 1.45 | 0.01em | Labels, captions |
| `--f-p` | 17px | 1.6 | 0 | Body |
| `--f-mp` | 22px | 1.45 | −0.005em | Lead, control text |
| `--f-mf` | 32px | 1.15 | −0.015em | Heading in a section |
| `--f-f` | 48px | 1.05 | −0.025em | Section heading, dialog question |
| `--f-ff` | 72px | 0.95 | −0.035em | Page title |
| `--f-fff` | clamp(64px, 11vw, 160px) | 0.9 | −0.045em | Movement titles |
| `--f-ffff` | clamp(64px, 17.5vw, 272px) | 0.82 | −0.055em | The overture only |

### Space, line, shape

- `--f-space-1` … `--f-space-10`: 4, 8, 12, 18, 27, 40, 60, 90, 135, 200 (perfect fifths).
- `--f-hairline` 1px, `--f-stroke` 1.5px, `--f-dot` 7px, `--f-gutter` 24px, `--f-margin` clamp(20px, 5vw, 80px).
- Grid: 12 columns. Columns 1–3 are the margin (names, notes), 4–12 the stave (the work). One column below 860px.
- Shape vocabulary, complete: hairline, dot, ring, arc, cross, corner marks, parentheses, pill (tags only), and arrows only where there's a direction.

### Tempo

| Token | Value | Use |
|---|---|---|
| `--f-allegro` | 160ms | Hover, press |
| `--f-moderato` | 320ms | A state changes |
| `--f-andante` | 640ms | Panels, toasts, dialogs |
| `--f-adagio` | 1400ms | The overture, once |
| `--f-exhale` | cubic-bezier(.16, 1, .3, 1) | Arriving |
| `--f-breath` | cubic-bezier(.65, 0, .35, 1) | Moving between states |

Under `prefers-reduced-motion: reduce`, every tempo is 1ms: things still change but don't travel.

## Components

Each contract lists anatomy, states and keyboard behaviour. "Yours" marks where the italic expression appears.

### f-btn (button)
- Anatomy: `<button class="f-btn" data-variant="statement | bracket | quiet">`. Optional `data-size="l"`.
- Statement: reversed type in an ink block, one per view. On hover the letters widen (`font-stretch` 100% to 114%) and corner marks close in around the block (`f-corners`); press drops it 1px. Bracket: `( Label )`. The parentheses step apart on hover and close in on press. Quiet: a hairline underline that retracts and redraws at stroke width.
- States: rest, hover, focus (accent outline, 4px offset), disabled (pencil), busy (`aria-busy="true"` plus the doing word and `f-dots`).
- Keyboard: native button.

### f-dots (loading)
- Anatomy: `<span class="f-dots" aria-hidden="true"><i></i><i></i><i></i></span>` inside a busy button, next to a present-tense word ("Saving").
- Shown only while something the person started is running. Static at 60% under reduced motion.

### f-check (checkbox)
- Anatomy: `<label class="f-check"><input type="checkbox"><span>Words</span></label>`; a group is `<fieldset class="f-checklist">` with a legend.
- Checked: an accent strike draws left to right at 60% height, running 0.18em past both ends of the words the way a pen does. Weight drops to 300 and the colour goes to pencil. Unchecking lifts the strike away to the right.
- The tally is an `f-fraction`: "*2* / 5 done", with the yours part in italic.
- States: rest, hover (ink), focus (outline on the words), checked, disabled.
- Keyboard: Tab to focus, Space toggles.

### f-choice (radio)
- Anatomy: `<fieldset class="f-choice">`, a legend, then `<label data-text="Words"><input type="radio"><span>Words</span></label>` for each option, then `<span class="f-choice-dot">`.
- Yours: the chosen word cross-fades into the italic, and the unchosen words step back to pencil. One accent dot sits under the chosen word; script sets `--c` (centre x) and `--y` (row offset) and adds `data-ready` before the first animated move.
- States: rest, hover, focus, chosen, disabled.
- Keyboard: native radio group (arrow keys move the choice).

### f-dial (radio on an arc)
- Anatomy: `<fieldset class="f-dial" style="--n: 7">`, a legend, then `.f-dial-face` holding one `<label style="--i: 0…n-1" data-text="N"><input type="radio"><span>N</span></label>` per option, then `.f-dial-arc`, `.f-dial-dot`, and an optional `.f-dial-unit`.
- Options sit on an arc from 170° to 10°. `--sel` is a registered number, set by `:has()` rules (up to 9 options) and transitioned over `--f-andante`. Every option derives its distance from it, so the whole dial rolls: the chosen number swells to 2.4× and cross-fades to italic, the others fade from ink toward pencil by distance, and the accent dot travels the inner arc.
- No script. Keyboard: native radio group.

### f-picks (a list of choices)
- Anatomy: `<fieldset class="f-picks">`, a legend, then `<label><input type="radio">…any content…</label>`.
- For choices that carry their own content, such as a specimen or a swatch. An accent dot hangs beside the chosen one. The specimen uses it for the pair and scheme pickers.

### f-switch
- Anatomy: `<label class="f-switch"><input type="checkbox" role="switch" aria-label="Name"> Sentence is <span class="f-switch-state" aria-hidden="true"><span>on</span><span>off</span></span><span class="f-switch-stop" aria-hidden="true"></span></label>`.
- Yours: the state word, in italic, rolls vertically between on and off. Off is pencil.
- The full stop is the state too: `.f-switch-stop` is a filled dot when on and a hairline ring when off (the calendar's done and to-come).
- States: on, off, hover (the underline darkens), focus, disabled.
- Keyboard: Space toggles.

### f-ruler (slider)
- Anatomy: `.f-ruler` holding a label, `<output class="f-ruler-value">`, `<input type="range">` and an optional `.f-ruler-scale` of `<span style="--n: 0…1">`.
- The track is a ruler: minor ticks every 5%, major every 25%, and the filled part in ink. The thumb is an ink hairline topped by the accent dot. Script sets `--p` (0–1).
- Yours: the value, a large italic numeral set in the gap of a dimension line (after Paul Rand). The line runs from zero to the thumb, with a tick at each end.
- States: rest, focus (outline 8px out), disabled (45% opacity).
- Keyboard: arrows step, Page Up / Page Down jump, Home / End go to the ends.

### f-field (text field, textarea)
- Anatomy: `.f-field` holding a `.f-label`, an optional `.f-field-count`, then the `input` or `textarea`, then an optional `.f-field-hint` or `.f-field-error`.
- No box, only a baseline. Focus draws an accent line from the left and shows the counter.
- Yours: the typed value, in the italic. The placeholder stays in the voice, in pencil.
- Textarea: ruled like paper, with lines every `--lh` (2.25rem) that scroll with the text.
- States: rest, focus, filled, error (`aria-invalid="true"` turns both lines crimson; the message in `.f-field-error` is linked with `aria-describedby`), disabled (dotted baseline).
- The error is a callout, after Weingart: a crimson hairline pill hung from the baseline by a leader line, with a dot where it meets the line. A textarea's ruled lines turn crimson too.
- Error copy says what to fix: "Check the address. It needs a domain after the @, like studio.com."

### f-select
- Anatomy: `<p class="f-select">Sort by <span class="f-select-box"><select>…</select></span></p>`.
- Yours: the chosen option, italic over a hairline. A small ↓ follows it.
- Where `appearance: base-select` is supported, the open list is restyled: the current option has an accent dot beside it, and the hovered option is highlighted.
- Keyboard: native select.

### f-progress
- Anatomy: `.f-progress` holding a label, `.f-progress-value` (the number plus `<small>%</small>`, `aria-hidden`), and `<progress>`.
- A hairline fills in ink, and a light numeral counts. The label keeps the action's name: "Uploading 12 files", then "Uploaded 12 files".
- Optional `.f-progress-units` shows one ring per item, and each fills (`data-done`) as it lands, like days on the calendar.

### f-toast
- Anatomy: `.f-toaster` (`aria-live="polite"`, fixed bottom left), holding `.f-toast` elements. Each is `svg.f-toast-timer` (a fermata: arc `pathLength="1"` plus an accent dot), a sentence, and an optional bracket action.
- The fermata's arc empties over `--life`. Pointing at the toast or focusing it holds the pause, which is literally what a fermata means. At most three toasts show at once. The toast leaves with `data-leaving`.
- Yours: the item's name inside the sentence, e.g. "Archived *Spring notes*."

### f-dialog
- Anatomy: `<dialog class="f-dialog" closedby="any">` holding `<form method="dialog">`, the `.f-dialog-title` question, `.f-dialog-body`, then `.f-dialog-actions` with a bracket (safe, `autofocus`) and a statement (the action).
- It's set like a poster: corner marks instead of a box (`f-corners`), an `f-meta` row of facts along the top (`.f-dialog-meta`), and the question set large, with the item as yours ("Delete *Spring notes*?"). The backdrop is paper at 86% with a blur.
- Keyboard: focus goes to the safe answer; Escape closes; a click outside closes. Smooth scrolling pauses while it's open.

### f-empty
- Anatomy: `.f-empty` holding an optional `.f-empty-figure` (`0`, aria-hidden), then `.f-empty-title`, one sentence of direction, and one action.
- An invitation to act, not a mood. The zero is thin, wide and cropped to its top half, so "nothing" reads as the fermata's arc.

### f-tabs
- Anatomy: `<div class="f-tabs" role="tablist">`, then `<button role="tab" aria-selected>` for each tab, with an optional count in `<sup>`, then `<span class="f-tabs-line">`.
- The ink line follows the selected tab through `--x`, `--w` and `--y`.
- Optional `.f-tabs-count` (aria-hidden) sets the number showing huge and thin, cropped by the rule it sinks into. It rolls when the number changes, and hides below 700px.
- Keyboard: roving tabindex. Left and Right arrows move and select, Home / End go to the ends.

### f-rows (index)
- Anatomy: `<ul class="f-rows">` with `<li><a>`, holding `.f-rows-title`, a kind, `.f-rows-year` and `.f-rows-go` (→, aria-hidden).
- On hover or focus, the row reverses: an ink block wipes in from the left and the text turns to paper. The title steps 8px forward and the arrow comes in.

### f-pager
- Anatomy: `<nav class="f-pager">` of links or buttons with two-digit numbers; the current one has `aria-current="page"`.
- A 3px dot sits under each number; the current page's dot is 6px and in the accent.
- Weight falls with distance (600, then 350 for the neighbours, then 200), after the WOVE poster. Colour stays at or above graphite, so contrast never drops.

### f-crumbs
- Anatomy: `<nav class="f-crumbs" aria-label="Breadcrumb"><ol>…</ol></nav>`. The dividers are drawn hairlines, leaning 24° like slashes. The current item is an ink span with `aria-current="page"`.

### f-disclose
- Anatomy: `<details class="f-disclose"><summary>Question</summary><div class="f-disclose-body">…</div></details>`.
- The + turns 45° into ×, and the question exhales (width 112%, weight 300) as it opens. The content opens by animating block-size (`::details-content`) over `--f-andante`.
- Keyboard: native (Enter or Space on the summary).

### f-month (calendar)
- Anatomy: `.f-month` holding `.f-month-head` (`.f-month-date`, the `.f-month-title` name and year, `.f-month-nav` ← →), then `.f-month-grid` with 7 `<abbr>` weekday heads and `<button class="f-month-day" data-when="past | today | future" aria-pressed>`.
- Past days are filled ink and disabled, today is the accent, and future days are hairline rings.
- Yours: the chosen day shows its number in italic inside a stroke ring, and the big date in the head rolls to it.
- The days between today and the chosen day are half-moons (`data-between`), after the eclipse poster: the wait, drawn.
- Keyboard: roving tabindex; arrow keys move by a day or a week; Enter or Space chooses.

### f-tag
- Anatomy: `<span class="f-tag" data-variant="ink | accent">`, or a removable `<button class="f-tag" data-removable aria-label="Remove X">`.
- The label sits in a `<span>`. Pointing at or focusing a removable tag strikes the word, as the checkbox does.
- The one rounded shape. Removing a tag moves focus to its neighbour.

### f-note (marginalia)
- Anatomy: `<button class="f-note" aria-describedby="id">Term<span class="f-note-text" id="id" aria-hidden="true">Note</span></button>`.
- A dotted underline. On hover or focus, the highlighter marks the term, a dot anchors the leader line, and the line draws down to an ink pill holding the note.
- Keyboard: focus shows it, and Escape dismisses it.

### Base pieces
- `f-corners`: four corner marks as one `::after`. It frames without closing. Tune it with `--f-corner` (length), `--f-corner-inset` and `--f-corner-colour`.
- `f-fraction`: `<span class="f-fraction"><span class="f-yours">2</span><i><span class="f-sr"> of </span></i><span>5</span></span>`. A display fraction with a leaning hairline.
- `f-link`: a hairline underline, with a highlighter wipe on hover.
- `f-meta`: a frame row of words held apart by flexing hairlines.
- `f-kbd`: a key, drawn as a ring.
- `mark`, `::selection`: the highlighter.
- `:focus-visible`: an accent outline at `--f-stroke`, offset 4px.

## The overture (specimen only)

- The title exhales from weight 800 and width 62% to weight 200 and width 112% over `--f-adagio`, once the fonts are in.
- The manifesto is laid out with `@chenglou/pretext` (`prepareWithSegments` once, `layoutNextLine` per row). Rows that cross the pause's circle are split into two runs that share one cursor. Runs narrower than 160px (half the width on phones) stay empty.
- The fermata sign sits in the hole: an ink arc that draws once and an accent dot. It eases toward the pointer (0.08 per frame), a tap or click places it, and it stays where it's left. Under reduced motion it jumps on click and never follows.
- The real paragraph stays in the DOM, visually hidden, for screen readers and as the fallback if pretext doesn't load.

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Statement button | "the silence that heals" corners | Corner marks close in on hover |
| Checkbox | Weingart letter | The pen overshoots; the tally is a fraction |
| Radio | "It has to be design." | Chosen word turns italic; the rest step back |
| Dial | WOVE | Numbers on an arc; the dial rolls |
| Switch | "28 December" dots | The full stop is a dot or a ring |
| Slider | Paul Rand dimension lines | Value set in a dimension from zero |
| Field error | Weingart callouts | Pill on a leader line from the baseline |
| Progress | Dot calendar | A ring per item fills |
| Toast | The fermata sign | The arc empties; pointing holds it |
| Dialog | SHAPES / GRADIENTS frame | Corners and a metadata row |
| Empty state | SPECTRA crop | Half a zero, which is an arc |
| Tabs | POINT / SPECTRA | A giant, cropped count |
| Index rows | "the uncreative" | The row reverses out of ink |
| Pager | WOVE | Weight falls with distance |
| Breadcrumbs | Swiss diagonals | Drawn, leaning hairlines |
| Disclosure | The overture | The question exhales |
| Month | Half-circle eclipse | The wait as half-moons |
| Tag | The checkbox | Removing strikes the word |
| Marginalia | Weingart letter | Highlighter, anchor dot, leader line |

## Skipped for now

- A destructive button variant. Danger is said in words, through the dialog.
- Date ranges in the calendar.
- Self-hosted fonts. They come from Google Fonts until phase 2 bundles them with their OFL notices. The specimen declares all four pairs in one stylesheet; font files download only when a face is used.
- A states row for the dial. Its states are the radio's.
