"use client"

import * as React from "react"

import { useComposedRefs } from "@/registry/0nlytype/lib/refs"
import { cn } from "@/registry/0nlytype/lib/utils"

type SelectProps = React.ComponentProps<"select"> & {
  /** The words before the choice: "Sort by". Clicking them opens the list. */
  label?: React.ReactNode
  /**
   * underline (default): the chosen word, italic over a hairline.
   * compose: a new choice is set from the letters of the last; the ones they share slide over.
   * ruby: the other choices are set small above the word; point at one to pick it.
   */
  variant?: "underline" | "compose" | "ruby"
  /** Classes for the sentence around the choice. className goes to the select. */
  rootClassName?: string
  /** Pins a state for documentation ("hover"); set on the root. */
  "data-force"?: string
}

type Choice = { value: string; label: string }

const text = (node: React.ReactNode): string =>
  typeof node === "string" || typeof node === "number" ? String(node) : Array.isArray(node) ? node.map(text).join("") : ""

/** The <option>s among the children, for the first paint. After that the select itself is read. */
function choicesOf(children: React.ReactNode): Choice[] {
  return React.Children.toArray(children).flatMap((child) => {
    if (!React.isValidElement<React.ComponentProps<"option">>(child) || child.type !== "option") return []
    const label = text(child.props.children)
    return [{ value: child.props.value === undefined ? label : String(child.props.value), label }]
  })
}

const read = (el: HTMLSelectElement): Choice[] => Array.from(el.options, (o) => ({ value: o.value, label: o.text }))
const graphemes = (s: string) => Array.from(new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(s), (g) => g.segment)
/** Distance from the word's inline start to a letter's inline start, so right to left measures the same way. */
function edge(word: HTMLElement) {
  const rtl = getComputedStyle(word).direction === "rtl"
  const box = word.getBoundingClientRect()
  const at = (el: Element) => {
    const r = el.getBoundingClientRect()
    return rtl ? box.right - r.right : r.left - box.left
  }
  return Object.assign(at, { dir: rtl ? -1 : 1 })
}
/** A tempo token in milliseconds: the tokens are written in seconds or milliseconds. */
const ms = (v: string, fallback: number) => (v.trim().endsWith("ms") ? parseFloat(v) : parseFloat(v) * 1000) || fallback
const still = () => typeof matchMedia === "undefined" || matchMedia("(prefers-reduced-motion: reduce)").matches

/** A choice inside a sentence. The chosen word is yours, in italic over a hairline. Give it <option>s. */
function Select({ label, variant = "underline", className, rootClassName, "data-force": force, children, onChange, ref: forwardedRef, ...props }: SelectProps) {
  const Root = label ? "label" : "span"
  const drawn = variant !== "underline"
  const select = React.useRef<HTMLSelectElement>(null)
  const composedRef = useComposedRefs(select, forwardedRef)
  const box = React.useRef<HTMLSpanElement>(null)
  const word = React.useRef<HTMLSpanElement>(null)
  const ghosts = React.useRef<HTMLSpanElement>(null)
  const ruby = React.useRef<HTMLSpanElement>(null)
  // Where things stood the moment before a change, so the layout effect can move them from there.
  const before = React.useRef<{ width: number; sorts: { ch: string; x: number }[]; line?: DOMRect; picked?: DOMRect; tier: Map<string, number>; was: string } | null>(null)

  const [choices, setChoices] = React.useState<Choice[]>(() => choicesOf(children))
  const [current, setCurrent] = React.useState<string>(() => {
    const want = props.value ?? props.defaultValue
    return want === undefined ? (choicesOf(children)[0]?.value ?? "") : String(want)
  })

  // The select is the truth: read it after mount, and whenever a controlled value or the options change.
  React.useLayoutEffect(() => {
    if (!drawn || !select.current) return
    setChoices(read(select.current))
    setCurrent(select.current.value)
  }, [drawn, props.value, children])

  const chosen = choices.find((c) => c.value === current)?.label ?? ""

  React.useLayoutEffect(() => {
    const from = before.current
    before.current = null
    if (!from || !box.current || !word.current || still()) return
    const css = getComputedStyle(box.current)
    const moderato = ms(css.getPropertyValue("--db-moderato"), 320)
    const allegro = ms(css.getPropertyValue("--db-allegro"), 160)
    const breath = css.getPropertyValue("--db-breath").trim() || "ease"
    const spiccato = css.getPropertyValue("--db-spiccato").trim() || "ease-out"
    const width = box.current.offsetWidth
    if (width !== from.width) box.current.animate([{ width: `${from.width}px` }, { width: `${width}px` }], { duration: moderato, easing: breath })

    if (variant === "compose") {
      // The compositor's stick: every sort the two words share slides to its new place (the nearest
      // one of the same letter), the ones the new word doesn't need drop out, and the rest are set in.
      const at = edge(word.current)
      const used = new Set<number>()
      Array.from(word.current.children as HTMLCollectionOf<HTMLElement>).forEach((sort) => {
        const x = at(sort)
        const ch = (sort.textContent ?? "").toLocaleLowerCase()
        let best = -1
        from.sorts.forEach((s, j) => {
          if (!used.has(j) && s.ch.toLocaleLowerCase() === ch && ch.trim() && (best < 0 || Math.abs(s.x - x) < Math.abs(from.sorts[best].x - x))) best = j
        })
        if (best >= 0) {
          used.add(best)
          sort.animate([{ translate: `${(from.sorts[best].x - x) * at.dir}px 0` }, { translate: "0 0" }], { duration: moderato, easing: breath })
        } else {
          sort.animate([{ opacity: 0, translate: "0 -0.5em" }, { opacity: 1, translate: "0 0" }], { duration: moderato, delay: allegro / 2, easing: spiccato, fill: "backwards" })
        }
      })
      from.sorts.forEach((s, j) => {
        if (used.has(j) || !ghosts.current) return
        const ghost = document.createElement("span")
        ghost.textContent = s.ch
        ghost.style[at.dir > 0 ? "left" : "right"] = `${s.x}px` // physical: the ghosts' box takes the page's direction, the word its own
        ghosts.current.append(ghost)
        ghost.animate([{ opacity: 1 }, { opacity: 0, translate: "0 0.5em" }], { duration: allegro * 1.5, easing: breath, fill: "forwards" }).finished.then(
          () => ghost.remove(),
          () => ghost.remove(),
        )
      })
    }

    if (variant === "ruby" && from.line) {
      // Interlinear: the picked word comes down out of the ruby onto the line, and the old one goes up into its place.
      // Each word travels between the two tiers and inks in as it arrives; neither is scaled, so neither is ever set in the other's face.
      const move = (el: Element | null | undefined, start?: DOMRect) => {
        if (!el || !start) return
        const end = el.getBoundingClientRect()
        const dx = getComputedStyle(el).direction === "rtl" ? start.right - end.right : start.left - end.left
        el.animate([{ translate: `${dx}px ${start.bottom - end.bottom}px`, opacity: 0 }, { translate: "0 0", opacity: 1 }], { duration: moderato, easing: breath })
      }
      // The words that stay in the ruby close up (or open) round the change.
      Array.from(ruby.current?.children ?? [], (el) => {
        const left = from.tier.get((el as HTMLElement).dataset.value ?? "")
        const dx = left === undefined ? 0 : left - el.getBoundingClientRect().left
        if (Math.abs(dx) > 0.5) el.animate([{ translate: `${dx}px 0` }, { translate: "0 0" }], { duration: moderato, easing: breath })
      })
      move(word.current, from.picked)
      move(ruby.current?.querySelector(`[data-value="${CSS.escape(from.was)}"]`), from.line)
    }
  }, [current, variant])

  const change = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange?.(e)
    if (!drawn) return
    const next = e.currentTarget.value
    if (box.current && word.current) {
      const at = edge(word.current)
      before.current = {
        width: box.current.offsetWidth,
        sorts: Array.from(word.current.children, (s) => ({ ch: s.textContent ?? "", x: at(s) })),
        line: word.current.getBoundingClientRect(),
        picked: ruby.current?.querySelector(`[data-value="${CSS.escape(next)}"]`)?.getBoundingClientRect(),
        tier: new Map(Array.from(ruby.current?.children ?? [], (el) => [(el as HTMLElement).dataset.value ?? "", el.getBoundingClientRect().left])),
        was: current,
      }
    }
    setCurrent(next)
  }

  const pick = (value: string) => {
    const el = select.current
    if (!el || el.disabled) return
    el.value = value
    el.dispatchEvent(new Event("change", { bubbles: true }))
    el.focus({ preventScroll: true, focusVisible: false } as FocusOptions)
  }

  return (
    <Root data-slot="select" data-variant={drawn ? variant : undefined} data-force={force} className={cn("db-select", rootClassName)}>
      {label ? <span>{label}</span> : null}
      <span ref={box} className="db-select-box">
        <select ref={composedRef} data-slot="select-input" className={className} onChange={change} {...props}>
          {children}
        </select>
        {drawn ? (
          <span ref={word} className="db-select-word" dir="auto" aria-hidden="true">
            {variant === "compose" ? graphemes(chosen).map((g, i) => <span key={i}>{g}</span>) : chosen}
          </span>
        ) : null}
        {variant === "compose" ? <span ref={ghosts} className="db-select-ghosts" aria-hidden="true" /> : null}
        {variant === "ruby" ? (
          // A shortcut for the pointer only: the select below holds the same choices for the keyboard and screen readers.
          <span ref={ruby} className="db-select-ruby" aria-hidden="true">
            {choices
              .filter((c) => c.value !== current)
              .map((c) => (
                <span
                  key={c.value}
                  data-value={c.value}
                  onClick={(e) => {
                    e.preventDefault()
                    pick(c.value)
                  }}
                >
                  {c.label}
                </span>
              ))}
          </span>
        ) : null}
      </span>
    </Root>
  )
}

export { Select, type SelectProps }
