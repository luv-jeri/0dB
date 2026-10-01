# 0dB: thread

Extracted from DESIGN.md.

### db-thread (thread)
- Underneath: native, with the scrollbar.
- Anatomy: `.db-thread` holding `.db-thread-scroll` (`role="log"`, `data-lenis-prevent`) of messages and markers, and `<button class="db-thread-latest" hidden>` holding `.db-thread-new`.
- It keeps to the latest message while you're at the end. Scrolled back, it stops following, and new messages are counted in an ink pill whose count rolls; pressing it focuses the log before taking you down, so focus stays there when the button disappears. Content sits at the bottom (`align-content: safe end`) while the thread is short.
- Variants on `.db-thread` (`data-variant="rests | running"`).
- Rests, after the principle that silence is structure and the score's multi-bar rest. The space before each message is the silence before it: script reads each header's `<time dateTime>` and sets `--db-rest` to log2(1 + minutes), and the gap is `--db-rest × 1.25 × --db-space-2` on a base of `--db-space-3`, capped at `--db-space-9`. Quick replies sit close; a morning's wait opens wide. A pause of an hour or more (`data-rest="3 hours later"`) is said in that silence as the marker's lapse says it: the words in pencil at `pp`, centred (`::after`, aria-hidden), their letters spread by `--db-lapse`, the lapse's own scale from a minute to a week. The two share one voice for a pause: the lapse is a marker you place, rests measures every gap for you. A day divider starts the count again. Nothing moves.
- Running, after a book's running head and the SHAPES / GRADIENTS frame row. Scrolled back past a day's divider, the top edge carries `.db-thread-head` (aria-hidden, since the log says it all): the day at the start, the time of the first message in view at the end, a hairline between them. It hides while the day's own divider is in view. When you cross into another day the word rolls, up going on, down going back.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Message scroller (`thread`) | Spiccato | The new-messages pill lands; its count rolls |
| Running thread (`thread`) | Roll | Crossing into another day, the running head's day rolls |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Message scroller (`thread`) | WOVE | The new count rolls in an ink pill |
| Rests thread (`thread`) | "Silence is structure"; the score's multi-bar rest; the marker's lapse | The gap is the time between; a long pause is said in it as a lapse |
| Running thread (`thread`) | A book's running head; SHAPES / GRADIENTS frame row | Scrolled back, the day and time ride the top edge on a hairline |
