"use client"

import * as React from "react"
import NextLink from "next/link"
import dynamic from "next/dynamic"

import { Share } from "@/components/site/landing"
import { DEMO_SCORES, useDemoPlayer } from "@/components/site/demo-player"
import { Button } from "@/registry/0nlytype/ui/button"

// The whole library at a glance: every name set as one wall of type, by movement, as a concert programme
// runs its pieces on. Beside it, a stage plays the piece you're at, live. Pointing at or focusing a name
// puts it on the stage; on a touch screen the name crossing the playhead does, as you scroll.
// Only the piece on the stage is mounted, and its example is fetched when it's first asked for.

export type Piece = { name: string; title: string; summary: string }
export type Movement = { num: string; name: string; pieces: Piece[] }

const Preview = dynamic(() => import("@/components/site/landing-preview"), { ssr: false })
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
      const duration = ms("--ot-moderato"), stagger = ms("--ot-arpeggio"), easing = css.getPropertyValue("--ot-exhale").trim()
      layers = lines.map((line, i) => {
        const mask = document.createElement("span"), ink = document.createElement("span")
        mask.className = "passage-line"
        mask.setAttribute("aria-hidden", "true")
        Object.assign(mask.style, { left: `${line.x}px`, top: `${line.y}px`, height: `${line.height * 1.12}px` })
        ink.textContent = line.text.trimEnd()
        mask.append(ink)
        el.append(mask)
        const animation = ink.animate([{ transform: "translateY(110%)" }, { transform: "translateY(0)" }], {
          duration, delay: i * stagger, easing, fill: "both",
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
    let live = true, idle = 0, deferred = 0
    const wake = () => {
      const ready = () => { if (live) style().then(() => live && setAwake(true)) }
      if (typeof requestIdleCallback === "function") idle = requestIdleCallback(ready, { timeout: 1400 })
      else deferred = window.setTimeout(ready, 0)
    }
    const near = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      near.disconnect()
      if (document.readyState === "complete") wake()
      else addEventListener("load", wake, { once: true })
    }, { rootMargin: "200px 0px" })
    near.observe(el)
    return () => {
      live = false
      near.disconnect()
      if (idle) cancelIdleCallback(idle)
      clearTimeout(deferred)
      removeEventListener("load", wake)
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
  // The stage holds still until the person presses Demonstrate; it is only offered where the piece has something to show.
  const demo = useDemoPlayer({ root: frame, host: stage, item: all[playing].name, identity: `${awake}${playing}`, reset: resetPerformance })
  const candidate = !!DEMO_SCORES[all[playing].name]?.script && playing === at

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
          <NextLink href="/requests/" className="ot-link">
            Request a component
          </NextLink>
          . Found a fault?{" "}
          <NextLink href="/feedback/?kind=bug" className="ot-link">
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
        <div className="ot-corners pieces-preview" id="pieces-preview" ref={frame} role="group" aria-label={`${piece.title} variations`} aria-describedby="pieces-performance">
          {awake && playing === at ? <Preview key={`${piece.name}-${performance}`} name={piece.name} /> : null}
        </div>
        <span className="ot-sr" id="pieces-performance">{candidate ? "The variations are live. Press Demonstrate to watch them answer, or point at or focus the preview to try them yourself." : "The variations are live. Point at or focus the preview to try them."}</span>
        <span className="ot-sr" role="status" aria-live="polite" aria-atomic="true">{demo.state === "playing" ? "Demonstrating" : demo.state === "finished" ? "Demo finished" : demo.state === "stopped" ? "Demo stopped. Your turn." : ""}</span>
        <p className="pieces-summary">{piece.summary}</p>
        <p className="pieces-actions">
          <NextLink href={`/docs/${piece.name}/`} className="ot-link pieces-open">
            Open {piece.title}
          </NextLink>
          <Share url={`/docs/${piece.name}/`} title={`${piece.title}, in 0nlyType`}>
            {`Share ${piece.title}`}
          </Share>
          {candidate ? (
            <Button variant="bracket" data-demo-control onClick={demo.state === "playing" ? demo.stop : demo.demonstrate} disabled={!demo.interactive} aria-controls="pieces-preview">
              {demo.state === "playing" ? "Stop" : "Demonstrate"}
            </Button>
          ) : null}
        </p>
      </aside>
    </div>
  )
}
