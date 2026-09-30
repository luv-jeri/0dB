"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/registry/0db/lib/utils"
import { roll } from "@/registry/0db/lib/roll"

function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root data-slot="tabs" className={cn("db-tabs-root", className)} {...props} />
}

/**
 * Sets where the line goes: --x (left), --r (right inset) and --y (lift to the
 * last row when the words wrap), measured from the active tab. data-dir says
 * which way it moved so the leading edge can go first. Physical measurements,
 * so right-to-left needs nothing more.
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
      const was = parseFloat(el.style.getPropertyValue("--x")) || 0
      el.dataset.dir = r.left - b.left >= was ? "right" : "left"
      el.style.setProperty("--x", `${r.left - b.left}px`)
      el.style.setProperty("--r", `${b.right - r.right}px`)
      el.style.setProperty("--y", `${r.bottom - lastRow}px`)
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
  return (node: HTMLDivElement | null) => {
    list.current = node
  }
}

/** Words with a hairline beneath; a line slides to the one in view, leading edge first. */
// ponytail: takes no ref of its own; the hook owns it. Add a merged ref if someone needs the list element.
function TabsList({ className, children, ...props }: Omit<React.ComponentProps<typeof TabsPrimitive.List>, "ref">) {
  const follow = useFollow()
  return (
    <TabsPrimitive.List
      ref={follow}
      data-slot="tabs-list"
      className={cn("db-tabs", className)}
      {...props}
    >
      {children}
      <span data-slot="tabs-line" className="db-tabs-line" aria-hidden="true" />
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
    <span data-slot="tabs-count" aria-hidden="true" className={cn("db-tabs-count", className)} {...props}>
      <span ref={inner}>{shown}</span>
    </span>
  )
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content data-slot="tabs-content" className={className} {...props} />
}

export { Tabs, TabsList, TabsTrigger, TabsContent, TabsCount }
