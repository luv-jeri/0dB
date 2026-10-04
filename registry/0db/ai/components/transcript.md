# 0dB: transcript

Extracted from DESIGN.md.

### db-transcript (transcript)
- Underneath: Native section and ordered cue list. Cues are static divs by default; onSeek from a client makes them native buttons. Semantic time durations, numeric bdi isolation, optional speaker in reading-grade italic and aria-current on the current cue.
- Creative move: The current spoken line grows into its own aperture of space; neighbouring cues keep their quiet reading size and the timestamp conducts from the margin. Reference: SPECTRA scale and timing coordinates (10.jpg).
- Behavior: Distinct from ActivityFeed's event history and ReadingTrail's page position: this is timed media text and cue seeking. Starts are finite, non-negative and strictly increasing; optional ends are exclusive and cannot overlap. Gaps have no current cue. No internal timer, automatic scrolling or per-cue live announcements. A static transcript can be rendered on the server; interactive usage belongs inside a client boundary.
- Motion: spoken aperture. The current cue opens its type size and vertical space with a controlled landing while the timestamp raises its construction tick. The old cue contracts immediately on a seek, including seeks into gaps; no timer or auto-scroll is added. Reduced motion resolves directly; each action ends at rest. Native focus and hit areas remain stable.
- Access: native controls retain keyboard and touch activation, focus remains visible, long text wraps in flow, logical spacing follows local direction, reduced motion changes directly and forced colours retain semantic lines and system focus. `[hidden]` keeps its native meaning.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Transcript (`transcript`) | Spoken aperture | The current cue opens its type size and vertical space with a controlled landing while the timestamp raises its construction tick. The old cue contracts immediately on a seek, including seeks into gaps; no timer or auto-scroll is added. |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Transcript (`transcript`) | SPECTRA scale and timing coordinates (10.jpg) | The current spoken line grows into its own aperture of space; neighbouring cues keep their quiet reading size and the timestamp conducts from the margin. |
