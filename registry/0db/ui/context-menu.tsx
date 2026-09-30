"use client"

import * as React from "react"
import * as MenuPrimitive from "@radix-ui/react-context-menu"

import { cn } from "@/registry/0db/lib/utils"
import { DropdownMenuShortcut } from "@/registry/0db/ui/dropdown-menu"

function ContextMenu(props: React.ComponentProps<typeof MenuPrimitive.Root>) {
  return <MenuPrimitive.Root data-slot="context-menu" {...props} />
}

function ContextMenuTrigger(props: React.ComponentProps<typeof MenuPrimitive.Trigger>) {
  return <MenuPrimitive.Trigger data-slot="context-menu-trigger" {...props} />
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

/**
 * The same list of words, opened where you pressed (right-click, the ContextMenu key or
 * Shift+F10) and spreading from that point like ink. It has no leader line: nothing
 * hangs it from a trigger.
 */
function ContextMenuContent({ className, collisionPadding = 20, ...props }: React.ComponentProps<typeof MenuPrimitive.Content>) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Content data-slot="context-menu-content" data-at="point" collisionPadding={collisionPadding} className={cn("db-pop db-menu", className)} {...props} />
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

/** Shortcut keys, each a base `db-kbd` ring; it is the dropdown menu's, under this slot. */
function ContextMenuShortcut(props: React.ComponentProps<typeof DropdownMenuShortcut>) {
  return <DropdownMenuShortcut data-slot="context-menu-shortcut" {...props} />
}

/** Opens something, so it carries the one → glyph. */
function ContextMenuSubTrigger({ className, ...props }: React.ComponentProps<typeof MenuPrimitive.SubTrigger>) {
  return <MenuPrimitive.SubTrigger data-slot="context-menu-sub-trigger" className={cn("db-menu-item db-menu-sub", className)} {...props} />
}

function ContextMenuSubContent({ className, sideOffset = 2, alignOffset = -8, ...props }: React.ComponentProps<typeof MenuPrimitive.SubContent>) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.SubContent data-slot="context-menu-sub-content" sideOffset={sideOffset} alignOffset={alignOffset} className={cn("db-pop db-menu", className)} {...props} />
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
