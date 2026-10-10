"use client"

import * as React from "react"
import NextLink from "next/link"
import { reportingFetch } from "./connection"
import type { RequestTopic } from "@/lib/reporting/contracts"
import { Button } from "@/registry/0nlytype/ui/button"
import { Field } from "@/registry/0nlytype/ui/field"
import { InputGroup, InputGroupInput, InputGroupButton } from "@/registry/0nlytype/ui/input-group"
import { Link } from "@/registry/0nlytype/ui/link"
import { Marker } from "@/registry/0nlytype/ui/marker"
import { Rows, Row, RowTitle, RowKind, RowMeta } from "@/registry/0nlytype/ui/rows"
import { GitHubFallback, publicLink, requestHref, STATUS_LABELS } from "./shared"

export function RequestBoard() {
  const [query, setQuery] = React.useState("")
  const [rows, setRows] = React.useState<RequestTopic[]>([])
  const [busy, setBusy] = React.useState(true)
  const [error, setError] = React.useState(false)
  const [hasMore, setHasMore] = React.useState(false)
  const [reload, setReload] = React.useState(0)
  const pending = React.useRef<AbortController | null>(null)
  const revision = React.useRef(0)

  const load = React.useCallback(async (offset: number) => {
    pending.current?.abort()
    const controller = new AbortController()
    pending.current = controller
    const current = ++revision.current
    setBusy(true)
    setError(false)
    try {
      const result = await reportingFetch<{ requests: RequestTopic[]; hasMore: boolean }>(`/v1/requests?q=${encodeURIComponent(query)}&offset=${offset}`, { signal: AbortSignal.any([controller.signal, AbortSignal.timeout(10000)]) })
      if (controller.signal.aborted || current !== revision.current) return
      setRows((previous) => offset ? [...previous, ...result.requests.filter((row) => !previous.some((entry) => entry.id === row.id))] : result.requests)
      setHasMore(result.hasMore)
    } catch {
      if (!controller.signal.aborted && current === revision.current) setError(true)
    } finally {
      if (!controller.signal.aborted && current === revision.current) setBusy(false)
    }
  }, [query])

  React.useEffect(() => {
    const timer = setTimeout(() => void load(0), 250)
    return () => { clearTimeout(timer); pending.current?.abort() }
  }, [load, reload])

  return (
    <main id="content" className="db-report-page">
      <header className="db-report-head">
        <p className="db-report-caption">0nlyType / Component requests</p>
        <h1>Room for<br />what’s next.</h1>
        <div className="db-report-intro">
          <p>Find an idea you need. Join it, follow its progress, or tell us what’s missing.</p>
          <Link asChild><NextLink href={requestHref()}>Request a component</NextLink></Link>
        </div>
      </header>
      <section className="db-report-board" aria-labelledby="requests-heading">
        <div className="db-report-board-head">
          <h2 id="requests-heading">The request board</h2>
          <Field label="Search requests">
            <InputGroup>
              <InputGroupInput type="search" dir="auto" value={query} maxLength={120} placeholder="A component or an idea" onChange={(event) => {
                pending.current?.abort()
                ++revision.current
                setQuery(event.target.value)
                setRows([])
                setHasMore(false)
                setError(false)
                setBusy(true)
              }} />
              {query ? <InputGroupButton onClick={() => { pending.current?.abort(); ++revision.current; setQuery(""); setRows([]); setHasMore(false); setBusy(true) }}>Clear</InputGroupButton> : null}
            </InputGroup>
          </Field>
        </div>
        <Marker role="status">{busy ? "Looking for requests…" : error ? "Requests are unavailable right now." : <><bdi className="db-report-number">{rows.length}</bdi> {rows.length === 1 ? "request" : "requests"} shown</>}</Marker>
        {error ? <div className="db-report-empty">
          <h3>The board couldn’t be reached.</h3>
          <p>You can still prepare a request. Try the board again in a moment, or open your idea on GitHub.</p>
          <Button variant="quiet" onClick={() => setReload((n) => n + 1)}>Try again</Button>
          <GitHubFallback kind="request" title={query} description={query ? `I would like a component for ${query}.` : ""} />
        </div> : null}
        {!busy && !error && !rows.length ? <div className="db-report-empty">
          <h3>{query ? "Nothing here by that name." : "The next idea could be yours."}</h3>
          <p>{query ? "Try another word, or start a request for the component you need." : "No public requests yet. Tell us what would help you build."}</p>
          <Link asChild><NextLink href={requestHref(undefined, query)}>Start a request</NextLink></Link>
        </div> : null}
        {rows.length ? <Rows variant="ditto" aria-label="Component requests" aria-busy={busy}>
          {rows.map((topic) => {
            const component = topic.status === "resolved" ? publicLink(topic.componentUrl) : undefined
            return <Row key={topic.id} asChild>
              <NextLink href={component || requestHref(topic)}>
                <RowTitle className="db-yours" dir="auto">{topic.title}</RowTitle>
                <RowKind>{STATUS_LABELS[topic.status]}</RowKind>
                <RowMeta><bdi className="db-report-number">{topic.demand}</bdi> {topic.demand === 1 ? "person" : "people"}</RowMeta>
                <span className="db-report-row-action">{component ? "See component" : "Join request"}</span>
              </NextLink>
            </Row>
          })}
        </Rows> : null}
        {hasMore ? <Button variant="bracket" busy={busy && "Loading"} disabled={busy} onClick={() => void load(rows.length)}>More requests</Button> : null}
      </section>
      <footer className="db-report-foot">
        <p>Each email counts once. Titles appear here after review; your email, details and attachments stay private.</p>
        <Link asChild><NextLink href="/docs/">Back to the library</NextLink></Link>
      </footer>
    </main>
  )
}
