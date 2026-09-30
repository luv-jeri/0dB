"use client"

import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"

type GroupContext = {
  id: string
  direction: "horizontal" | "vertical"
  sizes: number[]
  mins: number[]
  /** Moves the rule after panel i so panel i is `size` percent, the next panel taking the difference. */
  resize: (i: number, size: number) => void
}

const Group = React.createContext<GroupContext | null>(null)
/** Which panel a child is (a handle takes the panel before it). */
const Index = React.createContext(0)

function useGroup() {
  const ctx = React.useContext(Group)
  if (!ctx) throw new Error("Resizable parts must sit inside <ResizablePanelGroup>.")
  return ctx
}

type PanelProps = React.ComponentProps<"div"> & {
  /** Its share of the group, in percent. Panels without one share what's left. */
  defaultSize?: number
  /** The least it can be, in percent. */
  minSize?: number
}

type GroupProps = React.ComponentProps<"div"> & { direction: "horizontal" | "vertical" }

/**
 * Panels and the rules between them: two or more ResizablePanels with a ResizableHandle between
 * each, as direct children, in that order (panel, handle, panel, ...). Children are told apart by their place, not their type,
 * so this works when they arrive from a Server Component. Moved, each panel's share is drawn as a dimension.
 */
function ResizablePanelGroup({ direction, className, children, ...props }: GroupProps) {
  const id = React.useId()
  const nodes = React.Children.toArray(children)
  const panels = nodes.filter((_, at) => at % 2 === 0) as React.ReactElement<PanelProps>[]
  const mins = panels.map((p) => p.props.minSize ?? 10)

  const [sizes, setSizes] = React.useState(() => {
    // Panels without a defaultSize share what the others leave.
    const left = 100 - panels.reduce((sum, p) => sum + (p.props.defaultSize ?? 0), 0)
    const open = panels.filter((p) => p.props.defaultSize === undefined).length
    return panels.map((p) => p.props.defaultSize ?? left / open)
  })

  const resize = (i: number, size: number) =>
    setSizes((now) => {
      const total = now[i] + now[i + 1]
      const next = Math.round(Math.min(total - mins[i + 1], Math.max(mins[i], size)))
      return next === now[i] ? now : now.map((s, at) => (at === i ? next : at === i + 1 ? total - next : s))
    })

  return (
    <Group.Provider value={{ id, direction, sizes, mins, resize }}>
      <div data-slot="resizable" data-direction={direction} className={cn("db-resize", className)} {...props}>
        {nodes.map((node, at) => (
          <Index.Provider key={at} value={Math.floor(at / 2)}>
            {node}
          </Index.Provider>
        ))}
      </div>
    </Group.Provider>
  )
}

function ResizablePanel({ defaultSize, minSize, className, children, style, ...props }: PanelProps) {
  const { id, sizes } = useGroup()
  const i = React.useContext(Index)
  void defaultSize
  void minSize
  return (
    <div
      id={`${id}-panel-${i}`}
      data-slot="resizable-panel"
      style={{ flex: `0 1 ${sizes[i]}%`, ...style }}
      className={cn("db-resize-pane", className)}
      {...props}
    >
      {children}
      <div className="db-resize-dim" aria-hidden="true">
        <span>{Math.round(sizes[i])}%</span>
      </div>
    </div>
  )
}

/** The rule between two panels. Drag it, or focus it and use the arrow keys (Home and End go to the limits). */
function ResizableHandle({ className, onKeyDown, ...props }: React.ComponentProps<"div">) {
  const { id, direction, sizes, mins, resize } = useGroup()
  const i = React.useContext(Index)
  const [held, setHeld] = React.useState(false)
  const horizontal = direction === "horizontal"
  const max = Math.round(sizes[i] + sizes[i + 1] - mins[i + 1])

  const group = (el: HTMLElement) => el.closest<HTMLElement>("[data-slot=resizable]")!
  const rtl = (el: HTMLElement) => horizontal && getComputedStyle(group(el)).direction === "rtl"

  return (
    <div
      role="separator"
      tabIndex={0}
      data-slot="resizable-handle"
      data-dragging={held ? "" : undefined}
      aria-orientation={horizontal ? "vertical" : "horizontal"}
      aria-valuenow={Math.round(sizes[i])}
      aria-valuemin={mins[i]}
      aria-valuemax={max}
      aria-controls={`${id}-panel-${i}`}
      aria-label="Resize"
      className={cn("db-resize-handle", className)}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId)
        setHeld(true)
      }}
      onPointerMove={(e) => {
        if (!e.currentTarget.hasPointerCapture(e.pointerId)) return
        const r = group(e.currentTarget).getBoundingClientRect()
        const along = horizontal ? (rtl(e.currentTarget) ? r.right - e.clientX : e.clientX - r.left) / r.width : (e.clientY - r.top) / r.height
        // The pointer's place, less the panels before this one, is this panel's size.
        resize(i, along * 100 - sizes.slice(0, i).reduce((sum, s) => sum + s, 0))
      }}
      onPointerUp={() => setHeld(false)}
      onPointerCancel={() => setHeld(false)}
      onKeyDown={(e) => {
        onKeyDown?.(e)
        const flip = rtl(e.currentTarget) ? -1 : 1
        const step = e.shiftKey ? 10 : 5
        const to = {
          [horizontal ? "ArrowLeft" : "ArrowUp"]: sizes[i] - step * flip,
          [horizontal ? "ArrowRight" : "ArrowDown"]: sizes[i] + step * flip,
          Home: mins[i],
          End: max,
        }[e.key]
        if (to === undefined) return
        e.preventDefault()
        resize(i, to)
      }}
      {...props}
    />
  )
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
