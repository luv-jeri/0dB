"use client"

import * as React from "react"

// The home page's one bold moment, ported from the specimen: the wordmark exhales
// along its width axis, then pretext parts the manifesto around the pause, which
// follows a fine pointer and stays where it's left. Reduced motion: static layout,
// the pause jumps on click.

export const MANIFESTO =
  "Most interfaces talk over you. 0dB waits. It is a component library made of two typefaces, one colour and a great deal of space, for work that is read slowly and used for hours. There are no boxes to fill and no icons to decode. A checkbox is a sentence you strike through. A switch is the last word of a sentence, and you choose it. Everything the interface says is set upright in a grotesque; everything you say back arrives in an italic serif, so your words are never mistaken for ours. Colour appears once, to show where you are. Motion answers you, then rests. What remains is the quiet between the notes, and that is where the reading happens."

type Cursor = { segmentIndex: number; graphemeIndex: number }

export function Overture() {
  const region = React.useRef<HTMLDivElement>(null)
  const linesRef = React.useRef<HTMLDivElement>(null)
  const markRef = React.useRef<SVGSVGElement>(null)
  const [flowing, setFlowing] = React.useState(false)

  React.useEffect(() => {
    const el = region.current, lines = linesRef.current, mark = markRef.current
    if (!el || !lines || !mark) return
    const arc = mark.querySelector("path")!, dot = mark.querySelector("circle")!
    const still = matchMedia("(prefers-reduced-motion: reduce)")
    const hand = matchMedia("(hover: hover) and (pointer: fine)")
    let cancelled = false, frame = 0, observer: ResizeObserver | undefined
    const off: (() => void)[] = []

    ;(async () => {
      let lib: typeof import("@chenglou/pretext")
      try { lib = await import("@chenglou/pretext") } catch { return } // the plain paragraph stays
      if (cancelled) return
      const { prepareWithSegments, layoutNextLine } = lib
      const GAP = 24, pool: HTMLSpanElement[] = []
      let prepared: ReturnType<typeof prepareWithSegments>
      let size = 0, font = "", lh = 32, W = 0, r = 100, R = 124, base = 0, H = 0
      let cx = 0, cy = 0, tx = 0, ty = 0, fx = 0.64, fy = 0.46
      const start = (): Cursor => ({ segmentIndex: 0, graphemeIndex: 0 })

      async function measure() {
        const [s, l] = innerWidth >= 900 ? [22, 32] : innerWidth >= 560 ? [19, 28] : [17, 26]
        const voice = getComputedStyle(document.documentElement).getPropertyValue("--db-voice").trim()
        const next = `400 ${s}px ${voice}`
        if (next !== font) {
          size = s; lh = l; font = next
          await document.fonts.load(font)
          prepared = prepareWithSegments(MANIFESTO, font)
          el!.style.setProperty("--size", `${size}px`)
          el!.style.setProperty("--lh", `${lh}px`)
        }
        W = el!.clientWidth
        r = Math.min(150, Math.max(70, W * 0.13))
        R = r + GAP
        let c = start(), n = 0, line
        while ((line = layoutNextLine(prepared, c, W))) { c = line.end; n++ }
        base = n * lh
        H = 0
        arc.setAttribute("stroke-width", String((1.5 * 100) / r))
        dot.setAttribute("r", String((Math.max(12, r * 0.14) / 2) * (100 / r)))
      }

      function put(i: number, t: string, x: number, y: number) {
        let s = pool[i]
        if (!s) { s = lines!.appendChild(document.createElement("span")); s.style.setProperty("--i", String(i)); pool[i] = s }
        s.hidden = false
        if (s.textContent !== t) s.textContent = t
        s.style.translate = `${Math.round(x * 2) / 2}px ${y}px`
      }

      function render() {
        const MIN = W < 500 ? W * 0.5 : 160 // on a phone, rows beside the pause stay empty
        let cursor = start(), k = 0, y = 0, bottom = 0, done = false
        while (!done && y < 20000) {
          const dy = cy < y ? y - cy : cy > y + lh ? cy - y - lh : 0
          const hw = dy < R ? Math.sqrt(R * R - dy * dy) : -1
          const slots = hw < 0 ? [[0, W]] : [[0, cx - hw], [cx + hw, W]]
          for (const [a, b] of slots) {
            const x0 = Math.max(0, a), x1 = Math.min(W, b)
            if (x1 - x0 < MIN) continue
            const line = layoutNextLine(prepared, cursor, x1 - x0)
            if (!line) { done = true; break }
            cursor = line.end
            put(k++, line.text.trimEnd(), x0, y)
            bottom = y + lh
          }
          y += lh
        }
        for (let i = k; i < pool.length; i++) pool[i].hidden = true
        H = Math.max(H, bottom, cy + r) // only grows, so the page below never jumps
        el!.style.height = `${H}px`
        mark!.style.width = mark!.style.height = `${2 * r}px`
        mark!.style.translate = `${cx - r}px ${cy - r}px`
      }

      const settle = () => { fx = cx / W; fy = cy / base }
      function tick() {
        cx += (tx - cx) * 0.08
        cy += (ty - cy) * 0.08
        const arrived = Math.abs(tx - cx) < 0.3 && Math.abs(ty - cy) < 0.3
        if (arrived) { cx = tx; cy = ty; settle() }
        render()
        frame = arrived ? 0 : requestAnimationFrame(tick)
      }
      function aim(e: PointerEvent | MouseEvent) {
        const b = el!.getBoundingClientRect()
        tx = Math.min(W, Math.max(0, e.clientX - b.left))
        ty = Math.min(base, Math.max(0, e.clientY - b.top))
        if (still.matches) { cx = tx; cy = ty; settle(); render(); return }
        if (!frame) frame = requestAnimationFrame(tick)
      }
      const move = (e: PointerEvent) => { if (hand.matches && !still.matches) aim(e) }
      el!.addEventListener("pointermove", move)
      el!.addEventListener("click", aim)
      off.push(() => { el!.removeEventListener("pointermove", move); el!.removeEventListener("click", aim) })

      const relayout = async () => {
        await measure()
        if (cancelled) return
        cx = tx = fx * W
        cy = ty = fy * base
        render()
      }
      await relayout()
      if (cancelled) return
      el!.classList.add("intro")
      setFlowing(true)
      const t = setTimeout(() => el!.classList.remove("intro"), 4000)
      off.push(() => clearTimeout(t))

      // A new pair changes the voice: lay out again in it.
      const pair = new MutationObserver(() => relayout())
      pair.observe(document.documentElement, { attributes: true, attributeFilter: ["data-pair"] })
      off.push(() => pair.disconnect())

      let lastW = W
      observer = new ResizeObserver(() => {
        if (el!.clientWidth === lastW) return
        lastW = el!.clientWidth
        relayout()
      })
      observer.observe(el!)
    })()

    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      observer?.disconnect()
      off.forEach((f) => f())
    }
  }, [])

  return (
    <section className="overture" aria-labelledby="title">
      <h1 className="overture-title" id="title">0dB</h1>
      <p className="overture-def">
        <i className="db-term">noun, in acoustics.</i> The quietest sound a person can hear.
      </p>
      <p className="flow-caption margin">The pause goes where you point, and stays where you leave it.</p>
      <div className="flow" ref={region} aria-hidden="true">
        <svg className="flow-mark" ref={markRef} viewBox="-100 -100 200 200">
          <path d="M -58 29 A 58 58 0 0 1 58 29" pathLength={1} strokeDasharray={1} />
          <circle cx="0" cy="17" r="7" />
        </svg>
        <div className="flow-lines" ref={linesRef} />
      </div>
      <p className={flowing ? "manifesto db-sr" : "manifesto"}>{MANIFESTO}</p>
    </section>
  )
}
