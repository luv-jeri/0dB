"use client"

import * as React from "react"

import { useComposedRefs } from "@/registry/0db/lib/refs"
import { cn } from "@/registry/0db/lib/utils"

type PassageProps = Omit<React.ComponentProps<"p">, "children"> & {
  as?: "p" | "div"
  children: string
  announce?: boolean
  onSettled?: () => void
}

const milliseconds = (value: string) => (parseFloat(value) || 0) * (value.trim().endsWith("ms") ? 1 : 1000)

/** A new thought takes its own room. Only the two current readings ever share the measure. */
function Passage({ as: Tag = "p", children: text, announce = false, onSettled, className, ref: forwardedRef, ...props }: PassageProps) {
  const root = React.useRef<HTMLParagraphElement>(null)
  const art = React.useRef<HTMLSpanElement>(null)
  const previous = React.useRef(text)
  const settled = React.useEffectEvent(() => onSettled?.())
  const ref = useComposedRefs(root, forwardedRef)

  React.useEffect(() => {
    const el = root.current
    const layer = art.current
    if (!el || !layer) return
    const oldText = previous.current
    previous.current = text
    let cancelled = false
    let generation = 0
    let width = el.clientWidth
    let animations: Animation[] = []
    let notified = oldText === text
    const clean = () => {
      animations.forEach((animation) => animation.cancel())
      animations = []
      layer.replaceChildren()
      el.removeAttribute("data-moving")
    }
    const finish = () => {
      clean()
      if (!notified) { notified = true; settled() }
    }
    async function lay(animate: boolean) {
      const revision = ++generation
      clean()
      try {
        const lib = await import("@chenglou/pretext")
        const style = getComputedStyle(el!)
        const font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
        await document.fonts.load(font, oldText + text)
        if (cancelled || revision !== generation) return
        width = el!.clientWidth
        if (!width || !animate || oldText === text) { finish(); return }
        const measure = Math.max(1, width - parseFloat(style.paddingInlineStart) - parseFloat(style.paddingInlineEnd))
        const leading = parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.6
        const options = { letterSpacing: parseFloat(style.letterSpacing) || 0 }
        const old = lib.layoutWithLines(lib.prepareWithSegments(oldText, font, options), measure, leading)
        const next = lib.layoutWithLines(lib.prepareWithSegments(text, font, options), measure, leading)
        const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches
        const duration = reduce ? 120 : milliseconds(style.getPropertyValue("--db-andante"))
        const step = reduce ? 0 : milliseconds(style.getPropertyValue("--db-arpeggio"))
        const easing = style.getPropertyValue("--db-exhale").trim() || "ease-out"
        const direction = style.direction === "rtl" ? -1 : 1
        el!.setAttribute("data-moving", "")
        for (const [reading, incoming] of [[old, false], [next, true]] as const) {
          const sheet = document.createElement("span")
          sheet.className = "db-passage-lines"
          sheet.style.insetInlineStart = style.paddingInlineStart
          sheet.style.insetInlineEnd = style.paddingInlineEnd
          sheet.style.insetBlockStart = style.paddingTop
          layer!.append(sheet)
          reading.lines.forEach((line, index) => {
            const row = document.createElement("span")
            row.textContent = line.text || "\u00a0"
            sheet.append(row)
            const far = reduce ? "none" : `translateX(${(incoming ? -1 : 1) * direction * 0.8}em)`
            const frames = incoming
              ? [{ opacity: 0, transform: far }, { opacity: 1, transform: "none" }]
              : [{ opacity: 1, transform: "none" }, { opacity: 0, transform: far }]
            animations.push(row.animate(frames, { duration, delay: index * step + (incoming && !reduce ? duration / 3 : 0), easing, fill: "both" }))
          })
        }
        if (!reduce) {
          const padding = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom)
          const border = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth)
          const extra = style.boxSizing === "border-box" ? padding + border : 0
          animations.push(el!.animate([{ height: `${old.height + extra}px` }, { height: `${next.height + extra}px` }], { duration, easing, fill: "both" }))
        }
        await Promise.all(animations.map((animation) => animation.finished))
        if (!cancelled && revision === generation) finish()
      } catch {
        if (!cancelled && revision === generation) finish()
      }
    }
    void lay(true)
    const resized = new ResizeObserver(() => { if (el.clientWidth !== width) void lay(false) })
    resized.observe(el)
    const restyled = new MutationObserver(() => { void lay(false) })
    restyled.observe(document.documentElement, { attributeFilter: ["data-pair", "data-scheme", "data-mode", "data-key"] })
    const motion = matchMedia("(prefers-reduced-motion: reduce)")
    const stop = () => { generation++; finish() }
    motion.addEventListener("change", stop)
    return () => {
      cancelled = true
      resized.disconnect()
      restyled.disconnect()
      motion.removeEventListener("change", stop)
      clean()
    }
  }, [text, Tag])

  return (
    <Tag ref={ref} data-slot="passage" className={cn("db-passage", className)} {...props}>
      <span className="db-passage-text" aria-live={announce ? "polite" : undefined} aria-atomic={announce || undefined}>{text}</span>
      <span ref={art} className="db-passage-art" aria-hidden="true" />
    </Tag>
  )
}

export { Passage, type PassageProps }
