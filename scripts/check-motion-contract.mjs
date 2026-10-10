// Holds the motion rules to the source, before the build. Motion that starts by itself is a failure here, not a note.
//   scripted demos: every one waits for the person (one explicit start, nothing synthesised by discovery)
//   the home overture: one key, one deadline under three seconds, title and field gated by the same attribute
//   docs titles and shared toy links: nothing moves on its own
// The browser half (tests/motion.browser.mjs, tests/demo-player.browser.mjs) proves it on the packaged site.
import { readFileSync, readdirSync, statSync } from "node:fs"
import path from "node:path"

import { OVERTURE_ATTR, OVERTURE_DEADLINE, OVERTURE_KEY } from "../lib/site/overture.mjs"
import { DEMO_SCORES } from "../components/site/demo-scores.ts"

function sources(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name)
    if (name === "node_modules" || name === ".next") return []
    return statSync(full).isDirectory() ? sources(full) : /\.(tsx?|mjs|css)$/.test(name) ? [full.split(path.sep).join("/")] : []
  })
}

const failures = []
const fail = (rule, message) => failures.push(`${rule}: ${message}`)
const read = (file) => readFileSync(file, "utf8")

// ── scripted demos ──
const scripted = Object.entries(DEMO_SCORES).filter(([, score]) => score.script)
if (!scripted.length) fail("scripted demos", "DEMO_SCORES has no scripted entry; the gate would pass on nothing")
for (const [name, score] of scripted) if (!score.phrase?.trim()) fail("scripted demos", `${name} has no phrase to describe what Demonstrate does`)

const player = read("components/site/demo-player.ts")
const starts = [...player.matchAll(/\bstart\(/g)].filter((m) => !/const start = async/.test(player.slice(m.index - 20, m.index + 20)))
if (starts.length !== 1 || !/demonstrate:\s*\(\)\s*=>\s*\{\s*void start\(\)/.test(player))
  fail("scripted demos", `demo-player.ts must call start() in exactly one place, the Demonstrate control (found ${starts.length})`)
const discover = player.slice(player.indexOf("const discover"), player.indexOf("const hands"))
if (!discover.includes("choreography.compose")) fail("scripted demos", "discover() no longer reads the choreography; this check cannot see what it does")
if (/\bstart\(|\bquiet\(|\.click\(|dispatchEvent|\.focus\(/.test(discover)) fail("scripted demos", "discover() must only look: no start, click, focus or event")
for (const file of ["app/docs/[item]/demo-example.tsx", "components/site/landing-index.tsx"]) {
  const source = read(file)
  if (!/Demonstrate/.test(source) || !/data-demo-control/.test(source)) fail("scripted demos", `${file} has no Demonstrate control`)
}

// ── the home overture ──
if (!(OVERTURE_DEADLINE > 0 && OVERTURE_DEADLINE < 3000)) fail("the home overture", `deadline ${OVERTURE_DEADLINE}ms is not under three seconds`)
const tokens = read("registry/0nlytype/styles/tokens.css")
const ms = (token) => Number(tokens.match(new RegExp(`${token}:\\s*(\\d+)ms`))?.[1])
const landing = read("app/landing.css")
const exhale = landing.match(/html\[data-overture-at\] \.hero-line\[data-line="quiet"\] \{ animation: hero-exhale var\(--db-adagio\) [^ ]+ calc\((\d+) \* var\(--db-arpeggio\)\)/)
if (!exhale) fail("the home overture", "the headline's exhale must be gated by html[data-overture-at] and keep its adagio, delay and arpeggio form")
else {
  const title = ms("--db-adagio") + Number(exhale[1]) * ms("--db-arpeggio")
  if (!(title <= OVERTURE_DEADLINE)) fail("the home overture", `the headline takes ${title}ms, past the ${OVERTURE_DEADLINE}ms deadline`)
}
if (/^\.hero-line\[data-line="quiet"\] \{[^}]*animation/m.test(landing)) fail("the home overture", "the quiet line must not animate outside the overture: later visits arrive settled")
if (OVERTURE_ATTR !== "data-overture-at") fail("the home overture", "css and lifecycle disagree on the attribute")
const noise = read("components/site/landing-noise.tsx")
if (!/overtureActive\(\)/.test(noise) || !/onOvertureEnd\(/.test(noise)) fail("the home overture", "the Noise field must arrive only inside the overture and settle when it ends")
// Storage: one key, written by the script in the page, nowhere else.
const keyUses = ["components", "app", "lib", "registry"].flatMap((dir) => sources(dir)).filter((file) => read(file).includes(OVERTURE_KEY) || read(file).includes("overture-seen"))
if (keyUses.length !== 1 || keyUses[0] !== "lib/site/overture.mjs") fail("the home overture", `the overture key belongs only in lib/site/overture.mjs (found ${keyUses.join(", ") || "nowhere"})`)

// ── docs titles and shared toy links ──
const site = read("app/site.css")
if (/\.doc-title[^{]*\{[^}]*animation/.test(site) || /@keyframes site-settle/.test(site)) fail("docs titles", "a docs page title must stay still")
const toy = read("components/site/landing-toy.tsx")
const shared = toy.slice(toy.indexOf("Opened from a shared link"), toy.indexOf("return (\n    <div\n      ref={root}"))
if (!shared || /setQuiet|setTimeout\([^)]*,\s*\d{3,}/.test(shared)) fail("shared toy links", "a shared link must arrive settled, with no timer and no noise")

// ── the clock belongs to the inline script; the component only listens ──
const overtureScript = read("lib/site/overture.mjs")
if (!/setTimeout\(\(\)=>end\("deadline"\)/.test(overtureScript)) fail("the home overture", "the inline script must own the deadline timer")
const overtureView = read("components/site/landing-overture.tsx")
if (/setTimeout|setInterval|addEventListener\((?!OVERTURE_END_EVENT)/.test(overtureView)) fail("the home overture", "landing-overture.tsx must only listen for the end; the clock lives in the inline script")

// ── every engine, every time ──
const runner = read("tests/run-motion.mjs")
for (const engine of ["chromium", "firefox", "webkit"]) if (!runner.includes(`"${engine}"`)) fail("browser engines", `tests/run-motion.mjs must run ${engine}`)
if (!/"check:motion":\s*"[^"]*run-motion\.mjs/.test(read("package.json"))) fail("browser engines", "check:motion must go through tests/run-motion.mjs")
const ci = read(".github/workflows/ci.yml")
if (!/playwright install[^\n]*chromium[^\n]*firefox[^\n]*webkit/.test(ci)) fail("browser engines", "CI must install chromium, firefox and webkit")
for (const file of ["tests/motion.browser.mjs", "tests/demo-player.browser.mjs"]) if (/\.skip\(|test\.skip|if \(!installed/.test(read(file))) fail("browser engines", `${file} must not skip an engine`)

if (failures.length) { console.error(failures.map((f) => `- ${f}`).join("\n")); process.exit(1) }
console.log(`Motion contract holds: ${scripted.length} scripted demos wait for Demonstrate, the overture plays once under ${OVERTURE_DEADLINE}ms, docs titles and shared toy links are still.`)
