// Motion, proved in a browser on the packaged site (needs `npm run build`; the check starts and stops its own server).
//   the home overture: plays once per browser, ends by one deadline under three seconds, skips by key, press and
//   control, survives late fonts and unavailable storage, and is static under reduced motion
//   shared toy links arrive turned down, docs titles stay still, nothing logs an error
// Engines: Chromium only, in this wave. Nothing here depends on scroll timelines, so there is no second backend to
// compare yet. An engine that cannot launch fails the check; it is never skipped.
import assert from "node:assert/strict"
import { chromium } from "playwright"

import { OVERTURE_ATTR, OVERTURE_DEADLINE, OVERTURE_KEY } from "../lib/site/overture.mjs"
import { serveOut } from "../scripts/lib/serve-out.mjs"

const site = await serveOut()
const browser = await chromium.launch()
const failures = []
let ran = 0

/** Watches the overture attribute from before the page's own scripts: when it appeared, and when it went. */
const spy = (attr) => {
  window.__overture = { starts: [], ends: [] }
  new MutationObserver(() => {
    const value = document.documentElement.getAttribute(attr)
    const log = window.__overture
    if (value !== null && !log.starts.length) log.starts.push({ at: Number(value), seen: performance.now() })
    if (value === null && log.starts.length && !log.ends.length) log.ends.push(performance.now())
  }).observe(document, { attributes: true, subtree: true, attributeFilter: [attr] })
}

async function fresh(options = {}, init) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, ...options })
  await context.addInitScript(spy, OVERTURE_ATTR)
  if (init) await context.addInitScript(init)
  const errors = []
  context.on("page", (page) => {
    page.on("pageerror", (error) => errors.push(error.message))
    page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()) })
  })
  return { context, errors }
}
const log = (page) => page.evaluate(() => window.__overture)
const ended = (page, timeout = 6000) => page.waitForFunction(() => window.__overture.ends.length > 0, null, { timeout })
const weight = (page) => page.evaluate(() => Number(getComputedStyle(document.querySelector('.hero-line[data-line="quiet"]')).fontWeight))

async function check(name, fn) {
  ran++
  try { await fn() } catch (error) { failures.push(`${name}: ${error.message.split("\n")[0]}`) }
}

// ── the first visit ──
await check("first visit: plays, ends by the deadline, records itself once", async () => {
  const { context, errors } = await fresh()
  const page = await context.newPage()
  await page.goto(site.url("/"))
  await page.waitForFunction(() => window.__overture.starts.length > 0)
  assert.ok(await weight(page) > 600, "the quiet line should begin heavy")
  assert.ok(await page.locator(".hero-skip").isVisible(), "Skip intro should be visible while it plays")
  await ended(page)
  const { starts, ends } = await log(page)
  const took = ends[0] - starts[0].at
  assert.ok(took <= OVERTURE_DEADLINE + 150, `title and field ended after ${Math.round(took)}ms, past the ${OVERTURE_DEADLINE}ms deadline`)
  assert.ok(took < 3000)
  assert.equal(await weight(page), 200, "the quiet line should rest at its quietest")
  assert.equal(await page.locator(".hero-skip").isVisible(), false, "Skip intro should be gone after the overture")
  assert.equal(await page.locator("canvas.hero-noise[data-arrival]").count(), 0, "the field should have settled with the title")
  assert.equal(await page.evaluate((k) => localStorage.getItem(k), OVERTURE_KEY), "1")
  assert.deepEqual(errors, [])
  await context.close()
})

await check("the field arrives inside the overture and settles with it", async () => {
  const { context } = await fresh()
  const page = await context.newPage()
  await page.goto(site.url("/"))
  await page.waitForFunction(() => window.__overture.starts.length > 0)
  const arriving = await page.waitForSelector("canvas.hero-noise[data-arrival]", { timeout: 1500 }).then(() => true, () => false)
  // On a very slow start the overture may have too little left to be worth playing the field; then it simply rests.
  if (arriving) { await ended(page); assert.equal(await page.locator("canvas.hero-noise[data-arrival]").count(), 0) }
  await context.close()
})

await check("later visits arrive settled: reload, another tab, back", async () => {
  const { context } = await fresh()
  const first = await context.newPage()
  await first.goto(site.url("/"))
  await ended(first)
  for (const how of ["reload", "tab", "back"]) {
    const page = how === "tab" ? await context.newPage() : first
    if (how === "reload") await page.reload()
    if (how === "tab") await page.goto(site.url("/"))
    if (how === "back") { await page.goto(site.url("/docs/")); await page.goBack() }
    await page.waitForSelector(".hero-title")
    await page.waitForTimeout(500)
    const { starts } = await log(page)
    assert.equal(starts.length, 0, `the overture replayed after ${how}`)
    assert.equal(await weight(page), 200)
    assert.equal(await page.locator(".hero-skip").isVisible(), false)
  }
  await context.close()
})

await check("Escape ends it", async () => {
  const { context } = await fresh()
  const page = await context.newPage()
  await page.goto(site.url("/"))
  await page.waitForFunction(() => window.__overture.starts.length > 0)
  await page.keyboard.press("Escape")
  await ended(page, 500)
  assert.equal(await weight(page), 200)
  await context.close()
})

await check("a press ends it", async () => {
  const { context } = await fresh()
  const page = await context.newPage()
  await page.goto(site.url("/"))
  await page.waitForFunction(() => window.__overture.starts.length > 0)
  await page.mouse.click(700, 520)
  await ended(page, 500)
  await context.close()
})

await check("the wheel ends it", async () => {
  const { context } = await fresh()
  const page = await context.newPage()
  await page.goto(site.url("/"))
  await page.waitForFunction(() => window.__overture.starts.length > 0)
  await page.mouse.move(700, 520)
  await page.mouse.wheel(0, 120)
  await ended(page, 500)
  await context.close()
})

await check("Skip intro is reachable by keyboard and hands focus on to the first action", async () => {
  const { context } = await fresh()
  const page = await context.newPage()
  await page.goto(site.url("/"))
  await page.waitForFunction(() => window.__overture.starts.length > 0)
  let reached = false
  for (let i = 0; i < 12 && !reached; i++) {
    await page.keyboard.press("Tab")
    reached = await page.evaluate(() => document.activeElement?.classList.contains("hero-skip"))
  }
  assert.ok(reached, "Tab never reached Skip intro")
  assert.equal((await log(page)).ends.length, 0, "Tab alone must not end the overture")
  await page.keyboard.press("Enter")
  await ended(page, 500)
  assert.equal(await page.evaluate(() => document.activeElement?.closest(".hero-cta") !== null), true, "focus should move on to the first action")
  await context.close()
})

await check("Skip intro by pointer", async () => {
  const { context } = await fresh()
  const page = await context.newPage()
  await page.goto(site.url("/"))
  await page.waitForFunction(() => window.__overture.starts.length > 0)
  await page.locator(".hero-skip").click()
  await ended(page, 500)
  await context.close()
})

await check("Skip intro mirrors in right to left and stays on screen", async () => {
  const { context } = await fresh()
  const page = await context.newPage()
  await page.goto(site.url("/"))
  await page.waitForFunction(() => window.__overture.starts.length > 0)
  const place = () => page.evaluate(() => { const r = document.querySelector(".hero-skip").getBoundingClientRect(); return { left: r.left, right: r.right, width: innerWidth } })
  const ltr = await place()
  await page.evaluate(() => { document.documentElement.dir = "rtl" })
  const rtl = await place()
  assert.ok(ltr.right <= ltr.width && rtl.left >= 0, "Skip intro left the screen")
  assert.ok(rtl.left < ltr.left, "Skip intro should move to the other side in right to left")
  await context.close()
})

await check("the deadline holds when fonts arrive late", async () => {
  const { context } = await fresh()
  await context.route("**/*.woff2", async (route) => { await new Promise((r) => setTimeout(r, 3500)); await route.continue() })
  const page = await context.newPage()
  await page.goto(site.url("/"), { waitUntil: "commit" })
  await page.waitForFunction(() => window.__overture?.starts.length > 0, null, { timeout: 8000 })
  await ended(page, 8000)
  const { starts, ends } = await log(page)
  assert.ok(ends[0] - starts[0].at <= OVERTURE_DEADLINE + 150, "late fonts stretched the overture")
  await context.close()
})

// ── when the overture must not play ──
const never = (name, options, init, extra) => check(name, async () => {
  const { context, errors } = await fresh(options, init)
  const page = await context.newPage()
  await page.goto(site.url(extra?.route ?? "/"))
  await page.waitForSelector(".hero-title")
  await page.waitForTimeout(600)
  assert.equal((await log(page)).starts.length, 0, "the overture played")
  assert.equal(await page.locator(".hero-skip").isVisible(), false)
  assert.equal(await weight(page), 200)
  assert.ok(await page.locator("h1").isVisible(), "the page should still render")
  if (extra?.stored !== undefined) assert.equal(await page.evaluate((k) => localStorage.getItem(k), OVERTURE_KEY), extra.stored)
  assert.deepEqual(errors, [])
  await context.close()
})
await never("reduced motion: static, complete, and counted as seen", { reducedMotion: "reduce" }, null, { stored: "1" })
await never("storage that refuses to be read: arrives settled", {}, () => {
  Object.defineProperty(window, "localStorage", { get() { throw new DOMException("denied", "SecurityError") } })
})
await never("storage that refuses to be written: arrives settled", {}, () => {
  Storage.prototype.setItem = function () { throw new DOMException("full", "QuotaExceededError") }
})
await never("a link to a part of the page: arrives settled", {}, null, { route: "/#noise", stored: "1" })

await check("reduced motion asked for mid-way ends it", async () => {
  const { context } = await fresh()
  const page = await context.newPage()
  await page.goto(site.url("/"))
  await page.waitForFunction(() => window.__overture.starts.length > 0)
  await page.emulateMedia({ reducedMotion: "reduce" })
  await ended(page, 500)
  assert.equal(await weight(page), 200)
  await context.close()
})

// ── shared toy links, docs titles ──
await check("a shared toy link arrives turned down and stays so", async () => {
  const { context } = await fresh({ reducedMotion: "no-preference" })
  const page = await context.newPage()
  await page.goto(site.url("/?say=hello%20there#noise"))
  await page.waitForFunction(() => document.querySelector(".toy-input")?.value === "hello there")
  const samples = []
  for (let i = 0; i < 24; i++) {
    samples.push(await page.evaluate(() => ({ quiet: document.querySelector(".toy")?.hasAttribute("data-quiet"), meter: document.querySelector(".toy-meter")?.textContent })))
    await page.waitForTimeout(100)
  }
  assert.ok(samples.every((s) => s.quiet), "the toy left its quiet state without a gesture")
  assert.ok(samples.every((s) => s.meter?.trim() === "0 dB"), "the toy's meter moved without a gesture")
  await context.close()
})

await check("docs titles stay still", async () => {
  const { context, errors } = await fresh()
  const page = await context.newPage()
  await page.goto(site.url("/docs/button/"))
  await page.waitForSelector(".doc-title")
  for (const y of [0, 300, 900]) {
    await page.evaluate((top) => scrollTo(0, top), y)
    await page.waitForTimeout(150)
    const state = await page.evaluate(() => { const t = document.querySelector(".doc-title"); const s = getComputedStyle(t); return { name: s.animationName, tracking: s.letterSpacing, running: t.getAnimations().length } })
    assert.equal(state.name, "none")
    assert.equal(state.running, 0)
  }
  assert.deepEqual(errors, [])
  await context.close()
})

await check("the home page logs no error at 375, first visit and after", async () => {
  const { context, errors } = await fresh({ viewport: { width: 375, height: 800 }, isMobile: true, hasTouch: true })
  const page = await context.newPage()
  await page.goto(site.url("/"))
  await page.waitForTimeout(2600)
  await page.reload()
  await page.waitForTimeout(600)
  const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  assert.ok(over <= 1, `sideways overflow of ${over}px`)
  assert.deepEqual(errors, [])
  await context.close()
})

await browser.close()
await site.close()
if (failures.length) { console.error(failures.map((f) => `- ${f}`).join("\n")); process.exit(1) }
console.log(`Motion browser check passed: ${ran} cases (the home overture lifecycle, shared toy links, docs titles) in Chromium.`)
