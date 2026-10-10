# 0nlyType: timer

Extracted from DESIGN.md.

### ot-timer (timer)
- Underneath: native buttons plus a hook.
- Anatomy: `<div class="ot-timer" role="group" aria-label="Writing timer" data-variant="ring | horizon" data-state="idle | running | paused | done">` holding `.ot-timer-face` (`aria-hidden`, one `ot-ring` from radial-chart with its dot at the arc's start), `.ot-timer-read` (`.ot-timer-time` with `role="timer"`, holding the aria-hidden `.ot-timer-figures` and the time in words in a `.ot-sr`; then `.ot-timer-words`: `.ot-timer-label` and `.ot-timer-note`), `.ot-timer-actions` (two bracket `ot-btn`s) and a polite live region (`.ot-sr`).
- SPECTRA's huge figures against tiny print, inside the calendar's ring. The time is set in tabular figures at weight 200, as large as the ring allows (fewer figures set larger, by `--ot-timer-chars`): mm:ss, or h:mm:ss from an hour. Under it the label and one line of small print in pencil: the length when ready, "Ends 14:35" while it runs, Paused, Done.
- ring (the default): the ring is the time left. It starts full with the accent dot at the top; as the time goes the dot runs clockwise like a clock's hand and the arc behind it empties, so what is left always runs from the dot on round to the top.
- horizon: the Eclipse. A half ring stands on a horizon; the dot crosses it from the start of the line to its end like the sun, and what's left of the arc is the day still to go. The time stands on the line, its words under it. Right to left, the sun crosses the other way.
- It counts only because the person pressed Start. It follows the wall clock (a deadline, checked four times a second and again on coming back to the tab), so a hidden tab never falls behind. The arc is drawn from the clock every frame; the figures change once a second, each changed figure turning over downward like a counter's wheel (`roll`), the units first and the carry one arpeggio behind. Paused, the time steps back to pencil. Done, the ring is empty, the dot stands at the top and a full stop lands after 00:00 (spiccato); `onComplete` is called once.
- The presses: Start, then Pause and Resume in the same place, and Start again when done; Reset (disabled when ready) sweeps the ring back to full at andante. The two stand either side of the centre line, so a changed name never moves the other.
- Screen readers hear it politely and never every second: on each press ("Started, 25 minutes left."), every five minutes, each of the last five, at thirty seconds, and "Time is up." The time can be read on demand from the timer role. Keyboard: native buttons. Reduced motion: the arc steps once a second and the figures change without turning.
- `defaultElapsed` opens a session picked up again, paused. `data-force="running | paused | done"` pins a state for the docs without counting.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Timer (`timer`) | Countdown | Pressed Start, the dot runs clockwise and the arc empties behind it; each changed figure turns over like a counter's wheel; Reset sweeps the ring back; done, the full stop lands |
| Horizon timer (`timer`) | Crossing | The dot crosses the half ring toward the end of the horizon as the arc empties |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Timer (`timer`) | SPECTRA numbers; "28 December" ring | The time large inside a ring that empties behind the accent dot |
| Horizon timer (`timer`) | Eclipse | The dot crosses a half ring like the sun over the horizon |
