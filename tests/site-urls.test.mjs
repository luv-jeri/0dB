import { test } from "node:test"
import assert from "node:assert/strict"
import { SITE_URL, SITE_ORIGIN, SITE_BASE_PATH, sitePath, siteRoute, siteURL, registryURL } from "../lib/site/config.mjs"
import { consumerExampleSource } from "../lib/site/example-source.ts"
import { packageHeaders, siteFonts } from "../scripts/lib/site-assets.mjs"

test("deployment paths, public URLs, fonts and headers share the canonical base", () => {
  assert.equal(SITE_ORIGIN + SITE_BASE_PATH, SITE_URL)
  assert.equal(sitePath("/docs/button/"), new URL(siteURL("/docs/button/")).pathname)
  assert.equal(siteRoute(sitePath("/docs/button/")), "/docs/button/")
  assert.equal(siteRoute(`${SITE_BASE_PATH}-other/docs/button/`), `${SITE_BASE_PATH}-other/docs/button/`)
  assert.equal(packageHeaders("/*\n  X-Test: self\n/r/*\n  Access-Control-Allow-Origin: *\n"), `${sitePath("/*")}\n  X-Test: self\n${sitePath("/r/*")}\n  Access-Control-Allow-Origin: *\n`)
  const fonts = siteFonts()
  assert.equal(fonts.files.size, 8)
  for (const file of fonts.files.keys()) assert(fonts.css.includes(sitePath(`/fonts/${file}`)))
})

test("copied examples inline registry URLs without importing site-only helpers", () => {
  const source = 'import { registryURL } from "@/lib/site/config.mjs"\nconst ADD = `shadcn@latest add ${registryURL("button")}`\n'
  assert.equal(consumerExampleSource(source), `const ADD = \`shadcn@latest add ${registryURL("button")}\`\n`)
  const media = 'import { sitePath } from "@/lib/site/config.mjs"\nconst src = sitePath("/audio/studio-reading.wav")\n'
  assert.equal(consumerExampleSource(media), `const src = ${JSON.stringify(siteURL("/audio/studio-reading.wav"))}\n`)
})
