# 0dB: word-relay

Extracted from DESIGN.md.

### db-relay (word-relay)
- Underneath: native `<button>`.
- Anatomy: `.db-relay-frame` holds the native `<button class="db-relay" data-variant="statement">` and the sibling `.db-relay-pause` word button beneath it (never a nested button). The sentence button holds `.db-relay-lead` (the sentence, ours), `.db-relay-word` (aria-hidden, the word that rolls) and a `.db-sr` copy of the chosen word, so the button's name is the whole sentence. Person-driven changes are polite live updates; automatic changes keep the live region off.
- sentence (the default): mode-toggle's sentence, for any set of words. The lead is in the roman and graphite; the word is yours, in the expression italic and ink, on a hairline that hugs it. Pressing rolls it on to the next word (out at the top, in from below; back the other way), and the word's box eases from the old width to the new (moderato, breath), so the line follows the word. The last wraps to the first. Autoplay rolls to the next word every `interval` milliseconds (2400 by default, at least 1000); pressing or using the keys resets that reading interval.
- statement: after "It has to be design.", where heavy condensed roman is answered by a large italic that overlaps it, the one accent on the italic word and its full stop. The lead stands heavy (800) and narrow (75%) in ink; the word drops under it half again as large, in the italic and the accent, rising 0.42em into the line above with a halo of the paper round its letters (`--db-relay-ground`), so it cuts the roman where they cross. Pointing sketches a pencil hairline under it.
- Props: `words` (each with its own punctuation), `index` / `defaultIndex` / `onIndexChange(index)`. Controlled relays request the next index for both person-driven and automatic changes; the owner updates `index`. Disabled or single-word relays do not autoplay.
- States: rest, hover (sentence: ink, and the hairline inks; statement: the pencil hairline), focus (accent outline), disabled.
- Keyboard: Space or Enter goes to the next word; Down and Right to the next, Up and Left to the one before (Left and Right mirrored right to left); Home and End to the first and the last. Reduced motion: the word changes at once. Forced colours: the hairline and the word in CanvasText; the statement separates its two lines so the forced background cannot cover the lead.
- Autoplay (owner-approved exception, 2026-10-01): `autoplay` defaults to true; false keeps only person-driven behaviour and omits the pause control. `defaultPaused` starts it paused. The small roman `( pause )` / `( play )` button sits beneath the item at inline start, with `pauseLabel` / `playLabel` for its visible and accessible words. Explicit pause persists until play. Hover, focus within, an off-screen IntersectionObserver entry and a hidden tab suspend it; the person's scroll, drag, key or press takes over, and leaving interaction gives it 1600ms of rest before resuming. Reduced motion disables autoplay entirely and hides the unused control; `data-force="reduced"` shows that still state in docs. The clock uses rAF time deltas, cancels on unmount and never catches up hidden time.
- Autoplay states: autoplaying, paused (play available), reduced motion (still); the pause button is a separate keyboard stop with visible accent focus and native Enter/Space activation.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Word relay (`word-relay`) | Roll | Every 2400ms by default, or on press/keys, the word turns over and the line follows its width; pausable, off under reduced motion (owner-approved 2026-10-01) |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Word relay (`word-relay`) | Mode toggle's sentence; "It has to be design." (the italic word) | The last word rolls on to the next; the line follows it |
| Statement word relay (`word-relay`) | "It has to be design." scale contrast | Heavy narrow roman; the chosen word large in the italic and the accent, cutting across it |
