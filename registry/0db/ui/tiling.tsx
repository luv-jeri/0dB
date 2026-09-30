"use client"

import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"

type TilingProps = React.ComponentProps<"div"> & {
  /** rules: one hairline between tiles, as "Less is more." divides its sheet. crosses: no lines, a registration cross where the tiles' corners meet. */
  variant?: "rules" | "crosses"
}

/**
 * Tiles on the 12-column grid, held apart by space and one hairline, never boxed. A tiling covers the plane with
 * no gaps and no overlaps, so neighbours share an edge: each tile draws only its start and top edge, halfway into
 * the gap, and the edges that meet the tiling's own border are clipped away.
 */
function Tiling({ variant = "rules", className, children, ...props }: TilingProps) {
  // The sheet is the grid; the outer box is the container its narrow layouts are measured against.
  return (
    <div data-slot="tiling" data-variant={variant} className={cn("db-tiling", className)} {...props}>
      <div className="db-tiling-sheet">{children}</div>
    </div>
  )
}

type TileProps = React.ComponentProps<"div"> & {
  /** Columns out of 12. In a narrow tiling a tile of 6 or fewer takes half, a wider one the whole width. */
  span?: number
  /** Rows it stands through. */
  rows?: number
  /** The corner its content keeps to, as the poster keeps its notes. A child with margin-block-start: auto goes to the foot. */
  place?: "start-top" | "end-top" | "start-foot" | "end-foot"
}

function Tile({ span = 4, rows = 1, place = "start-top", className, style, ...props }: TileProps) {
  return (
    <div
      data-slot="tile"
      data-place={place}
      className={cn("db-tile", className)}
      style={{ "--span": span, "--rows": rows, ...style } as React.CSSProperties}
      {...props}
    />
  )
}

/** A plain, serialisable rectangle. Columns and rows start at 1, from the inline start. */
type TilingItem = {
  id: string
  label: string
  column: number
  row: number
  span: number
  rows: number
}

type TilingLayout = readonly TilingItem[]

type TilingEditorProps = Omit<React.ComponentProps<"div">, "children" | "defaultValue"> & {
  label: string
  value?: TilingLayout
  defaultValue?: TilingLayout
  onValueChange?: (value: TilingItem[]) => void
  variant?: TilingProps["variant"]
  renderTile?: (tile: TilingItem) => React.ReactNode
  /** Offers JSON on the page as well as a clipboard action. */
  copyLayout?: boolean
  /** Starts with a tile picked up; useful for a holding specimen. */
  defaultHeld?: string
}

const overlaps = (a: TilingItem, b: TilingItem) => a.column < b.column + b.span && b.column < a.column + a.span && a.row < b.row + b.rows && b.row < a.row + a.rows
const geometry = (tile: TilingItem) => `column ${tile.column}, row ${tile.row}. ${tile.span} wide, ${tile.rows} high.`
const copyTiles = (tiles: TilingLayout) => tiles.map((tile) => ({ ...tile }))

function layoutError(tiles: TilingLayout) {
  const ids = new Set<string>()
  for (const tile of tiles) {
    if (!tile.id || ids.has(tile.id)) return "Give every tile a unique, non-empty id."
    ids.add(tile.id)
    if (typeof tile.label !== "string" || !tile.label.trim()) return "Give every tile a label."
    if (![tile.column, tile.row, tile.span, tile.rows].every((n) => Number.isSafeInteger(n) && n > 0) || tile.column + tile.span > 13 || !Number.isSafeInteger(tile.row + tile.rows)) return "Use positive whole rows and spans, within the 12 columns."
  }
  for (let i = 0; i < tiles.length; i++) {
    if (tiles.slice(i + 1).some((tile) => overlaps(tiles[i], tile))) return "Place tiles in separate spaces; two tiles overlap."
  }
  return null
}

/** Editing is a separate, opt-in part. Tiling and Tile above keep their static server-rendered markup. */
function TilingEditor({ label, value, defaultValue = [], onValueChange, variant = "rules", renderTile, copyLayout = false, defaultHeld, className, ...props }: TilingEditorProps) {
  const [local, setLocal] = React.useState<TilingLayout>(() => copyTiles(defaultValue))
  const tiles = value ?? local
  const error = layoutError(tiles)
  const [held, setHeld] = React.useState<TilingItem | null>(() => tiles.find((tile) => tile.id === defaultHeld) ?? null)
  const current = tiles.find((tile) => tile.id === held?.id)
  const [notice, setNotice] = React.useState({ text: "Pick up a tile to make room for your own arrangement.", sequence: 0 })
  const hint = React.useId()
  const sheet = React.useRef<HTMLDivElement>(null)
  const add = React.useRef<HTMLButtonElement>(null)
  const output = React.useRef<HTMLDetailsElement>(null)
  const json = React.useRef<HTMLTextAreaElement>(null)
  const handles = React.useRef(new Map<string, HTMLButtonElement>())
  const focusNext = React.useRef<string | null>(null)
  const revealNext = React.useRef<HTMLButtonElement | null>(null)
  const previous = React.useRef(new Map<string, { x: number; y: number }>())
  const animateNext = React.useRef(false)
  const drag = React.useRef<{
    tile: TilingItem; pointer: number; x: number; y: number; left: number; top: number
    columnStep: number; rowStep: number; rtl: boolean; kind: "move" | "size"; moved: boolean; wasHeld: boolean
  } | null>(null)

  const say = (text: string) => setNotice((before) => ({ text, sequence: before.sequence + 1 }))
  const commit = (next: TilingItem[]) => {
    animateNext.current = !drag.current
    if (value === undefined) setLocal(next)
    onValueChange?.(next)
  }
  const lift = (tile: TilingItem) => {
    setHeld({ ...tile })
    say(`${tile.label} picked up at ${geometry(tile)}`)
  }
  const down = (tile: TilingItem) => {
    drag.current = null
    setHeld(null)
    say(`${tile.label} set down at ${geometry(tile)}`)
  }
  const cancel = () => {
    drag.current = null
    if (!held || !current) return
    const restored = { ...current, column: held.column, row: held.row, span: held.span, rows: held.rows }
    const blocked = tiles.some((tile) => tile.id !== held.id && overlaps(restored, tile))
    if (!blocked) commit(tiles.map((tile) => tile.id === held.id ? restored : tile))
    setHeld(null)
    say(blocked ? `${current.label} cannot return: that space is now occupied. Kept at ${geometry(current)}` : `${restored.label} put back at ${geometry(restored)}`)
  }
  const change = (tile: TilingItem, next: TilingItem, kind: "moved" | "resized") => {
    if (next.column < 1 || next.row < 1 || next.span < 1 || next.rows < 1 || next.column + next.span > 13) {
      say(`${tile.label} reached the grid edge. Still at ${geometry(tile)}`)
      return
    }
    const neighbour = tiles.find((other) => other.id !== tile.id && overlaps(next, other))
    if (neighbour) {
      say(`${tile.label} cannot be ${kind}: ${neighbour.label} occupies that space. Still at ${geometry(tile)}`)
      return
    }
    if (tile.column === next.column && tile.row === next.row && tile.span === next.span && tile.rows === next.rows) return
    commit(tiles.map((other) => other.id === tile.id ? next : other))
    say(`${tile.label} ${kind} to ${geometry(next)}`)
  }

  // Only a person's edit can start a glide. Mounts, prop updates and viewport changes are still.
  React.useLayoutEffect(() => {
    const board = sheet.current
    if (!board) return
    const cs = getComputedStyle(board)
    const glide = animateNext.current && !matchMedia("(prefers-reduced-motion: reduce)").matches
    const seen = new Map<string, { x: number; y: number }>()
    Array.from(board.children).forEach((node) => {
      if (!(node instanceof HTMLElement) || !node.dataset.id) return
      const at = { x: node.offsetLeft, y: node.offsetTop }
      const before = previous.current.get(node.dataset.id)
      seen.set(node.dataset.id, at)
      node.getAnimations().forEach((animation) => animation.cancel())
      if (glide && before && (at.x !== before.x || at.y !== before.y)) {
        node.animate([{ translate: `${before.x - at.x}px ${before.y - at.y}px` }, { translate: "0 0" }], { duration: parseFloat(cs.getPropertyValue("--db-moderato")) || 320, easing: cs.getPropertyValue("--db-breath").trim() || "ease" })
      }
    })
    previous.current = seen
    animateNext.current = false
    if (focusNext.current) {
      const handle = handles.current.get(focusNext.current)
      if (handle) {
        handle.focus({ preventScroll: true })
        handle.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "instant" })
      }
      focusNext.current = null
    }
    revealNext.current?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "instant" })
    revealNext.current = null
  })

  const key = (event: React.KeyboardEvent<HTMLButtonElement>, tile: TilingItem, kind: "move" | "size") => {
    if (event.key === "Escape" && current) {
      event.preventDefault()
      cancel()
      return
    }
    if (event.altKey || event.ctrlKey || event.metaKey || !current || current.id !== tile.id) return
    const rtl = getComputedStyle(event.currentTarget).direction === "rtl"
    const horizontal = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0
    const dx = horizontal * (rtl ? -1 : 1)
    const dy = event.key === "ArrowDown" ? 1 : event.key === "ArrowUp" ? -1 : 0
    if (!dx && !dy) return
    event.preventDefault()
    const resizing = event.shiftKey || kind === "size"
    revealNext.current = event.currentTarget
    change(tile, resizing ? { ...tile, span: tile.span + dx, rows: tile.rows + dy } : { ...tile, column: tile.column + dx, row: tile.row + dy }, resizing ? "resized" : "moved")
  }

  const pointerDown = (event: React.PointerEvent<HTMLButtonElement>, tile: TilingItem, kind: "move" | "size") => {
    if (event.button !== 0 || !event.isPrimary || !sheet.current) return
    event.preventDefault()
    event.currentTarget.focus({ preventScroll: true })
    event.currentTarget.setPointerCapture(event.pointerId)
    const board = sheet.current
    const bounds = board.getBoundingClientRect()
    const cs = getComputedStyle(board)
    const wasHeld = current?.id === tile.id
    drag.current = { tile, pointer: event.pointerId, x: event.clientX, y: event.clientY, left: bounds.left, top: bounds.top, columnStep: (bounds.width + parseFloat(cs.columnGap)) / 12, rowStep: parseFloat(cs.gridAutoRows) + parseFloat(cs.rowGap), rtl: cs.direction === "rtl", kind, moved: false, wasHeld }
    if (!wasHeld) lift(tile)
  }
  const pointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    const active = drag.current
    if (!active || active.pointer !== event.pointerId || !sheet.current) return
    const bounds = sheet.current.getBoundingClientRect()
    const x = event.clientX - active.x + active.left - bounds.left
    const y = event.clientY - active.y + active.top - bounds.top
    if (Math.abs(x) + Math.abs(y) < 4 && !active.moved) return
    active.moved = true
    const dx = Math.round(x / active.columnStep) * (active.rtl ? -1 : 1)
    const dy = Math.round(y / active.rowStep)
    const tile = tiles.find((item) => item.id === active.tile.id)
    if (!tile) return
    change(tile, active.kind === "size" ? { ...tile, span: active.tile.span + dx, rows: active.tile.rows + dy } : { ...tile, column: active.tile.column + dx, row: active.tile.row + dy }, active.kind === "size" ? "resized" : "moved")
  }
  const pointerUp = (event: React.PointerEvent<HTMLButtonElement>, tile: TilingItem) => {
    const active = drag.current
    if (!active || active.pointer !== event.pointerId) return
    drag.current = null
    event.currentTarget.releasePointerCapture(event.pointerId)
    if (active.moved || active.wasHeld) down(tile)
  }

  const addTile = () => {
    let n = tiles.length + 1
    while (tiles.some((tile) => tile.id === `tile-${n}`)) n++
    const tile = { id: `tile-${n}`, label: `Tile ${n}`, column: 1, row: 1, span: 4, rows: 1 }
    const last = Math.max(0, ...tiles.map((item) => item.row + item.rows - 1)) + 1
    for (let row = 1; row <= last; row++) {
      for (let column = 1; column <= 9; column++) {
        Object.assign(tile, { column, row })
        if (tiles.some((item) => overlaps(tile, item))) continue
        focusNext.current = tile.id
        commit([...tiles, tile])
        setHeld({ ...tile })
        say(`${tile.label} added and picked up at ${geometry(tile)}`)
        return
      }
    }
  }
  const removeTile = () => {
    if (!current) return
    const at = tiles.indexOf(current)
    const next = tiles.filter((tile) => tile.id !== current.id)
    focusNext.current = next[Math.min(at, next.length - 1)]?.id ?? null
    commit(next)
    drag.current = null
    setHeld(null)
    if (!next.length) add.current?.focus()
    say(`${current.label} removed. ${next.length} ${next.length === 1 ? "tile remains" : "tiles remain"}.`)
  }
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(tiles, null, 2))
      say("Layout copied as JSON.")
    } catch {
      if (output.current) output.current.open = true
      json.current?.focus()
      json.current?.select()
      say("Clipboard unavailable. Select and copy the layout below.")
    }
  }

  const rows = error ? 2 : Math.max(2, ...tiles.map((tile) => tile.row + tile.rows))
  return (
    <div data-slot="tiling-editor" data-variant={variant} className={cn("db-tiling db-tiling-editor", className)} {...props}>
      <div className="db-tiling-toolbar">
        <span className="db-tiling-caption">{label}</span>
        <div className="db-tiling-actions">
          <button ref={add} type="button" onClick={addTile} disabled={!!error}>Add tile</button>
          <button type="button" onClick={removeTile} disabled={!current || !!error} aria-label={current ? `Remove tile: ${current.label}` : "Remove tile"}>Remove tile</button>
          {copyLayout ? <button type="button" onClick={copy} disabled={!!error}>Copy layout</button> : null}
        </div>
      </div>
      <p id={hint} className="db-tiling-hint">Pick up with Enter or Space. Arrows move; Shift + arrows resize. Press again to put down. Escape puts it back. Drag “move” or “size”. Scroll across on a narrow screen.</p>
      {error ? <p role="alert">{error}</p> : (
        <div className="db-tiling-viewport" tabIndex={0} role="region" aria-label={`${label}, 12-column editing sheet`} aria-describedby={hint}>
          <div className="db-tiling-canvas">
            <div className="db-tiling-columns" aria-hidden="true">{Array.from({ length: 12 }, (_, i) => <span key={i}><bdi>{String(i + 1).padStart(2, "0")}</bdi></span>)}</div>
            <div ref={sheet} className="db-tiling-sheet" style={{ "--db-tiling-rows": rows } as React.CSSProperties}>
              {tiles.map((tile) => (
                <Tile key={tile.id} span={tile.span} rows={tile.rows} data-id={tile.id} data-held={current?.id === tile.id || undefined} role="group" aria-label={`${tile.label}, ${geometry(tile)}`} className={current?.id === tile.id ? "db-corners" : undefined} style={{ gridColumn: `${tile.column} / span ${tile.span}`, gridRow: `${tile.row} / span ${tile.rows}` }}>
                  {(["move", "size"] as const).map((kind) => (
                    <button
                      key={kind}
                      ref={kind === "move" ? (node) => { if (node) handles.current.set(tile.id, node); else handles.current.delete(tile.id) } : undefined}
                      type="button"
                      className={`db-tiling-${kind}`}
                      aria-label={`${kind === "move" ? "Move" : "Size"} ${tile.label}`}
                      aria-pressed={current?.id === tile.id}
                      aria-describedby={hint}
                      onClick={(event) => { if (event.detail === 0) { if (current?.id === tile.id) down(tile); else lift(tile) } }}
                      onKeyDown={(event) => key(event, tile, kind)}
                      onPointerDown={(event) => pointerDown(event, tile, kind)}
                      onPointerMove={pointerMove}
                      onPointerUp={(event) => pointerUp(event, tile)}
                      onPointerCancel={cancel}
                      onLostPointerCapture={() => { if (drag.current) cancel() }}
                    >{kind}</button>
                  ))}
                  <div className="db-tiling-content">{renderTile ? renderTile(tile) : <span className="db-tiling-name">{tile.label}</span>}</div>
                </Tile>
              ))}
              {!tiles.length ? <p className="db-tiling-empty">A little space.<br /><span>Add your first tile.</span></p> : null}
            </div>
          </div>
        </div>
      )}
      <p className="db-tiling-status" role="status" aria-live="polite" aria-atomic="true"><span key={notice.sequence}>{notice.text}</span></p>
      {copyLayout ? <details ref={output} className="db-tiling-output"><summary>Layout JSON</summary><textarea ref={json} readOnly aria-label={`${label} layout JSON`} value={JSON.stringify(tiles, null, 2)} spellCheck={false} /></details> : null}
    </div>
  )
}

export { Tiling, Tile, TilingEditor, type TilingProps, type TileProps, type TilingEditorProps, type TilingItem, type TilingLayout }
