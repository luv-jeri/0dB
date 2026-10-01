import { siteRoute } from "../lib/site/config.mjs"
// Isolated consumer installs from built public/r payloads. Repository sources,
// examples and node_modules are never available to the consumer typechecker.
//   npm run -s check:install -- --only button,dropzone,tiling
import { createServer } from "node:http"
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, rmSync, existsSync, cpSync, constants } from "node:fs"
import { spawn } from "node:child_process"
import { tmpdir } from "node:os"
import { fileURLToPath, pathToFileURL } from "node:url"
import path from "node:path"

const here = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const put = (root, file, value) => {
  const target = path.join(root, file)
  mkdirSync(path.dirname(target), { recursive: true })
  writeFileSync(target, typeof value === "string" ? value : JSON.stringify(value, null, 2) + "\n")
}

export function readRegistry(root) {
  const index = JSON.parse(readFileSync(path.join(root, "public/r/registry.json"), "utf8"))
  return new Map(index.items.map(({ name }) => {
    const item = JSON.parse(readFileSync(path.join(root, `public/r/${name}.json`), "utf8"))
    if (item.name !== name) throw new Error(`Registry payload name mismatch: ${name}`)
    return [name, item]
  }))
}

// Resolve dependencies against the local snapshot, never the deployed registry.
export function dependencyName(address, registry) {
  const name = /^https?:\/\//.test(address)
    ? siteRoute(new URL(address).pathname).match(/^\/r\/([^/]+)\.json$/)?.[1]
    : address.replace(/^@0db\//, "")
  if (!name || !registry.has(name)) throw new Error(`Missing local registry dependency: ${address}`)
  return name
}

export function closureFor(name, registry) {
  const found = new Map()
  const visit = (name) => {
    if (found.has(name)) return
    const item = registry.get(name)
    if (!item) throw new Error(`Unknown registry item: ${name}`)
    found.set(name, item)
    for (const dep of item.registryDependencies ?? []) visit(dependencyName(dep, registry))
  }
  visit(name)
  return [...found.values()]
}

export function selectItems(args, registry) {
  if (!args.length) return [...registry.keys()]
  if (args.length !== 2 || args[0] !== "--only" || !args[1].trim())
    throw new Error("Usage: npm run check:install -- [--only a,b]")
  const names = [...new Set(args[1].split(",").map((name) => name.trim()))]
  for (const name of names) if (!registry.has(name)) throw new Error(`Unknown registry item: ${name}`)
  return names
}

export function checkPlan(names, registry, only = false) {
  // Quick runs exercise both layouts for each requested item. Full runs cover
  // all root items and five src items, including CSS and dynamic npm imports.
  const sample = ["button", "dropzone", "tiling", "contour", "text-ribbon"]
  const src = only ? [...names] : sample.filter((name) => names.includes(name))
  if (!only) for (const name of names) if (src.length < Math.min(5, names.length) && !src.includes(name)) src.push(name)
  if (!only && !src.some((name) => closureFor(name, registry).some((item) => Object.keys(item.css ?? {}).some((key) => key.startsWith("@import")))))
    throw new Error("The src/app sample must include an item with CSS imports")
  return [...names.map((name) => ({ name, layout: "root" })), ...src.map((name) => ({ name, layout: "src" }))]
}

export function npmClosure(items) {
  const collect = (key) => [...new Set(items.flatMap((item) => item[key] ?? []))].sort()
  return { dependencies: collect("dependencies"), devDependencies: collect("devDependencies") }
}

export function createConsumer(app, layout) {
  const prefix = layout === "src" ? "src/" : ""
  put(app, "tsconfig.json", {
    compilerOptions: {
      target: "ES2022", lib: ["dom", "dom.iterable", "esnext"], strict: true, noEmit: true,
      skipLibCheck: true, esModuleInterop: true, module: "esnext", moduleResolution: "bundler",
      resolveJsonModule: true, isolatedModules: true, jsx: "react-jsx", incremental: false,
      plugins: [{ name: "next" }], paths: { "@/*": [`./${prefix}*`] },
    },
    include: ["**/*.ts", "**/*.tsx"], exclude: ["node_modules"],
  })
  put(app, "components.json", {
    $schema: "https://ui.shadcn.com/schema.json", style: "new-york", rsc: true, tsx: true,
    tailwind: { config: "", css: `${prefix}app/globals.css`, baseColor: "neutral", cssVariables: true, prefix: "" },
    aliases: { components: "@/components", utils: "@/lib/utils", ui: "@/components/ui", lib: "@/lib", hooks: "@/hooks" },
  })
  put(app, "postcss.config.mjs", 'export default { plugins: { "@tailwindcss/postcss": {} } }\n')
  put(app, "next-env.d.ts", '/// <reference types="next" />\n/// <reference types="next/image-types/global" />\n')
  put(app, `${prefix}app/globals.css`, '@import "tailwindcss";\n\n:root {\n  --background: oklch(1 0 0);\n  --foreground: oklch(0.145 0 0);\n}\n')
  put(app, `${prefix}app/layout.tsx`, 'import "./globals.css"\n\nexport default function RootLayout({ children }: { children: React.ReactNode }) {\n  return <html lang="en"><body>{children}</body></html>\n}\n')
  put(app, `${prefix}app/page.tsx`, 'export default function Page() {\n  return <main>Install check</main>\n}\n')
}

export function installedTarget(file, layout) {
  if (file.target?.startsWith("~/")) return file.target.slice(2)
  const folders = { "registry:ui": "components/ui", "registry:lib": "lib", "registry:hook": "hooks", "registry:component": "components" }
  const target = file.target ?? (folders[file.type] && `${folders[file.type]}/${path.basename(file.path)}`)
  if (!target || path.isAbsolute(target) || target.split(/[\\/]/).includes(".."))
    throw new Error(`Unsupported installed target: ${file.path}`)
  return `${layout === "src" ? "src/" : ""}${target}`
}

export function verifyInstall(app, layout, items) {
  for (const item of items) for (const file of item.files ?? []) {
    const target = installedTarget(file, layout)
    if (!existsSync(path.join(app, target))) throw new Error(`Missing installed file: ${target} (${item.name})`)
  }
  // TypeScript accepts side-effect CSS imports without resolving them. Check
  // the real CSS paths too, especially ../styles from src/app/globals.css.
  const globals = path.join(app, layout === "src" ? "src/app/globals.css" : "app/globals.css")
  const imports = (css) => [...css.matchAll(/@import\s+(?:url\(\s*)?["']([^"']+)["']/g)].map((match) => match[1])
  const actual = imports(readFileSync(globals, "utf8"))
  for (const item of items) for (const key of Object.keys(item.css ?? {})) for (const imported of imports(key))
    if (!actual.includes(imported)) throw new Error(`Missing CSS import: ${imported} (${item.name})`)
  const visited = new Set()
  const checkCSS = (file) => {
    if (visited.has(file)) return
    visited.add(file)
    for (const imported of imports(readFileSync(file, "utf8"))) {
      if (!imported.startsWith(".")) continue
      const target = path.resolve(path.dirname(file), imported)
      if (!existsSync(target)) throw new Error(`Unresolved CSS import: ${imported} from ${path.relative(app, file)}`)
      checkCSS(target)
    }
  }
  checkCSS(globals)
}

// Async: this process must answer the shadcn child's registry requests.
const run = (cmd, args, cwd, cache) => new Promise((resolve, reject) => {
  const child = spawn(cmd, args, {
    cwd, stdio: "inherit", timeout: 180000,
    // Do not allow a caller's NODE_PATH to expose repository dependencies.
    env: { ...process.env, NODE_PATH: "", NEXT_TELEMETRY_DISABLED: "1", npm_config_cache: cache,
      npm_config_prefer_offline: "true", npm_config_fetch_retries: "0", npm_config_fetch_timeout: "30000" },
  })
  child.on("error", reject)
  child.on("exit", (code, signal) => code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code ?? signal}`)))
})

export function copyTemplate(source, target) {
  // COPYFILE_FICLONE uses APFS clones/reflinks with a normal copy fallback.
  // No symlinks back to a template or to the repository.
  cpSync(source, target, { recursive: true, mode: constants.COPYFILE_FICLONE, verbatimSymlinks: true })
}

export async function main(args = process.argv.slice(2)) {
  const started = performance.now()
  const registry = readRegistry(here)
  const names = selectItems(args, registry)
  const plan = checkPlan(names, registry, args.length > 0)
  const root = mkdtempSync(path.join(tmpdir(), "0db-install-"))
  const cache = path.join(tmpdir(), "0db-install-npm-cache")
  let server
  try {
    const pkg = JSON.parse(readFileSync(path.join(here, "package.json"), "utf8"))
    const versions = (names) => Object.fromEntries(names.map((name) => {
      const version = pkg.dependencies[name] ?? pkg.devDependencies[name]
      if (!version) throw new Error(`Missing consumer tool version: ${name}`)
      return [name, version]
    }))
    const baseline = path.join(root, "baseline")
    put(baseline, "package.json", {
      name: "0db-install-consumer", private: true, type: "module",
      dependencies: versions(["next", "react", "react-dom"]),
      devDependencies: versions(["tailwindcss", "@tailwindcss/postcss", "typescript", "@types/react", "@types/react-dom", "@types/node"]),
    })
    console.log(`Install gate: ${names.length} root items, ${plan.length - names.length} src items. Consumers: ${root}`)
    const npmArgs = ["--no-audit", "--no-fund", "--loglevel=error"]
    await run("npm", ["install", ...npmArgs], baseline, cache)

    let base
    // Freeze the built payloads so concurrent builds cannot change half a
    // closure. Rewrite registry addresses/config only, never component code.
    server = createServer((req, res) => {
      const name = new URL(req.url, "http://local").pathname.match(/^\/r\/([^/]+)\.json$/)?.[1]
      const item = registry.get(name)
      if (!item) { res.writeHead(404).end(); return }
      try {
        const local = { ...item, registryDependencies: (item.registryDependencies ?? []).map((dep) => `${base}/r/${dependencyName(dep, registry)}.json`) }
        if (item.config?.registries) local.config = { ...item.config, registries: { ...item.config.registries, "@0db": `${base}/r/{name}.json` } }
        res.writeHead(200, { "content-type": "application/json" }).end(JSON.stringify(local))
      } catch (error) { res.writeHead(500).end(error.message) }
    })
    await new Promise((resolve, reject) => { server.once("error", reject); server.listen(0, "127.0.0.1", resolve) })
    base = `http://127.0.0.1:${server.address().port}`
    const templates = new Map()
    const failures = []
    for (const { name, layout } of plan) {
      const itemStarted = performance.now()
      const app = path.join(root, `${layout}-${name}`)
      try {
        const items = closureFor(name, registry)
        const deps = npmClosure(items)
        const key = JSON.stringify(deps)
        if (!templates.has(key)) {
          const template = path.join(root, `template-${templates.size}`)
          // A failed npm install must not leave extra packages for a later
          // closure that retries this template slot.
          rmSync(template, { recursive: true, force: true })
          copyTemplate(baseline, template)
          if (deps.dependencies.length) await run("npm", ["install", ...npmArgs, "--", ...deps.dependencies], template, cache)
          if (deps.devDependencies.length) await run("npm", ["install", "--save-dev", ...npmArgs, "--", ...deps.devDependencies], template, cache)
          templates.set(key, template)
        }
        copyTemplate(templates.get(key), app)
        createConsumer(app, layout)
        await run(process.execPath, [path.join(here, "node_modules/shadcn/dist/index.js"), "add", "--yes", "--overwrite", `${base}/r/${name}.json`], app, cache)
        verifyInstall(app, layout, items)
        await run(process.execPath, [path.join(app, "node_modules/typescript/bin/tsc"), "--noEmit", "-p", app], app, cache)
        console.log(`PASS ${name} (${layout === "src" ? "src/app" : "app"}): ${items.length} registry items, ${((performance.now() - itemStarted) / 1000).toFixed(1)}s`)
      } catch (error) {
        failures.push(`${name} (${layout}): ${error.message}`)
        console.error(`FAIL ${failures.at(-1)}`)
      } finally { rmSync(app, { recursive: true, force: true }) }
    }
    if (failures.length) throw new Error(`Install gate failed (${failures.length}/${plan.length}):\n${failures.join("\n")}`)
    console.log(`Install holds: ${plan.length} isolated consumer installs/typechecks, ${templates.size} dependency templates, ${((performance.now() - started) / 1000).toFixed(1)}s.`)
  } finally {
    if (server) await new Promise((resolve) => server.close(resolve))
    rmSync(root, { recursive: true, force: true })
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href)
  main().catch((error) => { console.error(error.message); process.exitCode = 1 })
