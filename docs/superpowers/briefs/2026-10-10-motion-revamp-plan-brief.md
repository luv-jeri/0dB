# Brief: plan the 0dB motion revamp (landing, library, components, docs)

You are drafting a plan, not building. Write the plan to `docs/superpowers/plans/2026-10-10-motion-revamp.md` in this worktree (`~/Developer/0db-motion-plan`, branch `docs/motion-revamp-plan`). Change no other file. Do not run `npm run build` or a dev server; reading, `git grep` and `node -e` probes are fine.

## The owner's words (2026-10-10, IST)

- ~04:40: "we want to enhance the overall experience of the component library and the landing page. I want you to watch this video and learn how we can make the best animation website, and then we will plan how we can implement all this in our landing page, components, and how we can use pretext here with the content of this video … then we will make the enhancements plus revamp of the landing page, component library and the components and the docs."
- ~05:10, choosing between "translate every technique into type, keep INTENT" and "loosen INTENT for the landing": "go with the recommendation" (translate into type, keep INTENT).
- ~05:15: "instead of images we can use the pretext to create shapes and replace the images."

## Decisions already made (follow; do not re-open)

- D1. Every technique from the video is translated into type. INTENT.md stays as it is. No images, no video, no motion library, no ambient motion beyond the approved exceptions. If the plan needs an INTENT amendment, list it in a separate "Owner decisions needed" section with one sentence why. Do not assume it.
- D2. Wherever the video uses a photograph, we use a **shape set in words** with `@chenglou/pretext` (0.0.9 in package.json): a calligram silhouette whose text is the content itself. The `calligram` item (`registry/0db/ui/calligram.tsx`) and the signs work are the precedent. INTENT refuses `shape`, `shape-artwork` and `shape-scene` because they were bare shapes. A shape made of words is type, so it's allowed. Say how the plan keeps that line clear.
- D3. Motion follows the person. Scroll, pointer and keys drive it. The only things that play on their own are the overture (once) and the approved autoplay exceptions. A "travel" or "orbit" moves only with scroll or drag.
- D4. No motion library. Use CSS scroll-driven animations (`animation-timeline: view()` / `scroll()`) where they're supported, a small IntersectionObserver or rAF fallback where they aren't, and Pretext for layout. Animate only `transform`, `opacity`, `clip-path` and font axes while scrolling. Every layout is computed up front (the video's "image sequence" lesson: pre-render the frames, then just draw).
- D5. Each new effect that does a job of its own is a **registry item**: `registry/0db/ui/<name>.tsx`, `styles/<name>.css`, `content/<name>.ts`, `examples/<name>.tsx`, a DESIGN.md contract and one Motion articulation, and a reference from `docs/references/`. Never aliases or splits (AGENTS.md "Ranking").
- D6. Reduced motion means static and complete. Phones get no parallax (the video's rule too). Right to left mirrors anything with a direction. Forced colours stay legible.
- D7. The overture: under 3 seconds, first visit only, skippable. Check what it does now and plan the gap.

## Read first

1. `INTENT.md`, `AGENTS.md`, and in `DESIGN.md` the Principles, Conventions, Motion (line ~1485), "The overture" (~1167) and "Where each move comes from" (~1174) sections, plus the contracts of every item you propose to touch.
2. The research in `docs/superpowers/research/2026-10-10-motion-video/`: the transcript and two Gemini analyses of Ruben Stom's "Animate Insane Websites with AI". Take timestamps from the transcript. The analyses label some details as their own opinion, so treat those as such.
3. The Cadence catalogue (Ruben Stom's 100+ animation library) at `/private/tmp/claude-501/-Users-sanjaykumar/8439a1dc-efb5-44a1-848c-89ebe6f35840/scratchpad/cadence/CATALOGUE.md`, with code under `code/`. It's for reference only: never copy its code into 0dB. Mine it for techniques that have a type-only version.
4. The current site: `app/page.tsx`, `app/landing.css`, `app/site.css`, `components/site/landing*.tsx`, `components/site/overture.tsx`, `components/site/smooth-scroll.tsx`, `components/site/docs-index.tsx`, `app/docs/**`. Also every item that already uses pretext (`git grep -l pretext -- registry`).
5. Parallel work you must not double-book: branch `feat/type-icons` in `~/Developer/0db-icons` is rebuilding "signs" (icons set in their own word, three variants each). It also edits INTENT/AGENTS/DESIGN and `scripts/build-registry.mjs`. Read `git log origin/main..feat/type-icons --stat` in that worktree, and schedule around the files it touches.

## What the plan must contain

1. **Inventory**: the current landing sections in order, and the docs page anatomy, each with what moves today and why.
2. **Technique map**: one row per technique, both from the video (reveal: wipe, fade-up stagger, scroll text illumination, section slide-over; parallax: layered, side-by-side floating, inner-frame; intro; travel: plane flight, z-flight, orbit, spiral, sphere; video: on load, on trigger, scroll scrub, end frame = start frame chaining) and from Cadence where it adds something. Each row gives:
   - the type-only translation;
   - the word-shape that replaces any image (D2);
   - Pretext's exact role (which API: `prepare`, `prepareWithSegments`, `layoutNextLine`, `layoutWithLines` and so on; check the installed package's exports in `~/Developer/0db-release/node_modules/@chenglou/pretext` (this worktree has no node_modules));
   - the trigger;
   - the CSS/JS approach, the fallback, and the reduced-motion and RTL behaviour;
   - whether it's a new item, a new variant of an existing item, or site-only;
   - its proposed item name, with no clash with existing names (`registry.json`).
   Mark the rows we should NOT do, and say why.
3. **Landing revamp**: the new section-by-section story, applying the video's ordering (subtle to dramatic) and "when everything moves, nothing stands out". Name the one cinematic moment and say why there's only one.
4. **Docs and library**: how reveals and parallax appear on docs pages, if at all (docs are information pages, and the video says skip intros there). How each item page shows its motion, and any component that gains a scroll-driven variant.
5. **Architecture**:
   - a shared scroll-timeline helper, or none, and why;
   - how Pretext layouts are precomputed and cached (SSR versus client, font-load timing, resize);
   - the frame budget;
   - how a scroll-scrubbed typesetting sequence is stored and drawn;
   - how chaining (the end state of one section is the start state of the next) works;
   - the browser support matrix for scroll-driven animations as of 2026-10, checked against current sources, which you must cite.
6. **Checks**:
   - what `npm run check` gains, such as a frame-time or layout-shift probe, a reduced-motion static check and an RTL check;
   - the standard each new item must meet before merge (AGENTS.md "Before you say it's done").
   - A standard that matters becomes a check, not prose.
7. **Waves**: ordered, each one a mergeable PR. Give each wave its files, the files it must not touch (the signs branch), its size (S/M/L), its success criterion, and who builds it (Sol for L, Sonnet 5.5 high for M/S, Opus for UI judgment calls). Count the registry items each wave adds, toward the 500+ goal.
8. **Owner decisions needed**: only real ones, each with a recommended default.
9. **Risks**, and what we refuse even though the video does it.

Be concrete: names, files, numbers. Verify every claim about the code by reading it, and cite `file:line`. Plain English, short sentences, no semicolons in the prose you write. When done, reply with the plan path, the count of proposed new items and variants, and the owner decisions list.
