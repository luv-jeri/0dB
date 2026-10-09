// The sign previews in docs/icons-preview, taken from the running dev server (npm run dev, port 3917):
//   node scripts/capture-signs.mjs [base]
// Contact sheets of every sign, and the sign docs page at 1440 and 375 by day and in Nocturne, with the catalogue
// once more right to left, filtered to the arrows so the mirrored ones show. Each shot waits 1.5s after load, so
// pretext has relaid every sign with the real faces. The 24px sheets are taken at 2x, as most screens show them.
import { chromium } from "playwright"
import { mkdirSync } from "node:fs"

const BASE = process.argv[2] ?? "http://localhost:3917/ui"
const OUT = "docs/icons-preview"

const sheets = [
  ["all-signs-24", "all-24", "day", 2],
  ["all-signs-24-nocturne", "all-24", "nocturne", 2],
  ["all-signs-120-words", "words-120", "day", 1],
  ["all-signs-120-fill", "fill-120", "day", 1],
  ["all-signs-120-dots", "dots-120", "day", 1],
]
const pages = [
  ["signs-1440", 1440, 900, "day"],
  ["signs-1440-nocturne", 1440, 900, "nocturne"],
  ["signs-375", 375, 812, "day"],
  ["signs-375-nocturne", 375, 812, "nocturne"],
]

mkdirSync(OUT, { recursive: true })
const browser = await chromium.launch()
try {
  const open = async (mode, viewport, scale = 1) => {
    const context = await browser.newContext({ viewport, deviceScaleFactor: scale })
    await context.addInitScript((m) => { try { localStorage.setItem("0db-theme", JSON.stringify({ mode: m })) } catch {} }, mode)
    return context
  }
  for (const [name, set, mode, scale] of sheets) {
    const context = await open(mode, { width: 1440, height: 900 }, scale)
    const page = await context.newPage()
    await page.goto(`${BASE}/lab/signs/?set=${set}`, { waitUntil: "networkidle" })
    await page.waitForTimeout(1500)
    await page.locator(".lab-signs").screenshot({ path: `${OUT}/${name}.png` })
    await context.close()
    console.log(`${OUT}/${name}.png`)
  }
  for (const [name, width, height, mode] of pages) {
    const context = await open(mode, { width, height }, 2)
    const page = await context.newPage()
    await page.goto(`${BASE}/docs/sign/`, { waitUntil: "networkidle" })
    await page.waitForTimeout(1500)
    await page.screenshot({ path: `${OUT}/${name}.png` })
    const catalogue = async () => {
      // On a phone the controls fill the screen, so the shot starts at the install line above the grid.
      await page.evaluate((at) => document.querySelector(at)?.scrollIntoView({ block: "start" }), width < 600 ? ".doc-signs-picked" : "#signs")
      await page.waitForTimeout(1500)
    }
    await catalogue()
    await page.screenshot({ path: `${OUT}/${name}-catalogue.png` })
    if (mode === "day") {
      await page.locator(".doc-signs-find input").fill("arrow")
      await page.evaluate(() => { document.documentElement.dir = "rtl" })
      await catalogue()
      await page.screenshot({ path: `${OUT}/${name}-rtl-catalogue.png` })
    }
    await context.close()
    console.log(`${OUT}/${name}.png`)
  }
} finally {
  await browser.close()
}
