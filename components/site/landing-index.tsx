"use client"

import * as React from "react"
import NextLink from "next/link"

import { Share } from "@/components/site/landing"

// The whole library at a glance: every name set as one wall of type, by movement, as a concert programme
// runs its pieces on. Beside it, a stage plays the piece you're at, live. Pointing at or focusing a name
// puts it on the stage; on a touch screen the name crossing the playhead does, as you scroll.
// Only the piece on the stage is mounted, and its example is fetched when it's first asked for.

export type Piece = { name: string; title: string; summary: string }
export type Movement = { num: string; name: string; pieces: Piece[] }

type Example = React.ComponentType
const loaded = new Map<string, Example>()
const load = (name: string) => import(`@/examples/${name}`).then((m: { default: Example }) => m.default)
// The home page's own sheet carries only what it sets; a piece on the stage needs its styles too. They come
// in one sheet, fetched as the index nears, off the path of the first paint.
let styled: Promise<unknown> | null = null
const style = () => (styled ??= import("@/app/registry.css").catch(() => {}))

/** A piece that throws on its own stage leaves the stage to its words. */
class Guard extends React.Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

function Preview({ name }: { name: string }) {
  const [got, setGot] = React.useState<{ name: string; E: Example } | null>(null)
  const Piece = loaded.get(name) ?? (got?.name === name ? got.E : null)
  React.useEffect(() => {
    if (loaded.has(name)) return
    let live = true
    load(name)
      .then((E) => {
        loaded.set(name, E)
        if (live) setGot({ name, E })
      })
      .catch(() => {})
    return () => {
      live = false
    }
  }, [name])
  return Piece ? (
    <Guard key={name}>{React.createElement(Piece)}</Guard>
  ) : null
}

const WORDS = ["quiet", "hush", "rest", "0dB"]
const still = () => matchMedia("(prefers-reduced-motion: reduce)").matches

/** Sets a field the way typing does, so the component's own handlers hear it. */
function type(el: HTMLInputElement | HTMLTextAreaElement, value: string) {
  const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype
  Object.getOwnPropertyDescriptor(proto, "value")?.set?.call(el, value)
  el.dispatchEvent(new Event("input", { bubbles: true }))
}

/**
 * While nobody is using the piece on the stage, it plays itself: it strikes its checkboxes, flips its switches,
 * steps its tabs and sliders, and types into its fields, one move at a time, so you see it answer. It only
 * makes moves that stay on the stage: nothing that opens a layer, follows a link, submits or copies. The
 * moment a hand or a key comes to the stage, it stops and leaves the piece to you.
 */
function usePerform(frame: React.RefObject<HTMLElement | null>, stage: React.RefObject<HTMLElement | null>, key: string) {
  React.useEffect(() => {
    const root = frame.current, host = stage.current
    if (!root || !host || still()) return
    let idle = true, seen = true, turn = 0, wait = 0, step = 0
    const timers = new Set<number>()
    const later = (f: () => void, ms: number) => { const t = window.setTimeout(() => { timers.delete(t); f() }, ms); timers.add(t) }
    const hands = () => { idle = false; clearTimeout(wait) }
    const away = () => { clearTimeout(wait); wait = window.setTimeout(() => (idle = true), 2500) }
    const events: [string, () => void][] = [["pointerenter", hands], ["pointerdown", hands], ["focusin", hands], ["keydown", hands], ["pointerleave", away], ["focusout", away]]
    events.forEach(([e, f]) => host.addEventListener(e, f))
    const view = new IntersectionObserver(([e]) => (seen = e.isIntersecting))
    view.observe(host)

    const moves = () =>
      [...root.querySelectorAll<HTMLElement>(
        'input[type=checkbox], input[type=radio], input[type=range], input:not([type]), input[type=text], input[type=search], input[type=number], textarea, [role=switch], [role=checkbox], [role=radio], [role=tab], [role=slider], [role=spinbutton], [aria-pressed], button[aria-expanded]:not([aria-haspopup])',
      )].filter((el) => !el.closest("a, [aria-haspopup], [data-perform=off]") && !(el as HTMLInputElement).disabled && !(el as HTMLInputElement).readOnly && el.getClientRects().length > 0 && el.getAttribute("aria-disabled") !== "true")

    function play(el: HTMLElement) {
      if (el instanceof HTMLInputElement && el.type === "range") {
        const min = +el.min || 0, max = +(el.max || 100), n = +el.value
        type(el, String(n + (max - min) / 5 > max ? min : n + (max - min) / 5))
        el.dispatchEvent(new Event("change", { bubbles: true }))
      } else if (el instanceof HTMLInputElement && el.type === "number") {
        type(el, String((+el.value || 0) + 1))
      } else if ((el instanceof HTMLInputElement && !["checkbox", "radio"].includes(el.type)) || el instanceof HTMLTextAreaElement) {
        const word = WORDS[step++ % WORDS.length], was = el.value
        if (was) { type(el, ""); return }
        ;[...word].forEach((_, i) => later(() => idle && type(el, word.slice(0, i + 1)), 90 * (i + 1)))
      } else if (el.matches("[role=slider], [role=spinbutton]")) {
        el.dispatchEvent(new KeyboardEvent("keydown", { key: step++ % 6 < 3 ? "ArrowRight" : "ArrowLeft", bubbles: true }))
      } else {
        if (el.getAttribute("role") === "tab") el.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, button: 0 }))
        el.click()
      }
    }

    const beat = window.setInterval(() => {
      if (!idle || !seen || document.hidden) return
      const all = moves()
      if (all.length) play(all[turn++ % all.length])
    }, 1400)
    return () => {
      clearInterval(beat)
      clearTimeout(wait)
      timers.forEach(clearTimeout)
      view.disconnect()
      events.forEach(([e, f]) => host.removeEventListener(e, f))
    }
  }, [frame, stage, key])
}

/**
 * The title as a line of type being reset: letters the old name and the new share slide to their new places,
 * and the rest are cut in, the way a compositor swaps a word in a set line. Quick, and still under reduced motion.
 */
function Title({ text }: { text: string }) {
  const ref = React.useRef<HTMLParagraphElement>(null)
  const last = React.useRef<{ ch: string; x: number }[]>([])
  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const origin = el.getBoundingClientRect().left
    const spans = [...el.querySelectorAll<HTMLElement>("[data-ch]")]
    const now = spans.map((s) => ({ ch: s.dataset.ch!.toLowerCase(), x: s.getBoundingClientRect().left - origin }))
    const before = last.current
    last.current = now
    if (!before.length || still()) return
    const used = new Set<number>()
    spans.forEach((s, i) => {
      let best = -1
      before.forEach((b, j) => { if (!used.has(j) && b.ch === now[i].ch && b.ch !== " " && (best < 0 || Math.abs(j - i) < Math.abs(best - i))) best = j })
      if (best >= 0) {
        used.add(best)
        const dx = before[best].x - now[i].x
        if (Math.abs(dx) > 0.5) s.animate([{ translate: `${dx}px 0` }, { translate: "0 0" }], { duration: 220, easing: "cubic-bezier(.2,.7,.2,1)" })
      } else {
        s.animate([{ clipPath: "inset(0 0 100% 0)", translate: "0 0.35em" }, { clipPath: "inset(0 0 -20% 0)", translate: "0 0" }], { duration: 180, delay: 14 * i, easing: "cubic-bezier(.2,.7,.2,1)", fill: "backwards" })
      }
    })
  }, [text])
  return (
    <p className="pieces-title" ref={ref}>
      <span className="db-sr">{text}</span>
      <span aria-hidden="true">
        {Array.from(text).map((c, i) => (
          <span key={`${i}${c}`} data-ch={c}>
            {c}
          </span>
        ))}
      </span>
    </p>
  )
}

export function PieceIndex({ movements, total }: { movements: Movement[]; total: number }) {
  const all = React.useMemo(() => movements.flatMap((m) => m.pieces.map((p) => ({ ...p, num: m.num, movement: m.name }))), [movements])
  const [at, setAt] = React.useState(0)
  const [awake, setAwake] = React.useState(false)
  const root = React.useRef<HTMLDivElement>(null)
  const hold = React.useRef(0)
  const stage = React.useRef<HTMLElement>(null)
  const frame = React.useRef<HTMLDivElement>(null)
  const piece = all[at]
  // The piece itself follows once the name has held for a moment: a flick through the wall fetches and mounts
  // nothing on the way, and a piece is never torn down while it's still measuring itself.
  const [playing, setPlaying] = React.useState(at)
  React.useEffect(() => {
    const t = window.setTimeout(() => setPlaying(at), 260)
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
    hold.current = window.setTimeout(() => setAt(i), 140) // a hand sweeping across the wall doesn't mount every piece it crosses
  }

  usePerform(frame, stage, `${awake}${playing}`)

  let n = -1
  return (
    <div className="pieces" ref={root}>
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
        <div className="db-corners pieces-preview">
          <div className="pieces-preview-scale" ref={frame}>
            {awake && playing === at ? <Preview name={piece.name} /> : null}
          </div>
        </div>
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
