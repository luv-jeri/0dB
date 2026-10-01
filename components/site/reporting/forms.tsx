"use client"

import { siteURL } from "@/lib/site/config.mjs"
import * as React from "react"
import NextLink from "next/link"
import {
  canEditRejectedSubmission, manifestFiles, receiptSecret, REPORTING_SITE_KEY,
  ReportingError, type ReportingConfig,
} from "@/lib/reporting/client"
import { findComponents, isUUID, LIMITS, MEDIA_TYPES, validateReport, type ComponentMatch, type RequestTopic } from "@/lib/reporting/contracts"
import { snapshotDiagnostics } from "@/lib/reporting/diagnostics"
import { emptyDraft, type ReportingDraft } from "@/lib/reporting/draft"
import { capturePage } from "@/lib/reporting/capture"
import { Button } from "@/registry/0db/ui/button"
import { Dropzone } from "@/registry/0db/ui/dropzone"
import { Field, Input, Textarea } from "@/registry/0db/ui/field"
import { Form, FormSubmit } from "@/registry/0db/ui/form"
import { InputGroup, InputGroupInput, InputGroupText } from "@/registry/0db/ui/input-group"
import { Link } from "@/registry/0db/ui/link"
import { Marker } from "@/registry/0db/ui/marker"
import { Picks, Pick, PickTitle, PickDescription } from "@/registry/0db/ui/picks"
import { Questionnaire, type Answers } from "@/registry/0db/ui/questionnaire"
import { toast, Toaster } from "@/registry/0db/ui/toast"
import { MediaReview } from "./media"
import { fetchReceipt, reportingFetch, submitReport, uploadAttachment } from "./connection"
import { downloadReceipt, ReportReceipt } from "./receipt"
import { GitHubFallback, message, STATUS_LABELS, uploaded } from "./shared"
import { Turnstile } from "./turnstile"
import { useReportingWorkspace } from "./workspace"
import { CropEditor, ItemSearch, PinPicker, pinTarget, type ReportingItem } from "./capture-controls"
import "./controls.css"

const questions = [
  { id: "happened", question: "What happened?", label: "What you saw", placeholder: "The steps you took, and where it went wrong" },
  { id: "expected", question: "What did you expect?", label: "What you hoped would happen", placeholder: "Describe the result you expected" },
]
const answerText = (answers: Answers) => [answers.happened?.trim(), answers.expected?.trim()].filter(Boolean).join("\n\n")
const references = (description: string) => [...new Set((description.match(/https?:\/\/[^\s<>]+/gi) ?? []).map((value) => value.replace(/[),.;!?]+$/, "")))]

export function FeedbackForms({ entries, presentation = "page", href, onPickingChange, onBusyChange }: {
  entries: ReportingItem[]
  presentation?: "page" | "panel"
  href?: string
  onPickingChange?: (picking: boolean) => void
  onBusyChange?: (busy: boolean) => void
}) {
  const { draft, loaded, storage, notice, replace, persist, select, clear } = useReportingWorkspace(entries, href)
  const [busy, setBusy] = React.useState("")
  const [error, setError] = React.useState("")
  const [config, setConfig] = React.useState<ReportingConfig | null>(null)
  const [connection, setConnection] = React.useState<"loading" | "ready" | "unavailable">("loading")
  const [reload, setReload] = React.useState(0)
  const [token, setToken] = React.useState("")
  const [attempt, setAttempt] = React.useState(0)
  const [dropKey, setDropKey] = React.useState(0)
  const [guideKey, setGuideKey] = React.useState(0)
  const [topics, setTopics] = React.useState<RequestTopic[]>([])
  const [topicError, setTopicError] = React.useState(false)
  const [guideOpen, setGuideOpen] = React.useState(false)
  const [capture, setCapture] = React.useState<File | null>(null)
  const [picking, setPicking] = React.useState(false)
  const [announcement, setAnnouncement] = React.useState("")
  const pickButton = React.useRef<HTMLButtonElement>(null)
  const captureButton = React.useRef<HTMLButtonElement>(null)
  const running = React.useRef(false)
  const reviewHeading = React.useRef<HTMLHeadingElement>(null)
  const descriptionInput = React.useRef<HTMLTextAreaElement>(null)
  const importInput = React.useRef<HTMLInputElement>(null)
  const frozen = draft.frozen
  const siteKey = REPORTING_SITE_KEY || config?.turnstileSiteKey || ""
  const matches = draft.kind === "request" && !draft.topicId ? findComponents(draft.title, entries) : []

  React.useEffect(() => {
    const controller = new AbortController()
    reportingFetch<ReportingConfig>("/v1/config", { signal: AbortSignal.any([controller.signal, AbortSignal.timeout(10000)]) })
      .then((value) => { if (!controller.signal.aborted) { setConfig(value); setConnection("ready") } })
      .catch(() => { if (!controller.signal.aborted) setConnection("unavailable") })
    return () => controller.abort()
  }, [reload])

  React.useEffect(() => {
    if (draft.kind !== "request" || draft.topicId || draft.title.trim().length < 3 || frozen || connection !== "ready") return
    const controller = new AbortController()
    const timer = setTimeout(() => {
      reportingFetch<{ requests: RequestTopic[] }>(`/v1/requests?q=${encodeURIComponent(draft.title)}&offset=0`, { signal: AbortSignal.any([controller.signal, AbortSignal.timeout(10000)]) })
        .then((result) => { if (!controller.signal.aborted) { setTopics(result.requests); setTopicError(false) } })
        .catch(() => { if (!controller.signal.aborted) setTopicError(true) })
    }, 300)
    return () => { clearTimeout(timer); controller.abort() }
  }, [draft.kind, draft.title, draft.topicId, frozen, connection])

  React.useEffect(() => { if (frozen) reviewHeading.current?.focus() }, [frozen])
  React.useEffect(() => { onBusyChange?.(Boolean(busy)) }, [busy, onBusyChange])

  const update = (changes: Partial<ReportingDraft>) => replace({ ...draft, ...changes })
  const reset = () => {
    clear()
    setError("")
    setDropKey((n) => n + 1)
    setGuideKey((n) => n + 1)
    setTopics([])
    setGuideOpen(false)
    toast("Ready for a new draft.")
  }

  async function prepare() {
    if (running.current) return
    running.current = true
    setError("")
    setBusy("Preparing review")
    try {
      const description = draft.description.trim() || (draft.topicId ? "I would like this component too." : "")
      const report = validateReport({
        id: crypto.randomUUID(), kind: draft.kind, title: draft.title, description, email: draft.email,
        references: references(description), pins: draft.kind === "bug" ? draft.pins : [], attachments: await manifestFiles(draft.files),
        diagnostics: draft.kind === "bug" ? draft.diagnostics : null,
        ...(draft.topicId ? { topicId: draft.topicId } : {}),
      })
      replace({ ...draft, frozen: { report, token: receiptSecret() } })
      await persist()
    } catch (cause) { setError(message(cause)) }
    finally { running.current = false; setBusy("") }
  }

  async function send() {
    if (running.current || !frozen || !config || (!config.local && !token)) return
    running.current = true
    setBusy("Sending report")
    setError("")
    const previouslyAttempted = draft.attempted
    let next = { ...draft, attempted: true }
    replace(next)
    await persist()
    try {
      let receipt = await submitReport(frozen, token)
      next = { ...next, receipt }
      replace(next)
      await persist()
      toast("Report received.")
      const failures: string[] = []
      for (const item of draft.files) {
        if (receipt.attachments.some((file) => file.id === item.id && (uploaded(file.state) || file.state === "expired"))) continue
        setBusy(`Uploading ${item.file.name}`)
        try {
          await uploadAttachment(receipt, item)
          receipt = { ...receipt, attachments: receipt.attachments.map((file) => file.id === item.id ? { ...file, state: "uploaded" } : file) }
          next = { ...next, receipt }
          replace(next)
          await persist()
        } catch (cause) { failures.push(`${item.file.name}: ${message(cause)}`) }
      }
      if (failures.length) setError(`Your report is received. Some attachments still need uploading. Use Retry uploads below. ${failures.join(" ")}`)
    } catch (cause) {
      setError(message(cause))
      if (canEditRejectedSubmission(cause, previouslyAttempted)) {
        replace({ ...next, attempted: false, frozen: null })
        await persist()
      }
    } finally {
      running.current = false
      setBusy("")
      setToken("")
      setAttempt((n) => n + 1)
    }
  }

  async function checkReceipt() {
    if (!frozen || running.current) return
    running.current = true
    setBusy("Checking receipt")
    setError("")
    try {
      const receipt = await fetchReceipt(frozen.report.id, frozen.token)
      update({ receipt })
      await persist()
    } catch (cause) {
      if (cause instanceof ReportingError && cause.status === 404) {
        update({ frozen: null, attempted: false })
        setError("No report was found for this receipt. You can edit your draft and send it again.")
      } else setError(message(cause))
    } finally { running.current = false; setBusy("") }
  }

  async function importReceipt(file: File) {
    if (running.current) return
    running.current = true
    setBusy("Opening receipt")
    setError("")
    try {
      if (file.size > 100000) throw new Error("Choose a 0dB receipt JSON file under 100 KB.")
      const saved = JSON.parse(await file.text()) as { id?: unknown; token?: unknown }
      if (!isUUID(saved.id) || typeof saved.token !== "string" || !/^[a-f0-9]{64}$/.test(saved.token)) throw new Error("This file is not a valid receipt.")
      const receipt = await fetchReceipt(saved.id, saved.token)
      replace({ ...emptyDraft(), kind: draft.kind, attempted: true, receipt })
      await persist()
      toast("Receipt opened.")
    } catch (cause) { setError(message(cause)) }
    finally { running.current = false; setBusy("") }
  }

  function finishGuide(answers: Answers) {
    const guided = [answers.happened ? `What happened\n${answers.happened}` : "", answers.expected ? `What I expected\n${answers.expected}` : ""].filter(Boolean).join("\n\n")
    if (guided) update({ description: [draft.description.trim(), guided].filter(Boolean).join("\n\n").slice(0, 6000) })
    setGuideOpen(false)
    descriptionInput.current?.focus()
    toast(guided ? "Answers added to your details." : "You can write the details below.")
  }

  const finishPicking = () => {
    setPicking(false)
    onPickingChange?.(false)
    requestAnimationFrame(() => requestAnimationFrame(() => pickButton.current?.focus({ preventScroll: true })))
  }
  const selectItem = (item: ComponentMatch, pin?: ReportingDraft["pins"][number]) => {
    const reference = `Component: ${siteURL(`/docs/${item.name}/`)}`
    update({
      title: draft.title || `Issue with ${item.title}`.slice(0, 120),
      description: draft.description.includes(reference) ? draft.description : `${reference}\n\n${draft.description}`.slice(0, 6000),
      pins: pin && !draft.pins.some((value) => value.path === pin.path) ? [...draft.pins, pin].slice(0, LIMITS.pins) : draft.pins,
    })
    setAnnouncement(`${item.title} selected. Its component link is in your details.`)
    if (picking) finishPicking()
  }
  async function screenshot(mode: "viewport" | "page") {
    if (running.current) return
    running.current = true
    setBusy("Capturing screenshot")
    setError("")
    try { setCapture(await capturePage(mode)) }
    catch (cause) { setError(`${message(cause)} You can attach an image or video instead.`) }
    finally { running.current = false; setBusy("") }
  }
  const finishCapture = () => {
    setCapture(null)
    requestAnimationFrame(() => captureButton.current?.focus({ preventScroll: true }))
  }
  const Root = presentation === "panel" ? "div" : "main"

  return (
    <Root id={presentation === "page" ? "content" : undefined} className="db-report-page" data-presentation={presentation} data-reporting-chrome>
      <Toaster variant="footnote" className="db-report-toaster" />
      {presentation === "page" ? <header className="db-report-head">
        <p className="db-report-caption">0dB / Feedback</p>
        <h1>Make it<br />better.</h1>
        <div className="db-report-intro"><p>A rough edge. A missing piece.<br />Tell us what would help.</p><Link asChild><NextLink href="/requests/">Browse component requests</NextLink></Link></div>
      </header> : null}
      <div className="db-report-layout">
        <aside className="db-report-aside">
          <Picks legend="I’d like to" value={draft.kind} disabled={!loaded || Boolean(busy) || Boolean(capture)} onValueChange={(kind) => {
            if (kind !== "bug" && kind !== "request") return
            select(kind)
            setError("")
            setTopics([])
            setTopicError(false)
            setGuideOpen(false)
            setToken("")
            setDropKey((n) => n + 1)
          }}>
            <Pick value="bug"><PickTitle>Report a bug</PickTitle><PickDescription>Something isn’t working as it should.</PickDescription></Pick>
            <Pick value="request"><PickTitle>Request a component</PickTitle><PickDescription>Something you wish the library had.</PickDescription></Pick>
          </Picks>
          {presentation === "panel" && draft.kind === "request" ? <Link asChild><NextLink href="/requests/">Browse component requests</NextLink></Link> : null}
          <div className="db-report-aside-note">
            <p>Your email and supporting details stay private. Request titles may be published after review.</p>
            <p className="db-report-note">Drafts and receipts stay in this browser for seven days after a save. Download a receipt to keep it longer.</p>
          </div>
        </aside>
        <div className="db-report-body" aria-busy={Boolean(busy)}>
          {!loaded ? <Marker role="status">Opening your draft…</Marker> : <>
            {notice ? <p role="status">{notice}</p> : null}
            {draft.receipt ? <ReportReceipt receipt={draft.receipt} title={draft.title} files={draft.files} externalBusy={busy} onBusyChange={setBusy} onChange={(receipt) => { update({ receipt }); void persist() }} onNew={reset} /> : frozen ? (
              <section className="db-report-review" aria-labelledby="review-heading">
                <Marker>Review / {draft.kind === "bug" ? "Issue" : "Component request"}</Marker>
                <h2 ref={reviewHeading} id="review-heading" tabIndex={-1}>One last look.</h2>
                <dl className="db-report-ledger">
                  <div><dt>Title</dt><dd className="db-yours" dir="auto">{frozen.report.title}</dd></div>
                  <div><dt>Details</dt><dd className="db-yours db-report-lines" dir="auto">{frozen.report.description}</dd></div>
                  <div><dt>Private email</dt><dd className="db-yours" dir="auto">{frozen.report.email}</dd></div>
                  <div><dt>Browser details</dt><dd>{frozen.report.diagnostics ? "Included" : "Not included"}</dd></div>
                </dl>
                <MediaReview files={draft.files} />
                <details className="db-report-disclosure"><summary>Exact report contents</summary><pre className="db-report-payload" tabIndex={0}>{JSON.stringify(frozen.report, null, 2)}</pre></details>
                <p>Send only what you want to share, including the visible contents of your images and videos.</p>
                {draft.attempted ? <p role="status">A send was attempted. The result may be delayed. Retrying sends the same report; check its receipt before making changes.</p> : null}
                {connection === "ready" && !config?.local && siteKey ? <Turnstile siteKey={siteKey} attempt={attempt} onToken={setToken} /> : null}
                {connection === "ready" && !config?.local && !siteKey ? <p>Sending is waiting for verification to be connected. Your draft is ready to keep or open on GitHub.</p> : null}
                <div className="db-report-actions">
                  <Button variant="bracket" disabled={Boolean(busy) || connection !== "ready" || (!config?.local && !token)} busy={busy === "Sending report" && "Sending"} onClick={() => void send()}>{draft.attempted ? "Retry sending" : "Send report"}</Button>
                  {draft.attempted ? <Button variant="quiet" disabled={Boolean(busy)} onClick={() => void checkReceipt()}>Check receipt</Button> : <Button variant="quiet" disabled={Boolean(busy)} onClick={() => update({ frozen: null })}>Keep editing</Button>}
                  {draft.attempted ? <Button variant="quiet" onClick={() => { downloadReceipt({ id: frozen.report.id, token: frozen.token }); toast("Receipt key download started.") }}>Download receipt key</Button> : null}
                </div>
              </section>
            ) : capture ? <CropEditor file={capture} onCancel={finishCapture} onAccept={async (file) => {
              const files = [...draft.files, { id: crypto.randomUUID(), file }]
              await manifestFiles(files)
              update({ files })
              setDropKey((n) => n + 1)
              setAnnouncement("Cropped screenshot attached. You can preview or remove it below.")
              finishCapture()
            }} /> : (
              <section className="db-report-edit" aria-labelledby="form-heading" key={draft.kind} inert={Boolean(busy)}>
                <h2 id="form-heading">{draft.topicId ? "Join this request." : draft.kind === "bug" ? "What needs a closer look?" : "What’s missing?"}</h2>
                {draft.kind === "bug" ? <section className="db-report-tools" aria-label="Page and screenshot">
                  <div className="db-report-actions">
                    <Button ref={pickButton} variant="bracket" disabled={draft.pins.length >= LIMITS.pins} onClick={() => { setPicking(true); onPickingChange?.(true) }}>Pick the item</Button>
                    <Button ref={captureButton} variant="quiet" disabled={draft.files.length >= LIMITS.files} onClick={() => void screenshot("viewport")}>Screenshot this view</Button>
                    <Button variant="quiet" disabled={draft.files.length >= LIMITS.files} onClick={() => void screenshot("page")}>Screenshot full page</Button>
                  </div>
                  <details className="db-report-disclosure"><summary>Find an item by name</summary><ItemSearch entries={entries} onSelect={selectItem} /></details>
                  {draft.pins.length ? <ol className="db-report-pins" aria-label="Picked items">{draft.pins.map((pin, index) => <li key={pin.path}>
                    <span><bdi className="db-report-number">{index + 1}.</bdi> <span className="db-yours">{pinTarget(pin, entries) ?? "Picked item"}</span></span>
                    <Button variant="quiet" aria-label={`Remove pin ${index + 1}`} onClick={() => { update({ pins: draft.pins.filter((_, at) => at !== index) }); setAnnouncement("Pin removed.") }}>Remove</Button>
                  </li>)}</ol> : null}
                  <p className="db-report-note" role="status">{announcement || "Choose an item on the page, or capture what you see. Nothing is shared until you review and send."}</p>
                </section> : null}
                {draft.kind === "bug" ? <details className="db-report-disclosure" open={guideOpen} onToggle={(event) => setGuideOpen(event.currentTarget.open)}>
                  <summary>Walk through what happened</summary>
                  <p className="db-report-note">Two short questions, up to 200 characters each. Add as much detail as you need in the form below.</p>
                  <Questionnaire key={guideKey} variant="interview" questions={questions} sentence={answerText} onComplete={finishGuide} submitLabel="Use these answers" />
                </details> : null}
                <Form className="db-report-form" onSubmit={prepare}>
                  <Field label={draft.kind === "bug" ? "A short title" : "Component name or idea"} count maxLength={120}>
                    <Input name="title" dir="auto" required minLength={3} value={draft.title} readOnly={Boolean(draft.topicId)} disabled={Boolean(busy)} onChange={(event) => { update({ title: event.target.value }); setTopics([]); setTopicError(false) }} data-error="Give it a title of 3–120 characters." placeholder={draft.kind === "bug" ? "What isn’t working?" : "What would you like to build?"} />
                  </Field>
                  {draft.kind === "request" && !draft.topicId && (matches.length || topics.length || topicError) ? <div className="db-report-suggestions">
                    {matches.length ? <><h3>Already in the library</h3><ul>{matches.map((entry) => <li key={entry.name}><Link asChild><NextLink href={`/docs/${entry.name}/`}>{entry.title}</NextLink></Link><p className="db-report-note">{entry.description}</p></li>)}</ul></> : null}
                    {topics.length ? <><h3>Others have asked</h3><ul>{topics.map((topic) => <li key={topic.id}><Button variant="quiet" onClick={() => { update({ topicId: topic.id, title: topic.title }); setTopics([]); toast("Request selected. Add your email to join.") }}>Join <span className="db-yours" dir="auto">{topic.title}</span></Button><p className="db-report-note">{STATUS_LABELS[topic.status]}</p></li>)}</ul></> : null}
                    {topicError ? <p className="db-report-note">Similar requests couldn’t be checked. You can still describe your idea.</p> : null}
                  </div> : null}
                  {draft.topicId ? <div><p>Each email counts once. Extra context is optional.</p><Button variant="quiet" onClick={() => update({ topicId: undefined })}>Make a separate request instead</Button></div> : null}
                  <Field label={draft.kind === "bug" ? "What happened, and what did you expect?" : draft.topicId ? "Anything to add? (optional)" : "What should it do?"} hint={draft.kind === "bug" ? "Include steps to reproduce it and the page or component. Links are welcome." : "Describe the job it should do. Add links to examples or inspiration."} count maxLength={6000}>
                    <Textarea ref={descriptionInput} name="description" dir="auto" required={!draft.topicId} value={draft.description} disabled={Boolean(busy)} onChange={(event) => update({ description: event.target.value })} rows={4} data-error="Add a few details so we can understand the idea or issue." />
                  </Field>
                  <Field label="Your email" hint="For replies and updates about this report. Never shown on the board.">
                    <InputGroup><InputGroupInput name="email" type="email" dir="ltr" autoComplete="email" required maxLength={254} value={draft.email} disabled={Boolean(busy)} onChange={(event) => update({ email: event.target.value })} placeholder="you@example.com" data-error="Enter an email address with a name and a domain." /><InputGroupText>Private</InputGroupText></InputGroup>
                  </Field>
                  <div className="db-report-attachments">
                    <h3>Show us, if it helps.</h3>
                    <Dropzone key={dropKey} accept={MEDIA_TYPES.join(",")} maxSize={LIMITS.fileBytes} defaultFiles={draft.files.map((item) => item.file)} disabled={Boolean(busy)} prompt="Drop images or video" hint="PNG, JPEG, WebP, MP4 or WebM. Up to 6 files, 10 MiB each, 30 MiB together." onFilesChange={(files) => {
                      if (files.length > LIMITS.files || files.reduce((size, file) => size + file.size, 0) > LIMITS.totalBytes || files.some((file) => !file.size)) {
                        setError("Choose up to 6 non-empty files, no more than 30 MiB together. Your earlier files are still here.")
                        setDropKey((n) => n + 1)
                        return
                      }
                      setError("")
                      update({ files: files.map((file) => draft.files.find((item) => item.file === file) ?? { id: crypto.randomUUID(), file }) })
                    }} />
                    {draft.files.length ? <>
                      <details className="db-report-disclosure"><summary>Preview attachments</summary><MediaReview files={draft.files} /></details>
                    </> : null}
                  </div>
                  {draft.kind === "bug" ? <div className="db-report-diagnostics">
                    <Button variant="quiet" disabled={Boolean(busy)} aria-pressed={Boolean(draft.diagnostics)} onClick={() => {
                      update({ diagnostics: draft.diagnostics ? null : snapshotDiagnostics() })
                      toast(draft.diagnostics ? "Browser details removed." : "Browser details added. You can review them before sending.")
                    }}>{draft.diagnostics ? "Remove browser details" : "Include browser details"}</Button>
                    <p className="db-report-note">Optional: browser, screen size, language and page. Nothing is attached until you choose it.</p>
                    {draft.diagnostics ? <details className="db-report-disclosure"><summary>Review browser details</summary><pre className="db-report-payload" tabIndex={0}>{JSON.stringify(draft.diagnostics, null, 2)}</pre></details> : null}
                  </div> : null}
                  <div className="db-report-actions"><FormSubmit variant="bracket" busy="Preparing review" disabled={Boolean(busy)}>Review report</FormSubmit><Button variant="quiet" disabled={Boolean(busy)} onClick={reset}>Clear draft</Button></div>
                </Form>
              </section>
            )}
            <p role="status" className="db-report-note db-report-save">{busy || storage}</p>
            {error ? <p role="alert" className="db-report-error">{error}</p> : null}
            {!draft.receipt && connection !== "ready" ? <div className="db-report-connection" role="status">
              <p>{connection === "loading" ? "Checking the reporting connection. You can write while we connect." : "The reporting service isn’t available right now. You can keep writing and try again later."}</p>
              {connection === "unavailable" ? <Button variant="quiet" onClick={() => { setConnection("loading"); setReload((n) => n + 1) }}>Try connecting again</Button> : null}
            </div> : null}
            {!draft.receipt ? <GitHubFallback kind={draft.kind} title={draft.title} description={draft.description} /> : null}
            {!draft.title && !draft.description && !draft.receipt && !draft.attempted ? <div className="db-report-import">
              <Button variant="quiet" disabled={Boolean(busy)} onClick={() => importInput.current?.click()}>Open a saved receipt</Button>
              <input ref={importInput} type="file" accept=".json,application/json" aria-label="Choose a saved receipt" className="db-sr" tabIndex={-1} onChange={(event) => { const file = event.target.files?.[0]; event.target.value = ""; if (file) void importReceipt(file) }} />
            </div> : null}
          </>}
        </div>
      </div>
      <noscript><p className="db-report-foot">The private forms need JavaScript. <a href="https://github.com/luv-jeri/0dB/issues/new">Open a GitHub issue</a> instead.</p></noscript>
      {picking ? <PinPicker entries={entries} onSelect={selectItem} onCancel={() => { setAnnouncement("Picking cancelled. Your draft is unchanged."); finishPicking() }} /> : null}
    </Root>
  )
}
