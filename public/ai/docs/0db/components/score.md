# 0dB: score

Extracted from DESIGN.md.

### db-score (score)
- Underneath: a React provider, a native text button and Web Audio synthesis; no audio files.
- Anatomy: `ScoreProvider`, `ScoreToggle` (`.db-score`, Sound off / Sound on, aria-pressed) and `useScore()` returning `{ on, cue(name), voice(i), resolve(), letter(ch) }`. Outside a provider the hook is silent and the toggle disabled.
- Sound is resolution: the space and restraint of “the silence that heals” (3.jpg), and the owner's soothing-music brief. Off by default. The on/off preference persists at localStorage key `0db-score`; unavailable storage leaves the control usable. A saved on does not create or resume audio in a new document: switch off and on to activate it there. Only the toggle's enabling press constructs AudioContext. The visible state describes the preference; hook calls need an activated context too.
- The opening holds C and D (sus2). `voice(i)` adds indexed voices 0–4 at most once; the full suspension is C, G, D, F, C. `resolve()` moves D to E and F to G over a 1.4s audio adagio; later voices join the major chord. `cue("set")` is a soft pluck (120ms throttle); `letter(ch)` maps a codepoint to a chord tone, quietly, at most once per 75ms. Empty text is silent. Sine/triangle oscillators use soft gain envelopes, a 0.055 master and a gentle compressor/limiter; short notes are capped and disconnected at their end.
- All calls are silent no-ops while off or hidden. Visibility hidden suspends; visibility visible resumes only an already activated, enabled context. Off suspends immediately, unmount stops voices and closes the context, and a storage event turning off also suspends. Unsupported or denied audio leaves the setting off.
- Keyboard and touch: native Space/Enter or press; text always names the state. Focus is the one accent outline. Reduced motion does not alter opted-in audio. Forced colours retain system button text, underline the on state and use Highlight focus.
- Why it is type-only: owner decision 2026-10-02 approves 2.5D depth, type-made images, shapes made of words and opt-in sound because type is the material and carries meaning. These are never the refused effect-only depth-background, particle-text, typography-vortex or warp-text: no blur, shadows, gradients, fills or particles; distance uses scale, ink-to-pencil colour and plane angle only; one accent in view. The sound marks chapters becoming a finished thought; its complete visual form is the words Sound off / Sound on, never a waveform or ornamental visualizer.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Score (`score`) | Resolution | Only after opt-in, soft chapter voices enter and the suspended chord settles to major over audio adagio; the text toggle simply inks |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Score (`score`) | “the silence that heals”, 3.jpg; the owner’s soothing-music brief | A text-only invitation to sound; chapter voices move a suspended thought to resolution |
