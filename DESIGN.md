# 0dB

A design system for type and silence. Two typefaces, one accent, and a great deal of space. Read INTENT.md first; this file is the how.

- Library: a shadcn registry. `npx shadcn@latest add https://0db.cojeev.com/r/<item>.json`
- Items: `registry/0db/ui/<item>.tsx`, each with a sidecar `registry/0db/styles/<item>.css`
- Base: `registry/0db/styles/{tokens,base,fonts}.css` (the `0db` base item)
- Specimen: `specimen/index.html`, the original static page, served at `/specimen/`. It still uses the old `f-` names; everything else uses `db-`.

## Principles

1. **Silence is structure.** Space does the layout. A hairline appears only where space alone can't hold two things apart.
2. **Type is the only ornament.** Weight, width, size, tracking and order carry every level of hierarchy. No icons, fills or shadows.
3. **Ours in roman, yours in italic.** Interface text is the voice, upright. Anything the person chose, typed or set turns into the expression italic at `--db-expression-scale`: a picked option, a typed value, a switch state, a slider value, a named item they own. Musical and foreign terms are italic too (`.db-term`), by book convention.
4. **One note of colour.** One accent marks where you are: the current page, the chosen option, focus. At most one accent mark in view. Crimson is only for errors. The highlighter is only for reading marks.
5. **Nothing moves unless you do.** Motion answers an action, then rests. Pointing sketches in pencil; choosing inks it in. The overture is the only motion that plays by itself, and it plays once.

## Conventions

- Tokens are `--db-*`. Component classes are `db-<name>`.
- States live on native attributes (`:checked`, `:disabled`, `[aria-selected]`, `[aria-invalid]`, `[aria-current]`, `[aria-pressed]`, `[aria-busy]`). Variants live on `data-variant`, and size on `data-size`.
- `[data-force~="hover"]` and `[data-force~="focus"]` pin a state for documentation rows.
- Every control is built on the right native element, so the React port can use native elements or Radix without changing the look.
- Four switches on `<html>`, all optional:
  - `data-mode="day | nocturne"`
  - `data-scheme="blueprint | statue | silence | riso"` (no attribute means cotton)
  - `data-key="ultramarine | viridian | ember | violet"`, which overrides the scheme's accent and is declared last so it always wins
  - `data-pair="press | paris | salon"` (no attribute means parma)
- One creative move per component, and only one, drawn from the poster references (see "Where each move comes from"). Likewise one motion per component, named as an articulation (see "Motion").
- `[hidden]` always wins over a component's `display`.
- Copy: sentence case, active verbs. An action keeps its name through the flow (Upload, Uploading, Uploaded). Errors say what to fix and never apologise.

## Tokens

### Colour

| Token | Day | Nocturne | Role |
|---|---|---|---|
| `--db-paper` | `#f2f3f0` | `#10111c` | The page |
| `--db-ink` | `#000` | `#e9eaec` | Display type, the statement block |
| `--db-graphite` | `#4a4b50` | `#b4b5bc` | Body text |
| `--db-pencil` | `#6b6c71` | `#83848c` | Placeholders, captions, done or off |
| `--db-rule` | ink at 14% (`color-mix`) | same | Hairlines |
| `--db-rule-strong` | ink at 42% (`color-mix`) | same | Baselines, ticks, rings |
| `--db-accent` | `#2b2bee` | `#8c8cff` | Where you are |
| `--db-signal` | `#c8102e` | `#ff6b7f` | Errors only |
| `--db-mark` | `#ffe45a` | same | Selection, `<mark>`, link hover |
| `--db-on-mark` | `#000` | same | Text on the highlighter |

Keys (`--db-accent`, day / nocturne): ultramarine `#2b2bee` / `#8c8cff`, viridian `#0b6e4f` / `#4fd1a5`, ember `#b83d00` / `#ff8a4c`, violet `#6a1b9a` / `#c58cf2`. Every key clears 4.5:1 on every scheme's paper (lowest: ember on silence, 4.56).

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

- `--db-voice`: a grotesque. Everything the interface says.
- `--db-expression`: an italic serif. Everything the person says back.
- `--db-expression-scale`: lifts the italic until the two x-heights meet. It's set per pair.

| Pair | Voice | Expression | Scale |
|---|---|---|---|
| parma (house) | Archivo (width 62–125, weight 100–900) | Bodoni Moda (optical size 6–96) | 1.15 |
| press | Schibsted Grotesk (weight 400–900) | Newsreader (optical size 6–72) | 1.1 |
| paris | Instrument Sans (width 75–100, weight 400–700) | EB Garamond | 1.24 |
| salon | Bricolage Grotesque (optical size, width 75–100, weight 200–800) | Cormorant | 1.26 |

The width moves (the title's exhale, the statement button, the disclosure) only travel as far as each voice's width axis allows. Schibsted has no width axis, so under press they change weight only.
- `--db-measure`: 62ch.

Dynamics: text steps by a fourth, headings by a fifth. Each size has `-lh` (leading) and `-tr` (tracking) companions.

| Token | Size | Leading | Tracking | Use |
|---|---|---|---|---|
| `--db-pp` | 13px | 1.45 | 0.01em | Labels, captions |
| `--db-p` | 17px | 1.6 | 0 | Body |
| `--db-mp` | 22px | 1.45 | −0.005em | Lead, control text |
| `--db-mf` | 32px | 1.15 | −0.015em | Heading in a section |
| `--db-f` | 48px | 1.05 | −0.025em | Section heading, dialog question |
| `--db-ff` | 72px | 0.95 | −0.035em | Page title |
| `--db-fff` | clamp(64px, 11vw, 160px) | 0.9 | −0.045em | Movement titles |
| `--db-ffff` | clamp(64px, 17.5vw, 272px) | 0.82 | −0.055em | The overture only |

### Space, line, shape

- `--db-space-1` … `--db-space-10`: 4, 8, 12, 18, 27, 40, 60, 90, 135, 200 (perfect fifths).
- `--db-hairline` 1px, `--db-stroke` 1.5px, `--db-dot` 7px, `--db-gutter` 24px, `--db-margin` clamp(20px, 5vw, 80px).
- Grid: 12 columns. Columns 1–3 are the margin (names, notes), 4–12 the stave (the work). One column below 860px.
- Shape vocabulary, complete: hairline, dot, ring, arc, cross, corner marks, parentheses, pill (tags only), and arrows only where there's a direction.

### Tempo

| Token | Value | Use |
|---|---|---|
| `--db-allegro` | 160ms | Hover, press |
| `--db-moderato` | 320ms | A state changes |
| `--db-andante` | 640ms | Panels, toasts, dialogs |
| `--db-adagio` | 1400ms | The overture, once |
| `--db-exhale` | cubic-bezier(.16, 1, .3, 1) | Arriving |
| `--db-breath` | cubic-bezier(.65, 0, .35, 1) | Moving between states |
| `--db-spiccato` | cubic-bezier(.34, 1.5, .5, 1) | Landing: one small rebound (about 8%) for dots, rings, frames |
| `--db-arpeggio` | 36ms | The step between things that arrive in turn |

Under `prefers-reduced-motion: reduce`, every tempo is 1ms and the arpeggio is 0: things still change but don't travel. Script-driven motion (rolls, the radio's stretch, tag removal, dusk and dawn) checks the same query and applies the change directly.

## Components

Each contract lists anatomy, states and keyboard behaviour. "Yours" marks where the italic expression appears.

### db-btn (button)
- Underneath: native `<button>`, plus Slot for `asChild`.
- Anatomy: `<button class="db-btn" data-variant="statement | bracket | quiet">`. Optional `data-size="l"`.
- Statement: reversed type in an ink block, one per view. On hover the letters widen (`font-stretch` 100% to 114%) and corner marks close in around the block (`db-corners`), landing with spiccato. Pressed, it holds its breath: weight 680, width 96%, down 1px, the corners clasped tight. Bracket: `( Label )`. The parentheses step apart on hover and close in on press. Quiet: a hairline underline that retracts and redraws at stroke width.
- States: rest, hover, focus (accent outline, 4px offset), disabled (pencil), busy (`aria-busy="true"` plus the doing word and `db-dots`).
- Keyboard: native button.

### db-dots (spinner)
- Underneath: native.
- Anatomy: `<span class="db-dots" aria-hidden="true"><i></i><i></i><i></i></span>` inside a busy button, next to a present-tense word ("Saving").
- Shown only while something the person started is running. Static at 60% under reduced motion.

### db-check (checkbox)
- Underneath: native checkbox; the tally rolls through a hook.
- Anatomy: `<label class="db-check"><input type="checkbox"><span>Words</span></label>`; a group is `<fieldset class="db-checklist">` with a legend.
- Hover sketches the strike as a pencil hairline (`--db-rule-strong`). Checked: an accent strike draws left to right at 60% height, running 0.18em past both ends of the words the way a pen does. Weight drops to 300 and the colour goes to pencil. Unchecking lifts the strike away to the right.
- The tally is an `db-fraction`: "*2* / 5 done", with the yours part in italic. The count rolls up when it grows and down when it shrinks.
- States: rest, hover (ink), focus (outline on the words), checked, disabled.
- Keyboard: Tab to focus, Space toggles.

### db-choice (radio-group)
- Underneath: native radios, plus a hook that places the dot.
- Anatomy: `<fieldset class="db-choice">`, a legend, then `<label data-text="Words"><input type="radio"><span>Words</span></label>` for each option, then `<span class="db-choice-dot">`.
- Yours: the chosen word cross-fades into the italic, and the unchosen words step back to pencil. One accent dot sits under the chosen word; script sets `--c` (centre x) and `--y` (row offset) and adds `data-ready` before the first animated move. As it travels, the dot stretches along its path like a drop of ink (scale up to 3.7 × 0.72 at mid-flight). Pointing at an unchosen word shows a hairline ring where the dot would land (`label::before`).
- States: rest, hover, focus, chosen, disabled.
- Keyboard: native radio group (arrow keys move the choice).

### db-dial (dial)
- Underneath: native radios, no script.
- Anatomy: `<fieldset class="db-dial" style="--n: 7">`, a legend, then `.db-dial-face` holding one `<label style="--i: 0…n-1" data-text="N"><input type="radio"><span>N</span></label>` per option, then `.db-dial-arc`, `.db-dial-dot`, and an optional `.db-dial-unit`.
- Options sit on an arc from 170° to 10°. `--sel` is a registered number, set by `:has()` rules (up to 9 options) and transitioned over `--db-andante` with `--db-spiccato`, so the dial swings a touch past and settles. Every option derives its distance from it, so the whole dial rolls: the chosen number swells to 2.4× and cross-fades to italic, the others fade from ink toward pencil by distance, and the accent dot travels the inner arc.
- No script. Keyboard: native radio group.

### db-picks (picks)
- Underneath: native radios.
- Anatomy: `<fieldset class="db-picks">`, a legend, then `<label><input type="radio">…any content…</label>`.
- For choices that carry their own content, such as a specimen or a swatch. An accent dot hangs beside the chosen one and lands with spiccato; pointing at another shows a hairline ring in its place. The specimen uses it for the pair and scheme pickers.

### db-switch (switch)
- Underneath: native checkbox with `role="switch"`.
- Anatomy: `<label class="db-switch"><input type="checkbox" role="switch" aria-label="Name"> Sentence is <span class="db-switch-state" aria-hidden="true"><span>on</span><span>off</span></span><span class="db-switch-stop" aria-hidden="true"></span></label>`.
- Yours: the state word, in italic, rolls vertically between on and off. Off is pencil.
- The full stop is the state too: `.db-switch-stop` is a filled dot when on and a hairline ring when off (the calendar's done and to-come). Ink fills it from the rim inward, and drains back out (an inset `box-shadow` over `--db-andante`).
- States: on, off, hover (the underline darkens), focus, disabled.
- Keyboard: Space toggles.

### db-ruler (slider)
- Underneath: native range, plus a hook for the readout.
- Anatomy: `.db-ruler` holding a label, `<output class="db-ruler-value">`, `<input type="range">` and an optional `.db-ruler-scale` of `<span style="--n: 0…1">`.
- The track is a ruler: minor ticks every 5%, major every 25%, and the filled part in ink. The thumb is an ink hairline topped by the accent dot. Script sets `--p` (0–1).
- Yours: the value, a large italic numeral set in the gap of a dimension line (after Paul Rand). The line runs from zero to the thumb, with a tick at each end.
- While the thumb is held (`:active`), the value lifts 5px, and it drops back with spiccato when you let go.
- States: rest, focus (outline 8px out), disabled (45% opacity).
- Keyboard: arrows step, Page Up / Page Down jump, Home / End go to the ends.

### db-field (field)
- Underneath: native input and textarea, plus a hook for the counter.
- Anatomy: `.db-field` holding a `.db-label`, an optional `.db-field-count`, then the `input` or `textarea`, then an optional `.db-field-hint` or `.db-field-error`.
- No box, only a baseline. Focus draws the accent line outward from where the pointer touched it (script sets `--o`, a percentage) or from the left for the keyboard, and shows the counter. The placeholder steps back to half strength on focus.
- Yours: the typed value, in the italic. The placeholder stays in the voice, in pencil.
- Textarea: ruled like paper, with lines every `--lh` (2.25rem) that scroll with the text.
- States: rest, focus, filled, error (`aria-invalid="true"` turns both lines crimson; the message in `.db-field-error` is linked with `aria-describedby`), disabled (dotted baseline).
- The error is a callout, after Weingart: a crimson hairline pill hung from the baseline by a leader line, with a dot where it meets the line. A textarea's ruled lines turn crimson too. It arrives in order: the dot lands, the leader drops, then the pill and its words.
- Error copy says what to fix: "Check the address. It needs a domain after the @, like studio.com."

### db-form (form)
- Underneath: a native `<form>` with `noValidate`, plus a hook. The browser's own constraint validation decides what's wrong; the form only says it the 0dB way.
- Anatomy: `<form class="db-form">` holding `db-field`s on a grid and one `FormSubmit`, a statement button.
- On submit it checks every control. Each invalid one gets its Field's error callout (the control's `data-error`, else the browser's message), `aria-invalid` and `aria-describedby`, and focus goes to the first. Typing clears or updates that field's error.
- Sending: `FormSubmit` goes busy and says so (`busy="Sending"`), with the breathing periods. A second submit while one runs is ignored.
- Copy: the button names the action (Send, Save), never Submit. Errors say what to fix.

### db-select (select)
- Underneath: native `<select>`.
- Anatomy: `<p class="db-select">Sort by <span class="db-select-box"><select>…</select></span></p>`.
- Yours: the chosen option, italic over a hairline. A small ↓ follows it.
- Where `appearance: base-select` is supported, the open list is restyled: the current option has an accent dot beside it, and the hovered option is highlighted. The list drops in 6px and its options arrive in turn (`sibling-index()` × `--db-arpeggio`, where supported).
- Keyboard: native select.

### db-progress (progress)
- Underneath: native `<progress>`.
- Anatomy: `.db-progress` holding a label, `.db-progress-value` (the number plus `<small>%</small>`, `aria-hidden`), and `<progress>`.
- A hairline fills in ink, and a light numeral counts. The label keeps the action's name: "Uploading 12 files", then "Uploaded 12 files".
- Optional `.db-progress-units` shows one ring per item, and each fills (`data-done`) as it lands, like days on the calendar, with a spiccato pop.

### db-toast (toast)
- Underneath: hook: a tiny store and a `<Toaster />`.
- Anatomy: `.db-toaster` (`aria-live="polite"`, fixed bottom left), holding `.db-toast` elements. Each is `svg.db-toast-timer` (a fermata: arc `pathLength="1"` plus an accent dot), a sentence, and an optional bracket action.
- The fermata's arc empties over `--life`. Pointing at the toast or focusing it holds the pause, which is literally what a fermata means. At most three toasts show at once. The toast rises, then its sentence is written in from the left. It leaves with `data-leaving`: it sinks and fades, then its height closes so the toasts above settle down into the space.
- Yours: the item's name inside the sentence, e.g. "Archived *Spring notes*."

### db-dialog (dialog)
- Underneath: native `<dialog>` with `showModal()`, plus a hook.
- Anatomy: `<dialog class="db-dialog" closedby="any">` holding `<form method="dialog">`, the `.db-dialog-title` question, `.db-dialog-body`, then `.db-dialog-actions` with a bracket (safe, `autofocus`) and a statement (the action).
- It's set like a poster: corner marks instead of a box (`db-corners`), an `db-meta` row of facts along the top (`.db-dialog-meta`), and the question set large, with the item as yours ("Delete *Spring notes*?"). The backdrop is paper at 86% with a blur. Opening is one short phrase: the corners open out into place, the meta rule draws from the left, and the question breathes out from weight 500 and width 88%.
- Keyboard: focus goes to the safe answer; Escape closes; a click outside closes. Smooth scrolling pauses while it's open.
- Alert dialog: for what can't be undone, `role="alertdialog" closedby="closerequest"` with `aria-describedby` on the body. It closes only with Escape or an answer, never a stray click. Any dialog can carry a form (the specimen's rename); `[data-close]` buttons close it without submitting.

### db-empty (empty)
- Underneath: native.
- Anatomy: `.db-empty` holding an optional `.db-empty-figure` (`0`, aria-hidden), then `.db-empty-title`, one sentence of direction, and one action.
- An invitation to act, not a mood. The zero (wrapped in a `<span>`) is thin, wide and cropped to its top half, so "nothing" reads as the fermata's arc. Pointing at or focusing the action raises the arc a little.

### db-tabs (tabs)
- Underneath: Radix Tabs.
- Anatomy: `<div class="db-tabs" role="tablist">`, then `<button role="tab" aria-selected>` for each tab, with an optional count in `<sup>`, then `<span class="db-tabs-line">`.
- The ink line follows the selected tab through `--x` (left), `--r` (right inset) and `--y`, like an inchworm: script sets `data-dir="left | right"`, and the leading edge moves first while the trailing edge follows 110ms later.
- Optional `.db-tabs-count` (aria-hidden) sets the number showing huge and thin, cropped by the rule it sinks into. It rolls when the number changes (up when it grows, down when it shrinks), and hides below 700px.
- Keyboard: roving tabindex. Left and Right arrows move and select, Home / End go to the ends.

### db-rows (rows)
- Underneath: native list.
- Anatomy: `<ul class="db-rows">` with `<li><a>`, holding `.db-rows-title`, a kind, `.db-rows-year` and `.db-rows-go` (→, aria-hidden).
- On hover or focus, the row reverses: an ink block rolls on and the text turns to paper. The title steps 8px forward and the arrow comes in. Script sets `data-edge="top | bottom"` on pointer enter and leave, so the ink comes in from the side your hand entered and leaves toward the side it goes. Moving down the list, one block of ink seems to travel with you.

### db-pager (pagination)
- Underneath: native links.
- Anatomy: `<nav class="db-pager">` of links or buttons with two-digit numbers; the current one has `aria-current="page"`.
- A 3px dot sits under each number; the current page's dot is 6px and in the accent, and it lands with spiccato. Pointing at another page draws a hairline ring there.
- Weight falls with distance (600, then 350 for the neighbours, then 200), after the WOVE poster. Colour stays at or above graphite, so contrast never drops.

### db-crumbs (breadcrumb)
- Underneath: native list.
- Anatomy: `<nav class="db-crumbs" aria-label="Breadcrumb"><ol>…</ol></nav>`. The dividers are drawn hairlines, leaning 24° like slashes. Pointing at a step darkens the hairlines on either side and leans them in (14° and −14°), so they hold it like a pair of brackets. The current item is an ink span with `aria-current="page"`.

### db-disclose (accordion)
- Underneath: native `<details>`.
- Anatomy: `<details class="db-disclose"><summary>Question</summary><div class="db-disclose-body">…</div></details>`.
- The + winds 45° into × with spiccato, and the question exhales (width 112%, weight 300) as it opens. The content opens by animating block-size (`::details-content`) over `--db-andante`, and the answer settles into the space.
- Keyboard: native (Enter or Space on the summary).

### db-month (calendar)
- Underneath: hook (a grid with a roving tab stop).
- Anatomy: `.db-month` holding `.db-month-head` (`.db-month-date`, the `.db-month-title` name and year, `.db-month-nav` ← →), then `.db-month-grid` with 7 `<abbr>` weekday heads and `<button class="db-month-day" data-when="past | today | future" aria-pressed>`.
- Past days are filled ink and disabled, today is the accent, and future days are hairline rings.
- Yours: the chosen day shows its number in italic inside a stroke ring, and the big date in the head rolls to it.
- The days between today and the chosen day are half-moons (`data-between`), after the eclipse poster: the wait, drawn. They wax in turn toward the chosen day (`--k` × `--db-arpeggio`), and the chosen day lands with spiccato.
- Turning the month, the days sweep in from the side you turned toward (`data-turn` on the grid, `--from` = ±1, `--d` = the day), and the big date rolls the same way.
- Keyboard: roving tabindex; arrow keys move by a day or a week; Enter or Space chooses.

### db-tag (badge)
- Underneath: native.
- Anatomy: `<span class="db-tag" data-variant="ink | accent">`, or a removable `<button class="db-tag" data-removable aria-label="Remove X">`.
- The label sits in a `<span>`. Pointing at or focusing a removable tag strikes the word, as the checkbox does.
- The one rounded shape. A removed tag, already struck, closes up (its width goes to 0) while its neighbours slide into the space, and focus moves to the next. Tags that come back arrive in turn (`data-arriving`, `--i`).

### db-note (note)
- Underneath: native, on hover and focus.
- Anatomy: `<button class="db-note" aria-describedby="id">Term<span class="db-note-text" id="id" aria-hidden="true">Note</span></button>`.
- A dotted underline. On hover or focus, the highlighter marks the term, a dot anchors the leader line, the line draws down, and the ink pill holding the note spreads from the line's tip (`clip-path: circle()`). Leaving plays the same four steps in reverse order.
- Keyboard: focus shows it, and Escape dismisses it.

### db-toggle, db-toggles (toggle, toggle-group)
- Underneath: Radix Toggle and ToggleGroup.
- Anatomy: `<button class="db-toggle" type="button" aria-pressed="false">Word</button>`. A group is `<div class="db-toggles" role="group" aria-label="Name">` of toggles; it allows many, or one with `data-single` (script releases the others).
- Held, the word wears the fermata: the arc rises over it, then the dot lands inside with spiccato. Pointing sketches the arc in pencil. Standing hairlines keep a group's words apart. Script dispatches a bubbling `db-toggle` event with the new state.
- States: rest, hover (pencil arc), focus, held, disabled.
- Keyboard: native button.

### db-btn-group (button-group)
- Underneath: native.
- Anatomy: `<div class="db-btn-group" role="group" aria-label="Name">` of `db-btn` buttons (no variant).
- One pair of parentheses holds the set, after 20(25), and hairlines stand between the actions. Pointing draws a line under one; it passes through.
- Keyboard: Tab between buttons.

### db-input-group (input-group)
- Underneath: native.
- Anatomy: `.db-input-group` holding `.db-input-group-text` (prefix), the `input`, then optional suffix text or a quiet `db-btn`. It sits inside an `db-field`.
- Ours and yours on one line: the prefix and suffix stay upright in pencil, the typed part is italic between them. The accent line draws only under your part (the input is its anchor), from where you touched it.
- States: rest, focus, error (`aria-invalid="true"`), disabled.

### db-code (input-otp)
- Underneath: native input, plus a hook.
- Anatomy: `<div class="db-code">` holding one `<input inputmode="numeric" autocomplete="one-time-code" maxlength="6">` and six `.db-code-slot` spans split three and three by `.db-code-sep`, a leaning hairline. Script copies the digits into the slots and sets `data-here` on the next slot and `data-state="done | wrong"` on the box.
- Each digit drops onto its baseline in italic (`db-drop-in`); the waiting line is the accent. Whole, the lines ink in turn. Wrong, they turn crimson together and an `db-field-error` says why.
- One real input underneath, so paste, autofill and the keyboard all work natively.

### db-combo (combobox)
- Underneath: cmdk inside a Radix Popover.
- Anatomy: `.db-field.db-combo` holding the label, an `<input role="combobox" aria-expanded aria-controls>`, and `<ul class="db-combo-list" role="listbox">` of `<li role="option">`. `.db-combo-empty` says what to try when nothing matches.
- In each suggestion, the letters you typed are wrapped in `<mark>` (the highlighter), and the suggestions arrive in turn. The active option carries a dot (`aria-selected`). The picked value is yours, in italic.
- Keyboard: Down and Up move through the list, Enter takes one, Escape closes it.

### db-date (date-picker)
- Underneath: Radix Popover holding the calendar.
- Anatomy: `<button class="db-date" popovertarget="id" aria-haspopup="dialog">` inside a sentence, opening an `db-pop` that holds an `db-month`. `data-set` marks a chosen date.
- A date inside a sentence, like the select. The month hangs from it on a leader line; choosing a day writes it into the sentence in italic and closes the popover.
- Keyboard: the month's own (arrows move by day or week, Enter chooses); Escape closes.

### Form
- A composition, not a class: fields on the grid and one statement button to send it. On a failed send, each field gets its callout, the line turns crimson, and focus goes to the first error. While sending, the button is busy and says so ("Sending" with `db-dots`). Nothing shakes and nothing apologises.

### db-alert (alert)
- Underneath: native.
- Anatomy: `<div class="db-alert" role="status">` (or `role="alert"` for errors) holding `.db-alert-title`, a sentence, and optional `.db-alert-actions`. `data-variant="danger"` for what went wrong. `data-arriving` plays the entrance.
- A double bar, the sign in a score that something changes here. It draws down the margin, then the words arrive beside it in turn. Crimson only for danger, and then it says what to do.

### db-skeleton (skeleton)
- Underneath: native.
- Anatomy: `<div class="db-skeleton" aria-hidden="true">` of empty lines, with an optional `.db-skeleton-ring` for an avatar. Set `aria-busy="true"` on the region it stands in for.
- Baselines where the words will be, at the length they'll run. A pencil stroke reads along each line in turn (`db-read`), the way an eye would. Still under reduced motion.

### db-pop (popover)
- Underneath: Radix Popover.
- Anatomy: `<div class="db-pop" popover>` opened by a button with `popovertarget`. Anchor positioning places it under the opener (`position-area`), using the implicit anchor.
- Hung from what opened it on a leader line, after Weingart: the dot lands on the opener's edge, the line drops, and the panel settles below.
- Keyboard: Escape or a click elsewhere puts it away (native popover light dismiss).

### db-menu, db-menubar (dropdown-menu, context-menu, menubar)
- Underneath: Radix DropdownMenu, ContextMenu and Menubar.
- Anatomy: `<div class="db-pop db-menu" popover role="menu">` holding `.db-menu-label` headings and `<button class="db-menu-item" role="menuitem">` (or `menuitemcheckbox` with `aria-checked`), each with optional `.db-menu-keys`. `data-variant="danger"` for a destructive item. A menubar is `<div class="db-menubar" role="menubar">` of buttons plus `.db-menubar-line`. A context menu is an `db-menu` with `data-at="point"`, placed where the person pressed.
- The item you point at is marked with the highlighter. Items arrive in turn. A menubar's stroke slides to the open menu. A context menu spreads from the point like ink (`db-spread`).
- Keyboard: Down and Up move, Home and End go to the ends, Enter runs, Escape closes, Tab closes and moves on. In a menubar, Down opens, and Left and Right move between menus, open or closed. The context menu opens with the ContextMenu key or Shift+F10.

### db-navmenu (navigation-menu)
- Underneath: Radix NavigationMenu.
- Anatomy: `<nav class="db-navmenu">` of small trigger buttons (`aria-expanded`, `aria-controls`) and `.db-navmenu-panel` panels of large links.
- Small words open a panel of large names, the scale contrast of a poster. The panel's rule draws across, the names arrive in turn, and the trigger's arrow turns. It opens on pointing (after a short wait) or pressing, and closes on leaving.
- Keyboard: Enter or Space toggles a panel; Escape closes it and returns focus to its trigger.

### db-command (command)
- Underneath: cmdk; `CommandDialog` puts it in a Radix Dialog.
- Anatomy: `.db-command` holding `<input class="db-command-input" role="combobox">`, `.db-command-list` (`role="listbox"`) of `.db-command-group` headings and `.db-command-option` rows (`.db-command-name`, `.db-command-hint`, `.db-command-go`), then `.db-command-empty`.
- What you type is set as large as a headline, in italic. Matches are marked with the highlighter; the chosen row steps forward and shows its arrow. Rows arrive in turn as the list changes.
- Keyboard: Down and Up move, Enter runs. Empty copy names something to try.
- `CommandDialog`: the ⌘K palette. A Radix Dialog holds the command over a dimmed page, with a visually hidden title. The page registers the shortcut; the item doesn't.

### db-steps (steps)
- Underneath: native `<ol>`.
- Anatomy: `<ol class="db-steps">` of `<li class="db-step">`, each with an `h3.db-step-title` and its text. `data-current` marks where the person is and sets `aria-current="step"`; `data-done` marks what's behind them.
- The numbers are a real sequence, so they are set large and thin at `--db-f` in the margin, in pencil. Done steps' numbers go to ink; the current number takes the accent and lands with spiccato. A hairline stands between steps.
- Only for real sequences. A list that isn't an order is `db-rows` or plain prose.

### db-source (source)
- Underneath: build-time highlighting with sugar-high, plus a Copy hook.
- Anatomy: `<figure class="db-source">`, a `figcaption.db-meta` frame row (the file name, a hairline, Copy), then `<pre class="db-source-code" tabindex="0"><code>`.
- Code is type. It's set in the voice at 88% width. Keywords are ink at weight 500; signs and comments are pencil; strings and JSX text, which someone wrote, are the expression italic. There's no second colour.
- Copy is a bracket button. It keeps its name through the flow: the label rolls from Copy to Copied, then back.
- Keyboard: the code block is focusable so it scrolls sideways with the arrow keys.

### db-sidebar (sidebar)
- Underneath: native, plus a hook; a sheet on narrow screens.
- Anatomy: `<nav class="db-sidebar">` holding `.db-sidebar-head`, `.db-sidebar-label` group names, and links whose word is split into `.db-sidebar-i` (the initial) and `.db-sidebar-rest`. `aria-current="page"` on the current one. `data-folded` folds it.
- Folded, each word keeps only its initial, large and light like a monogram, while the rest folds away in turn. The current page carries the accent dot.
- Keyboard: links, plus the fold button (`aria-expanded`).

### db-card (card)
- Underneath: native.
- Anatomy: `<article class="db-card">` holding an optional `.db-card-figure` (one giant letter, aria-hidden), `.db-card-title`, `.db-card-body`, and `.db-card-foot` with `.db-card-link`.
- A column under a rule, not a box. The giant letter is cropped by the rule like a poster's headline. Pointing at the card passes an ink stroke along the rule.

### db-peek (hover-card)
- Underneath: Radix HoverCard.
- Anatomy: `<span class="db-peek"><a>Name</a><span class="db-peek-card">` holding `.db-peek-name` (aria-hidden), a sentence and `.db-peek-meta`.
- The name, set large and cropped by the card's edge, slides in to meet you. It waits 450ms for the pointer; focus shows it at once. Where anchor positioning exists, the card flips or centres rather than leave the screen.

### db-tip (tooltip)
- Underneath: Radix Tooltip.
- Anatomy: `<span class="db-tip">` holding the control (with `aria-describedby`) and `.db-tip-text`.
- A whisper in parentheses above the thing it names. It waits for a still pointer; focus shows it at once. Escape sets `data-hush` until the pointer or focus leaves.

### db-sheet, db-drawer (sheet, drawer)
- Underneath: native `<dialog>`, through the dialog item.
- Anatomy: `<dialog class="db-sheet" closedby="any">` with `.db-sheet-spine` (the title again, aria-hidden). `<dialog class="db-drawer" closedby="any">` with `<button class="db-drawer-handle">`. Both share the dialog backdrop.
- A sheet is a page slid in from the end edge, its title running up the spine like a book's (`db-spine`). A drawer rises from below and lands with spiccato; its handle is the fermata's arc. Dragging the handle down sets `--pull` and `data-pulling`, and past a threshold it closes.
- Keyboard: Escape closes; the handle closes on Enter. Smooth scrolling pauses while open.

### db-collapse (collapsible)
- Underneath: native `<details>`.
- Anatomy: `<details class="db-collapse">` whose `<summary>` is the tail of a list ("and 4 more"), then `.db-collapse-list`.
- A list that ends in the rest of itself. The rest opens at reading speed through `::details-content`, and its lines arrive in turn.
- Keyboard: native.

### db-resize (resizable)
- Underneath: hook (a separator you can drag or move with the arrow keys).
- Anatomy: `.db-resize` holding two `.db-resize-pane`, `<div class="db-resize-handle" role="separator" tabindex="0" aria-valuenow>` between them, and `.db-resize-dim` (aria-hidden). Script sets `--split` (a percentage) and `data-dragging`.
- Take the rule and it inks; while held, each pane's share is drawn as a dimension, after Paul Rand.
- Keyboard: Left and Right move it by 5, Home and End go to 20 and 80.

### db-scroll (scroll-area)
- Underneath: native overflow, with the scrollbar.
- Anatomy: `<div class="db-scroll" tabindex="0" role="region" aria-label>`. Add `data-lenis-prevent` when smooth scrolling is on.
- A rule appears at an edge only while there's more beyond it. Pure CSS: paper backgrounds that scroll (`background-attachment: local`) cover rules that don't.

### db-scrollbar (scrollbar)
- Underneath: hook (`useScrollbar`).
- Anatomy: `<div class="db-scrollbar" aria-hidden="true"><span class="db-scrollbar-thumb"></span></div>`. Inside a vertical scroller it is the scroller's last child (the scroller gets `position: relative` if it was static). `data-variant="page"` fixes it to the window's inline end instead. The page variant also takes one `<span class="db-scrollbar-mark" data-num data-name data-for style="--at; --i">` per section.
- Script (`scrollbar(rail, host, { min, sections })`) sets `--view` (the share in view, with a thumb of at least `min` px), `--max` (how far the box scrolls), `data-idle` when there's nothing to scroll, then `data-ready`. It re-measures on resize and on any change inside the box, and puts the rail back if a list redraws its children. It turns on only for a fine pointer with scroll timelines; otherwise the thin native stroke stays.
- A ruler: a hairline and an ink thumb as long as the view. Inside a scroller, the rail is pinned by the scroller's own timeline (`animation-timeline: scroll(nearest)`, translating by `--max`), so it stays on the edge with no script running while you scroll. The thumb rides the same timeline. On the page, a mark shows where each movement begins, and the current one is ink (`data-now`).
- Pointing sketches: pointing at a scroller darkens its rail; pointing at the rail thickens the thumb, and on the page the numbers arrive down the rail in turn, with a mark's name when you point at it. Holding the thumb (`data-dragging`) inks it in the accent, because it marks where you are.
- Pointer only: pressing a page mark goes to its movement, pressing the rail centres the thumb there, and the thumb drags. Pressing doesn't move focus, so an open list stays open. The keyboard scrolls as always, which is why the rail is hidden from assistive technology.
- Without the rail: every scroller gets a thin stroke on a clear track (`scrollbar-color` from `:root`, `scrollbar-width: thin`) that darkens from rule to pencil when pointed at. Safari, which lacks `scrollbar-color`, gets a hairline thumb that thickens. Horizontal scrollers (tables) always use this.

### db-ratio (aspect-ratio)
- Underneath: native `aspect-ratio`.
- Anatomy: `<div class="db-ratio" style="--ratio: 1.7778">`, with an `db-fraction` naming it. `--ratio` is a registered number.
- A frame kept to a ratio and marked like a printer's crop: short lines outside each corner, never a border. Change `--ratio` and the frame eases to it while the fraction rolls.

### db-carousel (carousel)
- Underneath: scroll snap, plus a hook.
- Anatomy: `<div class="db-carousel" role="region" aria-roledescription="carousel">` holding `.db-carousel-track` (scroll-snap, `tabindex="0"`) of `.db-carousel-slide` with `.db-carousel-title`, then `.db-carousel-nav` with ← and → buttons around `.db-carousel-count` (`.db-carousel-now`).
- One poster at a time, each name set so large the frame crops it. The count rolls the way you travel; an IntersectionObserver keeps it true while you swipe.
- Keyboard: Left and Right on the track, or the buttons.

### db-table (table)
- Underneath: native `<table>`.
- Anatomy: `<table class="db-table">` with header `<button>`s inside `<th aria-sort>`, numeric cells marked `data-num`, `.db-table-name` for the row's name, and `<input type="checkbox" class="db-table-pick">` per row plus one to choose all.
- Hairline rows and tabular figures. The sorted column is set in ink (`data-sorted`). Re-sorting, the rows glide to their new places (FLIP). Choosing a row fills its ring with spiccato and its name turns italic (`data-picked`); the foot counts the picks.
- Keyboard: native buttons and checkboxes.

### db-chart (chart)
- Underneath: our own markup, plus a hook.
- Anatomy: `<figure class="db-chart" style="--n: 9">` holding `.db-chart-read` (`.db-chart-value`, a large rolling number, and its label), `.db-chart-plot` of `<button class="db-chart-bar" style="--v: 0–1" aria-label>`, then `.db-chart-axis`. `data-now` marks the current bar.
- Hairlines and dots against one very large number, as the posters set tiny data beside giant type. Pointing at or focusing a bar inks its line, swells its dot and rolls the number to it; leaving rolls it back to now. The current month is the accent.

### db-avatar (avatar)
- Underneath: native.
- Anatomy: `<span class="db-avatar" role="img" aria-label="Name">` holding an initial; `data-size="s | l"`, `data-here` for presence. A group is `<span class="db-avatars" role="group">`, ending in an optional `data-count` avatar ("+3").
- A person is a ring and their initial, in italic, since a name is theirs. Someone here carries the accent dot. A group overlaps, and steps apart when pointed at.

### db-item (item)
- Underneath: native.
- Anatomy: `<ul class="db-items">` of `<li class="db-item">` holding `.db-item-body` (`.db-item-title`, `.db-item-desc`), `.db-item-leader` (aria-hidden), then `.db-item-end` (a value or an action).
- A ledger line: what it is, a dotted leader, what you can do. Pointing at the line inks the leader from one end to the other.

### db-prose (typography)
- Underneath: native.
- Anatomy: `<article class="db-prose">` wrapping plain HTML: headings, `p`, `.db-prose-lead`, `blockquote`, lists, `code`.
- Set for reading at `--db-measure`. Headings step by the dynamics; quotes are in the expression; quote marks and list dashes hang in the margin so the edge stays true (`hanging-punctuation` where supported). Code is the voice, condensed.

### db-msg, db-bubble, db-reactions (message)
- Underneath: native.
- Anatomy: `<article class="db-msg" data-from="them | you">` holding an `db-avatar`, `.db-msg-head`, `.db-msg-body` (optionally a `<p class="db-bubble">`), and `.db-msg-foot` with `.db-msg-status` (`data-read`). Reactions are `<span class="db-reactions">` of `<button class="db-tag" aria-pressed>` with `.db-reaction-count`.
- No balloons. Of the speech bubble, only its tail is left: a leaning hairline. What you wrote sits on the other side, in italic. Sent is a ring; read, it fills to a dot. New messages write in (`db-write`). A reaction you add turns italic and its count rolls.

### db-marker (marker)
- Underneath: native.
- Anatomy: `<p class="db-marker">` for a status (with `.db-marker-dot`), or `data-variant="divider"` for where a day begins. `data-arriving` plays it.
- A quiet line in the flow. A divider draws its rules outward from the word, as if the word pushed them apart.

### db-attach (attachment)
- Underneath: native.
- Anatomy: `<ul class="db-attachments">` of `<li class="db-attach" data-state="idle | uploading | processing | done | error">` holding `.db-attach-ext`, `.db-attach-body` (`.db-attach-name`, `.db-attach-meta`), and `svg.db-attach-ring` (`.db-attach-track`, `.db-attach-arc`, `.db-attach-fill`). Script sets `--p` (0–1).
- A file's extension is its picture, set wide and thin. A ring counts it in, turns while it's processed, then fills to a dot with spiccato when it's safe. Failed, the ring turns crimson and the line says what happened, with a bracket "Try again".

### db-thread (thread)
- Underneath: native, with the scrollbar.
- Anatomy: `.db-thread` holding `.db-thread-scroll` (`role="log"`, `data-lenis-prevent`) of messages and markers, and `<button class="db-thread-latest" hidden>` holding `.db-thread-new`.
- It keeps to the latest message while you're at the end. Scrolled back, it stops following, and new messages are counted in an ink pill whose count rolls; pressing it takes you down. Content sits at the bottom (`align-content: safe end`) while the thread is short.

### db-quest (questionnaire)
- Underneath: native form.
- Anatomy: `<form class="db-quest">` holding `.db-quest-head` (an `db-fraction` count and a filling hairline), `.db-quest-step` sections each with a `.db-quest-q` question and its controls, `.db-quest-actions` (Skip, Next), then `.db-quest-sentence` (`aria-live="polite"`).
- One question at a time, set large. The count rolls and the hairline fills; each question turns in from the side you're heading (`db-turn`). At the end your answers are written into one sentence, arriving word by word, in italic, because every word of it is yours.
- Keyboard: native form controls; focus moves to each new question.

### Direction (right to left)
- Every component uses logical properties and `:dir(rtl)` where a stroke has a direction. Right to left, the crumbs' hairlines lean the other way, the checkbox strike runs from the right, and a field's accent line grows from the right for the keyboard.
- Arabic has no italic, and the pairs have no Arabic, so the system face stands in and what you type stays upright there.

### db-link (link)
- Underneath: native `<a>`. Its CSS lives in base.css, so every item may use it.
- A hairline underline, with a highlighter stroke on hover that goes on from the left and comes off to the right.

### db-kbd (kbd)
- Underneath: native `<kbd>`. Its CSS lives in base.css, so every item may use it.
- A key, drawn as a ring. `data-pressed` presses it (the specimen presses the G key's ring along with your keyboard).

### db-fraction (fraction)
- Underneath: native. Its CSS lives in base.css, so every item may use it.
- `<span class="db-fraction"><span class="db-yours">2</span><i><span class="db-sr"> of </span></i><span>5</span></span>`. A display fraction with a leaning hairline.

### db-meta (meta)
- Underneath: native. Its CSS lives in base.css, so every item may use it.
- A frame row of words held apart by flexing hairlines.

### db-corners (corners)
- Underneath: native. Its CSS lives in base.css, so every item may use it.
- Four corner marks as one `::after`. It frames without closing. Tune it with `--db-corner` (length), `--db-corner-inset` and `--db-corner-colour`.


### Globals
- `mark`, `::selection`: the highlighter.
- `:focus-visible`: an accent outline at `--db-stroke`, offset 4px.

## The overture (specimen only)

- The title exhales from weight 800 and width 62% to weight 200 and width 112% over `--db-adagio`, once the fonts are in.
- The manifesto is laid out with `@chenglou/pretext` (`prepareWithSegments` once, `layoutNextLine` per row). Rows that cross the pause's circle are split into two runs that share one cursor. Runs narrower than 160px (half the width on phones) stay empty.
- The fermata sign sits in the hole: an ink arc that draws once and an accent dot. It eases toward the pointer (0.08 per frame), a tap or click places it, and it stays where it's left. Under reduced motion it jumps on click and never follows.
- The real paragraph stays in the DOM, visually hidden, for screen readers and as the fallback if pretext doesn't load.

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Statement button (`button`) | "the silence that heals" corners | Corner marks close in on hover |
| Checkbox (`checkbox`) | Weingart letter | The pen overshoots; the tally is a fraction |
| Radio (`radio-group`) | "It has to be design." | Chosen word turns italic; the rest step back |
| Dial (`dial`) | WOVE | Numbers on an arc; the dial rolls |
| Switch (`switch`) | "28 December" dots | The full stop is a dot or a ring |
| Slider (`slider`) | Paul Rand dimension lines | Value set in a dimension from zero |
| Field error (`field`) | Weingart callouts | Pill on a leader line from the baseline |
| Progress (`progress`) | Dot calendar | A ring per item fills |
| Toast (`toast`) | The fermata sign | The arc empties; pointing holds it |
| Dialog (`dialog`) | SHAPES / GRADIENTS frame | Corners and a metadata row |
| Empty state (`empty`) | SPECTRA crop | Half a zero, which is an arc |
| Tabs (`tabs`) | POINT / SPECTRA | A giant, cropped count |
| Index rows (`rows`) | "the uncreative" | The row reverses out of ink |
| Pager (`pagination`) | WOVE | Weight falls with distance |
| Breadcrumbs (`breadcrumb`) | Swiss diagonals | Drawn, leaning hairlines |
| Disclosure (`accordion`) | The overture | The question exhales |
| Month (`calendar`) | Half-circle eclipse | The wait as half-moons |
| Tag (`badge`) | The checkbox | Removing strikes the word |
| Marginalia (`note`) | Weingart letter | Highlighter, anchor dot, leader line |
| Toggle (`toggle`) | The fermata sign | Held, the word wears the arc and dot |
| Toggle group, button group (`toggle-group`, `button-group`) | 20(25) | Parentheses hold the set; hairlines stand between |
| Input group (`input-group`) | "It has to be design." | Ours upright, yours italic, on one line |
| One-time code (`input-otp`) | "Less is more." rules | Short baselines, three and three |
| Combobox, menu, command (`combobox`, `dropdown-menu`, `context-menu`, `command`) | Weingart letter | The highlighter marks what matches |
| Date picker, popover (`date-picker`, `popover`) | Weingart callouts | Hung from the opener on a leader line |
| Alert (`alert`) | The score's double bar | Two bars down the margin |
| Skeleton (`skeleton`) | "Less is more." rules | Baselines where the words will be |
| Navigation menu (`navigation-menu`) | POINT / SPECTRA | Small words open large names |
| Menubar (`menubar`) | SHAPES / GRADIENTS frame | A frame row of words on a hairline |
| Command (`command`) | "the uncreative" | What you type, set as a headline |
| Sidebar (`sidebar`) | "It has to be design." | Folded, each word keeps its initial |
| Card (`card`) | SPECTRA crop | A giant letter cropped by the rule |
| Hover card (`hover-card`) | POINT crop | The name cropped by the card's edge |
| Tooltip (`tooltip`) | 20(25) | A whisper in parentheses |
| Sheet (`sheet`) | Book spines | The title runs up the spine |
| Drawer (`drawer`) | The fermata sign | The handle is the arc |
| Collapsible (`collapsible`) | "the silence that heals" captions | "and 4 more" is the control |
| Resizable, aspect ratio (`resizable`, `aspect-ratio`) | Paul Rand dimension lines | Shares measured; a printer's crop marks |
| Scroll area (`scroll-area`) | "Less is more." rules | A rule only where there's more |
| Scrollbar (`scrollbar`) | Paul Rand dimension lines | The page as a ruler, marked at each movement |
| Carousel (`carousel`) | POINT / SPECTRA | One poster at a time, cropped |
| Table (`table`) | Renaissance two-colour | Only the sorted column in ink |
| Chart (`chart`) | POINT / SPECTRA | Tiny data against one giant number |
| Avatar (`avatar`) | "28 December" dots | A ring, an initial, the presence dot |
| Item (`item`) | Contents pages | A dotted leader joins name and value |
| Prose (`typography`) | Swiss typesetting | Hanging punctuation keeps the edge true |
| Message (`message`) | "It has to be design." | Theirs roman, yours italic; only the tail |
| Marker (`marker`) | "Less is more." rules | Rules pushed apart by the word |
| Attachment (`attachment`) | "the uncreative" | The extension is the picture |
| Message scroller (`thread`) | WOVE | The new count rolls in an ink pill |
| Questionnaire (`questionnaire`) | Healthy habits → | Your answers written as one sentence |

## Motion

Three rules, then one articulation per component.

1. **Pointing sketches, choosing inks.** A hover previews in pencil: a hairline strike, a ring, a lean. A commitment draws in ink or the accent.
2. **What's inked lands.** Dots, rings and frames arrive with `--db-spiccato`, one small rebound.
3. **Strokes pass through.** A stroke drawn on hover leaves the way it was heading: in from the left, off to the right. This uses `background-position` with a `0s` transition, so the anchor flips at once while the size animates.

| Component | Articulation | What moves |
|---|---|---|
| Statement button (`button`) | Accent (a pressed note) | Hover widens it; press makes it heavier and narrower, and the corners clasp |
| Bracket button (`button`) | Spiccato | The parentheses step apart and rebound |
| Quiet button (`button`) | Pass-through | The line leaves to the right and redraws from the left |
| Loading (`spinner`) | Breath | The periods lift as they brighten |
| Checkbox (`checkbox`) | Pencil, then ink | A hairline sketch on hover, then the accent strike; the tally rolls |
| Radio (`radio-group`) | Legato | The dot stretches like a drop of ink as it glides; a ring on hover |
| Dial (`dial`) | Spiccato | The dial swings a touch past its stop |
| Picks (`picks`) | Pencil, then ink | A ring on hover, then the dot lands |
| Switch (`switch`) | Legato | The word rolls; ink fills the full stop from its rim |
| Slider (`slider`) | Lift | The value rises while the hand is on it |
| Field (`field`) | From the touch | The accent line grows out from where you touched it |
| Field error (`field`) | Arpeggio | Dot, leader, pill, in that order |
| Select (`select`) | Arpeggio | The options arrive in turn |
| Progress (`progress`) | Spiccato | Each ring pops as its item lands |
| Toast (`toast`) | Written | It rises, the sentence writes in, and the stack closes over the gap when it leaves |
| Dialog (`dialog`) | Breath out | The corners open out, the rule draws, the question exhales |
| Empty state (`empty`) | Rise | The arc lifts as you reach for the action |
| Tabs (`tabs`) | Inchworm | The leading edge first; the count rolls |
| Index rows (`rows`) | Roller | The ink follows the pointer in and out |
| Pager (`pagination`) | Pencil, then ink | A ring on hover; the accent dot lands |
| Breadcrumbs (`breadcrumb`) | Lean | The hairlines either side hold the step you point at |
| Disclosure (`accordion`) | Spiccato | The cross winds past; the answer settles |
| Month (`calendar`) | Arpeggio | The moons wax in turn; the days sweep in from the turn |
| Tag (`badge`) | Close-up | Struck, then closed; neighbours slide in |
| Marginalia (`note`) | Ink spread | Mark, anchor, line, note; reversed on leaving |
| Link (`link`) | Pass-through | The highlighter passes through the word |
| Key (`kbd`) | Press | The ring goes down with your key |
| Movement bar | Glissando | The movement name rolls up reading on, and down reading back |
| Toggle (`toggle`) | Pencil, then ink | The arc sketches on hover; held, it rises and the dot lands |
| Button group (`button-group`) | Pass-through | The line under an action leaves the way it was heading |
| Input group (`input-group`) | From the touch | The accent line grows only under your part |
| One-time code (`input-otp`) | Drop | Each digit drops onto its line; whole, the lines ink in turn |
| Combobox (`combobox`) | Arpeggio | The suggestions arrive in turn |
| Date picker (`date-picker`) | Spiccato | The month hangs from the sentence; the date writes in |
| Alert (`alert`) | Double bar | The bars draw down, then the words arrive |
| Skeleton (`skeleton`) | Reading | A pencil stroke reads along each line in turn |
| Popover (`popover`) | Arpeggio | Dot, leader, panel |
| Menu (`dropdown-menu`, `context-menu`) | Arpeggio | Dot, leader, words in turn; a context menu spreads from the point |
| Menubar (`menubar`) | Slide | The stroke slides to the open menu |
| Navigation menu (`navigation-menu`) | Arpeggio | The rule draws across; the names arrive; the arrow turns |
| Command (`command`) | Arpeggio | The rows arrive; the chosen one steps forward |
| Sidebar (`sidebar`) | Fold | The words fold to their initials in turn |
| Card (`card`) | Pass-through | An ink stroke passes along the rule |
| Hover card (`hover-card`) | Slide | The large name slides in to meet you |
| Tooltip (`tooltip`) | Wait | It appears only for a still pointer |
| Sheet (`sheet`) | Spine | The page slides in; the title runs up the spine |
| Drawer (`drawer`) | Spiccato | It lands with a rebound; it follows your drag down |
| Collapsible (`collapsible`) | Arpeggio | The rest opens at reading speed, line by line |
| Resizable (`resizable`) | Measure | The rule inks; the dimensions appear while held |
| Aspect ratio (`aspect-ratio`) | Breath | The frame eases to the ratio; the fraction rolls |
| Scrollbar (`scrollbar`) | Arpeggio, then ink | The numbers arrive down the rail; held, the thumb takes the accent |
| Carousel (`carousel`) | Roll | The count rolls the way you travel |
| Table (`table`) | Glide | The rows glide to their new order; a pick's ring lands |
| Chart (`chart`) | Roll | The number rolls to the month you point at, and back |
| Avatar (`avatar`) | Spiccato | A group steps apart to be counted |
| Item (`item`) | Ink | The leader inks from one end to the other |
| Message (`message`) | Written | New messages write in; the status ring fills to a dot |
| Reactions (`message`) | Roll | Yours turns italic; the count rolls |
| Marker (`marker`) | Spread | The rules draw outward from the word |
| Attachment (`attachment`) | Count in | The ring fills, turns, then lands as a dot |
| Message scroller (`thread`) | Spiccato | The new-messages pill lands; its count rolls |
| Questionnaire (`questionnaire`) | Turn | Questions turn in from where you're heading; the sentence writes in |
| Day and Nocturne | Dusk and dawn | A View Transition: Nocturne falls from the top with a soft edge, and day comes up from the bottom. Schemes and keys cross-fade. |

`roll(el, apply, dist, dir)` in the specimen is the one helper for every rolling number (`dir` 1 counts up, −1 counts down). The library ships it as `roll()` in `@/lib/0db/roll`.

## Registry conventions

- One item is four files: `registry/0db/ui/<item>.tsx`, its sidecar `registry/0db/styles/<item>.css`, the docs meta `content/<item>.ts` and the live example `examples/<item>.tsx`. The base pieces (link, kbd, fraction, meta, corners) have no sidecar; their CSS is in base.css.
- Item names follow shadcn where shadcn has the component; the class keeps the poster's word. `slider` renders `.db-ruler`.
- Sidecars are wrapped in `@layer components`; base.css is in `@layer base`, so a consumer's Tailwind utilities still win. `!important` appears only on `[hidden]` and `.db-sr`.
- Direction: logical properties, and `:is([dir="rtl"], [dir="rtl"] *)` where a stroke has a direction. Never `:dir()`: Lightning CSS, which Next and Tailwind run, lowers it to a list of `:lang()` that misses a page that only sets `dir`.
- Variants are `data-variant` and `data-size`, never classes. There's no cva.
- React 19: `ref` is a plain prop. `"use client"` appears only in files that need state, effects, handlers or Radix, so every other item works in a Server Component. Each root and part carries `data-slot`; `className` merges through `cn`.
- Imports inside the registry are `@/registry/0db/ui/<x>`, `@/registry/0db/lib/utils` and `@/registry/0db/lib/<x>`. The build rewrites them to `@/components/ui/<x>`, `@/lib/utils` and `@/lib/0db/<x>`.
- `registryDependencies` is the base item plus every sibling an item imports or lists in its meta's `uses` (a sibling whose classes its CSS borrows). npm dependencies come from its imports.
- `npm run registry:build` writes `registry.json`, `public/r/*.json`, `app/registry.css` and `lib/site/entries.ts`. All four are committed, and `check:registry` fails if they're stale.

## Docs conventions

- The docs are built only from 0dB items, plus page layout in `app/site.css`. When a page needs something the library lacks, it's built as an item first.
- Every item page is generated from `content/<item>.ts`, `examples/<item>.tsx` and this file: its contract under `### db-<class> (<item>)`, and its rows in "Where each move comes from" and "Motion", which name it in backticks.
- `examples/<item>.tsx` default-exports `Example`, the specimen's demo with real copy. An optional `States` export pins each state with `data-force` on the item's root, inside `<State label>`.
- Theme choices live on `<html>` as `data-mode`, `data-scheme`, `data-key` and `data-pair`, stored under `0db-theme` and restored by a script in `<head>` before first paint.

## Skipped for now

- A destructive button variant. Danger is said in words, through the dialog.
- Date ranges in the calendar.
- A states row for the dial. Its states are the radio's.
- A sheet from the start edge. The spine title assumes the end edge.
- A proper Arabic expression face. Right to left, the system face stands in, upright.
- Submenus in the menubar.
- Charts other than one series of bars. Lines, stacks and legends wait for a real need.
