# 0dB builder brief (Tasks 4 to 9b)

Read this whole file, then the plan (`docs/superpowers/plans/2026-09-30-0db-library.md`, "Global Constraints" and "Tasks 4 to 9") and the spec's section 4 (`docs/superpowers/specs/2026-09-30-0db-library-design.md`). Your task message names your items.

## What an item is

Four files, nothing else:

| File | What |
|---|---|
| `registry/0db/ui/<item>.tsx` | The React component(s). |
| `registry/0db/styles/<item>.css` | The sidecar, wrapped in `@layer components { … }`. Omit only for the base pieces (link, kbd, fraction, meta, corners), whose CSS already lives in `registry/0db/styles/base.css`. |
| `examples/<item>.tsx` | `export default function Example()` (the specimen's demo, real copy) and, where the item has states, `export function States()` returning `<State label="…">` wrappers from `@/components/site/state`. |
| `content/<item>.ts` | `export default defineComponent({ name, title, movement, contract, summary, underneath, props, uses? })` from `./types`. `name` equals the file name. `uses` lists siblings whose classes or keyframes the CSS borrows without importing them. |

**Copy these reference items before writing anything:** `button` (native plus Slot, variants on `data-variant`), `checkbox` (native plus a hook, `data-force` on the root, `roll`), `dialog` (native `<dialog>` plus a context), `tooltip` (Radix: CSS keyed on `[data-state]`, in/out keyframes, Radix positions), `steps` (plain server component), `source`. Look at all four files of each.

## Where the look comes from

- `specimen/fermata.css`, the item's fence. Fence start lines: base 6, motion 46, link 79, meta 96, kbd 100, corners 109, btn 128, dots 180, check 188, fraction 220, choice 225, dial 268, picks 322, switch 337, ruler 365, field 419, select 474, tabs 513, pager 544, crumbs 563, disclose 575, rows 599, month 624, tag 666, note 686, progress 722, toast 738, dialog 766, empty 796, toggle 809, toggles 835, btn-group 843, input-group 857, code 880, combo 902, pop 922, menu 941, menubar 969, navmenu 980, command 1004, sidebar 1032, card 1057, peek 1074, tip 1103, sheet 1117, drawer 1135, collapse 1153, resize 1164, scroll 1184, scrollbar 1195, ratio 1258, carousel 1281, table 1298, chart 1323, avatar 1346, item 1361, prose 1378, msg 1402, bubble 1420, marker 1433, attach 1443, thread 1462, quest 1474, alert 1491, skeleton 1504, date 1514.
- `specimen/index.html`: the demo markup (grep for `f-<class>`) and the script (from line ~1890: `roll` 1902, radio/tab dot `follow` 1916, `toast` 1954, `dots`/`busy` 1986, calendar `setNow` 2140, `scrollbar` 2154, and more below).
- `DESIGN.md`: the item's contract (anatomy, states, keyboard).

Start the sidecar mechanically, then adapt: `node scripts/port-fence.mjs <item> <fence> [<fence>…]` writes `registry/0db/styles/<item>.css` with `f-` renamed to `db-`. Fences that style several things (e.g. `msg` styles avatar placement) keep only what belongs to your item; anything borrowed from a sibling goes in `uses` or is imported.

## Rules (the reviewer checks every one)

1. React 19: `ref` is a plain prop, no `forwardRef`. `"use client"` only when the file uses hooks, context, event handlers passed to DOM, or Radix. A file without it must be importable from a Server Component.
2. Root and each part carry `data-slot="<item>"` / `data-slot="<item>-<part>"`. `className` merges with `cn` from `@/registry/0db/lib/utils`. Native props pass through (`...props`).
3. Variants are `data-variant` / `data-size`. No cva.
4. Imports: siblings as `@/registry/0db/ui/<x>`, `roll` from `@/registry/0db/lib/roll`, `cn` from `@/registry/0db/lib/utils`. Never import from `@/components/site` or `@/examples` inside `registry/`.
5. Radix items: replace `:popover-open` / `:open` / specimen anchor positioning with `[data-state="open"|"closed"]` selectors, an in keyframe on open and an out keyframe on closed, and Radix `side`/`align`/`sideOffset` for placement (see `tooltip.css`). Portal the content.
6. States pinned for the docs use `data-force="hover|focus|active|open…"` on the item's ROOT element, and the CSS reads `:is(:hover, [data-force~="hover"])` (see `checkbox.css`, `button.css`). Only add `data-force` selectors for states the examples pin.
7. The look is the specimen's. Ours in roman, yours in italic (`var(--db-expression)`, italic, `calc(var(--db-expression-scale) * 1em)`); one accent per view; nothing moves unless the person acts; `@media (prefers-reduced-motion: reduce)` is already handled by tokens (`--db-andante` etc. become 1ms) so use the tempo tokens for every duration. No icons, cards, shadows. Logical properties. Where a stroke has a direction, write `:is([dir="rtl"], [dir="rtl"] *)`, NEVER `:dir(rtl)`: Lightning CSS (Next and every consumer's Tailwind) compiles `:dir()` into a `:lang(ar, he, …)` list that misses a bare `dir="rtl"` page. `lint-css` fails on `:dir(`.
8. `!important` is forbidden in sidecars. No `f-` or `--f-` names anywhere.
9. Copy: sentence case, active verbs, an action keeps its name (Archive → Archived), errors say what to fix, no apologies. Demo copy follows the specimen (project index "Halden", a studio's brief, etc.).
10. Accessibility: keyboard behaviour per DESIGN.md; visible focus (base.css provides `:focus-visible`); labels on controls; `aria-*` where the native element doesn't carry it.

## Working in a shared tree (other builders run at the same time)

- Touch ONLY your items' four files. Never edit `registry.json`, `app/`, `lib/site/`, `public/`, `scripts/`, `content/types.ts`, `registry/0db/styles/base.css|tokens.css|theme.css`, or another item's files. If you need a shared change, say so in your report instead.
- Write files in this order: ui, css, example, content LAST. The build reads `content/` and fails if an item's ui file is missing; the docs import every example.
- Rebuild the registry under a lock, never bare:
  ```bash
  until mkdir .tmp/build.lock 2>/dev/null; do sleep 1; done; node --import tsx scripts/build-registry.mjs >/dev/null; s=$?; rmdir .tmp/build.lock; exit $s
  ```
  (run `mkdir -p .tmp` first). If it fails because of another builder's half-written item, wait and retry; if it fails on yours, fix it.
- Type check: `npx tsc --noEmit 2>&1 | grep -E '<your item names>'`. Errors in other builders' files are not yours. Lint your files: `npx eslint --max-warnings=0 <your files>`.
- A dev server runs on http://localhost:3000. After the registry rebuild, `curl -s http://localhost:3000/preview/<item>/ | grep -c 'data-slot="<item>'` must be ≥1, and the page must not contain `Unhandled Runtime Error` / `Error:`. The browser pane is shared by every builder: open your own tab with `tabs_create` and act only on that tabId, or rely on the markup.
- Do not commit. Do not run `npm install`; every dependency is already installed (all Radix packages, cmdk, sugar-high). If you truly need another package, stop and say so.

## Report (your final message)

Per item: files, what's underneath, siblings it imports or `uses`, and anything from the specimen you could not carry over, with the reason. Then any shared change you need. Keep it short.
