"use client"

import * as React from "react"
import * as MenuPrimitive from "@radix-ui/react-dropdown-menu"

import { marginaliaUnder } from "@/registry/0nlytype/lib/menu-room"
import { useComposedRefs } from "@/registry/0nlytype/lib/refs"
import { cn } from "@/registry/0nlytype/lib/utils"

// Radix reads direction from its own provider, not the page, so on a right-to-left page a menu
// would hang from the wrong end and its arrow keys would run the wrong way round. Without a dir,
// the menu takes the direction of the page around its trigger, read as the trigger mounts (as the
// menubar and the toggle group do). The root renders nothing, so the trigger reports it.
const Around = React.createContext<(dir: "rtl") => void>(() => {})

function DropdownMenu({ dir, ...props }: React.ComponentProps<typeof MenuPrimitive.Root>) {
  const [around, setAround] = React.useState<"rtl">()
  return (
    <Around.Provider value={setAround}>
      <MenuPrimitive.Root data-slot="dropdown-menu" dir={dir ?? around} {...props} />
    </Around.Provider>
  )
}

function DropdownMenuTrigger({ ref, ...props }: React.ComponentProps<typeof MenuPrimitive.Trigger>) {
  const setAround = React.useContext(Around)
  const composedRef = useComposedRefs(React.useCallback((node: HTMLButtonElement | null) => {
    if (node && getComputedStyle(node).direction === "rtl") setAround("rtl")
  }, [setAround]), ref)
  return (
    <MenuPrimitive.Trigger
      ref={composedRef}
      data-slot="dropdown-menu-trigger"
      {...props}
    />
  )
}

function DropdownMenuGroup(props: React.ComponentProps<typeof MenuPrimitive.Group>) {
  return <MenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
}

function DropdownMenuRadioGroup(props: React.ComponentProps<typeof MenuPrimitive.RadioGroup>) {
  return <MenuPrimitive.RadioGroup data-slot="dropdown-menu-radio-group" {...props} />
}

function DropdownMenuSub(props: React.ComponentProps<typeof MenuPrimitive.Sub>) {
  return <MenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />
}

/**
 * How a menu's list is set. `list`: the item you point at is marked with the highlighter.
 * `leaders`: a book's contents page; each word is joined to its keys by leader dots, and the
 * leader of the word you point at inks from the word to its keys. `marginalia` (dropdown
 * only): the word you point at is explained by a small note hung beside the list on a hairline
 * arrow (each item's `hint`). `orbit` (context menu only): the words stand on an arc.
 * Submenus inherit leaders; the other looks keep to their own list.
 */
type MenuVariant = "list" | "leaders" | "marginalia" | "orbit"
const MenuLook = React.createContext<MenuVariant>("list")

type Note = { hint?: string; y: number; under: boolean }

/**
 * Marginalia: the note for the item you point at, set beside the list at that item's height
 * (or under the list, where there's no room beside it). Radix focuses the item you point at or
 * arrow to, so focus tells us which one. Focus from a submenu bubbles here through React, so
 * only this menu's own items count.
 */
function useMarginalia(on: boolean) {
  const [note, setNote] = React.useState<Note>({ y: 0, under: false })
  const onFocus = (event: React.FocusEvent<HTMLDivElement>) => {
    const menu = event.currentTarget, item = (event.target as HTMLElement).closest<HTMLElement>("[role^='menuitem']")
    if (!on || !item || item.closest("[role='menu']") !== menu) return
    const under = marginaliaUnder(menu.getBoundingClientRect(), document.documentElement.clientWidth, getComputedStyle(menu).direction)
    setNote({ hint: item.dataset.hint, y: item.offsetTop + item.offsetHeight / 2, under })
  }
  const el = on ? (
    <div className="db-menu-note" aria-hidden data-under={note.under ? "" : undefined} data-empty={note.hint ? undefined : ""} style={{ "--db-note-y": `${note.y}px` } as React.CSSProperties}>
      {note.hint}
    </div>
  ) : null
  return { onFocus, el }
}

/**
 * A list of words on the popover panel, hung from its trigger on a leader line. The word
 * you point at is marked with the highlighter; the words arrive in turn.
 */
function DropdownMenuContent({
  className,
  align = "start",
  sideOffset = 27, /* --db-space-5: the leader is this long */
  collisionPadding = 20,
  variant = "list",
  style,
  onFocus,
  children,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Content> & { variant?: "list" | "leaders" | "marginalia" }) {
  const margin = useMarginalia(variant === "marginalia")
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Content
        data-slot="dropdown-menu-content"
        data-variant={variant}
        align={align}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        style={{ "--db-pop-gap": `${sideOffset}px`, ...style } as React.CSSProperties}
        className={cn("db-pop db-menu", className)}
        onFocus={(event) => (onFocus?.(event), margin.onFocus(event))}
        {...props}
      >
        <MenuLook.Provider value={variant}>{children}</MenuLook.Provider>
        {margin.el}
      </MenuPrimitive.Content>
    </MenuPrimitive.Portal>
  )
}

/** An item's `hint`: the note marginalia hangs beside it, and its description for screen readers. */
const hinted = (hint?: string) => (hint ? { "data-hint": hint, "aria-description": hint } : {})

/** A destructive item says so in its words ("Delete Halden for good"); it is never red. */
function DropdownMenuItem({
  className,
  variant = "default",
  hint,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Item> & { variant?: "default" | "destructive"; hint?: string }) {
  return <MenuPrimitive.Item data-slot="dropdown-menu-item" data-variant={variant} className={cn("db-menu-item", className)} {...hinted(hint)} {...props} />
}

/** Checked, the sentence turns to the expression italic. Screen readers get aria-checked. */
function DropdownMenuCheckboxItem({ className, hint, ...props }: React.ComponentProps<typeof MenuPrimitive.CheckboxItem> & { hint?: string }) {
  return <MenuPrimitive.CheckboxItem data-slot="dropdown-menu-checkbox-item" className={cn("db-menu-item", className)} {...hinted(hint)} {...props} />
}

function DropdownMenuRadioItem({ className, hint, ...props }: React.ComponentProps<typeof MenuPrimitive.RadioItem> & { hint?: string }) {
  return <MenuPrimitive.RadioItem data-slot="dropdown-menu-radio-item" className={cn("db-menu-item", className)} {...hinted(hint)} {...props} />
}

function DropdownMenuLabel({ className, ...props }: React.ComponentProps<typeof MenuPrimitive.Label>) {
  return <MenuPrimitive.Label data-slot="dropdown-menu-label" className={cn("db-menu-label", className)} {...props} />
}

function DropdownMenuSeparator({ className, ...props }: React.ComponentProps<typeof MenuPrimitive.Separator>) {
  return <MenuPrimitive.Separator data-slot="dropdown-menu-separator" className={cn("db-menu-sep", className)} {...props} />
}

/**
 * Shortcut keys, each drawn as a base `db-kbd` cap. A string of one word splits into
 * its characters ("⌘D" is two keys); a string with spaces splits on them ("Shift Tab").
 * A shortcut is a Latin key sequence, so it reads ⌘D left to right on a right-to-left page too.
 */
function DropdownMenuShortcut({ className, children, ...props }: React.ComponentProps<"span">) {
  const keys = typeof children === "string" ? (children.includes(" ") ? children.split(" ") : [...children]) : null
  return (
    <span data-slot="dropdown-menu-shortcut" dir="ltr" className={cn("db-menu-keys", className)} {...props}>
      {keys ? keys.map((k, i) => <kbd key={i} className="db-kbd">{k}</kbd>) : children}
    </span>
  )
}

/** Opens something, so it carries the one → glyph. */
function DropdownMenuSubTrigger({ className, hint, ...props }: React.ComponentProps<typeof MenuPrimitive.SubTrigger> & { hint?: string }) {
  return <MenuPrimitive.SubTrigger data-slot="dropdown-menu-sub-trigger" className={cn("db-menu-item db-menu-sub", className)} {...hinted(hint)} {...props} />
}

type SubPlace = Pick<React.ComponentProps<typeof MenuPrimitive.SubContent>, "ref" | "sideOffset" | "alignOffset" | "collisionPadding" | "style">

/** The leader a dropped submenu hangs on: --db-space-4. */
const DROP = 18

/**
 * Where a submenu opens, for all three menus. Beside its item when it fits there, as on a desk.
 * On a narrow screen, where it fits on neither side, it drops open under its item instead, in
 * by the words' inset, the next level of an outline, and hangs from the item on a leader the way
 * the menu hangs from its trigger (data-drop; dropdown-menu.css draws it). Radix fixes a
 * submenu's side (right, or left in right-to-left), so the drop is made from the offsets alone:
 * back across the item, and down by its height. Measured as the submenu opens.
 */
function useSubmenuPlace({ ref, sideOffset = 2, alignOffset = -8, collisionPadding = 20, style }: SubPlace) {
  const look = React.useContext(MenuLook)
  const [drop, setDrop] = React.useState<{ side: number; align: number } | null>(null)
  const place = React.useCallback(
    (node: HTMLDivElement | null) => {
      const item = node && document.getElementById(node.getAttribute("aria-labelledby") ?? "")
      if (!node || !item) return
      const r = item.getBoundingClientRect()
      const pad = typeof collisionPadding === "number" ? collisionPadding : Math.max(collisionPadding.left ?? 0, collisionPadding.right ?? 0)
      const fits = Math.max(document.documentElement.clientWidth - r.right, r.left) - pad - sideOffset >= node.offsetWidth
      item.toggleAttribute("data-drop", !fits) // its arrow turns down
      const next = fits ? null : { side: parseFloat(getComputedStyle(item).paddingInlineStart) - r.width, align: r.height }
      setDrop((was) => (was?.side === next?.side && was?.align === next?.align ? was : next))
    },
    [sideOffset, collisionPadding],
  )
  return {
    ref: useComposedRefs(place, ref),
    sideOffset: drop ? drop.side : sideOffset,
    alignOffset: drop ? drop.align : alignOffset,
    collisionPadding,
    style: drop ? ({ "--db-pop-gap": `${DROP}px`, ...style } as React.CSSProperties) : style,
    "data-drop": drop ? "" : undefined,
    "data-variant": look === "leaders" ? look : undefined, // a submenu keeps the contents page's leaders
  }
}

function DropdownMenuSubContent({ className, ref, sideOffset, alignOffset, collisionPadding, style, ...props }: React.ComponentProps<typeof MenuPrimitive.SubContent>) {
  const place = useSubmenuPlace({ ref, sideOffset, alignOffset, collisionPadding, style })
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.SubContent data-slot="dropdown-menu-sub-content" className={cn("db-pop db-menu", className)} {...props} {...place} />
    </MenuPrimitive.Portal>
  )
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  useSubmenuPlace,
  MenuLook,
}
export type { MenuVariant }
