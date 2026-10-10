"use client"

import * as React from "react"

import { useComposedRefs } from "@/registry/0nlytype/lib/refs"
import { cn } from "@/registry/0nlytype/lib/utils"

const pad = (n: number) => String(n).padStart(2, "0")
const still = () => matchMedia("(prefers-reduced-motion: reduce)").matches

type SegueSceneProps = React.ComponentProps<"div"> & {
  /** The scene's name. The hairline carries it, with the scene's number, as it crosses. */
  label?: string
}

/** One scene. Direct children of Segue only. */
function SegueScene({ label, className, ...props }: SegueSceneProps) {
  return <div data-slot="segue-scene" role={label ? "group" : undefined} aria-label={label} className={cn("db-segue-body", className)} {...props} />
}

type SegueProps = Omit<React.ComponentProps<"div">, "defaultValue"> & {
  /** Which scene is showing, from 0. Change it (from a button, a key, a form's answer) and the hairline crosses. */
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  /** wipe: an upright hairline crosses along the line. horizon: a level hairline rises from the foot, as the sun over a horizon. */
  variant?: "wipe" | "horizon"
  /** Tie the crossings to the scroll: the scenes change as the frame travels up the view, and change back as you scroll back. */
  scrub?: boolean
}

/**
 * One scene at a time. When the scene changes, one hairline crosses the frame, carrying the next scene's number
 * and name; behind it the next scene is already there, drifting the last few pixels into place, while the last is
 * pushed on ahead of it. Going back, it crosses the other way. Nothing crosses unless the person acts: a change of
 * `value`, or, with `scrub`, the scroll itself.
 */
function Segue({ value, defaultValue = 0, onValueChange, variant = "wipe", scrub = false, className, children, ref: forwardedRef, ...props }: SegueProps) {
  const scenes = React.Children.toArray(children).filter(React.isValidElement) as React.ReactElement<SegueSceneProps>[]
  const n = scenes.length
  const [own, setOwn] = React.useState(defaultValue)
  const current = Math.max(0, Math.min(n - 1, value ?? own))
  const ref = React.useRef<HTMLDivElement>(null)
  const composedRef = useComposedRefs(ref, forwardedRef)
  const shown = React.useRef(current)
  const labels = scenes.map((s) => s.props.label ?? "")

  // Scrub scenes remain readable in document order. Only the scene showing accepts interaction.
  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el || !scrub) return
    const saved = new Map<HTMLElement, string | null>()
    const sync = () => {
      const currentScene = el.querySelector<HTMLElement>(":scope > [data-current]")
      const active = el.ownerDocument.activeElement
      if (active && el.contains(active) && !currentScene?.contains(active)) currentScene?.focus({ preventScroll: true })
      for (const [control, tab] of saved) {
        if (!el.contains(control) || currentScene?.contains(control)) {
          if (tab === null) control.removeAttribute("tabindex")
          else control.setAttribute("tabindex", tab)
          saved.delete(control)
        }
      }
      el.querySelectorAll<HTMLElement>(":scope > .db-segue-scene:not([data-current])").forEach((scene) => {
        scene.querySelectorAll<HTMLElement>('a[href], area[href], button, input, select, textarea, iframe, object, embed, audio[controls], video[controls], summary, [contenteditable]:not([contenteditable="false"]), [tabindex]').forEach((control) => {
          const tab = control.getAttribute("tabindex")
          if (!saved.has(control) || tab !== "-1") saved.set(control, tab)
          if (tab !== "-1") control.setAttribute("tabindex", "-1")
        })
      })
    }
    sync()
    const watch = new MutationObserver(sync)
    watch.observe(el, { childList: true, subtree: true, attributes: true, attributeFilter: ["tabindex", "href", "contenteditable", "controls"] })
    return () => {
      watch.disconnect()
      for (const [control, tab] of saved) {
        if (tab === null) control.removeAttribute("tabindex")
        else control.setAttribute("tabindex", tab)
      }
    }
  })

  // The scrub chooses from a scroll handler, so it reads the latest value and callback through a ref.
  const choose = React.useRef<(i: number) => void>(() => {})
  React.useLayoutEffect(() => {
    choose.current = (i: number) => {
      if (i === current) return
      if (value === undefined) setOwn(i)
      onValueChange?.(i)
    }
  })

  // The crossing, for one scene: `from` ahead of the line, `to` behind it, `p` how far across (0 to 1).
  const cross = React.useCallback((el: HTMLDivElement, from: number, to: number, back: boolean) => {
    const parts = el.querySelectorAll<HTMLElement>(":scope > .db-segue-scene")
    parts.forEach((s, i) => (i === from ? (s.dataset.part = "from") : i === to ? (s.dataset.part = "to") : delete s.dataset.part))
    const rtl = getComputedStyle(el).direction === "rtl"
    el.dataset.edge = variant === "horizon" ? (back ? "top" : "bottom") : rtl !== back ? "right" : "left"
    const caption = el.querySelector<HTMLElement>(".db-segue-caption")!
    caption.firstElementChild!.textContent = pad(to + 1)
    caption.lastElementChild!.textContent = parts[to]?.dataset.label ?? ""
  }, [variant])
  const rest = (el: HTMLDivElement) => {
    delete el.dataset.phase
    delete el.dataset.edge
    el.style.removeProperty("--db-segue-p")
    el.querySelectorAll<HTMLElement>(":scope > .db-segue-scene").forEach((s) => delete s.dataset.part)
  }

  // Pressed: set before the new scene paints, so it never shows whole before the line has crossed.
  React.useLayoutEffect(() => {
    const el = ref.current, from = shown.current
    shown.current = current
    if (!el || scrub || from === current || still()) return
    cross(el, from, current, current < from)
    el.dataset.phase = "set"
    el.style.setProperty("--db-segue-p", "0")
    void el.offsetWidth // drawn at the edge once, so it can travel
    el.dataset.phase = "cross"
    el.style.setProperty("--db-segue-p", "1")
    const done = (e: TransitionEvent) => e.target === el && e.propertyName === "--db-segue-p" && rest(el)
    el.addEventListener("transitionend", done)
    el.addEventListener("transitioncancel", done)
    return () => {
      el.removeEventListener("transitionend", done)
      el.removeEventListener("transitioncancel", done)
      rest(el) // a second press arrives at once and crosses again from there
    }
  }, [current, scrub, cross])

  // Scrubbed: how far the frame's middle has risen, from four fifths of the way down the view to one fifth (or as far
  // as the page can scroll), is how far through the scenes you are. Read from the real layout in a frame asked for by
  // the scroll event, which runs after a smooth scroller's own frame, so the line and the page move together.
  React.useEffect(() => {
    const el = ref.current
    if (!el || !scrub || n < 2) return
    let frame = 0
    const read = () => {
      const r = el.getBoundingClientRect(), h = innerHeight, mid = r.top + scrollY + r.height / 2
      const from = Math.max(0, mid - 0.8 * h), to = Math.min(document.documentElement.scrollHeight - h, mid - 0.2 * h)
      const p = (to <= from ? 1 : Math.min(1, Math.max(0, (scrollY - from) / (to - from)))) * (n - 1)
      const k = Math.min(n - 2, Math.floor(p)), f = p - k
      choose.current(Math.round(p))
      if (still() || f <= 0 || f >= 1) return rest(el) // under reduced motion the scene changes halfway and nothing travels
      if (el.dataset.phase !== "scrub" || el.querySelector(":scope > [data-part='from']") !== el.children[k]) cross(el, k, k + 1, false)
      el.dataset.phase = "scrub"
      el.style.setProperty("--db-segue-p", String(f))
    }
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(read)
    }
    read()
    addEventListener("scroll", onScroll, { passive: true })
    addEventListener("resize", onScroll)
    return () => {
      cancelAnimationFrame(frame)
      removeEventListener("scroll", onScroll)
      removeEventListener("resize", onScroll)
      rest(el)
    }
  }, [scrub, n, cross])

  return (
    <div ref={composedRef} data-slot="segue" data-variant={variant === "wipe" ? undefined : variant} data-scrub={scrub || undefined} className={cn("db-segue", className)} {...props}>
      {scenes.map((scene, i) => {
        const on = i === current
        // A scrub is read in order, so every scene stays with readers; pressed, only the one showing does.
        const hide = !on && !scrub
        return (
          <div
            key={scene.key ?? i}
            className="db-segue-scene"
            data-current={on || undefined}
            data-label={labels[i] || undefined}
            inert={hide}
            aria-hidden={hide || undefined}
            tabIndex={-1}
            onFocusCapture={(event) => {
              if (!on && scrub) event.currentTarget.parentElement?.querySelector<HTMLElement>(":scope > [data-current]")?.focus({ preventScroll: true })
            }}
            onClickCapture={(event) => {
              if (!on && scrub) {
                event.preventDefault()
                event.stopPropagation()
              }
            }}
          >
            {scene}
          </div>
        )
      })}
      <span className="db-segue-line" aria-hidden="true">
        <span className="db-segue-caption">
          <span />
          <span />
        </span>
      </span>
      {!scrub && (
        <span className="db-sr" aria-live="polite">
          {`${current + 1} of ${n}${labels[current] ? `: ${labels[current]}` : ""}`}
        </span>
      )}
    </div>
  )
}

export { Segue, SegueScene, type SegueProps, type SegueSceneProps }
