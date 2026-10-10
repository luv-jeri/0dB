"use client"

import * as React from "react"
import * as MenuPrimitive from "@radix-ui/react-menubar"

import { useComposedRefs } from "@/registry/0nlytype/lib/refs"
import { cn } from "@/registry/0nlytype/lib/utils"
import { DropdownMenuShortcut, MenuLook, useSubmenuPlace } from "@/registry/0nlytype/ui/dropdown-menu"

type MenubarVariant = "pocket" | "leaders" | "caption"
const Look = React.createContext<MenubarVariant>("pocket")

/** An item's own words, without its shortcut keys or a submenu's arrow. */
const words = (el: HTMLElement) =>
  [...el.childNodes].filter((n) => n.nodeType === Node.TEXT_NODE).map((n) => n.textContent).join("").trim() || (el.textContent ?? "").trim()

/** Where focus is, as the words that lead there: the bar's word, any submenus, then the item. */
function pathTo(el: HTMLElement) {
  const path: string[] = []
  for (let at: HTMLElement | null = el; at; ) {
    path.unshift(words(at))
    if (at.dataset.slot === "menubar-trigger") break
    at = document.getElementById(at.closest("[role='menu']")?.getAttribute("aria-labelledby") ?? "")
  }
  return path
}

/**
 * A row of words on a hairline. Opening a word opens the hairline under it into a pocket:
 * the line folds down around the menu and back up. Down opens, Left and Right move between menus.
 *
 * `variant`: `pocket` (the default), `leaders` (every menu is a contents page, the dropdown
 * menu's leaders) or `caption`, after the SHAPES / GRADIENTS rule that carries a name at its
 * far end and the old status line: the rule's far end carries the bar's name at rest, and the
 * path to what focus is on as you move ("File / Export / As PDF"). The caption is aria-hidden;
 * the menus already say where you are.
 */
function Menubar({ className, dir, ref, variant = "pocket", children, onFocus, onBlur, ...props }: React.ComponentProps<typeof MenuPrimitive.Root> & { variant?: MenubarVariant }) {
  // Radix reads direction from its own provider, not the page, so a right-to-left page would get
  // left-to-right menus and arrow keys the wrong way round. Without a dir, the bar takes the
  // direction of the page around it, read as it mounts (as the toggle group does).
  const [around, setAround] = React.useState<"rtl">()
  const [path, setPath] = React.useState<string[] | null>(null)
  const caption = variant === "caption"
  const rest = props["aria-label"]
  const composedRef = useComposedRefs(React.useCallback((node: HTMLDivElement | null) => {
    const up = node?.parentElement
    if (!dir && up && getComputedStyle(up).direction === "rtl") setAround("rtl")
  }, [dir]), ref)
  return (
    <MenuPrimitive.Root
      ref={composedRef}
      data-slot="menubar"
      data-variant={variant}
      dir={dir ?? around}
      className={cn("ot-menubar", className)}
      // Focus in the menus bubbles here through React, from their portals too.
      onFocus={(event) => {
        onFocus?.(event)
        const at = (event.target as HTMLElement).closest<HTMLElement>("[role^='menuitem']") // not a menu's own box
        if (caption && at) setPath(pathTo(at))
      }}
      onBlur={(event) => {
        onBlur?.(event)
        const to = event.relatedTarget as HTMLElement | null
        if (caption && !to?.closest("[data-slot='menubar'], [role='menu']")) setPath(null)
      }}
      {...props}
    >
      <Look.Provider value={variant}>{children}</Look.Provider>
      {caption ? (
        <span className="ot-menubar-caption" aria-hidden data-rest={path ? undefined : ""}>
          {(path ?? (rest ? [rest] : [])).map((w, i) => (
            <span key={`${i}-${w}`}>{w}</span>
          ))}
        </span>
      ) : null}
    </MenuPrimitive.Root>
  )
}

function MenubarMenu(props: React.ComponentProps<typeof MenuPrimitive.Menu>) {
  return <MenuPrimitive.Menu {...props} />
}

function MenubarTrigger({ className, ...props }: React.ComponentProps<typeof MenuPrimitive.Trigger>) {
  return <MenuPrimitive.Trigger data-slot="menubar-trigger" className={cn("ot-menubar-trigger", className)} {...props} />
}

function MenubarGroup(props: React.ComponentProps<typeof MenuPrimitive.Group>) {
  return <MenuPrimitive.Group data-slot="menubar-group" {...props} />
}

function MenubarRadioGroup(props: React.ComponentProps<typeof MenuPrimitive.RadioGroup>) {
  return <MenuPrimitive.RadioGroup data-slot="menubar-radio-group" {...props} />
}

function MenubarSub(props: React.ComponentProps<typeof MenuPrimitive.Sub>) {
  return <MenuPrimitive.Sub data-slot="menubar-sub" {...props} />
}

/**
 * The dropdown menu's list of words, hung in the bar's own hairline: the panel rises just
 * over the rule (a sideOffset of minus one and a half pixels, since the word reaches down to
 * the rule), its paper hides the rule there, and its sides and foot carry the line on. So
 * the menu needs no leader. Its words start under the word that opened it; the bar sits its
 * words in from the rule's ends by the same inset, so even the first menu folds from the rule.
 */
function MenubarContent({
  className,
  align = "start",
  sideOffset = -1.5, /* over the rule by more than its width, whatever pixel it rounds to */
  alignOffset = -27, /* --ot-space-5, the items' inset: their words line up under the word */
  collisionPadding = 20,
  ref,
  onFocusOutside,
  children,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Content>) {
  const look = React.useContext(Look) === "leaders" ? "leaders" : "list"
  const node = React.useRef<HTMLDivElement>(null)
  const composedRef = useComposedRefs(node, ref)
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Content
        ref={composedRef}
        data-slot="menubar-content"
        data-variant={look}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        collisionPadding={collisionPadding}
        className={cn("ot-pop ot-menu", className)}
        onFocusOutside={(event) => {
          onFocusOutside?.(event)
          // A menu still rolling up must not dismiss the next one: moving between menus
          // focuses the new one while the old one's exit animation runs.
          if (node.current?.dataset.state === "closed") event.preventDefault()
        }}
        {...props}
      >
        <MenuLook.Provider value={look}>{children}</MenuLook.Provider>
      </MenuPrimitive.Content>
    </MenuPrimitive.Portal>
  )
}

/** A destructive item says so in its words ("Delete Halden for good"); it is never red. */
function MenubarItem({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Item> & { variant?: "default" | "destructive" }) {
  return <MenuPrimitive.Item data-slot="menubar-item" data-variant={variant} className={cn("ot-menu-item", className)} {...props} />
}

/** Checked, the sentence turns to the expression italic. Screen readers get aria-checked. */
function MenubarCheckboxItem({ className, ...props }: React.ComponentProps<typeof MenuPrimitive.CheckboxItem>) {
  return <MenuPrimitive.CheckboxItem data-slot="menubar-checkbox-item" className={cn("ot-menu-item", className)} {...props} />
}

function MenubarRadioItem({ className, ...props }: React.ComponentProps<typeof MenuPrimitive.RadioItem>) {
  return <MenuPrimitive.RadioItem data-slot="menubar-radio-item" className={cn("ot-menu-item", className)} {...props} />
}

function MenubarLabel({ className, ...props }: React.ComponentProps<typeof MenuPrimitive.Label>) {
  return <MenuPrimitive.Label data-slot="menubar-label" className={cn("ot-menu-label", className)} {...props} />
}

function MenubarSeparator({ className, ...props }: React.ComponentProps<typeof MenuPrimitive.Separator>) {
  return <MenuPrimitive.Separator data-slot="menubar-separator" className={cn("ot-menu-sep", className)} {...props} />
}

/** Shortcut keys, each a base `ot-kbd` cap; it is the dropdown menu's, under this slot. */
function MenubarShortcut(props: React.ComponentProps<typeof DropdownMenuShortcut>) {
  return <DropdownMenuShortcut data-slot="menubar-shortcut" {...props} />
}

/** Opens something, so it carries the one → glyph. */
function MenubarSubTrigger({ className, ...props }: React.ComponentProps<typeof MenuPrimitive.SubTrigger>) {
  return <MenuPrimitive.SubTrigger data-slot="menubar-sub-trigger" className={cn("ot-menu-item ot-menu-sub", className)} {...props} />
}

/** Beside its item, or on a narrow screen dropped open under it (the dropdown menu's useSubmenuPlace). */
function MenubarSubContent({ className, ref, sideOffset, alignOffset, collisionPadding, style, ...props }: React.ComponentProps<typeof MenuPrimitive.SubContent>) {
  const place = useSubmenuPlace({ ref, sideOffset, alignOffset, collisionPadding, style })
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.SubContent data-slot="menubar-sub-content" className={cn("ot-pop ot-menu", className)} {...props} {...place} />
    </MenuPrimitive.Portal>
  )
}

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarGroup,
  MenubarLabel,
  MenubarItem,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
}
