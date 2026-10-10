# 0nlyType: melody

Extracted from DESIGN.md.

### db-melody (melody)
- Underneath: native, plus a hook that measures and lays the words out with pretext (`@chenglou/pretext`, loaded when it's needed).
- Anatomy: `<figure class="db-melody" tabindex="0" aria-label>` holding one `.db-melody-stave` per line, each with a `.db-melody-staff` (five hairlines in `--db-rule`, an opening barline, and a closing one), an `svg.db-melody-marks` (the engraving) and its `.db-melody-note` words, positioned by pretext's measures. The last stave ends on a double bar.
- The engraving is the marks a singer reads, in pencil and nothing else: a slur over each phrase (the words up to a comma or a full stop, never across a stave), a pen stroke that swells in the middle and thins to nothing at its ends, bowed just enough to clear every word it passes over and leaning toward the end that needs the lift; a fermata (an arc over a dot) above the staff over the last word; and under the first word its dynamic, `.db-melody-dynamic`, in the bold italic. The dynamic is the type size the melody is set at, since the sizes are dynamics already: at `--db-mp` it's *mp*. A word's letters wear a halo of the paper (`--db-melody-ground`), so the lines and slurs stop just short of them.
- A sentence set on a stave, each word a note: its baseline sits on a line or in a space, following `contour` (steps, 0 the bottom line, 8 the top, odd numbers the spaces). Without one, the sentence writes its own tune: long words rise, the phrase rocks, and it comes home to where it began.
- The words are spaced evenly across the measure and wrap onto a new stave when it's full; the last stave keeps to a moderate gap, a rest rather than a stretch. No word stands alone on the last stave: it takes one from the stave before when that one can spare it.
- Pointing at a word sounds it: it takes the accent, lifts a little and lands, and the words after it do the same in turn, one `--db-arpeggio` apart, then settle back to ink. The last word, under its fermata, holds the accent for as long again before it lets go. The same word sounded twice starts over.
- Keyboard: the figure is one focus stop, and Enter plays the phrase from the first word. The words are aria-hidden; the figure's label is the plain sentence. Under reduced motion there's no lift and no travel: the sounded words hold the accent until you leave.
- It lays out again when its width changes or `<html>` changes face. Before the fonts arrive, or without script, it's the plain sentence.
- `variant` (`data-variant`): `stave` (the default), `noteheads` or `cutaway`.
- noteheads: after the calendar poster's discs and the score's lyric underlay. Each word's note is a disc (`.db-melody-head`) one staff space across on its step, with no stem, and the words are sung under the staff on one lyric baseline (below the lowest disc too), each under its disc. No slurs, since every word is one note. The fermata stands over the last disc, and the dynamic goes above the staff over the first, where a vocal score puts it to keep the words below clear. The discs say where you are in the song, as the poster says where you are in the month: to come in hairline rings (`--db-rule-strong`, filled with the ground), sung in ink, the word you're at in the accent. Pointing at a word or its disc moves there, and the discs fill or empty in turn from where you were, one `--db-arpeggio` apart; leaving lets it go. Keyboard: the arrows step along the words (mirrored right to left), Home and End go to the first and the last, Enter sings it through to the last, Escape and blur let it go. Reduced motion: the discs change at once.
- cutaway: after the cutaway score, which drops an instrument's staff while it rests. The continuous staff and its barlines are not drawn; under each word, and 0.12em beyond it, a piece of the five lines (`.db-melody-bit`) stands instead, so the silences between the words are paper and the slurs carry across them. Everything else, the tune, the marks and the arpeggio, is the stave's.
- Forced colours: the discs ring and fill in CanvasText, the one you're at in Highlight; the staff lines are GrayText, and the words drop their halo, which would be forced to the text colour.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Melody (`melody`) | Arpeggio | The word you point at sounds, then the rest of the phrase in turn; the last holds under its fermata |
| Noteheads melody (`melody`) | Ink | The discs fill in turn up to the word you're at, which takes the accent |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Melody (`melody`) | The score | The sentence sits on a stave, a word to a line or space |
| Noteheads melody (`melody`) | "Less but better" calendar; the score's lyric underlay | Discs on the staff: sung in ink, here in the accent, to come in rings |
| Cutaway melody (`melody`) | The cutaway score; "Less is more." | The staff is drawn only under the words |
