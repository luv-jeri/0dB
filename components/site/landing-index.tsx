"use client"

import * as React from "react"
import NextLink from "next/link"

import { Share } from "@/components/site/landing"
import { useDemoClock, useDemoPlayer } from "@/components/site/demo-player"

// The whole library at a glance: every name set as one wall of type, by movement, as a concert programme
// runs its pieces on. Beside it, a stage plays the piece you're at, live. Pointing at or focusing a name
// puts it on the stage; on a touch screen the name crossing the playhead does, as you scroll.
// Only the piece on the stage is mounted, and its example is fetched when it's first asked for.

export type Piece = { name: string; title: string; summary: string }
export type Movement = { num: string; name: string; pieces: Piece[] }

type Example = React.ComponentType
const loaded = new Map<string, Example>()
const load = async (name: string) => (await liveExample(name)) ?? import(`@/examples/${name}`).then((m: { default: Example; States?: Example }) => PINNED.has(name) && m.States ? m.States : m.default)
// Layers are shown in place, so every surface can be read together without opening a portal.
const PINNED = new Set(["dialog", "popover", "hover-card", "tooltip", "drawer", "toast", "context-menu", "dropdown-menu", "tour", "typography"])
let styled: Promise<unknown> | null = null
const style = () => (styled ??= import("@/app/registry.css").catch(() => {}))
const FACE = ["data-pair", "data-scheme", "data-mode", "data-key"]
const still = () => matchMedia("(prefers-reduced-motion: reduce)").matches

/** The browser measures the actual balanced lines, including tracking and the selected variable face.
 * The server's text keeps its layout throughout. Only offscreen headings are armed; an initial paint
 * is never hidden or delayed. Each line passes its own baseline mask once, then leaves plain text. */
export function PassageTitle({ children, ...props }: React.ComponentProps<"h2"> & { children: string }) {
  const ref = React.useRef<HTMLHeadingElement>(null)
  React.useEffect(() => {
    const el = ref.current, source = el?.firstElementChild as HTMLElement | null
    if (!el || !source || still() || el.getBoundingClientRect().top < innerHeight) return
    let layers: HTMLElement[] = [], animations: Animation[] = []
    const finish = () => {
      animations.forEach((a) => a.cancel())
      animations = []
      layers.forEach((l) => l.remove())
      layers = []
      source.style.removeProperty("color")
    }
    const view = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      view.disconnect()
      if (still()) return
      const node = source.firstChild
      if (!node) return
      const box = el.getBoundingClientRect(), css = getComputedStyle(el)
      const lines: { text: string; x: number; y: number; height: number }[] = []
      const range = document.createRange()
      for (const word of children.matchAll(/\S+\s*/g)) {
        range.setStart(node, word.index!)
        range.setEnd(node, word.index! + word[0].trimEnd().length)
        const rect = range.getBoundingClientRect(), last = lines.at(-1)
        if (last && Math.abs(last.y - (rect.top - box.top)) < 2) last.text += word[0]
        else lines.push({ text: word[0], x: rect.left - box.left, y: rect.top - box.top, height: rect.height })
      }
      const ms = (token: string) => parseFloat(css.getPropertyValue(token)) || 0
      layers = lines.map((line, i) => {
        const mask = document.createElement("span"), ink = document.createElement("span")
        mask.className = "passage-line"
        mask.setAttribute("aria-hidden", "true")
        Object.assign(mask.style, { left: `${line.x}px`, top: `${line.y}px`, height: `${line.height * 1.12}px` })
        ink.textContent = line.text.trimEnd()
        mask.append(ink)
        el.append(mask)
        const animation = ink.animate([{ transform: "translateY(110%)" }, { transform: "translateY(0)" }], {
          duration: ms("--db-moderato"), delay: i * ms("--db-arpeggio"), easing: css.getPropertyValue("--db-exhale").trim(), fill: "both",
        })
        animations.push(animation)
        return mask
      })
      source.style.color = "transparent"
      Promise.all(animations.map((a) => a.finished)).then(finish).catch(() => {})
    }, { threshold: 0.08 })
    view.observe(el)
    const resize = new ResizeObserver(finish)
    resize.observe(el)
    const theme = new MutationObserver(finish)
    theme.observe(document.documentElement, { attributeFilter: FACE })
    const motion = matchMedia("(prefers-reduced-motion: reduce)")
    motion.addEventListener("change", finish)
    return () => { view.disconnect(); resize.disconnect(); theme.disconnect(); motion.removeEventListener("change", finish); finish() }
  }, [children])
  return <h2 {...props} ref={ref}><span>{children}</span></h2>
}

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
    const { WordRelay } = await import("@/registry/0db/ui/word-relay")
    return function RelayVariations() {
      const { ref, step } = useDemoClock()
      const [own, setOwn] = React.useState<number | null>(null)
      return <div ref={ref} data-demo-clock className="grid">{(["statement", "sentence"] as const).map((variant) => <p className={variant === "statement" ? "db-f" : "db-mp"} style={{ margin: 0 }} key={variant}><WordRelay variant={variant} autoplay={false} index={(own ?? step) % 4} onIndexChange={setOwn} words={["design.", "type.", "silence.", "yours."]}>It has to be</WordRelay></p>)}</div>
    }
  }
  if (name === "scroll-expand") {
    const { ScrollExpand } = await import("@/registry/0db/ui/scroll-expand")
    return function ExpandVariations() {
      const { ref, step } = useDemoClock()
      return <div ref={ref} data-demo-clock className="grid">{(["mark", "horizon"] as const).map((variant) => <ScrollExpand key={variant} variant={variant} progress={[1, 0.25, 0.6, 1, 0.6][step % 5]} caption={[variant, "Space opens"]}><p className="db-f" style={{ margin: 0, paddingBlock: "var(--db-space-6)" }}>Space<br />does the<br />layout.</p></ScrollExpand>)}</div>
    }
  }
  if (name === "steps") {
    const { Steps, Step, StepTitle } = await import("@/registry/0db/ui/steps")
    return function StepVariations() {
      const { ref, step } = useDemoClock()
      return <div ref={ref} data-demo-clock className="grid">{(["margin", "rise", "cascade", "folio"] as const).map((variant) => <div className="grid" key={variant}><span className="db-label">{variant}</span><Steps variant={variant} value={step % 3 + 1}>{["Brief", "Scope", "Call"].map((title) => <Step key={title}><StepTitle>{title}</StepTitle></Step>)}</Steps></div>)}</div>
    }
  }
  if (name === "activity-feed") {
    const { ActivityFeed } = await import("@/registry/0db/ui/activity-feed")
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
    const { Thread, ThreadDay } = await import("@/registry/0db/ui/thread")
    const { Message, MessageBody, MessageBubble, MessageHeader } = await import("@/registry/0db/ui/message")
    return function ThreadVariations() {
      const { ref, step } = useDemoClock()
      const words = ["The proofs are back.", "The flag holds at stamp size.", "Send it to the ferry office."]
      return <div ref={ref} data-demo-clock className="grid">{(["default", "rests", "running"] as const).map((variant) => <div className="grid" key={variant}><span className="db-label">{variant}</span><Thread variant={variant} label={`${variant} thread`} style={{ height: "15rem" }}><ThreadDay>Today</ThreadDay><Message><MessageHeader name="Ada" time="09:40" dateTime="2026-09-30T09:40" /><MessageBody><MessageBubble>The harbour mark is ready.</MessageBubble></MessageBody></Message><Message key={step % 3} arriving={step > 0}><MessageHeader name="Bruno" time="10:40" dateTime="2026-09-30T10:40" /><MessageBody><MessageBubble>{words[step % 3]}</MessageBubble></MessageBody></Message></Thread></div>)}</div>
    }
  }
  if (name === "tiling") {
    const { TilingEditor } = await import("@/registry/0db/ui/tiling")
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
    const { ModeToggle } = await import("@/registry/0db/ui/mode-toggle")
    return function ModeVariations() {
      return <div className="grid">{(["stop", "dimmer", "noon", "eclipse", "horizon", "words", "fermata", "sentence", "knockout", "hour"] as const).map((variant) => <div key={variant} className="grid"><span className="db-label">{variant}</span><ModeToggle variant={variant} /></div>)}</div>
    }
  }
  if (name === "progress") {
    const { Progress } = await import("@/registry/0db/ui/progress")
    return function ProgressVariations() {
      const { ref, step } = useDemoClock()
      return <div ref={ref} data-demo-clock className="grid">{(["hairline", "sentence", "count", "parentheses", "tally"] as const).map((variant) => <div key={variant} className="grid"><span className="db-label">{variant}</span><Progress variant={variant} value={(step % 5) * 25} label="Setting the type" /></div>)}</div>
    }
  }
  if (name === "agent-state") {
    const { AgentState } = await import("@/registry/0db/ui/agent-state")
    return function AgentVariations() {
      const { ref, step } = useDemoClock()
      const state = (["ready", "thinking", "working", "input", "done"] as const)[step % 5]
      return <div ref={ref} data-demo-clock className="grid">{(["dot", "word"] as const).map((variant) => <div className="grid" key={variant}><span className="db-label">{variant}</span><AgentState variant={variant} state={state} /></div>)}</div>
    }
  }
  if (name === "sheet") {
    const { Sheet, SheetTitle, SheetDescription } = await import("@/registry/0db/ui/sheet")
    return function SheetVariations() {
      return <div className="grid">{(["spine", "shelf", "rag", "fold"] as const).map((variant) => <div className="grid" key={variant}><span className="db-label">{variant}</span><Sheet><dialog open className="db-sheet" data-side="end" data-variant={variant === "spine" ? undefined : variant} style={{ position: "relative", inset: "auto", translate: "none", width: "100%", height: "18rem", maxHeight: "none", transition: "none" }}><p className="db-sheet-spine" aria-hidden="true">The brief</p><SheetTitle>The brief</SheetTitle><SheetDescription>Keep the flag. Lose the anchor. Set the timetable large.</SheetDescription></dialog></Sheet></div>)}</div>
    }
  }
  return null
}

function Preview({ name }: { name: string }) {
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

/** A whole name cuts through one line mask. Its letters never leave their word. */
function Title({ text }: { text: string }) {
  return <p className="pieces-title"><span key={text}>{text}</span></p>
}

export function PieceIndex({ movements, total }: { movements: Movement[]; total: number }) {
  const all = React.useMemo(() => movements.flatMap((m) => m.pieces.map((p) => ({ ...p, num: m.num, movement: m.name }))), [movements])
  const [at, setAt] = React.useState(0)
  const [awake, setAwake] = React.useState(false)
  const root = React.useRef<HTMLDivElement>(null)
  const hold = React.useRef(0)
  const stage = React.useRef<HTMLElement>(null)
  const frame = React.useRef<HTMLDivElement>(null)
  const lead = React.useRef<SVGPathElement>(null)
  const piece = all[at]
  // A hairline joins the chosen name to the stage. Its endpoints follow the sticky stage on scroll.
  React.useEffect(() => {
    const el = root.current, path = lead.current
    if (!el || !path) return
    let raf = 0
    const draw = () => {
      const name = el.querySelector(`[data-at="${at}"]`), target = stage.current
      if (!name || !target) return
      const box = el.getBoundingClientRect(), a = name.getBoundingClientRect(), b = target.getBoundingClientRect()
      const rtl = getComputedStyle(el).direction === "rtl"
      const wall = el.querySelector(".pieces-wall")!.getBoundingClientRect()
      const x = (rtl ? wall.left - 5 : wall.right + 5) - box.left, y = a.top + a.height / 2 - box.top
      const end = (rtl ? b.right + 8 : b.left - 8) - box.left, to = b.top + 12 - box.top
      const mid = (x + end) / 2
      path.setAttribute("d", `M${x},${y}H${mid}V${to}H${end}`)
    }
    const queue = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(draw) }
    const resize = new ResizeObserver(queue)
    resize.observe(el)
    addEventListener("scroll", queue, { passive: true })
    draw()
    return () => { cancelAnimationFrame(raf); resize.disconnect(); removeEventListener("scroll", queue) }
  }, [at])
  // The piece itself follows once the name has held for a moment: a flick through the wall fetches and mounts
  // nothing on the way, and a piece is never torn down while it's still measuring itself.
  const [playing, setPlaying] = React.useState(at)
  React.useEffect(() => {
    const t = window.setTimeout(() => setPlaying(at), 60)
    return () => clearTimeout(t)
  }, [at])

  // Wake the stage only when the index comes near, so the first view fetches no example at all.
  React.useEffect(() => {
    const el = root.current
    if (!el) return
    let live = true
    const near = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      near.disconnect()
      style().then(() => live && setAwake(true))
    }, { rootMargin: "600px 0px" })
    near.observe(el)
    return () => {
      live = false
      near.disconnect()
    }
  }, [])

  // Without a fine pointer, the playhead picks: the name crossing a line just under the stage.
  React.useEffect(() => {
    const el = root.current
    if (!el || matchMedia("(hover: hover) and (pointer: fine)").matches) return
    const head = new IntersectionObserver(
      (seen) => {
        for (const e of seen) if (e.isIntersecting) setAt(Number((e.target as HTMLElement).dataset.at))
      },
      { rootMargin: "-72% 0px -27% 0px" },
    )
    el.querySelectorAll("[data-at]").forEach((a) => head.observe(a))
    return () => head.disconnect()
  }, [])

  React.useEffect(() => () => clearTimeout(hold.current), [])
  const point = (i: number) => {
    clearTimeout(hold.current)
    hold.current = window.setTimeout(() => setAt(i), 30) // a hand sweeping across the wall doesn't mount every piece it crosses
  }

  const [performance, resetPerformance] = React.useReducer((n: number) => n + 1, 0)
  useDemoPlayer({ root: frame, host: stage, item: all[playing].name, identity: `${awake}${playing}`, reset: resetPerformance })

  let n = -1
  return (
    <div className="pieces" ref={root}>
      <svg className="pieces-lead" aria-hidden="true"><path ref={lead} /></svg>
      <div className="pieces-wall">
        {movements.map((m) => (
          <div key={m.num} className="pieces-movement">
            <h3 className="pieces-move">
              <span className="pieces-num">
                {m.num}
              </span>{" "}
              {m.name}
            </h3>{" "}
            <ul className="pieces-names">
              {m.pieces.map((p) => {
                const i = ++n
                return (
                  <li key={p.name}>
                    <NextLink
                      href={`/docs/${p.name}/`}
                      prefetch={false}
                      className="pieces-name"
                      data-at={i}
                      data-current={i === at || undefined}
                      onPointerEnter={(e) => e.pointerType === "mouse" && point(i)}
                      onFocus={() => {
                        clearTimeout(hold.current)
                        setAt(i)
                      }}
                    >
                      {p.title}
                      <span className="pieces-n" aria-hidden="true">
                        {i + 1}
                      </span>
                    </NextLink>{" "}
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
        <p className="pieces-more">
          Missing one?{" "}
          <NextLink href="/requests/" className="db-link">
            Request a component
          </NextLink>
          . Found a fault?{" "}
          <NextLink href="/feedback/?kind=bug" className="db-link">
            Report a bug
          </NextLink>
          .
        </p>
      </div>
      <aside className="pieces-stage" ref={stage} aria-label="The piece on the stage">
        <p className="pieces-where">
          <span>
            <span className="pieces-where-num">
              {piece.num}
            </span>{" "}
            <span key={piece.movement} className="pieces-where-name">
              {piece.movement}
            </span>
          </span>
          <span className="pieces-count">
            {String(at + 1).padStart(3, "0")}
            <span className="pieces-of"> / {total}</span>
          </span>
        </p>
        <Title text={piece.title} />
        <div className="db-corners pieces-preview" ref={frame} aria-label={`${piece.title} variations`} aria-describedby="pieces-performance">
          {awake && playing === at ? <Preview key={`${piece.name}-${performance}`} name={piece.name} /> : null}
        </div>
        <span className="db-sr" id="pieces-performance">Variations play together. Point at or focus the preview to pause and try them.</span>
        <p className="pieces-summary">{piece.summary}</p>
        <p className="pieces-actions">
          <NextLink href={`/docs/${piece.name}/`} className="db-link pieces-open">
            Open {piece.title}
          </NextLink>
          <Share url={`/docs/${piece.name}/`} title={`${piece.title}, in 0dB`}>
            {`Share ${piece.title}`}
          </Share>
        </p>
      </aside>
    </div>
  )
}
