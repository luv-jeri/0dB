"use client"

import * as React from "react"

import { useDemoClock } from "@/components/site/demo-player"

type Example = React.ComponentType
const loaded = new Map<string, Example>()
const load = async (name: string) => (await liveExample(name)) ?? import(`@/examples/${name}`).then((m: { default: Example; States?: Example }) => PINNED.has(name) && m.States ? m.States : m.default)
// Layers are shown in place, so every surface can be read together without opening a portal.
const PINNED = new Set(["dialog", "popover", "hover-card", "tooltip", "drawer", "toast", "context-menu", "dropdown-menu", "tour", "typography"])
const FACE = ["data-pair", "data-scheme", "data-mode", "data-key"]

/** A failure stays legible and offers the actual specimen instead of an empty stage. */
class Guard extends React.Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    return this.state.failed ? <p data-preview-error>Preview unavailable. Open the component below.</p> : this.props.children
  }
}

// These are layouts for the examples, not changes to the components' contracts. Each gallery keeps all
// its variants mounted. A natural-size sheet is fitted in both dimensions, including after live changes.
const COLUMNS: Record<string, number> = {
  "accordion": 2, "activity-feed": 2, "agent-chat": 2, "area-chart": 2, "avatar": 2, "breadcrumb": 2,
  "calendar": 2, "chart": 2, "checkbox": 2, "collapsible": 3, "combobox": 2, "data-table": 2, "dialog": 3,
  "dropzone": 2, "empty": 2, "field": 2, "form": 2, "grid": 2, "input-group": 2, "input-otp": 2,
  "item": 2, "line-chart": 2, "mode-toggle": 3, "number-input": 2, "pagination": 1, "picks": 2,
  "progress": 2, "radio-group": 2, "scroll-area": 2, "scrollbar": 2, "scroll-expand": 2, "select": 2, "skeleton": 2, "steps": 2, "stat": 2,
  "sheet": 2, "source": 2, "spinner": 3, "table": 2, "tabs": 2, "thread": 2, "tiling": 2, "toggle": 2, "tree": 2, "typography": 2,
}
const WIDTHS: Record<string, number> = { "calendar": 880, "agent-chat": 1000, "agent-state": 240, "data-table": 1100, "table": 1000, "form": 960, "source": 1000, "dialog": 1100 }

async function liveExample(name: string): Promise<Example | null> {
  if (name === "word-relay") {
    const { WordRelay } = await import("@/registry/0nlytype/ui/word-relay")
    return function RelayVariations() {
      const { ref, step } = useDemoClock()
      const [own, setOwn] = React.useState<number | null>(null)
      return <div ref={ref} data-demo-clock className="grid">{(["statement", "sentence"] as const).map((variant) => <p className={variant === "statement" ? "db-f" : "db-mp"} style={{ margin: 0 }} key={variant}><WordRelay variant={variant} autoplay={false} index={(own ?? step) % 4} onIndexChange={setOwn} words={["design.", "type.", "silence.", "yours."]}>It has to be</WordRelay></p>)}</div>
    }
  }
  if (name === "scroll-expand") {
    const { ScrollExpand } = await import("@/registry/0nlytype/ui/scroll-expand")
    return function ExpandVariations() {
      const { ref, step } = useDemoClock()
      return <div ref={ref} data-demo-clock className="grid">{(["mark", "horizon"] as const).map((variant) => <ScrollExpand key={variant} variant={variant} progress={[1, 0.25, 0.6, 1, 0.6][step % 5]} caption={[variant, "Space opens"]}><p className="db-f" style={{ margin: 0, paddingBlock: "var(--db-space-6)" }}>Space<br />does the<br />layout.</p></ScrollExpand>)}</div>
    }
  }
  if (name === "steps") {
    const { Steps, Step, StepTitle } = await import("@/registry/0nlytype/ui/steps")
    return function StepVariations() {
      const { ref, step } = useDemoClock()
      return <div ref={ref} data-demo-clock className="grid">{(["margin", "rise", "cascade", "folio"] as const).map((variant) => <div className="grid" key={variant}><span className="db-label">{variant}</span><Steps variant={variant} value={step % 3 + 1}>{["Brief", "Scope", "Call"].map((title) => <Step key={title}><StepTitle>{title}</StepTitle></Step>)}</Steps></div>)}</div>
    }
  }
  if (name === "activity-feed") {
    const { ActivityFeed } = await import("@/registry/0nlytype/ui/activity-feed")
    const entries = [
      { id: "proof", who: "Ada", what: "approved the proof", at: "2026-09-30T16:40" },
      { id: "mark", who: "Bruno", what: "shared the mark", at: "2026-09-30T14:12" },
      { id: "brief", what: "The brief was agreed", at: "2026-09-30T14:02" },
    ]
    return function FeedVariations() {
      return <div className="grid">{(["ledger", "almanac", "lapse"] as const).map((variant) => <div className="grid" key={variant}><span className="db-label">{variant}</span><ActivityFeed variant={variant} entries={entries} initial={2} days={{ "2026-09-30": "Today" }} /></div>)}</div>
    }
  }
  if (name === "thread") {
    const { Thread, ThreadDay } = await import("@/registry/0nlytype/ui/thread")
    const { Message, MessageBody, MessageBubble, MessageHeader } = await import("@/registry/0nlytype/ui/message")
    return function ThreadVariations() {
      const { ref, step } = useDemoClock()
      const words = ["The proofs are back.", "The flag holds at stamp size.", "Send it to the ferry office."]
      return <div ref={ref} data-demo-clock className="grid">{(["default", "rests", "running"] as const).map((variant) => <div className="grid" key={variant}><span className="db-label">{variant}</span><Thread variant={variant} label={`${variant} thread`} style={{ height: "15rem" }}><ThreadDay>Today</ThreadDay><Message><MessageHeader name="Ada" time="09:40" dateTime="2026-09-30T09:40" /><MessageBody><MessageBubble>The harbour mark is ready.</MessageBubble></MessageBody></Message><Message key={step % 3} arriving={step > 0}><MessageHeader name="Bruno" time="10:40" dateTime="2026-09-30T10:40" /><MessageBody><MessageBubble>{words[step % 3]}</MessageBubble></MessageBody></Message></Thread></div>)}</div>
    }
  }
  if (name === "tiling") {
    const { TilingEditor } = await import("@/registry/0nlytype/ui/tiling")
    return function TilingVariations() {
      const { ref, step } = useDemoClock()
      const layout = [
        { id: "space", label: "Space", column: step % 2 ? 7 : 1, row: 1, span: 6, rows: 1 },
        { id: "type", label: "Type", column: step % 2 ? 1 : 7, row: 2, span: 6, rows: 1 },
      ]
      const [own, setOwn] = React.useState<typeof layout | null>(null)
      return <div ref={ref} data-demo-clock className="grid">{(["rules", "crosses"] as const).map((variant) => <div className="grid" key={variant}><span className="db-label">{variant}</span><TilingEditor variant={variant} label="Make room for the words" value={own ?? layout} onValueChange={setOwn} /></div>)}</div>
    }
  }
  if (name === "mode-toggle") {
    const { ModeToggle } = await import("@/registry/0nlytype/ui/mode-toggle")
    return function ModeVariations() {
      return <div className="grid">{(["stop", "dimmer", "noon", "eclipse", "horizon", "words", "fermata", "sentence", "knockout", "hour"] as const).map((variant) => <div key={variant} className="grid"><span className="db-label">{variant}</span><ModeToggle variant={variant} /></div>)}</div>
    }
  }
  if (name === "progress") {
    const { Progress } = await import("@/registry/0nlytype/ui/progress")
    return function ProgressVariations() {
      const { ref, step } = useDemoClock()
      return <div ref={ref} data-demo-clock className="grid">{(["hairline", "sentence", "count", "parentheses", "tally"] as const).map((variant) => <div key={variant} className="grid"><span className="db-label">{variant}</span><Progress variant={variant} value={(step % 5) * 25} label="Setting the type" /></div>)}</div>
    }
  }
  if (name === "agent-state") {
    const { AgentState } = await import("@/registry/0nlytype/ui/agent-state")
    return function AgentVariations() {
      const { ref, step } = useDemoClock()
      const state = (["ready", "thinking", "working", "input", "done"] as const)[step % 5]
      return <div ref={ref} data-demo-clock className="grid">{(["dot", "word"] as const).map((variant) => <div className="grid" key={variant}><span className="db-label">{variant}</span><AgentState variant={variant} state={state} /></div>)}</div>
    }
  }
  if (name === "sheet") {
    const { Sheet, SheetTitle, SheetDescription } = await import("@/registry/0nlytype/ui/sheet")
    return function SheetVariations() {
      return <div className="grid">{(["spine", "shelf", "rag", "fold"] as const).map((variant) => <div className="grid" key={variant}><span className="db-label">{variant}</span><Sheet><dialog open className="db-sheet" data-side="end" data-variant={variant === "spine" ? undefined : variant} style={{ position: "relative", inset: "auto", translate: "none", width: "100%", height: "18rem", maxHeight: "none", transition: "none" }}><p className="db-sheet-spine" aria-hidden="true">The brief</p><SheetTitle>The brief</SheetTitle><SheetDescription>Keep the flag. Lose the anchor. Set the timetable large.</SheetDescription></dialog></Sheet></div>)}</div>
    }
  }
  return null
}

export default function Preview({ name }: { name: string }) {
  const [got, setGot] = React.useState<{ name: string; E: Example } | null>(null)
  const [failed, setFailed] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)
  const Piece = loaded.get(name) ?? (got?.name === name ? got.E : null)
  React.useEffect(() => {
    if (loaded.has(name)) return
    let live = true
    load(name).then((E) => { loaded.set(name, E); if (live) setGot({ name, E }) }).catch(() => live && setFailed(true))
    return () => { live = false }
  }, [name])
  React.useLayoutEffect(() => {
    const sheet = ref.current, frame = sheet?.parentElement
    if (!sheet || !frame || !Piece) return
    let raf = 0
    const fit = () => {
      const css = getComputedStyle(frame)
      const w = frame.clientWidth - parseFloat(css.paddingLeft) - parseFloat(css.paddingRight)
      const h = frame.clientHeight - parseFloat(css.paddingTop) - parseFloat(css.paddingBottom)
      const width = Math.max(sheet.offsetWidth, sheet.scrollWidth), height = Math.max(sheet.offsetHeight, sheet.scrollHeight)
      const scale = Math.min(w / width, h / height, 1.15)
      sheet.style.setProperty("--preview-scale", String(scale))
      sheet.dataset.fitted = "true"
    }
    const queue = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(fit) }
    const resize = new ResizeObserver(queue)
    resize.observe(sheet)
    resize.observe(frame)
    const changes = new MutationObserver(queue)
    changes.observe(sheet, { subtree: true, childList: true, characterData: true })
    const theme = new MutationObserver(queue)
    theme.observe(document.documentElement, { attributeFilter: FACE })
    document.fonts.ready.then(queue)
    fit()
    return () => { cancelAnimationFrame(raf); resize.disconnect(); changes.disconnect(); theme.disconnect() }
  }, [Piece, name])
  return (
    <div className="pieces-preview-scale" ref={ref} data-piece={name} data-pinned={PINNED.has(name) || undefined} style={{ "--preview-width": `${WIDTHS[name] ?? 680}px`, "--preview-columns": COLUMNS[name] ?? 1 } as React.CSSProperties}>
      <div className="pieces-preview-demo">
        {failed ? <p data-preview-error>Preview unavailable. Open the component below.</p> : Piece ? <Guard key={name}>{React.createElement(Piece)}</Guard> : <p className="pieces-loading" role="status">Setting the type…</p>}
      </div>
    </div>
  )
}

