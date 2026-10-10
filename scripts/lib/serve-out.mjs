// A throwaway static server over the exported site (out/), for the browser checks. The check that starts it owns it
// and stops it. Routes follow the deployed base path, as check-pages does.
import { createServer } from "node:http"
import { existsSync, readFileSync, statSync } from "node:fs"
import path from "node:path"

import { sitePath, siteRoute } from "../../lib/site/config.mjs"

const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".woff2": "font/woff2", ".svg": "image/svg+xml", ".txt": "text/plain" }

export async function serveOut() {
  const root = path.resolve("out")
  if (!existsSync(root)) throw new Error("No out/. Run npm run build first.")
  const server = createServer((req, res) => {
    let file = path.join(root, siteRoute(decodeURIComponent(new URL(req.url, "http://x").pathname)))
    if (!file.startsWith(root)) { res.writeHead(403).end(); return }
    if (existsSync(file) && statSync(file).isDirectory()) file = path.join(file, "index.html")
    if (!existsSync(file)) { res.writeHead(404, { "content-type": "text/html" }).end(readFileSync(path.join(root, "404.html"))); return }
    res.writeHead(200, { "content-type": types[path.extname(file)] ?? "application/octet-stream" }).end(readFileSync(file))
  })
  await new Promise((resolve) => server.listen(0, resolve))
  const origin = `http://localhost:${server.address().port}`
  return { url: (route = "/") => origin + sitePath(route), close: () => new Promise((resolve) => server.close(resolve)) }
}
