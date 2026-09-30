// A fresh Next app installs every item from a locally served registry, the way a
// consumer would, then builds and renders every example.
//   every item installs
//   server page renders every example
//   statement button and checked checkbox keep 0dB computed styles
// Slow and uses the network (npm install), so it runs apart from `npm run check`.
import { createServer } from "node:http"
import { readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync, existsSync, statSync, cpSync } from "node:fs"
import { execFileSync } from "node:child_process"
import path from "node:path"
import { chromium } from "playwright"
import { rewriteImports } from "./lib/items.mjs"

const here = process.cwd()
const app = path.resolve(".tmp/install-app")
const pkg = JSON.parse(readFileSync("package.json", "utf8"))
const v = (name) => pkg.dependencies[name] ?? pkg.devDependencies[name]
const put = (file, text) => { mkdirSync(path.dirname(path.join(app, file)), { recursive: true }); writeFileSync(path.join(app, file), typeof text === "string" ? text : JSON.stringify(text, null, 2) + "\n") }
const run = (cmd, args, cwd = app) => execFileSync(cmd, args, { cwd, stdio: "inherit", env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" } })
const failures = []

// The registry, served from public/ with the production base URL swapped for this server's.
const registry = createServer((req, res) => {
  const file = path.join(here, "public", new URL(req.url, "http://x").pathname)
  if (!file.startsWith(path.join(here, "public")) || !existsSync(file)) { res.writeHead(404).end(); return }
  res.writeHead(200, { "content-type": "application/json" }).end(readFileSync(file, "utf8").replaceAll("https://0db.cojeev.com", base))
}).listen(0)
const base = `http://localhost:${registry.address().port}`

rmSync(app, { recursive: true, force: true })
put("package.json", {
  name: "install-check", private: true, type: "module",
  scripts: { build: "next build" },
  dependencies: { next: v("next"), react: v("react"), "react-dom": v("react-dom") },
  devDependencies: {
    tailwindcss: v("tailwindcss"), "@tailwindcss/postcss": v("@tailwindcss/postcss"), typescript: v("typescript"),
    "@types/react": v("@types/react"), "@types/react-dom": v("@types/react-dom"), "@types/node": v("@types/node"),
  },
})
put("postcss.config.mjs", 'const config = { plugins: { "@tailwindcss/postcss": {} } }\n\nexport default config\n')
put("next.config.ts", 'import type { NextConfig } from "next"\n\nconst config: NextConfig = { output: "export", images: { unoptimized: true } }\n\nexport default config\n')
put("tsconfig.json", {
  compilerOptions: {
    target: "ES2022", lib: ["dom", "dom.iterable", "esnext"], strict: true, noEmit: true, skipLibCheck: true, esModuleInterop: true,
    module: "esnext", moduleResolution: "bundler", resolveJsonModule: true, isolatedModules: true, jsx: "react-jsx", incremental: true,
    plugins: [{ name: "next" }], paths: { "@/*": ["./*"] },
  },
  include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  exclude: ["node_modules"],
})
put("components.json", {
  $schema: "https://ui.shadcn.com/schema.json", style: "new-york", rsc: true, tsx: true,
  tailwind: { config: "", css: "app/globals.css", baseColor: "neutral", cssVariables: true, prefix: "" },
  aliases: { components: "@/components", utils: "@/lib/utils", ui: "@/components/ui", lib: "@/lib", hooks: "@/hooks" },
})
// A stock shadcn globals.css, with preflight and its own colours, which 0dB must survive.
put("app/globals.css", '@import "tailwindcss";\n\n:root {\n  --background: oklch(1 0 0);\n  --foreground: oklch(0.145 0 0);\n}\n\n@layer base {\n  body { background: var(--background); color: var(--foreground); }\n}\n')
put("app/layout.tsx", 'import "./globals.css"\n\nexport default function RootLayout({ children }: { children: React.ReactNode }) {\n  return <html lang="en"><body>{children}</body></html>\n}\n')

run("npm", ["install", "--no-audit", "--no-fund", "--loglevel=error"])

// every item installs
const items = JSON.parse(readFileSync("registry.json", "utf8")).items.map((i) => i.name)
try {
  run(process.execPath, [path.join(here, "node_modules/shadcn/dist/index.js"), "add", "--yes", "--overwrite", ...items.map((n) => `${base}/r/${n}.json`)])
} catch { failures.push("every item installs: shadcn add failed (output above)") }
for (const n of items.filter((n) => existsSync(`registry/0db/ui/${n}.tsx`)))
  if (!existsSync(path.join(app, `components/ui/${n}.tsx`))) failures.push(`every item installs: components/ui/${n}.tsx is missing`)

// server page renders every example: page.tsx has no "use client", so every item a
// Server Component imports must carry its own.
const examples = readdirSync("examples").filter((f) => f.endsWith(".tsx")).map((f) => path.basename(f, ".tsx"))
for (const n of examples) put(`examples/${n}.tsx`, rewriteImports(readFileSync(`examples/${n}.tsx`, "utf8")))
cpSync("components/site", path.join(app, "components/site"), { recursive: true })
const id = (n) => "X" + n.replace(/(^|-)([a-z0-9])/g, (_m, _d, c) => c.toUpperCase())
put("app/page.tsx",
  examples.map((n) => `import * as ${id(n)} from "@/examples/${n}"`).join("\n") +
  "\n\nconst all = [" + examples.map((n) => `["${n}", ${id(n)}]`).join(", ") + "] as const\n\n" +
  "export default function Page() {\n  return (\n    <main>\n      {all.map(([name, m]) => {\n        const States = \"States\" in m ? m.States : null\n" +
  "        return <section key={name} data-example={name}><m.default />{States ? <States /> : null}</section>\n      })}\n    </main>\n  )\n}\n")
try { run("npm", ["run", "build"]) } catch { failures.push("server page renders every example: next build failed (output above)") }

if (existsSync(path.join(app, "out/index.html"))) {
  const out = path.join(app, "out")
  const site = createServer((req, res) => {
    let file = path.join(out, new URL(req.url, "http://x").pathname)
    if (existsSync(file) && statSync(file).isDirectory()) file = path.join(file, "index.html")
    if (!file.startsWith(out) || !existsSync(file)) { res.writeHead(404).end(); return }
    const ext = path.extname(file)
    res.writeHead(200, { "content-type": { ".html": "text/html", ".js": "text/javascript", ".css": "text/css" }[ext] ?? "application/octet-stream" }).end(readFileSync(file))
  }).listen(0)
  const browser = await chromium.launch()
  const page = await browser.newPage()
  const errors = []
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()) })
  page.on("pageerror", (e) => errors.push(e.message))
  await page.goto(`http://localhost:${site.address().port}/`, { waitUntil: "networkidle" })
  for (const e of errors) failures.push(`server page renders every example: console error: ${e}`)
  const shown = await page.$$eval("[data-example]", (els) => els.map((e) => e.getAttribute("data-example")))
  for (const n of examples) if (!shown.includes(n)) failures.push(`server page renders every example: ${n} did not render`)

  // statement button and checked checkbox keep 0dB computed styles
  const styles = await page.evaluate(() => {
    const btn = document.querySelector('.db-btn[data-variant="statement"]')
    const span = document.querySelector(".db-check > input:checked + span")
    const s = (el) => el && getComputedStyle(el)
    return {
      btn: btn && { bg: s(btn).backgroundColor, color: s(btn).color, font: s(btn).fontFamily },
      check: span && { weight: s(span).fontWeight, color: s(span).color },
      body: getComputedStyle(document.body).backgroundColor,
    }
  })
  const want = (name, got, expected) => { if (got !== expected) failures.push(`statement button and checked checkbox keep 0dB computed styles: ${name} is ${got}, expected ${expected}`) }
  want("statement background", styles.btn?.bg, "rgb(0, 0, 0)")
  want("statement colour", styles.btn?.color, "rgb(242, 243, 240)")
  if (!/Archivo|0dB/i.test(styles.btn?.font ?? "")) failures.push(`statement button and checked checkbox keep 0dB computed styles: statement font is ${styles.btn?.font}`)
  want("checked weight", styles.check?.weight, "300")
  want("checked colour", styles.check?.color, "rgb(107, 108, 113)")
  want("body background", styles.body, "rgb(242, 243, 240)")
  await browser.close()
  site.close()
}

registry.close()
if (failures.length) { console.error(failures.join("\n")); process.exit(1) }
rmSync(app, { recursive: true, force: true })
console.log(`Install holds: ${items.length} items installed into a fresh Next app, ${examples.length} examples rendered.`)
