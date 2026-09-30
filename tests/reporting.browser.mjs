import assert from "node:assert/strict"
import { build } from "esbuild"
import { chromium } from "playwright"

// A helper check on the existing site. No new server, mounted UI or provider calls.
const compiled = await build({
  stdin: {
    contents: "export * from './lib/reporting/draft.ts'; export * from './lib/reporting/diagnostics.ts'",
    resolveDir: process.cwd(),
  },
  bundle: true, write: false, format: "iife", globalName: "reportingHelpers", platform: "browser",
  define: { "process.env.NEXT_PUBLIC_RELEASE_SHA": '"development"' },
})
const browser = await chromium.launch()
try {
  const context = await browser.newContext()
  const page = await context.newPage()
  const failures = []
  page.on("pageerror", error => failures.push(error.message))
  const response = await page.goto("http://localhost:3000/docs/button/", { waitUntil: "networkidle" })
  assert.equal(response.status(), 200)
  await page.addScriptTag({ content: compiled.outputFiles[0].text })
  const result = await page.evaluate(async () => {
    const h = window.reportingHelpers
    await h.deleteDraft()
    const originalNow = Date.now
    let time = originalNow()
    Date.now = () => time
    try {
      const draft = { ...h.emptyDraft(), kind: "bug", files: [{ id: crypto.randomUUID(), file: new File(["private"], "private.png", { type: "image/png" }) }], frozen: { report: { id: crypto.randomUUID() }, token: "private-token" } }
      await h.saveDraftWorkspace({ activeKind: "bug", drafts: { bug: draft } })
      const restored = await h.loadDraftWorkspace()
      const fileText = await restored.drafts.bug.files[0].file.text()
      time += h.DRAFT_TTL_MS
      const expired = await h.loadDraftWorkspace()
      const nativeFetch = window.fetch
      const nativeWarn = console.warn
      const untouched = h.snapshotDiagnostics().console.length === 0 && window.fetch === nativeFetch
      const stop = h.startDiagnostics()
      console.warn("reporting test token=private-token person@example.com")
      const snapshot = h.snapshotDiagnostics()
      stop()
      const stopped = window.fetch === nativeFetch && console.warn === nativeWarn && h.snapshotDiagnostics().console.length === 0
      return { fileText, token: restored.drafts.bug.frozen.token, expired, untouched, stopped, message: snapshot.console[0].message, theme: snapshot.environment.theme }
    } finally {
      Date.now = originalNow
      await h.deleteDraft()
    }
  })
  assert.equal(result.fileText, "private")
  assert.equal(result.token, "private-token")
  assert.equal(result.expired, null)
  assert.ok(result.untouched && result.stopped)
  assert.ok(!result.message.includes("private-token") && !result.message.includes("person@example.com"))
  assert.ok(["day", "nocturne"].includes(result.theme))
  assert.deepEqual(failures, [])
  console.log("Reporting browser check passed: real IndexedDB files/retry identity, expiry, explicit diagnostics capture and cleanup.")
  await context.close()
} finally { await browser.close() }
