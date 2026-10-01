import { cpSync, readFileSync, rmSync, mkdirSync, writeFileSync } from "node:fs"
import { SITE_BASE_PATH, sitePath, siteURL } from "../lib/site/config.mjs"
import { packageHeaders } from "./lib/site-assets.mjs"

rmSync("dist", { recursive: true, force: true })
mkdirSync("dist", { recursive: true })
cpSync("out", `dist${SITE_BASE_PATH}`, { recursive: true })
// Workers reads these control files only at the asset root.
for (const file of ["_headers", "_redirects", "robots.txt"]) rmSync(`dist${SITE_BASE_PATH}/${file}`, { force: true })
writeFileSync("dist/robots.txt", `User-agent: *\nAllow: /\nSitemap: ${siteURL("/sitemap.xml")}\n`)
writeFileSync("dist/_headers", packageHeaders(readFileSync("public/_headers", "utf8")))
writeFileSync("dist/_redirects", `/ ${sitePath("/")} 302\n${SITE_BASE_PATH} ${sitePath("/")} 301\n`)
cpSync("out/404.html", "dist/404.html")
console.log(`Packaged out/ at dist${SITE_BASE_PATH}/ with root controls and 404.`)
