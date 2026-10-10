"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { useComposedRefs } from "@/registry/0nlytype/lib/refs"
import { cn } from "@/registry/0nlytype/lib/utils"
import { roll } from "@/registry/0nlytype/lib/roll"

type TabsProps = React.ComponentProps<typeof TabsPrimitive.Root> & {
  /**
   * line: a line slides under the word in view, leading edge first.
   * rubato: no line; the chosen word takes width and weight from the others, and the bar keeps its length.
   * open: the words stacked in ruled cells beside the panel; the rule between them opens beside the chosen one.
   * Vertical by default, so Up and Down move.
   */
  variant?: "line" | "rubato" | "open"
}

function Tabs({ className, variant = "line", orientation, dir, ref, ...props }: TabsProps) {
  // Radix writes dir="ltr" on the root unless told otherwise, which would turn a right-to-left page's
  // tabs and arrow keys around. Without a dir, the tabs take the direction of the page around them,
  // read as they mount, before the first paint (as the menus and the toggle group do).
  const [around, setAround] = React.useState<"rtl">()
  const composedRef = useComposedRefs(React.useCallback((node: HTMLDivElement | null) => {
    const up = node?.parentElement
    if (!dir && up && getComputedStyle(up).direction === "rtl") setAround("rtl")
  }, [dir]), ref)
  return (
    <TabsPrimitive.Root
      ref={composedRef}
      dir={dir ?? around}
      data-slot="tabs"
      data-variant={variant}
      orientation={orientation ?? (variant === "open" ? "vertical" : "horizontal")}
      className={cn("ot-tabs-root", className)}
      {...props}
    />
  )
}

/**
 * Sets where the line goes: --x (left), --r (right inset) and --y (lift to the
 * last row when the words wrap), measured from the active tab, plus --t and --b
 * (its top and bottom insets) for the open variant's break in the rule. data-dir
 * says which way it moved (left, right, up, down) so the leading edge can go
 * first. Physical measurements, so right-to-left needs nothing more.
 */
function useFollow() {
  const list = React.useRef<HTMLDivElement | null>(null)
  React.useLayoutEffect(() => {
    const el = list.current
    if (!el) return
    let ready = false
    const follow = () => {
      const on = el.querySelector<HTMLElement>('[role="tab"][data-state="active"]')
      if (!on) return
      const b = el.getBoundingClientRect()
      const r = on.getBoundingClientRect()
      const lastRow = Math.max(...[...el.querySelectorAll('[role="tab"]')].map((t) => t.getBoundingClientRect().bottom))
      const k = b.width / el.offsetWidth || 1 // on-screen px per CSS px: a scaled or zoomed ancestor would throw the line off
      const x = (r.left - b.left) / k
      const t = (r.top - b.top) / k
      const was = parseFloat(el.style.getPropertyValue("--x")) || 0
      const wasT = parseFloat(el.style.getPropertyValue("--t")) || 0
      el.dataset.dir = Math.abs(x - was) > 0.5 ? (x > was ? "right" : "left") : t >= wasT ? "down" : "up"
      el.style.setProperty("--x", `${x}px`)
      el.style.setProperty("--t", `${t}px`)
      el.style.setProperty("--b", `${(b.bottom - r.bottom) / k}px`)
      el.style.setProperty("--r", `${(b.right - r.right) / k}px`)
      el.style.setProperty("--y", `${(r.bottom - lastRow) / k}px`)
    }
    follow()
    // Nothing glides until the person has chosen: the first place is just where it starts.
    const chose = new MutationObserver(() => {
      if (!ready) el.setAttribute("data-ready", "")
      ready = true
      follow()
    })
    chose.observe(el, { attributes: true, attributeFilter: ["data-state"], subtree: true })
    const resize = new ResizeObserver(follow)
    resize.observe(el)
    el.querySelectorAll('[role="tab"]').forEach((t) => resize.observe(t))
    document.fonts?.ready.then(follow)
    return () => {
      chose.disconnect()
      resize.disconnect()
    }
  }, [])
  return list
}

/** Words with a hairline beneath; a line slides to the one in view, leading edge first. */
function TabsList({ className, children, ref, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  const follow = useFollow()
  const composedRef = useComposedRefs(follow, ref)
  return (
    <TabsPrimitive.List
      ref={composedRef}
      data-slot="tabs-list"
      className={cn("ot-tabs", className)}
      {...props}
    >
      {children}
      <span data-slot="tabs-line" className="ot-tabs-line" aria-hidden="true" />
    </TabsPrimitive.List>
  )
}

type TabsTriggerProps = React.ComponentProps<typeof TabsPrimitive.Trigger> & {
  /** How many things are behind this tab, raised beside its name. */
  count?: number | string
}

function TabsTrigger({ className, count, children, ...props }: TabsTriggerProps) {
  return (
    <TabsPrimitive.Trigger data-slot="tabs-trigger" className={className} {...props}>
      {children}
      {count !== undefined ? <sup>{count}</sup> : null}
    </TabsPrimitive.Trigger>
  )
}

/** The count of what's showing, set huge and cropped by the rule it sinks into. Put it inside TabsList; it rolls when the number changes. */
function TabsCount({ children, className, ...props }: Omit<React.ComponentProps<"span">, "children"> & { children: number | string }) {
  const text = String(children)
  const inner = React.useRef<HTMLSpanElement>(null)
  const [shown, setShown] = React.useState(text)
  React.useEffect(() => {
    if (text === shown) return
    const el = inner.current
    if (!el) return setShown(text)
    roll(el, () => setShown(text), "100%", +text > +shown ? 1 : -1)
  }, [text, shown])
  return (
    <span data-slot="tabs-count" aria-hidden="true" className={cn("ot-tabs-count", className)} {...props}>
      <span ref={inner}>{shown}</span>
    </span>
  )
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content data-slot="tabs-content" className={className} {...props} />
}

export { Tabs, TabsList, TabsTrigger, TabsContent, TabsCount, type TabsProps }
