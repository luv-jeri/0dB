# Astra re-review of a6b1482..51ea682 (2026-10-01)

No blockers.

- [registry/0db/ui/tiling.tsx:260](/Users/sanjaykumar/Developer/sa/registry/0db/ui/tiling.tsx:260) — **major** — Releasing outside a tile before delayed pointer capture leaves a pending drag. Re-entering with no button pressed starts moving the tile. Reproduced with the actual transpiled handler. — **Fix:** Clear pending gestures on document `pointerup`/`pointercancel` and window blur; reject moves without the primary button held.

- [registry/0db/styles/mode-toggle.css:238](/Users/sanjaykumar/Developer/sa/registry/0db/styles/mode-toggle.css:238) — **major** — Stop/dimmer disable forced-colour adjustment, but their ordinary hover selectors override the system-colour rules. In day mode on a black high-contrast canvas, Stop’s selected word and Dimmer’s “N” become invisible. — **Fix:** Map their local colour tokens to system colours or match the hover selectors’ specificity.

- [registry/0db/styles/tiling.css:146](/Users/sanjaykumar/Developer/sa/registry/0db/styles/tiling.css:146) — **major** — Forced-colour borders lose to the more-specific variant, selected and held/focused rules. Automatic colour adjustment is disabled, so tile boundaries can disappear against a black canvas. — **Fix:** Override local border/accent tokens with system colours, including held and focused states.

- [components/site/demo-player.ts:405](/Users/sanjaykumar/Developer/sa/components/site/demo-player.ts:405) — **major** — Interaction detection omits `click`. Assistive activation that produces a trusted click without preceding pointer, keyboard or focus events leaves playback running; subsequent steps or remounts can overwrite the reader’s choice. — **Fix:** Include trusted clicks in cancellation. The player’s synthetic `.click()` calls remain excluded by `isTrusted`.

- [registry/0db/ui/tiling.tsx:282](/Users/sanjaykumar/Developer/sa/registry/0db/ui/tiling.tsx:282) — **minor** — Viewport pointer deltas become unscaled CSS translations. Inside the scaled landing preview, a 100px drag at scale 0.5 moves the tile only 50px; vertical snapping also lags. The position animation similarly mixes viewport and local coordinates. — **Fix:** Convert measurements and pointer deltas into one local coordinate system.

- [components/site/landing-toy.tsx:81](/Users/sanjaykumar/Developer/sa/components/site/landing-toy.tsx:81) — **minor** — Clicking outside the open share panel within `.toy` closes it on `pointerdown`, then immediately reopens it on `click` and copies again. Reproduced with the component handlers. — **Fix:** Suppress reopening for the gesture that dismissed the panel, or coordinate dismissal and opening within one event phase.

- [registry/0db/ui/mode-toggle.tsx:60](/Users/sanjaykumar/Developer/sa/registry/0db/ui/mode-toggle.tsx:60) — **minor** — Every pointer leave calls `matches(":active-view-transition")` without checking support. Unsupported browsers throw, skipping the rest reset and consumer callback. — **Fix:** Guard selector support or track transition state explicitly.

In-memory checks took approximately 0.4 seconds. Browser verification was blocked by the read-only sandbox. No files changed.