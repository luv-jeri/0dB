// Scripted demos start only when the person asks, proved on the packaged site (needs `npm run build`).
//   for EVERY scripted entry in components/site/demo-scores.ts (read from the source, never a fixed list): its docs
//   page offers Demonstrate, nothing moves until it is pressed, pressing runs it, and Stop hands it back
//   the landing's stage does the same for the piece it shows
//   the control works from the keyboard, mirrors in right to left, and stays legible in forced colours
// Engines: Chromium only, in this wave (see tests/motion.browser.mjs).
import assert from "node:assert/strict"
import { chromium } from "playwright"

import { DEMO_SCORES } from "../components/site/demo-scores.ts"
import { serveOut } from "../scripts/lib/serve-out.mjs"

const scripted = Object.entries(DEMO_SCORES).filter(([, score]) => score.script).map(([name]) => name)
assert.ok(scripted.length > 0, "no scripted demo found; the gate would pass on nothing")

const site = await serveOut()
const browser = await chromium.launch()
const failures = []
const only = process.env.DEMO_ONLY?.split(",")
const items = only ?? scripted

/** The state the player publishes on the example, and whether a performance has begun. */
const demoState = (page, selector) => page.evaluate((sel) => { const el = document.querySelector(sel); return { state: el?.dataset.demoState ?? null, cycle: el?.dataset.demoCycle ?? null } }, selector)

async function one(context, item) {
  const page = await context.newPage()
  const errors = []
  page.on("pageerror", (error) => errors.push(error.message))
  try {
    await page.goto(site.url(`/docs/${item}/`), { waitUntil: "load" })
    const example = `[data-demo-item="${item}"]`
    await page.waitForSelector(example, { timeout: 10000 })
    await page.locator(example).scrollIntoViewIfNeeded()
    const control = page.locator(".doc-demo-controls button")
    assert.equal(await control.count(), 1, "no Demonstrate control on the page")
    assert.equal((await control.textContent()).trim(), "Demonstrate")
    // Available once it has been looked at (load, idle, in view). Then give an eager player every chance to start.
    await page.waitForFunction(() => { const b = document.querySelector(".doc-demo-controls button"); return b && !b.disabled }, null, { timeout: 10000 })
    for (let i = 0; i < 8; i++) {
      const { state, cycle } = await demoState(page, example)
      assert.ok(!["playing", "finished", "stopped"].includes(state) && cycle === null, `started by itself (${state}, cycle ${cycle})`)
      await page.waitForTimeout(250)
    }
    // Pressed, it plays; Stop hands it back and the control is Demonstrate again.
    await control.click()
    await page.waitForFunction((sel) => document.querySelector(sel)?.dataset.demoState === "playing", example, { timeout: 5000 })
    assert.equal((await control.textContent()).trim(), "Stop")
    await control.click()
    await page.waitForFunction((sel) => document.querySelector(sel)?.dataset.demoState === "stopped", example, { timeout: 2000 })
    assert.equal((await control.textContent()).trim(), "Demonstrate")
    assert.equal((await demoState(page, example)).state, "stopped")
    assert.deepEqual(errors, [])
  } finally { await page.close() }
}

// Docs pages, a few at a time (each is a full page; the laptop is small).
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const queue = [...items]
await Promise.all(Array.from({ length: 3 }, async () => {
  for (let item = queue.shift(); item; item = queue.shift()) {
    try { await one(context, item) } catch (error) { failures.push(`${item}: ${error.message.split("\n")[0]}`) }
  }
}))

// One run to the end: Demonstrate plays a single bounded pass and finishes by itself.
for (const item of only ? [] : ["toggle", "accordion", "tabs"]) {
  const page = await context.newPage()
  try {
    await page.goto(site.url(`/docs/${item}/`))
    await page.waitForFunction(() => { const b = document.querySelector(".doc-demo-controls button"); return b && !b.disabled }, null, { timeout: 10000 })
    await page.locator(".doc-demo-controls button").click()
    await page.waitForFunction((sel) => document.querySelector(sel)?.dataset.demoState === "finished", `[data-demo-item="${item}"]`, { timeout: 30000 })
    assert.equal((await page.locator(".doc-demo-controls button").textContent()).trim(), "Demonstrate")
  } catch (error) { failures.push(`${item} (to the end): ${error.message.split("\n")[0]}`) } finally { await page.close() }
}

// Keyboard, right to left, forced colours.
if (!only) {
  const page = await context.newPage()
  try {
    await page.goto(site.url("/docs/toggle/"))
    await page.waitForFunction(() => { const b = document.querySelector(".doc-demo-controls button"); return b && !b.disabled })
    const geometry = () => page.evaluate(() => { const r = document.querySelector(".doc-demo-controls button").getBoundingClientRect(); return { left: r.left, right: r.right, width: innerWidth, height: r.height } })
    const ltr = await geometry()
    assert.ok(ltr.height >= 40, "the control is too small to hit")
    await page.evaluate(() => { document.documentElement.dir = "rtl" })
    const rtl = await geometry()
    assert.ok(rtl.left >= 0 && rtl.right <= rtl.width && rtl.left < ltr.left, "the control should mirror to the other side and stay on screen")
    await page.evaluate(() => { document.documentElement.dir = "ltr" })
    // Keyboard: Tab to it, Space starts, Space again stops.
    await page.evaluate(() => document.querySelector(".doc-demo-controls button").focus())
    await page.keyboard.press("Space")
    await page.waitForFunction(() => document.querySelector('[data-demo-item="toggle"]').dataset.demoState === "playing", null, { timeout: 5000 })
    await page.keyboard.press("Space")
    await page.waitForFunction(() => document.querySelector('[data-demo-item="toggle"]').dataset.demoState === "stopped", null, { timeout: 2000 })
    // Forced colours: the label is painted in a system colour on the system canvas, never invisible.
    await page.emulateMedia({ forcedColors: "active" })
    const paint = await page.evaluate(() => { const b = document.querySelector(".doc-demo-controls button"); const s = getComputedStyle(b); return { color: s.color, background: s.backgroundColor, width: b.getBoundingClientRect().width } })
    assert.ok(paint.width > 0 && paint.color !== paint.background, `forced colours: ${paint.color} on ${paint.background}`)
  } catch (error) { failures.push(`control (keyboard, rtl, forced colours): ${error.message.split("\n")[0]}`) } finally { await page.close() }
}
await context.close()

// The landing's stage.
if (!only) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  await ctx.addInitScript((key) => { try { localStorage.setItem(key, "1") } catch {} }, "0db-overture-seen")
  const page = await ctx.newPage()
  try {
    await page.goto(site.url("/"))
    await page.locator(".pieces-stage").scrollIntoViewIfNeeded()
    await page.waitForSelector(".pieces-preview > *", { timeout: 15000 })
    // Move to a scripted piece by focusing its name (focus is how a keyboard reader picks).
    const name = scripted.includes("accordion") ? "accordion" : scripted[0]
    await page.locator(`a.pieces-name[href$="/docs/${name}/"]`).focus()
    const control = page.locator(".pieces-actions [data-demo-control]")
    await control.waitFor({ timeout: 5000 })
    await page.waitForFunction(() => { const b = document.querySelector(".pieces-actions [data-demo-control]"); return b && !b.disabled }, null, { timeout: 15000 })
    for (let i = 0; i < 8; i++) {
      const { state } = await demoState(page, ".pieces-preview")
      assert.ok(!["playing", "finished", "stopped"].includes(state), `the landing stage started by itself (${state})`)
      await page.waitForTimeout(250)
    }
    await control.click()
    await page.waitForFunction(() => document.querySelector(".pieces-preview")?.dataset.demoState === "playing", null, { timeout: 5000 })
    await control.click()
    await page.waitForFunction(() => document.querySelector(".pieces-preview")?.dataset.demoState === "stopped", null, { timeout: 2000 })
  } catch (error) { failures.push(`landing stage: ${error.message.split("\n")[0]}`) } finally { await ctx.close() }
}

await browser.close()
await site.close()
if (failures.length) { console.error(failures.map((f) => `- ${f}`).join("\n")); process.exit(1) }
console.log(`Demo player browser check passed: ${items.length} of ${scripted.length} scripted demos wait for Demonstrate, run, and stop on request${only ? "" : "; keyboard, right to left, forced colours and the landing stage hold"}.`)
