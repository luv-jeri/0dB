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

type EditKind = "move" | "corner" | "start" | "end" | "top" | "bottom"
type TilingEdit = { id: string; base: TilingLayout; layout: TilingItem[]; kind: EditKind; offset?: { x: number; y: number } }
const sameGeometry = (a: TilingItem, b: TilingItem) => a.column === b.column && a.row === b.row && a.span === b.span && a.rows === b.rows
const tracks = (tile: TilingItem) => ({ gridColumn: `${tile.column} / span ${tile.span}`, gridRow: `${tile.row} / span ${tile.rows}` })

// A sparse sheet can make room. Matching rectangles swap; other neighbours keep their
// columns and move down, in reading order, until each has its own unoccupied rectangle.
function arrange(tiles: TilingLayout, next: TilingItem, kind: EditKind) {
  const original = tiles.find((tile) => tile.id === next.id)!
  const neighbours = tiles.filter((tile) => tile.id !== next.id)
  const hit = neighbours.filter((tile) => overlaps(next, tile))
  if (kind === "move" && hit.length === 1 && sameGeometry(next, { ...hit[0], id: next.id })) {
    const swapped = { ...hit[0], column: original.column, row: original.row, span: original.span, rows: original.rows }
    return tiles.map((tile) => tile.id === next.id ? next : tile.id === swapped.id ? swapped : { ...tile })
  }
  const placed = [next]
  for (const tile of [...neighbours].sort((a, b) => a.row - b.row || a.column - b.column)) {
    let candidate = { ...tile }
    let collisions = placed.filter((other) => overlaps(candidate, other))
    while (collisions.length) {
      candidate = { ...candidate, row: Math.max(...collisions.map((other) => other.row + other.rows)) }
      collisions = placed.filter((other) => overlaps(candidate, other))
    }
    placed.push(candidate)
  }
  return tiles.map((tile) => placed.find((other) => other.id === tile.id)!)
}

function adjusted(tile: TilingItem, dx: number, dy: number, kind: EditKind) {
  const next = { ...tile }
  if (kind === "move") {
    next.column = Math.max(1, Math.min(13 - tile.span, tile.column + dx))
    next.row = Math.max(1, tile.row + dy)
  } else {
    if (kind === "corner" || kind === "end") next.span = Math.max(1, Math.min(13 - tile.column, tile.span + dx))
    if (kind === "corner" || kind === "bottom") next.rows = Math.max(1, tile.rows + dy)
    if (kind === "start") {
      next.column = Math.max(1, Math.min(tile.column + tile.span - 1, tile.column + dx))
      next.span = tile.span + tile.column - next.column
    }
    if (kind === "top") {
      next.row = Math.max(1, Math.min(tile.row + tile.rows - 1, tile.row + dy))
      next.rows = tile.rows + tile.row - next.row
    }
  }
  return next
}

/** Editing is opt-in. Pointer and keyboard previews commit together on drop; Escape discards them. */
function TilingEditor({ label, value, defaultValue = [], onValueChange, variant = "rules", renderTile, copyLayout = false, defaultHeld, className, ...props }: TilingEditorProps) {
  const [local, setLocal] = React.useState<TilingLayout>(() => copyTiles(defaultValue))
  const tiles = value ?? local
  const error = layoutError(tiles)
  const [selected, setSelected] = React.useState(defaultHeld ?? "")
  const [edit, setEdit] = React.useState<TilingEdit | null>(() => defaultHeld && tiles.some((tile) => tile.id === defaultHeld) ? { id: defaultHeld, base: tiles, layout: copyTiles(tiles), kind: "move" } : null)
  // An external controlled update always wins over an unfinished gesture.
  const activeEdit = edit?.base === tiles ? edit : null
  const shown = activeEdit?.layout ?? tiles
  const current = shown.find((tile) => tile.id === selected)
  const [notice, setNotice] = React.useState({ text: "", sequence: 0 })
  const hint = React.useId()
  const keys = React.useId()
  const sheet = React.useRef<HTMLDivElement>(null)
  const add = React.useRef<HTMLButtonElement>(null)
  const output = React.useRef<HTMLDetailsElement>(null)
  const json = React.useRef<HTMLTextAreaElement>(null)
  const handles = React.useRef(new Map<string, HTMLDivElement>())
  const focusNext = React.useRef<string | null>(null)
  const previous = React.useRef(new Map<string, { x: number; y: number }>())
  const animateNext = React.useRef(false)
  const suppressClick = React.useRef(false)
  const drag = React.useRef<{
    tile: TilingItem; base: TilingLayout; pointer: number; x: number; y: number; left: number; top: number
    columnStep: number; rowStep: number; rtl: boolean; kind: EditKind; moved: boolean; preview: TilingItem[]
  } | null>(null)

  const say = (text: string) => setNotice((before) => ({ text, sequence: before.sequence + 1 }))
  const commit = (next: TilingItem[]) => {
    animateNext.current = true
    if (value === undefined) setLocal(next)
    onValueChange?.(copyTiles(next))
  }
  const lift = (tile: TilingItem, kind: EditKind = "move") => {
    setSelected(tile.id)
    setEdit({ id: tile.id, base: tiles, layout: copyTiles(tiles), kind })
    say(`${tile.label} picked up. ${geometry(tile)}`)
  }
  const clear = () => {
    drag.current = null
    setEdit(null)
    animateNext.current = true
  }
  const cancel = () => {
    clear()
    say("Edit cancelled. Saved layout unchanged.")
  }
  const drop = (next = activeEdit?.layout) => {
    const tile = next?.find((item) => item.id === selected)
    if (next && next.some((item, i) => !sameGeometry(item, tiles[i]))) commit(next)
    clear()
    if (tile) say(`${tile.label} set down. ${geometry(tile)}`)
  }

  // Capture visible positions, including the held tile's pointer offset, so release
  // glides from the hand to its landing cells. Prop updates and mounts stay still.
  React.useLayoutEffect(() => {
    const board = sheet.current
    if (!board) return
    const bounds = board.getBoundingClientRect()
    const cs = getComputedStyle(board)
    const glide = animateNext.current && !matchMedia("(prefers-reduced-motion: reduce)").matches
    const seen = new Map<string, { x: number; y: number }>()
    Array.from(board.children).forEach((node) => {
      if (!(node instanceof HTMLElement) || !node.dataset.id) return
      const rect = node.getBoundingClientRect()
      const at = { x: rect.left - bounds.left, y: rect.top - bounds.top }
      const before = previous.current.get(node.dataset.id)
      seen.set(node.dataset.id, at)
      if (glide && before && !node.hasAttribute("data-dragging") && (Math.abs(at.x - before.x) > 0.5 || Math.abs(at.y - before.y) > 0.5)) {
        node.getAnimations().forEach((animation) => animation.cancel())
        node.animate([{ translate: `${before.x - node.offsetLeft}px ${before.y - node.offsetTop}px` }, { translate: "0 0" }], { duration: parseFloat(cs.getPropertyValue("--db-moderato")) || 320, easing: cs.getPropertyValue("--db-breath").trim() || "ease" })
      }
    })
    previous.current = seen
    animateNext.current = false
    if (focusNext.current) {
      handles.current.get(focusNext.current)?.focus({ preventScroll: true })
      focusNext.current = null
    }
  })

  const key = (event: React.KeyboardEvent<HTMLElement>, tile: TilingItem, kind: EditKind = "move") => {
    if (event.target !== event.currentTarget || event.altKey || event.ctrlKey || event.metaKey) return
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      event.stopPropagation()
      if (activeEdit?.id === tile.id) drop()
      else lift(tile, kind)
      return
    }
    if (!activeEdit || activeEdit.id !== tile.id) return
    const rtl = getComputedStyle(event.currentTarget).direction === "rtl"
    const dx = (event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0) * (rtl ? -1 : 1)
    const dy = event.key === "ArrowDown" ? 1 : event.key === "ArrowUp" ? -1 : 0
    if (!dx && !dy) return
    event.preventDefault()
    event.stopPropagation()
    const action = event.shiftKey ? "corner" : kind
    const next = adjusted(tile, dx, dy, action)
    if (sameGeometry(next, tile)) { say(`${tile.label} reached the grid edge.`); return }
    const layout = arrange(activeEdit.base, next, action)
    animateNext.current = true
    setEdit({ ...activeEdit, layout, kind: action })
    say(`${tile.label} ${action === "move" ? "moved" : "resized"}. ${geometry(next)} Neighbours make room.`)
  }

  const pointerDown = (event: React.PointerEvent<HTMLElement>, tile: TilingItem, kind: EditKind = "move") => {
    if (event.defaultPrevented || event.button !== 0 || !event.isPrimary || !sheet.current) return
    if ((event.target as HTMLElement).closest("input, textarea, select, [contenteditable]:not([contenteditable='false']), [data-tiling-no-drag]")) return
    if (kind !== "move") { event.preventDefault(); event.stopPropagation() }
    const board = sheet.current
    const bounds = board.getBoundingClientRect()
    const cs = getComputedStyle(board)
    suppressClick.current = false
    // Do not capture or prevent the initial press: links and buttons still receive a click.
    drag.current = { tile, base: tiles, pointer: event.pointerId, x: event.clientX, y: event.clientY, left: bounds.left, top: bounds.top, columnStep: (bounds.width + parseFloat(cs.columnGap)) / 12, rowStep: parseFloat(cs.gridAutoRows) + parseFloat(cs.rowGap), rtl: cs.direction === "rtl", kind, moved: false, preview: copyTiles(tiles) }
    setSelected(tile.id)
  }
  const pointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const pending = drag.current
    if (!pending || pending.pointer !== event.pointerId || !sheet.current) return
    if (pending.base !== tiles) { cancel(); return }
    const bounds = sheet.current.getBoundingClientRect()
    const x = event.clientX - pending.x + pending.left - bounds.left
    const y = event.clientY - pending.y + pending.top - bounds.top
    if (!pending.moved && Math.hypot(x, y) < 6) return
    if (!pending.moved) {
      pending.moved = true
      event.currentTarget.focus({ preventScroll: true })
      event.currentTarget.setPointerCapture(event.pointerId)
      event.currentTarget.getAnimations().forEach((animation) => animation.cancel())
    }
    event.preventDefault()
    suppressClick.current = true
    const dx = Math.round(x / pending.columnStep) * (pending.rtl ? -1 : 1)
    const dy = Math.round(y / pending.rowStep)
    const next = adjusted(pending.tile, dx, dy, pending.kind)
    const layout = arrange(pending.base, next, pending.kind)
    const was = pending.preview.find((tile) => tile.id === next.id)!
    animateNext.current = !sameGeometry(was, next)
    if (!sameGeometry(was, next)) say(`${next.label}, ${geometry(next)} Release to place. Neighbours make room.`)
    pending.preview = layout
    setEdit({ id: next.id, base: pending.base, layout, kind: pending.kind, offset: pending.kind === "move" ? { x, y } : undefined })
  }
  const pointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const pending = drag.current
    if (!pending || pending.pointer !== event.pointerId) return
    if (pending.base !== tiles) cancel()
    else if (pending.moved) drop(pending.preview)
    else drag.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
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
        clear()
        focusNext.current = tile.id
        commit([...tiles, tile])
        setSelected(tile.id)
        say(`${tile.label} added. ${geometry(tile)}`)
        return
      }
    }
  }
  const removeTile = () => {
    if (!current) return
    const at = tiles.findIndex((tile) => tile.id === current.id)
    const next = tiles.filter((tile) => tile.id !== current.id)
    focusNext.current = next[Math.min(at, next.length - 1)]?.id ?? null
    clear()
    commit(next)
    setSelected(focusNext.current ?? "")
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

  const rows = error ? 2 : Math.max(2, ...shown.map((tile) => tile.row + tile.rows), ...tiles.map((tile) => tile.row + tile.rows))
  const landing = activeEdit?.layout.find((tile) => tile.id === activeEdit.id)
  return (
    <div data-slot="tiling-editor" data-variant={variant} className={cn("db-tiling db-tiling-editor", className)} {...props} onKeyDown={(event) => { if (event.key === "Escape" && (activeEdit || drag.current)) { event.preventDefault(); cancel() }; props.onKeyDown?.(event) }}>
      <div className="db-tiling-toolbar">
        <span className="db-tiling-caption">{label}</span>
        <div className="db-tiling-actions" role="group" aria-label={`${label} actions`}>
          <button ref={add} type="button" onClick={addTile} disabled={!!error}>Add tile</button>
          <button type="button" onClick={removeTile} disabled={!current || !!error} aria-label={current ? `Remove tile: ${current.label}` : "Remove tile"}>Remove tile</button>
          {copyLayout ? <button type="button" onClick={copy} disabled={!!error}>Copy layout</button> : null}
        </div>
      </div>
      <div className="db-tiling-instructions">
        <p id={hint} className="db-tiling-hint">Drag to move. Drag the corner to resize.</p>
        <p id={keys} className="db-tiling-keys">Enter / Space picks up or drops. Arrows move. Shift + arrows resize. Escape cancels.</p>
      </div>
      {error ? <p role="alert">{error}</p> : (
        <div className="db-tiling-viewport" tabIndex={0} role="region" aria-label={`${label}, 12-column editing sheet`} aria-describedby={`${hint} ${keys}`}>
          <div className="db-tiling-canvas">
            <div className="db-tiling-columns" aria-hidden="true">{Array.from({ length: 12 }, (_, i) => <span key={i}><bdi>{String(i + 1).padStart(2, "0")}</bdi></span>)}</div>
            <div ref={sheet} className="db-tiling-sheet" style={{ "--db-tiling-rows": rows } as React.CSSProperties}>
              {landing ? <div className="db-tiling-landing" aria-hidden="true" style={tracks(landing)} /> : null}
              {shown.map((tile) => {
                const holding = activeEdit?.id === tile.id
                const floating = holding && activeEdit.offset
                const rectangle = floating ? activeEdit.base.find((item) => item.id === tile.id)! : tile
                return (
                  <Tile key={tile.id} ref={(node) => { if (node) handles.current.set(tile.id, node); else handles.current.delete(tile.id) }} span={rectangle.span} rows={rectangle.rows} data-id={tile.id} data-selected={selected === tile.id || undefined} data-held={holding || undefined} data-dragging={!!floating || undefined} role="group" aria-roledescription="movable tile" aria-label={`${tile.label}, ${geometry(tile)}`} aria-describedby={`${hint} ${keys}`} tabIndex={0} style={{ ...tracks(rectangle), translate: floating ? `${floating.x}px ${floating.y}px` : undefined }}
                    onKeyDown={(event) => key(event, tile)} onPointerDown={(event) => pointerDown(event, tile)} onPointerMove={pointerMove} onPointerUp={pointerUp}
                    onPointerCancel={cancel} onLostPointerCapture={(event) => { if (event.target === event.currentTarget && drag.current?.moved) cancel() }} onDragStart={(event) => event.preventDefault()}
                    onClickCapture={(event) => { if (suppressClick.current) { event.preventDefault(); event.stopPropagation(); suppressClick.current = false } }}
                    onClick={() => setSelected(tile.id)}>
                    <button type="button" className="db-tiling-move" tabIndex={-1} aria-label={`Move ${tile.label}`} aria-pressed={holding} aria-describedby={`${hint} ${keys}`}
                      onKeyDown={(event) => key(event, tile)} onClick={(event) => { if (event.detail === 0) { if (holding) drop(); else lift(tile) } }} />
                    <div className="db-tiling-content">{renderTile ? renderTile(tile) : <span className="db-tiling-name">{tile.label}</span>}</div>
                    {holding ? <span className="db-tiling-dimensions" aria-hidden="true"><span>{tile.span}</span><span> × </span><span>{tile.rows}</span></span> : null}
                    {(["start", "end", "top", "bottom", "corner"] as const).map((side) => (
                      <button key={side} type="button" className="db-tiling-size" data-side={side} aria-label={`Resize ${tile.label}${side === "corner" ? "" : ` ${side} edge`}`} aria-describedby={`${hint} ${keys}`} aria-pressed={holding}
                        onKeyDown={(event) => key(event, tile, side)} onPointerDown={(event) => pointerDown(event, tile, side)}
                        onClick={(event) => { event.stopPropagation(); if (event.detail === 0) { if (holding) drop(); else lift(tile, side) } }} />
                    ))}
                  </Tile>
                )
              })}
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
