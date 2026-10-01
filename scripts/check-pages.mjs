import { fixtureReportingReads } from "./lib/reporting-fixture.mjs"
import { sitePath, siteRoute } from "../lib/site/config.mjs"
// Opens every page of the static export in Chromium.
//   no console errors on any page at 375 and 1440
//   no sideways overflow
//   rtl slider page has no overflow
//   reduced motion collapses tempo
//   stored nocturne applies before paint
// Needs `npm run build` first. /specimen/ is skipped: it's the original page, copied as it is.
import { createServer } from "node:http"
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs"
import path from "node:path"
import { chromium } from "playwright"

const root = path.resolve("out")
if (!existsSync(root)) { console.error("No out/. Run npm run build first."); process.exit(1) }

const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".woff2": "font/woff2", ".svg": "image/svg+xml", ".txt": "text/plain" }
const server = createServer((req, res) => {
  let file = path.join(root, siteRoute(decodeURIComponent(new URL(req.url, "http://x").pathname)))
  if (!file.startsWith(root)) { res.writeHead(403).end(); return }
  if (existsSync(file) && statSync(file).isDirectory()) file = path.join(file, "index.html")
  if (!existsSync(file)) { res.writeHead(404, { "content-type": "text/html" }).end(readFileSync(path.join(root, "404.html"))); return }
  res.writeHead(200, { "content-type": types[path.extname(file)] ?? "application/octet-stream" }).end(readFileSync(file))
}).listen(0)
const base = `http://localhost:${server.address().port}`

const pages = []
const walk = (dir) => { for (const f of readdirSync(dir)) {
  const p = path.join(dir, f)
  if (statSync(p).isDirectory()) { if (f !== "specimen" && f !== "_next" && f !== "r") walk(p) }
  else if (f === "index.html") pages.push("/" + path.relative(root, dir).split(path.sep).join("/") + (dir === root ? "" : "/"))
} }
walk(root)

const failures = []
const browser = await chromium.launch()

for (const width of [375, 1440]) {
  const context = await browser.newContext({ viewport: { width, height: 900 } })
  await fixtureReportingReads(context)
  const page = await context.newPage()
  let errors = []
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()) })
  page.on("pageerror", (e) => errors.push(e.message))
  for (const url of pages) {
    errors = []
    await page.goto(base + sitePath(url), { waitUntil: "networkidle" })
    for (const e of errors) failures.push(`no console errors on any page at 375 and 1440: ${url} @${width}: ${e}`)
    const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    if (over > 1) failures.push(`no sideways overflow: ${url} @${width} overflows by ${over}px`)
  }
  await context.close()
}

{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.goto(`${base}${sitePath("/docs/slider/")}`)
  const over = await page.evaluate(() => { document.documentElement.dir = "rtl"; return document.documentElement.scrollWidth - document.documentElement.clientWidth })
  if (over > 1) failures.push(`rtl slider page has no overflow: overflows by ${over}px`)
  await page.close()
}

{
  const page = await browser.newPage()
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto(`${base}${sitePath("/")}`)
  const andante = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--db-andante").trim())
  if (andante !== "1ms") failures.push(`reduced motion collapses tempo: --db-andante is "${andante}"`)
  await page.close()
}

{
  const context = await browser.newContext()
  await context.addInitScript((docsPath) => {
    if (location.pathname === docsPath) localStorage.setItem("0db-theme", JSON.stringify({ mode: "nocturne" }))
    // Record the mode the moment <body> is created, before anything in it can paint.
    new MutationObserver((_, obs) => {
      if (document.body) { window.__modeAtBody = document.documentElement.dataset.mode ?? "day"; obs.disconnect() }
    }).observe(document, { childList: true, subtree: true })
  }, sitePath("/docs/"))
  const page = await context.newPage()
  await page.goto(`${base}${sitePath("/docs/")}`)
  await page.goto(`${base}${sitePath("/docs/button/")}`)
  const mode = await page.evaluate(() => window.__modeAtBody)
  if (mode !== "nocturne") failures.push(`stored nocturne applies before paint: <html data-mode> was "${mode}" when <body> began`)
  await context.close()
}

await browser.close()
server.close()
if (failures.length) { console.error(failures.join("\n")); process.exit(1) }
console.log(`Pages hold: ${pages.length} pages at 375 and 1440, rtl, reduced motion, nocturne before paint.`)
