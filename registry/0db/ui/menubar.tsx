"use client"

import * as React from "react"
import * as MenuPrimitive from "@radix-ui/react-menubar"

import { cn } from "@/registry/0db/lib/utils"
import { DropdownMenuShortcut } from "@/registry/0db/ui/dropdown-menu"

type MenubarProps = React.ComponentProps<typeof MenuPrimitive.Root>

/**
 * A row of words along a hairline; each opens a menu. A stroke slides from the open
 * word to the next as you move between menus. Down opens, Left and Right move.
 */
function Menubar({ className, value, defaultValue, onValueChange, ref, children, ...props }: MenubarProps) {
  const root = React.useRef<HTMLDivElement>(null)
  React.useImperativeHandle(ref, () => root.current as HTMLDivElement)
  const [inner, setInner] = React.useState(defaultValue ?? "")
  const current = value ?? inner

  // The stroke sits under whichever trigger is open. Measured after the open state lands.
  React.useLayoutEffect(() => {
    const el = root.current
    const t = el?.querySelector<HTMLElement>('[data-slot="menubar-trigger"][data-state="open"]')
    if (!el || !t) return
    const first = !el.style.getPropertyValue("--x")
    const line = el.querySelector<HTMLElement>('[data-slot="menubar-line"]')
    if (first && line) line.style.transition = "none" // the first open lands in place; later ones slide
    el.style.setProperty("--x", `${t.offsetLeft}px`)
    el.style.setProperty("--w", `${t.offsetWidth}px`)
    if (first && line) {
      void line.offsetWidth // commit the placement before the transition returns
      line.style.transition = ""
    }
  }, [current])

  return (
    <MenuPrimitive.Root
      ref={root}
      data-slot="menubar"
      data-open={current ? "" : undefined}
      value={value}
      defaultValue={defaultValue}
      onValueChange={(v) => {
        setInner(v)
        onValueChange?.(v)
      }}
      className={cn("db-menubar", className)}
      {...props}
    >
      {children}
      <span data-slot="menubar-line" aria-hidden="true" className="db-menubar-line" />
    </MenuPrimitive.Root>
  )
}

function MenubarMenu(props: React.ComponentProps<typeof MenuPrimitive.Menu>) {
  return <MenuPrimitive.Menu {...props} />
}

function MenubarTrigger({ className, ...props }: React.ComponentProps<typeof MenuPrimitive.Trigger>) {
  return <MenuPrimitive.Trigger data-slot="menubar-trigger" className={cn("db-menubar-trigger", className)} {...props} />
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
 * The dropdown menu's list of words, hung under the word that opened it. The leader
 * is long enough to clear the hairline the menubar sits on.
 */
function MenubarContent({
  className,
  align = "start",
  sideOffset = 27, /* --db-space-5: the leader is this long */
  collisionPadding = 20,
  style,
  ref,
  onFocusOutside,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Content>) {
  const node = React.useRef<HTMLDivElement>(null)
  React.useImperativeHandle(ref, () => node.current as HTMLDivElement)
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Content
        ref={node}
        data-slot="menubar-content"
        align={align}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        style={{ "--db-pop-gap": `${sideOffset}px`, ...style } as React.CSSProperties}
        className={cn("db-pop db-menu", className)}
        onFocusOutside={(event) => {
          onFocusOutside?.(event)
          // A menu still fading out must not dismiss the next one: moving between menus
          // focuses the new one while the old one's exit animation runs.
          if (node.current?.dataset.state === "closed") event.preventDefault()
        }}
        {...props}
      />
    </MenuPrimitive.Portal>
  )
}

/** A destructive item says so in its words ("Delete Halden for good"); it is never red. */
function MenubarItem({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Item> & { variant?: "default" | "destructive" }) {
  return <MenuPrimitive.Item data-slot="menubar-item" data-variant={variant} className={cn("db-menu-item", className)} {...props} />
}

/** Checked, the sentence turns to the expression italic. Screen readers get aria-checked. */
function MenubarCheckboxItem({ className, ...props }: React.ComponentProps<typeof MenuPrimitive.CheckboxItem>) {
  return <MenuPrimitive.CheckboxItem data-slot="menubar-checkbox-item" className={cn("db-menu-item", className)} {...props} />
}

function MenubarRadioItem({ className, ...props }: React.ComponentProps<typeof MenuPrimitive.RadioItem>) {
  return <MenuPrimitive.RadioItem data-slot="menubar-radio-item" className={cn("db-menu-item", className)} {...props} />
}

function MenubarLabel({ className, ...props }: React.ComponentProps<typeof MenuPrimitive.Label>) {
  return <MenuPrimitive.Label data-slot="menubar-label" className={cn("db-menu-label", className)} {...props} />
}

function MenubarSeparator({ className, ...props }: React.ComponentProps<typeof MenuPrimitive.Separator>) {
  return <MenuPrimitive.Separator data-slot="menubar-separator" className={cn("db-menu-sep", className)} {...props} />
}

/** Shortcut keys, each a base `db-kbd` ring; it is the dropdown menu's, under this slot. */
function MenubarShortcut(props: React.ComponentProps<typeof DropdownMenuShortcut>) {
  return <DropdownMenuShortcut data-slot="menubar-shortcut" {...props} />
}

/** Opens something, so it carries the one → glyph. */
function MenubarSubTrigger({ className, ...props }: React.ComponentProps<typeof MenuPrimitive.SubTrigger>) {
  return <MenuPrimitive.SubTrigger data-slot="menubar-sub-trigger" className={cn("db-menu-item db-menu-sub", className)} {...props} />
}

function MenubarSubContent({ className, sideOffset = 2, alignOffset = -8, ...props }: React.ComponentProps<typeof MenuPrimitive.SubContent>) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.SubContent data-slot="menubar-sub-content" sideOffset={sideOffset} alignOffset={alignOffset} className={cn("db-pop db-menu", className)} {...props} />
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
