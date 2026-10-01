import { registryURL } from "./config.mjs"
import { readFileSync } from "node:fs"
import { rewriteImports } from "@/scripts/lib/items.mjs"

/** Consumer examples carry literal registry addresses, without the site's config import. */
export function consumerExampleSource(source: string): string {
  return rewriteImports(source)
    .replace(/^import \{ registryURL \} from "@\/lib\/site\/config.mjs"\n/m, "")
    .replace(/\$\{registryURL\("([^"]+)"\)\}/g, (_match, name: string) => registryURL(name))
}

/** The example as a consumer would write it: imports as installed, without the docs-only States. */
export function exampleSource(name: string): string {
  const source = readFileSync(`examples/${name}.tsx`, "utf8")
  return consumerExampleSource(source.split(/\n(?=export function States)/)[0])
    .replace(/^import \{ State \} from .*\n/m, "")
    .trimEnd() + "\n"
}

/** The one-line install command for an item, without its runner: a CommandLine adds the reader's. */
export const installCommand = (name: string) => `shadcn@latest add ${registryURL(name)}`
