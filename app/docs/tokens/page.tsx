import { readFileSync } from "node:fs"
import type { Metadata } from "next"

import { CopyButton } from "@/registry/0db/ui/source"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/registry/0db/ui/table"

export const metadata: Metadata = {
  title: "Tokens",
  description: "Every --db- token and its Day value. Copy one to use it.",
}

/** The first :root block of tokens.css, grouped by its own comments. */
function groups() {
  const css = readFileSync("registry/0db/styles/tokens.css", "utf8")
  const root = css.slice(css.indexOf(":root"), css.indexOf("\n}", css.indexOf(":root")))
  const out: { title: string; tokens: { name: string; value: string }[] }[] = []
  for (const line of root.split("\n")) {
    const heading = line.match(/^\s*\/\* ([^:*]+?)[:.*]/)
    if (heading) out.push({ title: heading[1].trim(), tokens: [] })
    for (const [, name, value] of line.matchAll(/(--db-[a-z0-9-]+)\s*:\s*([^;]+);/g)) {
      if (!out.length) out.push({ title: "Tokens", tokens: [] })
      out[out.length - 1].tokens.push({ name, value: value.trim() })
    }
  }
  return out.filter((g) => g.tokens.length)
}

export default function Tokens() {
  return (
    <>
      <header className="doc-head">
        <h1 className="doc-title">Tokens</h1>
        <p className="doc-summary">Every item reads only these. The values shown are Day; the scheme, key, pair and Nocturne switches change them in place.</p>
      </header>
      {groups().map((g) => (
        <section key={g.title} className="doc-section" aria-labelledby={`t-${g.title}`}>
          <h2 id={`t-${g.title}`}>{g.title}</h2>
          <div className="doc-table" role="region" aria-label={`${g.title} tokens`} tabIndex={0}>
            <Table>
              <TableCaption>{g.title} tokens</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Token</TableHead>
                  <TableHead>Day value</TableHead>
                  <TableHead>
                    <span className="db-sr">Copy</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {g.tokens.map((t) => (
                  <TableRow key={t.name}>
                    <TableCell primary>
                      <code>{t.name}</code>
                    </TableCell>
                    <TableCell>
                      <code>{t.value}</code>
                    </TableCell>
                    <TableCell>
                      <CopyButton text={`var(${t.name})`} aria-label={`Copy var(${t.name})`} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      ))}
    </>
  )
}
