"use client"

import * as React from "react"

import { useComposedRefs } from "@/registry/0nlytype/lib/refs"
import { cn } from "@/registry/0nlytype/lib/utils"

type GroupContext = {
  id: string
  direction: "horizontal" | "vertical"
  sizes: number[]
  mins: number[]
  /** Moves the rule after panel i so panel i is `size` percent, the next panel taking the difference. */
  resize: (i: number, size: number) => void
  variant: Variant
  /** In flow, the lines each panel holds, once laid out. */
  flow: string[][] | null
}

type Variant = "rule" | "fit" | "flow"

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

type GroupProps = React.ComponentProps<"div"> & {
  direction: "horizontal" | "vertical"
  /**
   * rule: panes and the rules between them. fit: each pane's ResizableTitle is set to its measure, as a
   * compositor sets wood type: it condenses first, then changes size. flow: `text` runs through the panes
   * as continued columns: the first holds as many lines as its height allows, and the rest carry on in the next.
   */
  variant?: Variant
  /** In flow, the one paragraph that runs through the panes. Plain text: pretext measures it. */
  text?: string
}

/**
 * Panels and the rules between them: two or more ResizablePanels with a ResizableHandle between
 * each, as direct children, in that order (panel, handle, panel, ...). Children are told apart by their place, not their type,
 * so this works when they arrive from a Server Component. Moved, each panel's share is drawn as a dimension.
 */
function ResizablePanelGroup({ direction, variant = "rule", text = "", className, children, ref: forwardedRef, ...props }: GroupProps) {
  const id = React.useId()
  const ref = React.useRef<HTMLDivElement>(null)
  const composedRef = useComposedRefs(ref, forwardedRef)
  const flow = useFlow(ref, variant === "flow" ? text : "")
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
    <Group.Provider value={{ id, direction, sizes, mins, resize, variant, flow }}>
      <FlowText.Provider value={text}>
      <div ref={composedRef} data-slot="resizable" data-direction={direction} data-variant={variant === "rule" ? undefined : variant} className={cn("ot-resize", className)} {...props}>
        {nodes.map((node, at) => (
          <Index.Provider key={at} value={Math.floor(at / 2)}>
            {node}
          </Index.Provider>
        ))}
      </div>
      </FlowText.Provider>
    </Group.Provider>
  )
}

/**
 * Continued columns: lays `text` out at each pane's measure, the first pane taking as many lines as its
 * height holds, the next the rest, and so on; the last takes what is left. Re-laid when a pane changes
 * size (a drag, the window) and when <html> changes its face.
 */
function useFlow(group: React.RefObject<HTMLDivElement | null>, text: string) {
  const [flow, setFlow] = React.useState<string[][] | null>(null)
  React.useEffect(() => {
    const el = group.current
    if (!el || !text) return
    let cancelled = false
    let frame = 0
    const off: (() => void)[] = []
    ;(async () => {
      let lib: typeof import("@chenglou/pretext")
      try {
        lib = await import("@chenglou/pretext")
      } catch {
        return // the plain paragraph stays in the first pane
      }
      let font = ""
      let prepared: ReturnType<typeof lib.prepareWithSegments> | undefined
      const lay = async () => {
        const columns = [...el.querySelectorAll<HTMLElement>(":scope > [data-slot=resizable-panel] > .ot-resize-flow")]
        if (!columns.length) return
        const style = getComputedStyle(columns[0])
        const next = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
        if (next !== font || !prepared) {
          font = next
          await document.fonts.load(font, text)
          prepared = lib.prepareWithSegments(text, font)
        }
        const lh = parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.5
        let cursor = { segmentIndex: 0, graphemeIndex: 0 }
        const out = columns.map((c, at) => {
          const pane = c.parentElement!
          const room = pane.clientHeight - parseFloat(getComputedStyle(pane).paddingBottom) - c.offsetTop
          const count = at === columns.length - 1 ? Infinity : Math.max(0, Math.floor(room / lh))
          const lines: string[] = []
          for (let guard = 0; lines.length < count && guard < 500; guard++) {
            const line = lib.layoutNextLine(prepared!, cursor, Math.max(c.clientWidth, 24))
            if (!line) break
            lines.push(line.text.trimEnd())
            cursor = line.end
          }
          return lines
        })
        if (!cancelled) setFlow(out)
      }
      const soon = () => {
        cancelAnimationFrame(frame)
        frame = requestAnimationFrame(() => void lay())
      }
      await lay()
      if (cancelled) return
      const resized = new ResizeObserver(soon)
      el.querySelectorAll(":scope > [data-slot=resizable-panel]").forEach((pane) => resized.observe(pane))
      const restyled = new MutationObserver(soon)
      restyled.observe(document.documentElement, { attributes: true })
      off.push(() => resized.disconnect(), () => restyled.disconnect(), () => cancelAnimationFrame(frame))
    })()
    return () => {
      cancelled = true
      off.forEach((f) => f())
    }
  }, [group, text])
  return flow
}

/** A pane's share of the flowing text. The reader of the page gets the whole paragraph once, in the first. */
function Flow({ lines, first }: { lines?: string[]; first: boolean }) {
  const { flow } = useGroup()
  const text = React.useContext(FlowText)
  if (!flow) return first ? <p className="ot-resize-flow">{text}</p> : <p className="ot-resize-flow" aria-hidden="true" />
  return (
    <p className="ot-resize-flow">
      {first && <span className="ot-sr">{text}</span>}
      <span aria-hidden="true">
        {lines?.map((l, at) => (
          <span key={at} className="ot-resize-line">
            {l}
          </span>
        ))}
      </span>
    </p>
  )
}

const FlowText = React.createContext("")

function ResizablePanel({ defaultSize, minSize, className, children, style, ...props }: PanelProps) {
  const { id, sizes, variant, flow } = useGroup()
  const i = React.useContext(Index)
  void defaultSize
  void minSize
  return (
    <div
      id={`${id}-panel-${i}`}
      data-slot="resizable-panel"
      style={{ flex: `0 1 ${sizes[i]}%`, ...style }}
      className={cn("ot-resize-pane", className)}
      {...props}
    >
      {children}
      {variant === "flow" && <Flow lines={flow?.[i]} first={i === 0} />}
      <div className="ot-resize-dim" aria-hidden="true">
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
      className={cn("ot-resize-handle", className)}
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

/** Archivo's width axis: how far a title may condense, and how wide it may set. */
const NARROW = 62
const WIDE = 125

/**
 * A pane's title. In a fit group it is set to the pane's measure, heavy, as wood type is: the width
 * axis goes first (condensed as the pane narrows, extended as it widens), and only past its ends does
 * the size change. Elsewhere it is a plain heading.
 */
function ResizableTitle({ className, children, ref: forwardedRef, ...props }: React.ComponentProps<"h3">) {
  const { variant } = useGroup()
  const ref = React.useRef<HTMLHeadingElement>(null)
  const composedRef = useComposedRefs(ref, forwardedRef)
  React.useEffect(() => {
    const el = ref.current
    const word = el?.firstElementChild as HTMLElement | null
    if (variant !== "fit" || !el || !word) return
    let frame = 0
    const set = () => {
      const measure = el.clientWidth
      const at = (stretch: number) => {
        word.style.fontStretch = `${stretch}%`
        return word.getBoundingClientRect().width
      }
      el.style.fontSize = ""
      const size = parseFloat(getComputedStyle(el).fontSize) // the size it would be set at, from the stylesheet
      el.style.fontSize = "100px"
      const narrow = at(NARROW)
      const wide = at(WIDE)
      // At that size, the stretch that fills the measure; then the size that makes it exact.
      const want = (measure / size) * 100
      const stretch = Math.min(WIDE, Math.max(NARROW, NARROW + ((want - narrow) / (wide - narrow || 1)) * (WIDE - NARROW)))
      const width = at(stretch)
      el.style.fontSize = `${(100 * measure) / width}px`
      el.setAttribute("data-set", "")
    }
    const soon = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(set)
    }
    document.fonts.ready.then(soon)
    const resized = new ResizeObserver(soon)
    resized.observe(el)
    const restyled = new MutationObserver(soon)
    restyled.observe(document.documentElement, { attributes: true })
    return () => {
      cancelAnimationFrame(frame)
      resized.disconnect()
      restyled.disconnect()
    }
  }, [variant])
  return (
    <h3 ref={composedRef} data-slot="resizable-title" className={cn("ot-resize-title", className)} {...props}>
      <span>{children}</span>
    </h3>
  )
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle, ResizableTitle, type GroupProps as ResizablePanelGroupProps }
