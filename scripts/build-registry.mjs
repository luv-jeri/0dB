// Builds registry.json from content/*.ts and registry/0db, runs `shadcn build`,
// then rewrites imports in the payloads to the consumer's aliases.
//   node --import tsx scripts/build-registry.mjs          build
//   node --import tsx scripts/build-registry.mjs --check  exit 1 if the committed output is stale
import { readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync, copyFileSync, renameSync, existsSync } from "node:fs"
import { execFileSync } from "node:child_process"
import path from "node:path"
import { createHash } from "node:crypto"
import ts from "typescript"
import { transform } from "lightningcss"
import { readItems, rewriteImports, SOURCE } from "./lib/items.mjs"
import { buildAiKit, writeAiKit, checkAiKit } from "./lib/ai-kit.mjs"

const check = process.argv.includes("--check")
const baseURL = (process.env.DB_REGISTRY_URL ?? "https://0db.cojeev.com").replace(/\/$/, "")
const url = (name) => `${baseURL}/r/${name}.json`
const style = (name) => ({ path: `${SOURCE}/styles/${name}.css`, type: "registry:file", target: `styles/0db/${name}.css` })
// Relative to app/globals.css: Tailwind inlines @import with its own resolver, which knows no tsconfig alias.
const imports = (...names) => Object.fromEntries(names.map((n) => [`@import "../styles/0db/${n}.css"`, {}]))

// Tailwind theme and shadcn aliases come from theme.css, so the docs and installs agree.
const theme = readFileSync(`${SOURCE}/styles/theme.css`, "utf8")
const block = (re) => Object.fromEntries([...theme.match(re)[1].matchAll(/--([a-z0-9-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]))
const themeVars = block(/@theme inline \{([^}]*)\}/)
const aliases = Object.fromEntries(Object.entries(block(/:root \{([^}]*)\}/)).map(([k, v]) => [`--${k}`, v]))
const variant = theme.match(/@custom-variant dark ([^;]+);/)[1]

const base = {
  name: "0db",
  type: "registry:base",
  extends: "none",
  title: "0dB",
  description: "0dB tokens, the default font pair, the reset and the base pieces, with a Tailwind v4 theme bridge.",
  dependencies: ["clsx", "tailwind-merge"],
  config: { registries: { "@0db": `${baseURL}/r/{name}.json` } },
  files: [
    { path: `${SOURCE}/lib/utils.ts`, type: "registry:lib", target: "lib/utils.ts" },
    ...readdirSync(`${SOURCE}/lib`).filter((f) => f.endsWith(".ts") && f !== "utils.ts").sort()
      .map((f) => ({ path: `${SOURCE}/lib/${f}`, type: "registry:lib", target: `lib/0db/${f}` })),
    style("tokens"), style("fonts"), style("base"),
    { path: "FONT-NOTICES.md", type: "registry:file", target: "styles/0db/FONT-NOTICES.md" },
    { path: "LICENCE", type: "registry:file", target: "styles/0db/LICENCE-0db.md" },
  ],
  cssVars: { theme: themeVars },
  css: {
    ...imports("tokens", "fonts", "base"),
    [`@custom-variant dark ${variant}`]: {},
    ":root, :root[data-mode]": aliases,
  },
}

const pairs = [["press", "Schibsted Grotesk and Newsreader"], ["paris", "Instrument Sans and EB Garamond"], ["salon", "Bricolage Grotesque and Cormorant"]].map(([pair, faces]) => ({
  name: `fonts-${pair}`,
  type: "registry:item",
  title: `Pair: ${pair}`,
  description: `${faces}, for <html data-pair="${pair}">.`,
  registryDependencies: [url("0db")],
  files: [style(`fonts-${pair}`)],
  css: imports(`fonts-${pair}`),
}))

const metas = await readItems()
const items = metas.map((m) => ({
  name: m.name,
  type: "registry:ui",
  title: m.title,
  description: m.summary,
  registryDependencies: [url("0db"), ...m.siblings.map(url)],
  ...(m.npm.length ? { dependencies: m.npm } : {}),
  files: [{ path: m.ui, type: "registry:ui" }, ...(m.css ? [style(m.name)] : [])],
  ...(m.css ? { css: imports(m.name) } : {}),
  meta: { movement: m.movement, underneath: m.underneath, contract: m.contract },
}))

const kit = buildAiKit({ items: metas, baseURL })
const registry = { $schema: "https://ui.shadcn.com/schema/registry.json", name: "0db", homepage: baseURL, items: [base, ...pairs, ...items, kit.item] }
const out = check ? ".tmp/registry-check" : "."
mkdirSync(out, { recursive: true })
writeAiKit(kit, out)
// Check mode builds from fresh staged kit files without modifying the committed copies.
const buildInput = check ? { ...registry, items: registry.items.map((item) => item.name === "ai"
  ? { ...item, files: item.files.map((file) => ({ ...file, path: `${out}/${file.path}` })) }
  : item) } : registry
writeFileSync(`${out}/registry.json`, JSON.stringify(buildInput, null, 2) + "\n")

// Each route gets its own sidecars in specimen order, including transitive
// dependencies and the pieces its examples use. Registry payloads stay portable.
const byName = new Map(metas.map((m) => [m.name, m]))
function collectStyles(files) {
  const names = new Set()
  const seen = new Set()
  function item(name) {
    if (names.has(name)) return
    const meta = byName.get(name)
    if (!meta) return
    names.add(name)
    meta.siblings.forEach(item)
  }
  function visit(file) {
    if (["app/docs/[item]/examples.tsx", "components/site/registry-styles.tsx"].includes(file)) return
    if (seen.has(file)) return
    seen.add(file)
    const source = ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, false, ts.ScriptKind.TSX)
    function walk(node) {
      const spec = ts.isImportDeclaration(node) || ts.isExportDeclaration(node) ? node.moduleSpecifier
        : ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword ? node.arguments[0] : undefined
      if (spec && ts.isStringLiteralLike(spec)) {
        const value = spec.text
        if (value.startsWith("@/registry/0db/ui/")) item(value.slice("@/registry/0db/ui/".length))
        else if (value.startsWith("@/components/") || value.startsWith("@/examples/") || value.startsWith(".")) {
          const base = value.startsWith("@/") ? value.slice(2) : path.join(path.dirname(file), value)
          const target = [base, `${base}.tsx`, `${base}.ts`].find((f) => /\.tsx?$/.test(f) && existsSync(f))
          if (target) visit(target)
        }
      }
      ts.forEachChild(node, walk)
    }
    walk(source)
  }
  files.forEach(visit)
  return names
}
const registryCSS = "/* Generated by scripts/build-registry.mjs: every item sidecar, in the specimen's cascade order. */\n" +
  metas.filter((m) => m.css).map((m) => `@import "../${m.css}";`).join("\n") + "\n"
const routeSheets = new Map()
const routeHrefs = {}
function routeStyle(route, files) {
  const names = collectStyles(files)
  const css = metas.filter((m) => m.css && names.has(m.name)).map((m) => readFileSync(m.css, "utf8")).join("\n")
  const minified = transform({ filename: "registry.css", code: Buffer.from(css), minify: true }).code.toString()
  const hash = createHash("sha256").update(minified).digest("hex").slice(0, 12)
  const file = `${hash}.css`
  routeSheets.set(file, minified)
  routeHrefs[route] = `/site-styles/${file}`
}
const pages = readdirSync("app", { recursive: true }).filter((f) => /(?:^|\/)page\.tsx$/.test(f) && !f.includes("["))
for (const page of pages) {
  const parts = page.split("/").slice(0, -1)
  const layouts = Array.from({ length: parts.length + 1 }, (_, i) => path.join("app", ...parts.slice(0, i), "layout.tsx")).filter(existsSync)
  routeStyle("/" + parts.join("/"), [...layouts, `app/${page}`])
}
routeStyle("/404", ["app/layout.tsx", ...["app/not-found.tsx", "app/global-not-found.tsx"].filter(existsSync)])
for (const m of metas) routeStyle(`/docs/${m.name}`, ["app/layout.tsx", "app/docs/layout.tsx", "app/docs/[item]/page.tsx", m.ui, `examples/${m.name}.tsx`])
const stylesTS = '"use client"\n\n// Generated by scripts/build-registry.mjs. React hoists this SSR stylesheet and\n// waits for it on navigation; no effect, unstyled frame or client-only CSS load.\nimport { usePathname } from "next/navigation"\n\nconst sheets: Record<string, string> = ' + JSON.stringify(routeHrefs, null, 2) +
  '\n\nexport function RegistryStyles() {\n  const path = usePathname().replace(/\\/$/, "") || "/"\n  return <link rel="stylesheet" href={sheets[path] ?? sheets["/404"]} precedence="registry" />\n}\n'

// Metadata is cheap; examples belong to the item being read, never the catalogue.
const id = (name) => name.replace(/-(.)/g, (_m, c) => c.toUpperCase()).replace(/^(\d)/, "_$1")
const hasStates = (m) => /export\s+(?:function|const)\s+States\b/.test(readFileSync(`examples/${m.name}.tsx`, "utf8"))
const entriesTS = "// Generated by scripts/build-registry.mjs. Every item's docs meta, in registry order.\n" +
  metas.map((m) => `import ${id(m.name)}Meta from "@/content/${m.name}"`).join("\n") +
  "\n\nexport const entries = [\n" + metas.map((m) => `  { meta: ${id(m.name)}Meta, hasStates: ${hasStates(m)}, siblings: ${JSON.stringify(m.siblings)}, npm: ${JSON.stringify(m.npm)} },`).join("\n") + "\n]\n"
const examplesTS = '"use client"\n\n// Generated by scripts/build-registry.mjs. SSR stays intact; only this item hydrates.\nimport dynamic from "next/dynamic"\nimport type { ComponentType } from "react"\n\nconst examples: Record<string, { Example: ComponentType; States?: ComponentType }> = {\n' +
  metas.map((m) => `  "${m.name}": { Example: dynamic(() => import("@/examples/${m.name}"))${hasStates(m) ? `, States: dynamic(() => import("@/examples/${m.name}").then((m) => m.States))` : ""} },`).join("\n") +
  '\n}\n\nexport function ItemExample({ item, states = false }: { item: string; states?: boolean }) {\n  const Component = states ? examples[item]?.States : examples[item]?.Example\n  return Component ? <Component /> : null\n}\n'

// Build beside public/r and swap it in at the end, so the dev server never sees the folder missing.
const payloads = check ? `${out}/r` : ".tmp/r-build"
rmSync(payloads, { recursive: true, force: true })
execFileSync(process.execPath, ["node_modules/shadcn/dist/index.js", "build", `${out}/registry.json`, "-o", payloads], { stdio: check ? "pipe" : "inherit" })
// Keep source paths canonical in the public item and index, including in check mode.
writeFileSync(`${out}/registry.json`, JSON.stringify(registry, null, 2) + "\n")
copyFileSync(`${out}/registry.json`, path.join(payloads, "registry.json"))
for (const file of readdirSync(payloads).filter((f) => f.endsWith(".json"))) {
  const data = JSON.parse(readFileSync(path.join(payloads, file), "utf8"))
  if (check && data.name === "ai") for (const f of data.files ?? []) f.path = f.path.slice(out.length + 1)
  for (const f of data.files ?? []) if (f.content && /\.tsx?$/.test(f.path)) f.content = rewriteImports(f.content)
  writeFileSync(path.join(payloads, file), JSON.stringify(data, null, 2) + "\n")
}
if (!check) { rmSync("public/r", { recursive: true, force: true }); renameSync(payloads, "public/r") }

if (check) {
  const stale = checkAiKit(kit)
  const same = (a, b) => { try { return readFileSync(a, "utf8") === readFileSync(b, "utf8") } catch { return false } }
  if (!same(`${out}/registry.json`, "registry.json")) stale.push("registry.json")
  if (readFileSync("app/registry.css", "utf8") !== registryCSS) stale.push("app/registry.css")
  if (readFileSync("lib/site/entries.ts", "utf8") !== entriesTS) stale.push("lib/site/entries.ts")
  for (const [file, source] of [["components/site/registry-styles.tsx", stylesTS], ["app/docs/[item]/examples.tsx", examplesTS]]) {
    if (!existsSync(file) || readFileSync(file, "utf8") !== source) stale.push(file)
  }
  for (const [file, source] of routeSheets) {
    if (!existsSync(`public/site-styles/${file}`) || readFileSync(`public/site-styles/${file}`, "utf8") !== source) stale.push(`public/site-styles/${file}`)
  }
  const built = readdirSync(payloads).sort()
  const committed = readdirSync("public/r").sort()
  if (built.join() !== committed.join()) stale.push("public/r (file list)")
  for (const f of built) if (!same(path.join(payloads, f), path.join("public/r", f))) stale.push(`public/r/${f}`)
  if (!same(path.join(payloads, "registry.json"), "public/registry.json")) stale.push("public/registry.json")
  rmSync(out, { recursive: true, force: true })
  if (stale.length) {
    console.error(`Registry output is stale. Run npm run registry:build.\n  ${stale.join("\n  ")}`)
    process.exit(1)
  }
  console.log(`Registry is current: ${registry.items.length} items.`)
} else {
  writeFileSync("app/registry.css", registryCSS)
  mkdirSync("lib/site", { recursive: true })
  writeFileSync("lib/site/entries.ts", entriesTS)
  mkdirSync("public/site-styles", { recursive: true })
  for (const file of readdirSync("public/site-styles")) if (/^[a-f0-9]{12}\.css$/.test(file) && !routeSheets.has(file)) rmSync(`public/site-styles/${file}`)
  for (const [file, source] of routeSheets) writeFileSync(`public/site-styles/${file}`, source)
  writeFileSync("components/site/registry-styles.tsx", stylesTS)
  rmSync("app/docs/[item]/styles.ts", { force: true })
  writeFileSync("app/docs/[item]/examples.tsx", examplesTS)
  copyFileSync("public/r/registry.json", "public/registry.json")
  console.log(`Registry built: ${registry.items.length} items (${items.length} components).`)
}
