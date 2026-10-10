"use client"

import * as React from "react"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"

import { useComposedRefs } from "@/registry/0nlytype/lib/refs"
import { cn } from "@/registry/0nlytype/lib/utils"

type Run = { items: HTMLElement[]; l: number; r: number; t: number; h: number }
type Mark = { el: HTMLElement; items: HTMLElement[] }

/**
 * One mark per run of held words that stand side by side on a row: the slur over them, or the
 * parentheses round them. The mark reads --l, --r, --t and --h from the run's words: from the
 * italic you see, not the cell it shares with the wider or narrower roman, so the mark sits even
 * on both sides. Physical measurements, so right to left needs nothing more.
 *
 * As the held words change, a mark that covered one of a run's words stretches to fit it; another
 * mark that also did (two runs just joined) fades where it is; a run with no mark gets one, which
 * lands; a mark with no run lets go. With one held at a time, the mark glides from the old word to
 * the new one, leading edge first (data-dir). The engine also marks the first word of each wrapped
 * row (data-line-start), so no hairline stands at the start of a line.
 *
 * fingering: each held word carries the order it was held in (--n), set over the middle of the face
 * you see (--fx), and the group carries the number the next one would get (--next). Seeded from the
 * value's order, which is the order Radix keeps.
 */
function useMarks(single: boolean, fingering: boolean, seed: readonly string[]) {
  const ref = React.useRef<HTMLDivElement | null>(null)
  const first = React.useRef(seed)
  React.useLayoutEffect(() => {
    const root = ref.current
    const layer = root?.querySelector<HTMLElement>(":scope > .ot-toggles-marks")
    if (!root || !layer) return
    let marks: Mark[] = []
    const all = () => [...root.querySelectorAll<HTMLElement>('[data-slot="toggle-group-item"]')]
    let order = first.current.flatMap((v) => all().filter((i) => i.dataset.value === v && i.dataset.state === "on"))

    // The face you see, left and right in px: held, the italic copy; otherwise the roman. They share
    // one cell (start-aligned on the first word of a line, centred elsewhere) but not one width.
    const face = (item: HTMLElement, k: number, rtl: boolean) => {
      const word = item.querySelector<HTMLElement>(":scope > .ot-toggles-word")
      if (!word) {
        const r = item.getBoundingClientRect()
        const cs = getComputedStyle(item)
        return [r.left + parseFloat(cs.paddingLeft) * k, r.right - parseFloat(cs.paddingRight) * k]
      }
      if (item.dataset.state !== "on") {
        const r = word.firstElementChild!.getBoundingClientRect()
        return [r.left, r.right]
      }
      const cell = word.getBoundingClientRect()
      const w = parseFloat(getComputedStyle(word, "::after").width) * k
      const l = getComputedStyle(word).justifyItems.includes("center") ? (cell.left + cell.right - w) / 2 : rtl ? cell.right - w : cell.left
      return [l, l + w]
    }

    const place = (moving: boolean) => {
      // Resizes, fonts arriving and the first place are not a choice: the marks go straight there.
      if (!moving) root.setAttribute("data-still", "")
      const b = root.getBoundingClientRect()
      const k = b.width / root.offsetWidth || 1 // on-screen px per CSS px: a scaled ancestor would throw the marks off
      const rtl = getComputedStyle(root).direction === "rtl"
      const items = all()
      const runs: Run[] = []
      let run: Run | undefined
      let top: number | undefined
      for (const item of items) {
        const r = item.getBoundingClientRect()
        const turned = top !== undefined && Math.abs(r.top - top) > 1
        top = r.top
        item.toggleAttribute("data-line-start", turned)
      }
      for (const item of items) {
        const r = item.getBoundingClientRect()
        const turned = item.hasAttribute("data-line-start")
        const [fl, fr] = face(item, k, rtl)
        if (fingering) item.style.setProperty("--fx", `${((fl + fr) / 2 - r.left) / k}px`)
        if (item.dataset.state !== "on") run = undefined
        else {
          // The mark stands off the italic by the item's own padding, the room its parentheses hang in.
          const cs = getComputedStyle(item)
          const l = fl - parseFloat(cs.paddingLeft) * k
          const rr = fr + parseFloat(cs.paddingRight) * k
          if (run && !turned) {
            run.items.push(item)
            run.l = Math.min(run.l, l)
            run.r = Math.max(run.r, rr)
          } else runs.push((run = { items: [item], l, r: rr, t: r.top, h: r.height }))
        }
      }
      if (fingering) {
        const on = items.filter((i) => i.dataset.state === "on")
        order = order.filter((i) => on.includes(i)).concat(on.filter((i) => !order.includes(i)))
        order.forEach((i, n) => i.style.setProperty("--n", `"${n + 1}"`))
        root.style.setProperty("--next", `"${order.length + 1}"`)
      }

      const set = (mark: Mark, run: Run, glide = false) => {
        const { el } = mark
        const l = (run.l - b.left) / k
        const r = (b.right - run.r) / k
        const was = parseFloat(el.style.getPropertyValue("--l")) - parseFloat(el.style.getPropertyValue("--r"))
        if (glide) el.dataset.dir = l - r >= was ? "right" : "left"
        else delete el.dataset.dir
        el.style.setProperty("--l", `${l}px`)
        el.style.setProperty("--r", `${r}px`)
        el.style.setProperty("--t", `${(run.t - b.top) / k}px`)
        el.style.setProperty("--h", `${run.h / k}px`)
        el.toggleAttribute("data-muted", run.items.every((i) => i.hasAttribute("data-disabled")))
        mark.items = run.items
        return mark
      }
      const leave = (el: HTMLElement, how: "merge" | "release") => {
        el.setAttribute("data-leave", how)
        const done = () => el.remove()
        Promise.all(el.getAnimations({ subtree: true }).map((a) => a.finished)).then(done, done)
      }

      const claimed = new Set<Mark>()
      const next: Mark[] = []
      const fresh: Run[] = []
      for (const run of runs) {
        const over = marks.filter((m) => !claimed.has(m) && m.items.some((i) => run.items.includes(i)))
        if (!over.length) {
          fresh.push(run)
          continue
        }
        over.forEach((m) => claimed.add(m))
        over.slice(1).forEach((m) => leave(m.el, "merge"))
        next.push(set(over[0], run))
      }
      const entering: HTMLElement[] = []
      for (const run of fresh) {
        const left = single ? marks.find((m) => !claimed.has(m)) : undefined
        if (left) {
          claimed.add(left)
          next.push(set(left, run, moving))
          continue
        }
        const el = document.createElement("i")
        el.className = "ot-toggles-mark"
        el.setAttribute("data-enter", "")
        layer.append(el)
        entering.push(el)
        next.push(set({ el, items: [] }, run))
      }
      marks.filter((m) => !claimed.has(m)).forEach((m) => leave(m.el, "release"))
      marks = next

      // Read once so the entering marks start from their first frame, then let them land.
      void root.offsetWidth
      entering.forEach((el) => el.removeAttribute("data-enter"))
      if (!moving) {
        void root.offsetWidth
        root.removeAttribute("data-still")
      }
    }

    place(false)
    // A choice moves the marks; the direction arriving (read as the group mounts) only puts them in place.
    const chose = new MutationObserver((list) => {
      const own = list.filter((m) => !layer.contains(m.target))
      if (own.length) place(!own.some((m) => m.attributeName === "dir"))
    })
    chose.observe(root, { attributes: true, attributeFilter: ["data-state", "data-disabled", "dir"], subtree: true, childList: true })
    const resize = new ResizeObserver(() => place(false))
    resize.observe(root)
    root.querySelectorAll('[data-slot="toggle-group-item"]').forEach((i) => resize.observe(i))
    document.fonts?.ready.then(() => place(false))
    return () => {
      chose.disconnect()
      resize.disconnect()
      layer.replaceChildren()
    }
  }, [single, fingering])
  return ref
}

type ToggleGroupProps = React.ComponentProps<typeof ToggleGroupPrimitive.Root> & {
  /**
   * How held words are marked. slur: hairlines stand between the words, and a run of held neighbours
   * is tied under one slur. bracket: no hairlines; the held words are set in parentheses, and
   * neighbours share one pair. fingering: each held word carries, over it, the number of its turn
   * (for type="multiple"). margin: the words stand in a column beside a hairline and an empty
   * margin; a held word crosses the hairline into the margin, like a book's side head.
   */
  variant?: "slur" | "bracket" | "fingering" | "margin"
}

/**
 * Words in a row that you can hold down. type="single" holds one at a time, "multiple" any number.
 * Held, a word is yours, so it turns italic; its mark (a slur, or parentheses) stretches over the
 * held words beside it and glides to a new choice. Radix keeps the roving focus and the arrow keys.
 */
function ToggleGroup({ className, variant = "slur", dir, children, ref, ...props }: ToggleGroupProps) {
  const held = props.value ?? props.defaultValue
  const ownRef = useMarks(props.type === "single", variant === "fingering", typeof held === "string" ? [held] : (held ?? []))
  // Radix writes dir="ltr" on the group unless told otherwise, which would turn a right-to-left page's
  // words and arrow keys around. Without a dir, the group takes the direction of the page around it,
  // read as the group mounts, before the first paint.
  const [around, setAround] = React.useState<"rtl">()
  const composedRef = useComposedRefs(React.useCallback((node: HTMLDivElement | null) => {
    ownRef.current = node
    const up = node?.parentElement
    if (!dir && up && getComputedStyle(up).direction === "rtl") setAround("rtl")
  }, [dir, ownRef]), ref)
  return (
    <ToggleGroupPrimitive.Root
      ref={composedRef}
      data-slot="toggle-group"
      data-variant={variant}
      dir={dir ?? around}
      className={cn("ot-toggles", className)}
      {...props}
    >
      {children}
      <span data-slot="toggle-group-marks" className="ot-toggles-marks" aria-hidden="true" />
    </ToggleGroupPrimitive.Root>
  )
}

type ToggleGroupItemProps = React.ComponentProps<typeof ToggleGroupPrimitive.Item> & {
  /** Pins a state for documentation ("hover", "focus"); set on the root. */
  "data-force"?: string
}

/**
 * One word in the group. A plain-text word shares its grid cell with an italic copy of itself (drawn
 * by the stylesheet from data-text), so it is always as wide as its wider state and nothing beside it
 * moves when it turns.
 */
function ToggleGroupItem({ className, children, ...props }: ToggleGroupItemProps) {
  return (
    <ToggleGroupPrimitive.Item data-slot="toggle-group-item" data-value={props.value} className={cn("ot-toggles-item", className)} {...props}>
      {typeof children === "string" ? (
        <span className="ot-toggles-word" data-text={children}>
          <span>{children}</span>
        </span>
      ) : (
        children
      )}
    </ToggleGroupPrimitive.Item>
  )
}

export { ToggleGroup, ToggleGroupItem, type ToggleGroupProps, type ToggleGroupItemProps }
