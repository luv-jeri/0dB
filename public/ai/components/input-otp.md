# 0nlyType: input-otp

Extracted from DESIGN.md.

### ot-code (input-otp)
- Underneath: native input, plus a hook.
- Anatomy: `<div class="ot-code">` holding one `<input inputmode="numeric" autocomplete="one-time-code" maxlength="6">` and six `.ot-code-slot` spans split three and three by `.ot-code-sep`, a leaning hairline. Script copies the digits into the slots and sets `data-here` on the next slot and `data-state="done | wrong"` on the box.
- Each digit drops onto its baseline in italic (`ot-drop-in`); the waiting line is the accent. Whole, the lines ink in turn. Wrong, they turn crimson together and an `ot-field-error` says why.
- One real input underneath, so paste, autofill and the keyboard all work natively.
- Variant `close-up` (the proofreader's close-up mark; the tight tracking of "the uncreative"): a dot waits for each digit, the next one in the accent. Whole, the spaces close and the halves meet in one tight figure; the mark's two arcs land over and under the join. Wrong, the spaces open again in crimson.
- Variant `lyric` (the score's lyric line; a cheque's sum in words): each digit is read back in words under its line (`.ot-code-word`, ours, upright), with a comma at the halfway breath and a full stop at the end, so the code can be checked aloud against the message. Whole, the words ink.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| One-time code (`input-otp`) | Drop | Each digit drops onto its line; whole, the lines ink in turn |
| Close-up code (`input-otp`) | Close up | Whole, the spaces close; the two arcs land over and under the join |
| Lyric code (`input-otp`) | Read back | Each word opens from its middle under its digit |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| One-time code (`input-otp`) | "Less is more." rules | Short baselines, three and three |
| Close-up code (`input-otp`) | The proofreader's close-up mark; "the uncreative" | Dots wait; whole, the code closes into one figure |
| Lyric code (`input-otp`) | The score's lyric line; a cheque's sum in words | Each digit read back in words under it |
