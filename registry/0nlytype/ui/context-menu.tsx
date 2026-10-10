"use client"

import * as React from "react"
import * as MenuPrimitive from "@radix-ui/react-context-menu"

import { useComposedRefs } from "@/registry/0nlytype/lib/refs"
import { cn } from "@/registry/0nlytype/lib/utils"
import { DropdownMenuShortcut, MenuLook, useSubmenuPlace } from "@/registry/0nlytype/ui/dropdown-menu"

// Radix reads direction from its own provider, not the page. Without a dir, the menu takes the
// direction of the page around its trigger, read as the trigger mounts (as the dropdown menu
// does). The trigger also keeps where you pressed, for the content to place itself from.
type Point = { x: number; y: number }
type Around = { dir?: "ltr" | "rtl"; setAround: (dir: "rtl") => void; atRef: React.RefObject<Point> }
const Around = React.createContext<Around>({ setAround: () => {}, atRef: { current: { x: 0, y: 0 } } })

function ContextMenu({ dir, ...props }: React.ComponentProps<typeof MenuPrimitive.Root>) {
  const [around, setAround] = React.useState<"rtl">()
  const atRef = React.useRef<Point>({ x: 0, y: 0 })
  const value = React.useMemo(() => ({ dir: dir ?? around, setAround, atRef }), [dir, around])
  return (
    <Around.Provider value={value}>
      <MenuPrimitive.Root data-slot="context-menu" dir={dir ?? around} {...props} />
    </Around.Provider>
  )
}

function ContextMenuTrigger({ ref, onContextMenu, onPointerDown, ...props }: React.ComponentProps<typeof MenuPrimitive.Trigger>) {
  const { setAround, atRef } = React.useContext(Around)
  const composedRef = useComposedRefs(React.useCallback((node: HTMLSpanElement | null) => {
    if (node && getComputedStyle(node).direction === "rtl") setAround("rtl")
  }, [setAround]), ref)
  return (
    <MenuPrimitive.Trigger
      ref={composedRef}
      data-slot="context-menu-trigger"
      onContextMenu={(event) => {
        atRef.current = { x: event.clientX, y: event.clientY }
        onContextMenu?.(event)
      }}
      onPointerDown={(event) => {
        atRef.current = { x: event.clientX, y: event.clientY } // a long press opens from here
        onPointerDown?.(event)
      }}
      {...props}
    />
  )
}

function ContextMenuGroup(props: React.ComponentProps<typeof MenuPrimitive.Group>) {
  return <MenuPrimitive.Group data-slot="context-menu-group" {...props} />
}

function ContextMenuRadioGroup(props: React.ComponentProps<typeof MenuPrimitive.RadioGroup>) {
  return <MenuPrimitive.RadioGroup data-slot="context-menu-radio-group" {...props} />
}

function ContextMenuSub(props: React.ComponentProps<typeof MenuPrimitive.Sub>) {
  return <MenuPrimitive.Sub data-slot="context-menu-sub" {...props} />
}

/** Where a menu opens from the point along one axis: forward (toward the line's end, or
 * down) when it fits, else back from the point, else slid in to fit. Returns its start edge. */
function reach(at: number, size: number, room: number, pad: number, forward: boolean) {
  const fore = at + 2, back = at - 2 - size
  const fitsFore = fore + size <= room - pad, fitsBack = back >= pad
  if (forward ? fitsFore : fitsBack) return forward ? fore : back
  if (forward ? fitsBack : fitsFore) return forward ? back : fore
  return Math.max(pad, Math.min(fore, room - pad - size))
}

/**
 * The same list of words, opened where you pressed (right-click, the ContextMenu key or
 * Shift+F10) and spreading from that point like ink. It has no leader line: nothing
 * hangs it from a trigger. It opens toward the line's end and down from the point, as the
 * system's own menus do: to the left on a right-to-left page. Without room it opens back
 * from the point, and on a phone, with room neither way, it slides in to fit, over the
 * point. Radix only opens it to the right and never slides it across, so it is placed here:
 * Radix sets it at the point (no collisions) and it is carried to its place. A cross, the
 * register mark of a Swiss sheet, pins the point the ink spread from.
 *
 * `variant`: `list` (the highlighter), `leaders` (the dropdown menu's contents page) or
 * `orbit`, after WOVE: the words stand on an arc bowed away from the point, a dot on the arc
 * for each, and the one you point at inks with the accent dot.
 */
function ContextMenuContent({
  className,
  collisionPadding = 20,
  variant = "list",
  ref,
  style,
  children,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Content> & { variant?: "list" | "leaders" | "orbit" }) {
  const { dir, atRef } = React.useContext(Around)
  const [shift, setShift] = React.useState<Point>({ x: 0, y: 0 })
  const pad = typeof collisionPadding === "number" ? collisionPadding : Math.max(...Object.values(collisionPadding), 0)
  const composedRef = useComposedRefs(React.useCallback((node: HTMLDivElement | null) => {
    if (node) {
      const { x, y } = atRef.current, html = document.documentElement
      const next = { x: reach(x, node.offsetWidth, html.clientWidth, pad, dir !== "rtl") - (x + 2), y: reach(y - 2, node.offsetHeight, html.clientHeight, pad, true) - y }
      setShift((was) => (was.x === next.x && was.y === next.y ? was : next))
    }
  }, [atRef, dir, pad]), ref)
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Content
        ref={composedRef}
        data-slot="context-menu-content"
        data-at="point"
        data-variant={variant}
        avoidCollisions={false}
        collisionPadding={collisionPadding}
        style={{ translate: `${shift.x}px ${shift.y}px`, "--db-at-x": `${-shift.x}px`, "--db-at-y": `${-shift.y}px`, ...style } as React.CSSProperties}
        className={cn("db-pop db-menu", className)}
        {...props}
      >
        <MenuLook.Provider value={variant}>{children}</MenuLook.Provider>
      </MenuPrimitive.Content>
    </MenuPrimitive.Portal>
  )
}

/** A destructive item says so in its words ("Delete Halden for good"); it is never red. */
function ContextMenuItem({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Item> & { variant?: "default" | "destructive" }) {
  return <MenuPrimitive.Item data-slot="context-menu-item" data-variant={variant} className={cn("db-menu-item", className)} {...props} />
}

/** Checked, the sentence turns to the expression italic. Screen readers get aria-checked. */
function ContextMenuCheckboxItem({ className, ...props }: React.ComponentProps<typeof MenuPrimitive.CheckboxItem>) {
  return <MenuPrimitive.CheckboxItem data-slot="context-menu-checkbox-item" className={cn("db-menu-item", className)} {...props} />
}

function ContextMenuRadioItem({ className, ...props }: React.ComponentProps<typeof MenuPrimitive.RadioItem>) {
  return <MenuPrimitive.RadioItem data-slot="context-menu-radio-item" className={cn("db-menu-item", className)} {...props} />
}

function ContextMenuLabel({ className, ...props }: React.ComponentProps<typeof MenuPrimitive.Label>) {
  return <MenuPrimitive.Label data-slot="context-menu-label" className={cn("db-menu-label", className)} {...props} />
}

function ContextMenuSeparator({ className, ...props }: React.ComponentProps<typeof MenuPrimitive.Separator>) {
  return <MenuPrimitive.Separator data-slot="context-menu-separator" className={cn("db-menu-sep", className)} {...props} />
}

/** Shortcut keys, each a base `db-kbd` cap; it is the dropdown menu's, under this slot. */
function ContextMenuShortcut(props: React.ComponentProps<typeof DropdownMenuShortcut>) {
  return <DropdownMenuShortcut data-slot="context-menu-shortcut" {...props} />
}

/** Opens something, so it carries the one → glyph. */
function ContextMenuSubTrigger({ className, ...props }: React.ComponentProps<typeof MenuPrimitive.SubTrigger>) {
  return <MenuPrimitive.SubTrigger data-slot="context-menu-sub-trigger" className={cn("db-menu-item db-menu-sub", className)} {...props} />
}

/** Beside its item, or on a narrow screen dropped open under it (the dropdown menu's useSubmenuPlace). */
function ContextMenuSubContent({ className, ref, sideOffset, alignOffset, collisionPadding, style, ...props }: React.ComponentProps<typeof MenuPrimitive.SubContent>) {
  const place = useSubmenuPlace({ ref, sideOffset, alignOffset, collisionPadding, style })
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.SubContent data-slot="context-menu-sub-content" className={cn("db-pop db-menu", className)} {...props} {...place} />
    </MenuPrimitive.Portal>
  )
}

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuLabel,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
}
