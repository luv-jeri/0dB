"use client"

import * as React from "react"
import * as MenuPrimitive from "@radix-ui/react-dropdown-menu"

import { cn } from "@/registry/0db/lib/utils"

function DropdownMenu(props: React.ComponentProps<typeof MenuPrimitive.Root>) {
  return <MenuPrimitive.Root data-slot="dropdown-menu" {...props} />
}

function DropdownMenuTrigger(props: React.ComponentProps<typeof MenuPrimitive.Trigger>) {
  return <MenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />
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
 * A list of words on the popover panel, hung from its trigger on a leader line. The word
 * you point at is marked with the highlighter; the words arrive in turn.
 */
function DropdownMenuContent({
  className,
  align = "start",
  sideOffset = 8,
  style,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Content>) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Content
        data-slot="dropdown-menu-content"
        align={align}
        sideOffset={sideOffset}
        style={{ "--db-pop-gap": `${sideOffset}px`, ...style } as React.CSSProperties}
        className={cn("db-pop db-menu", className)}
        {...props}
      />
    </MenuPrimitive.Portal>
  )
}

/** A destructive item says so in its words ("Delete Halden for good"); it is never red. */
function DropdownMenuItem({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Item> & { variant?: "default" | "destructive" }) {
  return <MenuPrimitive.Item data-slot="dropdown-menu-item" data-variant={variant} className={cn("db-menu-item", className)} {...props} />
}

/** Checked, the sentence turns to the expression italic. Screen readers get aria-checked. */
function DropdownMenuCheckboxItem({ className, ...props }: React.ComponentProps<typeof MenuPrimitive.CheckboxItem>) {
  return <MenuPrimitive.CheckboxItem data-slot="dropdown-menu-checkbox-item" className={cn("db-menu-item", className)} {...props} />
}

function DropdownMenuRadioItem({ className, ...props }: React.ComponentProps<typeof MenuPrimitive.RadioItem>) {
  return <MenuPrimitive.RadioItem data-slot="dropdown-menu-radio-item" className={cn("db-menu-item", className)} {...props} />
}

function DropdownMenuLabel({ className, ...props }: React.ComponentProps<typeof MenuPrimitive.Label>) {
  return <MenuPrimitive.Label data-slot="dropdown-menu-label" className={cn("db-menu-label", className)} {...props} />
}

function DropdownMenuSeparator({ className, ...props }: React.ComponentProps<typeof MenuPrimitive.Separator>) {
  return <MenuPrimitive.Separator data-slot="dropdown-menu-separator" className={cn("db-menu-sep", className)} {...props} />
}

/**
 * Shortcut keys, each drawn as a base `db-kbd` ring. A string of one word splits into
 * its characters ("⌘D" is two keys); a string with spaces splits on them ("Shift Tab").
 */
function DropdownMenuShortcut({ className, children, ...props }: React.ComponentProps<"span">) {
  const keys = typeof children === "string" ? (children.includes(" ") ? children.split(" ") : [...children]) : null
  return (
    <span data-slot="dropdown-menu-shortcut" className={cn("db-menu-keys", className)} {...props}>
      {keys ? keys.map((k, i) => <kbd key={i} className="db-kbd">{k}</kbd>) : children}
    </span>
  )
}

/** Opens something, so it carries the one → glyph. */
function DropdownMenuSubTrigger({ className, ...props }: React.ComponentProps<typeof MenuPrimitive.SubTrigger>) {
  return <MenuPrimitive.SubTrigger data-slot="dropdown-menu-sub-trigger" className={cn("db-menu-item db-menu-sub", className)} {...props} />
}

function DropdownMenuSubContent({ className, sideOffset = 2, ...props }: React.ComponentProps<typeof MenuPrimitive.SubContent>) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.SubContent data-slot="dropdown-menu-sub-content" sideOffset={sideOffset} className={cn("db-pop db-menu", className)} {...props} />
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
}
