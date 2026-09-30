# Astra review brief: 0dB production readiness

You are reviewing 0dB, a React 19 component library published as a shadcn registry. It is built with Next 16 (static export), Tailwind v4, Radix, cmdk and @chenglou/pretext. The repo is the current directory. The docs site will be deployed as a static export to https://0db.cojeev.com through a Cloudflare Worker (`wrangler.jsonc`). People install components with `npx shadcn add https://0db.cojeev.com/r/<name>.json`.

You are read-only. Do not edit, create or delete files. Do not commit. Do not run `npm run build`, `npm run dev`, `next`, or any script that writes to the repo. You may run read-only commands (`git`, `rg`, `cat`, `ls`), and `npx tsc --noEmit -p .`.

## Read first
- `INTENT.md`: what 0dB is and what it refuses.
- `DESIGN.md`: principles, conventions, tokens, the Motion table, and every component contract.
- `AGENTS.md` (Next 16 has breaking changes; the docs are in `node_modules/next/dist/docs/`).
- `package.json`, `next.config.ts`, `wrangler.jsonc`, `.github/workflows/ci.yml`, `components.json`.
- `scripts/` (the registry build and the checks), `content/types.ts`, `lib/site/`.
- `registry/0db/` (the ui, the styles and the lib: this is what users install), `examples/`, `content/`, `app/`, `components/site/`.

The design rules are deliberate; don't argue with them. They are: type is the only ornament, no icons, no cards, fills or shadows, one accent in view, and nothing moves unless the person acts. Review against them instead: flag code that breaks its own contract or the rules.

## What to review
1. **Code quality:**
   - correctness bugs;
   - React 19 and Next 16 misuse (client and server boundaries, effects, hydration mismatches, refs, keys, stale closures);
   - memory and listener leaks (observers, rAF, scroll listeners, timers);
   - duplicated logic that should be shared;
   - dead code and unused exports;
   - TypeScript `any` and unsafe casts;
   - naming and consistency across the 107 items.
2. **Registry and install correctness:** does each `public/r/<name>.json` carry every file and dependency it imports (`registryDependencies`, npm `dependencies`)? Will `npx shadcn add` produce a building app? Check the import rewriting in `scripts/lib/items.mjs`, and the CSS `@import` paths.
3. **Accessibility:** keyboard, focus, roles and names, live regions, reduced motion, forced colours, and right-to-left. Spot-check at least 25 components across every movement, including the newest (agent-chat, swapy, tour, pie-chart, radar-chart, segue, marquee, text-ribbon, word-relay, scroll-expand, figure, tiling, activity-feed, reading-trail, data-table, stat, timer).
4. **Performance:** bundle weight of the docs site, work done on scroll, layout thrash, fonts, and images.
5. **Production and security:** CSP and security headers for the static export on Cloudflare; `robots.txt`, `sitemap.xml`, metadata and OG; the 404 page; error states; licences (`FONT-NOTICES.md`, LICENCE); secrets in the repo; and CI gaps (what the CI gate does not catch).
6. **Docs:** accuracy of the install page, the props tables compared with the real props, broken links, and missing docs for props that exist.
7. **Gaps:** anything a production component library is expected to have that 0dB lacks, consistent with INTENT.md's refusals.

## Output
Write your review as Markdown to stdout, in this shape:
- **Verdict:** one paragraph. Is it production-ready? What blocks it?
- **Findings:** a table with the columns `id | severity (blocker/high/medium/low) | area | file:line | problem | fix`. Number them A1, A2 and so on. Be concrete; every finding needs a file and line, and a fix.
- **Gaps:** what's missing, ranked.
- **What is good:** a short list, so it isn't lost in the fixes.

Only report what you verified in the code. Mark any guess as "unverified".
