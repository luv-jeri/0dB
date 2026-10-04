import assert from "node:assert/strict"
import { createServer } from "node:http"
import { readFileSync } from "node:fs"
import { build } from "esbuild"
import { chromium } from "playwright"
import { createElement } from "react"
import { renderToString } from "react-dom/server"
import { tsImport } from "tsx/esm/api"

/** Isolated behavior checks load only the component supplied by their own PR. */
export async function withComponent(name, check) {
  const options = { bundle: true, write: false, format: "iife", platform: "browser", jsx: "automatic", define: { "process.env.NODE_ENV": '"production"' } }
  const bundle = await build({ ...options, entryPoints: [`tests/fixtures/${name}.tsx`] })
  let hydrationBundle, prerenderedAudio, failedAudio, recording
  if (name === "audio-player") {
    hydrationBundle = await build({ ...options, entryPoints: ["tests/fixtures/audio-hydration.tsx"] })
    const { AudioPlayer } = await tsImport("../registry/0db/ui/audio-player.tsx", import.meta.url)
    prerenderedAudio = renderToString(createElement(AudioPlayer, { src: "/one.wav", label: "Preloaded reading" }))
    failedAudio = renderToString(createElement(AudioPlayer, { src: "/missing.wav", label: "Unavailable reading" }))
    recording = readFileSync("public/audio/studio-reading.wav")
  }
  const css = ["tokens", "base", ...(name === "text-search" ? ["field"] : []), name].map((item) => readFileSync(`registry/0db/styles/${item}.css`, "utf8")).join("\n")
  const html = (body) => `<html><head><style>${css}</style></head><body>${body}</body></html>`
  let restored = false
  const server = createServer((req, res) => {
    if (req.url === "/missing.wav" && !restored) res.writeHead(404).end()
    else if (recording && req.url.endsWith(".wav")) {
      const range = req.headers.range?.match(/^bytes=(\d+)-(\d*)$/)
      const start = range ? Number(range[1]) : 0
      const end = range?.[2] ? Math.min(recording.length - 1, Number(range[2])) : recording.length - 1
      res.writeHead(range ? 206 : 200, { "content-type": "audio/wav", "content-length": end - start + 1, "accept-ranges": "bytes", ...(range ? { "content-range": `bytes ${start}-${end}/${recording.length}` } : {}) }).end(recording.subarray(start, end + 1))
    }
    else if (req.url === "/bundle.js") res.writeHead(200, { "content-type": "text/javascript" }).end(bundle.outputFiles[0].contents)
    else if (hydrationBundle && req.url === "/hydration-bundle.js") res.writeHead(200, { "content-type": "text/javascript" }).end(hydrationBundle.outputFiles[0].contents)
    else if (prerenderedAudio && req.url === "/hydration") res.writeHead(200, { "content-type": "text/html" }).end(html(`<main id="hydrated-audio">${prerenderedAudio}</main>`))
    else if (failedAudio && req.url === "/hydration-error") res.writeHead(200, { "content-type": "text/html" }).end(html(`<main id="hydrated-audio">${failedAudio}</main>`))
    else res.writeHead(200, { "content-type": "text/html" }).end(html('<main id="fixture"></main><script src="/bundle.js"></script>'))
  })
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve))
  const browser = await chromium.launch()
  const page = await browser.newPage({ reducedMotion: "reduce", viewport: { width: 375, height: 900 } })
  const errors = []
  page.on("pageerror", (error) => errors.push(error.message))
  const base = `http://127.0.0.1:${server.address().port}`
  try {
    await page.goto(base)
    await page.waitForFunction(() => document.getElementById("fixture").children.length > 0)
    await check({ page, base, restoreAudio: () => { restored = true }, read: (selector) => page.locator(selector).innerText(), settle: (predicate) => page.waitForFunction(predicate) })
    assert.deepEqual(errors, [])
    console.log(`${name}: isolated behavior and recovery checks pass.`)
  } finally { await browser.close(); await new Promise((resolve) => server.close(resolve)) }
}
