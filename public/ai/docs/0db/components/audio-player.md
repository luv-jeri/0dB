# 0dB: audio-player

Extracted from DESIGN.md.

### db-audio (audio-player)
- Underneath: Native audio with no autoplay and no native-control panel, Play/Pause button and native range seek. audioProps forwards the audio ref and media events; onTimeChange reports real playback time. Native root ref and props reach the outer div.
- Creative move: A monumental personal clock sits above a real-time score. Play tensions the clock and lifts the playhead; a quarter-time scale makes the recording seekable. Reference: It has to be design scale contrast (1.jpg), a score fermata.
- Behavior: Distinct from Timer's started countdown and Melody's pointer phrase: this controls a real recording. Playback belongs to the browser; metadata and duration determine seeking, which is disabled for missing or infinite duration. Attachment samples metadata that loaded before hydration. Rejected Play promises or native load errors show a visible status. Source replacement pauses the retiring recording, remounts the native recording and clears the reading; unmount and disabled also pause playback. No synthetic timer, network service or motion framework.
- Motion: held playhead. Play tensions the italic clock and opens the fermata while the real media playhead rises from the baseline. Pause relaxes the setting and lowers the needle. Seeking moves the score to actual media time, with no synthetic clock. Reduced motion resolves directly; each action ends at rest. Native focus and hit areas remain stable.
- Access: native controls retain keyboard and touch activation, focus remains visible, long text wraps in flow, logical spacing follows local direction, reduced motion changes directly and forced colours retain semantic lines and system focus. `[hidden]` keeps its native meaning.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Audio player (`audio-player`) | Held playhead | Play tensions the italic clock and opens the fermata while the real media playhead rises from the baseline. Pause relaxes the setting and lowers the needle. Seeking moves the score to actual media time, with no synthetic clock. |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Audio player (`audio-player`) | It has to be design scale contrast (1.jpg), a score fermata | A monumental personal clock sits above a real-time score. Play tensions the clock and lifts the playhead; a quarter-time scale makes the recording seekable. |
