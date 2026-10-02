# 0dB: strata

Extracted from DESIGN.md.

### db-strata (strata)
- Underneath: native type in a perspective container, CSS view-timeline animation where supported and a small scroll-event/rAF fallback setting `--p` otherwise. No motion library.
- Anatomy: `.db-strata` holds direct `.db-strata-plane` children; each plane retains its real DOM content and reading order. The parent ranks depths for timing only, deepest first, without moving nodes. `trigger="scroll" | "load"` defaults to scroll. `StrataPlane` takes `depth` clamped to 0..1, `tilt="x" | "y" | "none"` (y), and `from="start" | "end" | "above" | "below"` (start).
- Move: WOVE (9.jpg) makes distant words smaller and pencil, chosen words large and near; the opening's weight contrast comes from It has to be design (1.jpg). At zero the planes are translated into depth, angled, scaled down and pencil; at one they are flat, near and ink. Start/end mirror in RTL. Mobile depth is two fifths as deep.
- Motion: one arrival. Load takes adagio with exhale, each plane one arpeggio after the previous, deepest first. Scroll follows entry to 65% of the section's cover range, with staggered progress equivalent to arpeggio/adagio; the fallback bounds its end to the available page scroll. It stops with the scroll and reverses with it. Settled planes have no pointer parallax, idle loop or continuing travel.
- Reduced motion and no script: the composed flat, ink state immediately. Turning reduced motion off does not replay a read load opening. Keyboard: no extra stop; child semantics and focus remain intact. Forced colours: CanvasText. No live region: depth changes presentation only.
- Why it is type-only: owner decision 2026-10-02 approves 2.5D depth because the type is the material and carries meaning: depth becomes clarity, the unfinished thought becomes workable. Distance is scale, ink-to-pencil colour and plane angle only, with perspective and transforms. No blur, shadows, gradients, fills or particles; it must never become the refused effect-only depth-background, particle-text, typography-vortex or warp-text. One accent in view.

## Motion

| Component | Articulation | What moves |
|---|---|---|
| Strata (`strata`) | Arrival | The deepest type arrives first, one arpeggio apart; adagio on load or the reader’s scroll, then flat stillness |

## Where each move comes from

| Component | Reference | Move |
|---|---|---|
| Strata (`strata`) | WOVE (9.jpg), distant pencil figures and near ink; It has to be design (1.jpg) | Depth resolves into a flat, clear typographic statement |
