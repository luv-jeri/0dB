"use client"

import * as React from "react"

import { cn } from "@/registry/0nlytype/lib/utils"
import { Collapsible, CollapsibleContent, CollapsibleList, CollapsibleTrigger } from "@/registry/0nlytype/ui/collapsible"
import { Item, ItemActions, ItemTitle } from "@/registry/0nlytype/ui/item"

type TreeNode = {
  id: string
  label: React.ReactNode
  /** A folder holds children; a node without them is a leaf. An empty array is an empty folder. */
  children?: TreeNode[]
  /** Set at the end of the line after a dotted leader, as a contents page sets its page numbers: a size, a count, a folio. */
  value?: React.ReactNode
  /** A leaf that goes somewhere is a link. */
  href?: string
}

type TreeProps = Omit<React.ComponentProps<"div">, "children"> & {
  nodes: TreeNode[]
  /**
   * branch: a hairline spine hangs from under each open folder's first letter and every name sits on it at a dot; a
   * closed folder is a ring, an open one a filled dot, the chosen leaf the accent. outline: the book's decimal
   * contents, each name numbered by its place (1, 1.2, 1.2.3) in a pencil column, and no lines at all.
   */
  variant?: "branch" | "outline"
  /** The chosen leaf's id, controlled or not. */
  selected?: string | null
  defaultSelected?: string | null
  onSelectedChange?: (id: string) => void
  /** The open folders' ids, controlled or not. */
  expanded?: string[]
  defaultExpanded?: string[]
  onExpandedChange?: (ids: string[]) => void
  /** A folder longer than this shows its first rows, then "and 6 more", as a collapsible does. */
  limit?: number
}

type Ctx = { selected: string | null; select: (id: string) => void; open: Set<string>; toggle: (id: string, open: boolean) => void; limit: number; touched: React.RefObject<boolean> }
const TreeCtx = React.createContext<Ctx | null>(null)

const CONTROLS = "summary, .db-tree-name"

/**
 * A hierarchy you open a folder at a time: native disclosures, so every folder opens with Enter or Space and Tab
 * walks it. The arrows walk it too, as a tree: up and down through what shows, right to open or step in, left to
 * close or step out, Home and End to the ends.
 */
function Tree({ nodes, variant = "branch", selected, defaultSelected = null, onSelectedChange, expanded, defaultExpanded = [], onExpandedChange, limit = Infinity, className, onKeyDown, ...props }: TreeProps) {
  const [ownSelected, setOwnSelected] = React.useState(defaultSelected)
  const [ownOpen, setOwnOpen] = React.useState(() => new Set(defaultExpanded))
  const touched = React.useRef(false) // a folder that opens before anyone touches the tree (open from the start) doesn't play its arrival
  const open = React.useMemo(() => (expanded ? new Set(expanded) : ownOpen), [expanded, ownOpen])

  const ctx: Ctx = {
    selected: selected === undefined ? ownSelected : selected,
    select(id) {
      if (selected === undefined) setOwnSelected(id)
      onSelectedChange?.(id)
    },
    open,
    toggle(id, now) {
      if (open.has(id) === now) return
      const next = new Set(open)
      if (now) next.add(id)
      else next.delete(id)
      if (!expanded) setOwnOpen(next)
      onExpandedChange?.([...next])
    },
    limit,
    touched,
  }

  function walk(e: React.KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(e)
    const at = e.target as HTMLElement
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || !at.matches(CONTROLS)) return
    const all = [...e.currentTarget.querySelectorAll<HTMLElement>(CONTROLS)].filter((el) => el.checkVisibility())
    const i = all.indexOf(at)
    const rtl = getComputedStyle(at).direction === "rtl"
    const key = rtl ? ({ ArrowLeft: "ArrowRight", ArrowRight: "ArrowLeft" } as Record<string, string>)[e.key] ?? e.key : e.key
    const folder = at.localName === "summary" ? (at.parentElement as HTMLDetailsElement) : null
    let to: HTMLElement | null | undefined
    if (key === "ArrowDown") to = all[i + 1]
    else if (key === "ArrowUp") to = all[i - 1]
    else if (key === "Home") to = all[0]
    else if (key === "End") to = all.at(-1)
    else if (key === "ArrowRight" && folder) {
      if (!folder.open) folder.open = true
      else to = all[i + 1]
    } else if (key === "ArrowLeft") {
      if (folder?.open) folder.open = false
      else to = (folder ?? at).parentElement?.closest("details")?.querySelector<HTMLElement>(":scope > summary")
    } else return
    e.preventDefault()
    to?.focus()
  }

  return (
    <TreeCtx.Provider value={ctx}>
      <div
        data-slot="tree"
        data-variant={variant === "branch" ? undefined : variant}
        className={cn("db-tree", className)}
        onKeyDown={walk}
        onPointerDownCapture={() => void (touched.current = true)}
        onKeyDownCapture={() => void (touched.current = true)}
        {...props}
      >
        <Branch nodes={nodes} />
      </div>
    </TreeCtx.Provider>
  )
}

function Branch({ nodes }: { nodes: TreeNode[] }) {
  const { limit } = React.useContext(TreeCtx)!
  const cut = nodes.length > limit ? Math.max(1, limit) : nodes.length
  const rest = nodes.slice(cut)
  return (
    <ul className="db-tree-list">
      {nodes.slice(0, cut).map((n) => (
        <Node key={n.id} node={n} />
      ))}
      {rest.length ? (
        <li className="db-tree-tail">
          <Collapsible>
            <CollapsibleTrigger openLabel={`Hide these ${rest.length}`}>and {rest.length} more</CollapsibleTrigger>
            <CollapsibleContent>
              <CollapsibleList>
                {rest.map((n) => (
                  <Node key={n.id} node={n} />
                ))}
              </CollapsibleList>
            </CollapsibleContent>
          </Collapsible>
        </li>
      ) : null}
    </ul>
  )
}

function Node({ node }: { node: TreeNode }) {
  const { selected, select, open, toggle, touched } = React.useContext(TreeCtx)!
  const [arriving, setArriving] = React.useState(false)
  const end = node.value === undefined ? null : <ItemActions>{node.value}</ItemActions>

  if (!node.children) {
    const current = selected === node.id
    const name = <ItemTitle>{node.label}</ItemTitle>
    return (
      <Item className="db-tree-node db-tree-row" data-kind="leaf" data-selected={current ? "" : undefined}>
        {node.href ? (
          <a className="db-tree-name" href={node.href} aria-current={current ? "page" : undefined} onClick={() => select(node.id)}>
            {name}
          </a>
        ) : (
          <button type="button" className="db-tree-name" aria-current={current ? "true" : undefined} onClick={() => select(node.id)}>
            {name}
          </button>
        )}
        {end}
      </Item>
    )
  }

  const n = node.children.length
  return (
    <li className="db-tree-node" data-kind="folder">
      <details
        className="db-tree-folder"
        open={open.has(node.id)}
        data-arriving={arriving ? "" : undefined}
        onToggle={(e) => {
          if (e.target !== e.currentTarget) return // a tail's toggle inside bubbles up
          const now = e.currentTarget.open
          setArriving(now && touched.current)
          toggle(node.id, now)
        }}
      >
        <summary className="db-tree-row">
          <ItemTitle>
            {node.label}
            <sup className="db-tree-count" aria-hidden="true">{n}</sup>
            <span className="db-sr">, {n === 1 ? "1 item" : `${n} items`}</span>
          </ItemTitle>
          {end}
        </summary>
        {n ? <Branch nodes={node.children} /> : <p className="db-tree-empty">Empty</p>}
      </details>
    </li>
  )
}

export { Tree, type TreeProps, type TreeNode }
