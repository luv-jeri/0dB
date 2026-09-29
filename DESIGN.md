# Fermata

A design system for type and silence. Two typefaces, one accent, and a great deal of space.

- Specimen: `fermata/index.html` (run `python3 -m http.server 4173 --directory fermata`)
- Tokens: `fermata/tokens.css` (becomes the library's `registry:base` item)
- Base and components: `fermata/fermata.css`, fenced `/* ── f-<name> ── */` so each fence becomes a `styles/<name>.css` sidecar

Status: version 0.1, phase 1 of 4. The next phases are the React component library (built the way 000h is: a shadcn registry, cva variants, CSS sidecars), then the agency landing page, then the portfolio.

## Principles

1. **Silence is structure.** Space does the layout. A hairline appears only where space alone can't hold two things apart.
2. **Type is the only ornament.** Weight, width, size, tracking and order carry every level of hierarchy. No icons, fills or shadows.
3. **Ours in roman, yours in italic.** Interface text is Archivo, upright. Anything the person chose, typed or set turns into Bodoni Moda italic at `--f-expression-scale` (1.15em): a picked option, a typed value, a switch state, a slider value, a named item they own. Musical and foreign terms are italic too (`.f-term`), by book convention.
4. **One note of colour.** One accent marks where you are: the current page, the chosen option, focus. At most one accent mark in view. Crimson is only for errors. The highlighter is only for reading marks.
5. **Nothing moves unless you do.** Motion answers an action, then rests. The overture is the only motion that plays by itself, and it plays once.

## Conventions

- Tokens are `--f-*`. Component classes are `f-<name>`.
- States live on native attributes (`:checked`, `:disabled`, `[aria-selected]`, `[aria-invalid]`, `[aria-current]`, `[aria-pressed]`, `[aria-busy]`). Variants live on `data-variant`, and size on `data-size`.
- `[data-force~="hover"]` and `[data-force~="focus"]` pin a state for documentation rows.
- Every control is built on the right native element, so the React port can use native elements or Radix without changing the look.
- Modes: `<html data-mode="day | nocturne">`. Keys: `<html data-key="viridian | ember | violet">` (no attribute means ultramarine).
- Copy: sentence case, active verbs. An action keeps its name through the flow (Upload, Uploading, Uploaded). Errors say what to fix and never apologise.

## Tokens

### Colour

| Token | Day | Nocturne | Role |
|---|---|---|---|
| `--f-paper` | `#f2f3f0` | `#10111c` | The page |
| `--f-ink` | `#000` | `#e9eaec` | Display type, the statement block |
| `--f-graphite` | `#4a4b50` | `#b4b5bc` | Body text |
| `--f-pencil` | `#6b6c71` | `#83848c` | Placeholders, captions, done or off |
| `--f-rule` | `rgb(0 0 0 / .14)` | `rgb(255 255 255 / .14)` | Hairlines |
| `--f-rule-strong` | `rgb(0 0 0 / .42)` | `rgb(255 255 255 / .42)` | Baselines, ticks, rings |
| `--f-accent` | `#2b2bee` | `#8c8cff` | Where you are |
| `--f-signal` | `#c8102e` | `#ff6b7f` | Errors only |
| `--f-mark` | `#ffe45a` | same | Selection, `<mark>`, link hover |
| `--f-on-mark` | `#000` | same | Text on the highlighter |

Keys (`--f-accent`, day / nocturne): viridian `#0b6e4f` / `#4fd1a5`, ember `#b83d00` / `#ff8a4c`, violet `#6a1b9a` / `#c58cf2`. All clear 4.5:1 on their paper.

### Type

- `--f-voice`: Archivo (variable: width 62–125, weight 100–900). Everything the interface says.
- `--f-expression`: Bodoni Moda italic (optical size 6–96). Everything the person says back.
- `--f-expression-scale`: 1.15, so the two x-heights meet.
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
- Statement: reversed type in an ink block, one per view. Hover widens the letters (`font-stretch` 100% to 114%), and press drops 1px. Bracket: `( Label )`, and the parentheses step apart on hover. Quiet: a hairline underline that retracts and redraws at stroke width.
- States: rest, hover, focus (accent outline, 4px offset), disabled (pencil), busy (`aria-busy="true"` plus the doing word and `f-dots`).
- Keyboard: native button.

### f-dots (loading)
- Anatomy: `<span class="f-dots" aria-hidden="true"><i></i><i></i><i></i></span>` inside a busy button, next to a present-tense word ("Saving").
- Shown only while something the person started is running. Static at 60% under reduced motion.

### f-check (checkbox)
- Anatomy: `<label class="f-check"><input type="checkbox"><span>Words</span></label>`; a group is `<fieldset class="f-checklist">` with a legend.
- Checked: an accent strike draws left to right at 60% height, weight drops to 300, and the colour goes to pencil. Unchecking lifts the strike away to the right.
- States: rest, hover (ink), focus (outline on the words), checked, disabled.
- Keyboard: Tab to focus, Space toggles.

### f-choice (radio)
- Anatomy: `<fieldset class="f-choice">`, a legend, then `<label data-text="Words"><input type="radio"><span>Words</span></label>` for each option, then `<span class="f-choice-dot">`.
- Yours: the chosen word cross-fades into Bodoni italic. One accent dot sits under the chosen word; script sets `--c` (centre x) and `--y` (row offset) and adds `data-ready` before the first animated move.
- States: rest, hover, focus, chosen, disabled.
- Keyboard: native radio group (arrow keys move the choice).

### f-switch
- Anatomy: `<label class="f-switch"><input type="checkbox" role="switch" aria-label="Name"> Sentence is <span class="f-switch-state" aria-hidden="true"><span>on</span><span>off</span></span>.</label>`.
- Yours: the state word, in italic, rolls vertically between on and off. Off is pencil.
- States: on, off, hover (the underline darkens), focus, disabled.
- Keyboard: Space toggles.

### f-ruler (slider)
- Anatomy: `.f-ruler` holding a label, `<output class="f-ruler-value">`, `<input type="range">` and an optional `.f-ruler-scale` of `<span style="--n: 0…1">`.
- The track is a ruler: minor ticks every 5%, major every 25%, and the filled part in ink. The thumb is an ink hairline topped by the accent dot. Script sets `--p` (0–1).
- Yours: the value, a large italic numeral that travels above the thumb.
- States: rest, focus (outline 8px out), disabled (45% opacity).
- Keyboard: arrows step, Page Up / Page Down jump, Home / End go to the ends.

### f-field (text field, textarea)
- Anatomy: `.f-field` holding a `.f-label`, an optional `.f-field-count`, then the `input` or `textarea`, then an optional `.f-field-hint` or `.f-field-error`.
- No box, only a baseline. Focus draws an accent line from the left and shows the counter.
- Yours: the typed value, in Bodoni italic. The placeholder stays Archivo, in pencil.
- Textarea: ruled like paper, with lines every `--lh` (2.25rem) that scroll with the text.
- States: rest, focus, filled, error (`aria-invalid="true"` turns both lines crimson; the message in `.f-field-error` is linked with `aria-describedby`), disabled (dotted baseline).
- Error copy says what to fix: "Check the address. It needs a domain after the @, like studio.com."

### f-select
- Anatomy: `<p class="f-select">Sort by <span class="f-select-box"><select>…</select></span></p>`.
- Yours: the chosen option, italic over a hairline. A small ↓ follows it.
- Where `appearance: base-select` is supported, the open list is restyled: current option in accent, hovered option in highlighter.
- Keyboard: native select.

### f-progress
- Anatomy: `.f-progress` holding a label, `.f-progress-value` (the number plus `<small>%</small>`, `aria-hidden`), and `<progress>`.
- A hairline fills in ink, and a light numeral counts. The label keeps the action's name: "Uploading 12 files", then "Uploaded 12 files".

### f-toast
- Anatomy: `.f-toaster` (`aria-live="polite"`, fixed bottom left), holding `.f-toast` elements, each a sentence, an optional bracket action, and `.f-toast-timer`.
- The timer hairline depletes over `--life` and pauses on hover or focus. At most three toasts show at once. The toast leaves with `data-leaving`.
- Yours: the item's name inside the sentence, e.g. "Archived *Spring notes*."

### f-dialog
- Anatomy: `<dialog class="f-dialog" closedby="any">` holding `<form method="dialog">`, the `.f-dialog-title` question, `.f-dialog-body`, then `.f-dialog-actions` with a bracket (safe, `autofocus`) and a statement (the action).
- The question is set large; the item is yours ("Delete *Spring notes*?"). The backdrop is paper at 86% with a blur.
- Keyboard: focus goes to the safe answer; Escape closes; a click outside closes. Smooth scrolling pauses while it's open.

### f-empty
- Anatomy: `.f-empty` holding `.f-empty-title`, one sentence of direction, and one action.
- An invitation to act, not a mood.

### f-tabs
- Anatomy: `<div class="f-tabs" role="tablist">`, then `<button role="tab" aria-selected>` for each tab, with an optional count in `<sup>`, then `<span class="f-tabs-line">`.
- The ink line follows the selected tab through `--x`, `--w` and `--y`.
- Keyboard: roving tabindex. Left and Right arrows move and select, Home / End go to the ends.

### f-rows (index)
- Anatomy: `<ul class="f-rows">` with `<li><a>`, holding `.f-rows-title`, a kind, `.f-rows-year` and `.f-rows-go` (→, aria-hidden).
- Hover or focus steps the title 8px forward and brings in the arrow.

### f-pager
- Anatomy: `<nav class="f-pager">` of links or buttons with two-digit numbers; the current one has `aria-current="page"`.
- A 3px dot sits under each number; the current page's dot is 6px and in the accent.

### f-crumbs
- Anatomy: `<nav class="f-crumbs" aria-label="Breadcrumb"><ol>…</ol></nav>`. Slashes come from CSS. The current item is an ink span with `aria-current="page"`.

### f-disclose
- Anatomy: `<details class="f-disclose"><summary>Question</summary><div class="f-disclose-body">…</div></details>`.
- The + turns 45° into ×. The content opens by animating block-size (`::details-content`) over `--f-andante`.
- Keyboard: native (Enter or Space on the summary).

### f-month (calendar)
- Anatomy: `.f-month` holding `.f-month-head` (`.f-month-date`, the `.f-month-title` name and year, `.f-month-nav` ← →), then `.f-month-grid` with 7 `<abbr>` weekday heads and `<button class="f-month-day" data-when="past | today | future" aria-pressed>`.
- Past days are filled ink and disabled, today is the accent, and future days are hairline rings.
- Yours: the chosen day shows its number in italic inside a stroke ring.
- Keyboard: roving tabindex; arrow keys move by a day or a week; Enter or Space chooses.

### f-tag
- Anatomy: `<span class="f-tag" data-variant="ink | accent">`, or a removable `<button class="f-tag" data-removable aria-label="Remove X">`.
- The one rounded shape. Removing a tag moves focus to its neighbour.

### f-note (marginalia)
- Anatomy: `<button class="f-note" aria-describedby="id">Term<span class="f-note-text" id="id" aria-hidden="true">Note</span></button>`.
- A dotted underline. On hover or focus, a leader line draws down to an ink pill holding the note.
- Keyboard: focus shows it, and Escape dismisses it.

### Base pieces
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

## Skipped for now

- A destructive button variant. Danger is said in words, through the dialog.
- Date ranges in the calendar.
- Self-hosted fonts (they come from Google Fonts until phase 2 bundles them with their OFL notices).
