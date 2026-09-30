import { readFileSync } from "node:fs"
import type { Metadata } from "next"
import NextLink from "next/link"
import { notFound } from "next/navigation"

import { Corners } from "@/registry/0db/ui/corners"
import { Meta } from "@/registry/0db/ui/meta"
import { Prose } from "@/registry/0db/ui/typography"
import { Source } from "@/registry/0db/ui/source"
import { CommandLine } from "@/registry/0db/ui/command-line"
import { Steps, Step, StepTitle } from "@/registry/0db/ui/steps"
import { Scrollbar } from "@/registry/0db/ui/scrollbar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/0db/ui/tabs"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/registry/0db/ui/table"
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/registry/0db/ui/pagination"
import { Link } from "@/registry/0db/ui/link"
import { entries } from "@/lib/site/entries"
import { movementName, ordered, UNDER } from "@/lib/site/catalog"
import { contractFor, motionRows, moveRows } from "@/lib/site/design-md"
import { exampleSource, installCommand } from "@/lib/site/example-source"
import { rewriteImports } from "@/scripts/lib/items.mjs"

type Params = { params: Promise<{ item: string }> }

export function generateStaticParams() {
  return entries.map((e) => ({ item: e.meta.name }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { item } = await params
  const entry = entries.find((e) => e.meta.name === item)
  return entry ? { title: entry.meta.title, description: entry.meta.summary } : {}
}

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"]

/** The files `shadcn add` writes for this item, read from its published payload. */
function payload(name: string) {
  const json = JSON.parse(readFileSync(`public/r/${name}.json`, "utf8")) as {
    dependencies?: string[]
    files: { path: string; type: string; target?: string; content: string }[]
  }
  return {
    npm: json.dependencies ?? [],
    files: json.files.map((f) => ({
      target: f.target ?? f.path.replace("registry/0db/ui/", "components/ui/").replace("registry/0db/lib/", "lib/0db/"),
      content: f.path.endsWith(".css") ? f.content : rewriteImports(f.content),
    })),
  }
}

function Rows({ title, table }: { title: string; table: { header: string[]; rows: string[][] } }) {
  return (
    <div className="doc-table" role="region" aria-label={title} tabIndex={0}>
      <Table>
        <TableCaption>{title}</TableCaption>
        <TableHeader>
          <TableRow>
            {table.header.map((h) => (
              <TableHead key={h}>{h}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {table.rows.map((r, i) => (
            <TableRow key={i}>
              {r.map((c, j) => (
                <TableCell key={j} primary={j === 0} dangerouslySetInnerHTML={{ __html: c }} />
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default async function ItemPage({ params }: Params) {
  const { item } = await params
  const entry = entries.find((e) => e.meta.name === item)
  if (!entry) notFound()
  const { meta } = entry
  const Example = entry.example.default
  const States = "States" in entry.example ? (entry.example.States as React.ComponentType) : null
  const at = ordered.findIndex((e) => e.meta.name === item)
  const prev = ordered[at - 1]?.meta
  const next = ordered[at + 1]?.meta
  const contract = contractFor(meta.contract, meta.name)
  const moves = moveRows(meta.name)
  const motion = motionRows(meta.name)
  const { npm, files } = payload(meta.name)
  const siblings = entry.siblings as string[]

  const sections = [
    { id: "example", name: "Example" },
    { id: "install", name: "Install" },
    { id: "usage", name: "Usage" },
    ...(contract ? [{ id: "contract", name: "Contract" }] : []),
    ...(meta.props.length ? [{ id: "props", name: "Props" }] : []),
    ...(moves.rows.length || motion.rows.length ? [{ id: "craft", name: "Craft" }] : []),
  ].map((s, i) => ({ ...s, num: ROMAN[i] }))

  return (
    <article>
      <header className="doc-head">
        <Meta>
          <span>
            {meta.movement} {movementName(meta.movement)}
          </span>
          <span>{UNDER[meta.underneath]}</span>
          <span className="db-label">{meta.contract}</span>
        </Meta>
        <h1 className="doc-title">{meta.title}</h1>
        <p className="doc-summary">{meta.summary}</p>
      </header>

      <section className="doc-section" id="example" aria-labelledby="example-h">
        <h2 id="example-h" className="db-sr">
          Example
        </h2>
        {/* The frame is itself Corners; the corners page shows its own, alone. */}
        {meta.name === "corners" ? (
          <div className="doc-example">
            <Example />
          </div>
        ) : (
          <Corners className="doc-example">
            <Example />
          </Corners>
        )}
        {States ? (
          <div className="spec-states" inert aria-label="States, pinned">
            <States />
          </div>
        ) : null}
      </section>

      <section className="doc-section doc-install" id="install" aria-labelledby="install-h">
        <h2 id="install-h">Install</h2>
        <Tabs defaultValue="cli">
          <TabsList aria-label="How to install">
            <TabsTrigger value="cli">Command</TabsTrigger>
            <TabsTrigger value="manual">By hand</TabsTrigger>
          </TabsList>
          <TabsContent value="cli">
            <p>Run it in a project that has the shadcn CLI set up. It brings {new Intl.ListFormat("en").format(["the 0dB base", ...siblings])} along.</p>
            <CommandLine runner command={installCommand(meta.name)} emphasis={meta.name} />
          </TabsContent>
          <TabsContent value="manual">
            <Steps>
              <Step>
                <StepTitle>Install the base</StepTitle>
                <p>
                  The tokens, fonts and base styles every item stands on. See{" "}
                  <Link asChild>
                    <NextLink href="/docs/install/">Install</NextLink>
                  </Link>
                  .
                </p>
              </Step>
              {npm.length ? (
                <Step>
                  <StepTitle>Add the packages</StepTitle>
                  <CommandLine command={`npm install ${npm.join(" ")}`} />
                </Step>
              ) : null}
              {siblings.length ? (
                <Step>
                  <StepTitle>Add the items it uses</StepTitle>
                  <p>
                    {siblings.map((s, i) => (
                      <span key={s}>
                        {i ? ", " : ""}
                        <Link asChild>
                          <NextLink href={`/docs/${s}/`}>{s}</NextLink>
                        </Link>
                      </span>
                    ))}
                  </p>
                </Step>
              ) : null}
              {files.map((f) => (
                <Step key={f.target}>
                  <StepTitle>Copy {f.target}</StepTitle>
                  {f.target.endsWith(".css") ? (
                    <p>
                      Then import it from your global stylesheet: <code>@import &quot;@/{f.target}&quot;;</code>
                    </p>
                  ) : null}
                  <Source title={f.target} code={f.content} />
                </Step>
              ))}
            </Steps>
          </TabsContent>
        </Tabs>
      </section>

      <section className="doc-section" id="usage" aria-labelledby="usage-h">
        <h2 id="usage-h">Usage</h2>
        <Source title={`${meta.name}-example.tsx`} code={exampleSource(meta.name)} />
      </section>

      {contract ? (
        <section className="doc-section" id="contract" aria-labelledby="contract-h">
          <h2 id="contract-h">Contract</h2>
          <Prose dangerouslySetInnerHTML={{ __html: contract }} />
        </section>
      ) : null}

      {meta.props.length ? (
        <section className="doc-section" id="props" aria-labelledby="props-h">
          <h2 id="props-h">Props</h2>
          <div className="doc-table" role="region" aria-label={`Props of ${meta.title}`} tabIndex={0}>
            <Table>
              <TableCaption>Props of {meta.title}</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Prop</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Default</TableHead>
                  <TableHead>What it does</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {meta.props.map((p) => (
                  <TableRow key={p.name}>
                    <TableCell primary>
                      <code>{p.name}</code>
                    </TableCell>
                    <TableCell>
                      <code>{p.type}</code>
                    </TableCell>
                    <TableCell>{p.default ? <code>{p.default}</code> : null}</TableCell>
                    <TableCell>{p.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      ) : null}

      {moves.rows.length || motion.rows.length ? (
        <section className="doc-section" id="craft" aria-labelledby="craft-h">
          <h2 id="craft-h">Craft</h2>
          <div className="doc-steps">
            {moves.rows.length ? <Rows title="Where its move comes from" table={moves} /> : null}
            {motion.rows.length ? <Rows title="How it moves" table={motion} /> : null}
          </div>
        </section>
      ) : null}

      <Pagination className="doc-foot" aria-label="Items">
        <PaginationContent>
          <PaginationItem>
            {prev ? (
              <PaginationPrevious asChild>
                <NextLink href={`/docs/${prev.name}/`} rel="prev" aria-label={`Previous: ${prev.title}`}>
                  {prev.title}
                </NextLink>
              </PaginationPrevious>
            ) : (
              <PaginationPrevious />
            )}
          </PaginationItem>
          <PaginationItem>
            {next ? (
              <PaginationNext asChild>
                <NextLink href={`/docs/${next.name}/`} rel="next" aria-label={`Next: ${next.title}`}>
                  {next.title}
                </NextLink>
              </PaginationNext>
            ) : (
              <PaginationNext />
            )}
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <Scrollbar variant="page" className="doc-scrollbar" sections={sections} />
    </article>
  )
}
