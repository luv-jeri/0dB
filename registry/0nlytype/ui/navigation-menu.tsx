"use client"

import * as React from "react"
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu"

import { useComposedRefs } from "@/registry/0nlytype/lib/refs"
import { cn } from "@/registry/0nlytype/lib/utils"

type Variant = "names" | "lead" | "inline"
const VariantContext = React.createContext<Variant>("names")

type NavigationMenuProps = React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
  /**
   * names: a panel of large names hung under the menu.
   * lead: a contents page; the names small in a column, and the one you point at or focus set as the headline beside them, with its line.
   * inline: one line of thought; pressing a word opens its names into the line after it, and the words after make room.
   */
  variant?: Variant
}

/**
 * Small words that open a panel of large names. Radix keeps the pointer delay,
 * focus and arrow keys; each panel spans the width of the menu, hung under it.
 * There is no viewport: every panel sits in its own item.
 */
function NavigationMenu({ variant = "names", className, dir, ref, ...props }: NavigationMenuProps) {
  // Radix writes dir="ltr" on the nav unless told otherwise. Without a dir, the menu takes the direction
  // of the page around it, read as it mounts (as the menus and the tabs do), so its words and keys mirror.
  const [around, setAround] = React.useState<"rtl">()
  const composedRef = useComposedRefs(React.useCallback((node: HTMLElement | null) => {
    const up = node?.parentElement
    if (!dir && up && getComputedStyle(up).direction === "rtl") setAround("rtl")
  }, [dir]), ref)
  return (
    <VariantContext.Provider value={variant}>
      <NavigationMenuPrimitive.Root
        ref={composedRef}
        dir={dir ?? around}
        data-slot="navigation-menu"
        data-variant={variant}
        className={cn("ot-navmenu", className)}
        {...props}
      />
    </VariantContext.Provider>
  )
}

function NavigationMenuList({ className, ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return <NavigationMenuPrimitive.List data-slot="navigation-menu-list" className={className} {...props} />
}

function NavigationMenuItem(props: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  return <NavigationMenuPrimitive.Item data-slot="navigation-menu-item" {...props} />
}

/** Inline, the names open into the line, so a passing pointer must not open them: only a press does. */
const held = (e: React.PointerEvent) => e.preventDefault()

/** A small word with a ↓ that turns over while its panel is open (inline: a → that inks). */
function NavigationMenuTrigger({ className, onPointerMove, onPointerLeave, ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  const inline = React.useContext(VariantContext) === "inline"
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={className}
      onPointerMove={(e) => (onPointerMove?.(e), inline && held(e))}
      onPointerLeave={(e) => (onPointerLeave?.(e), inline && held(e))}
      {...props}
    />
  )
}

/** The panel. Its children are NavigationMenuLinks, each a large name that may hold a <small> line. */
function NavigationMenuContent({ className, children, onPointerOver, onFocus, onPointerLeave, ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  const variant = React.useContext(VariantContext)
  // lead: which name stands as the headline. The first, until another is pointed at or focused.
  const [lead, setLead] = React.useState(0)
  const links = React.Children.toArray(children).filter(React.isValidElement<{ children?: React.ReactNode }>)
  const pick = (from: EventTarget) => {
    const a = from instanceof Element ? from.closest("[data-slot=navigation-menu-link]") : null
    const all = a?.parentElement ? [...a.parentElement.children] : []
    if (a && all.includes(a)) setLead(all.indexOf(a))
  }
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn("ot-navmenu-panel", className)}
      onPointerOver={(e) => (onPointerOver?.(e), variant === "lead" && pick(e.target))}
      onFocus={(e) => (onFocus?.(e), variant === "lead" && pick(e.target))}
      onPointerLeave={(e) => (onPointerLeave?.(e), variant === "inline" && held(e))}
      {...props}
    >
      {variant === "lead" ? (
        <>
          <div data-slot="navigation-menu-names" className="ot-navmenu-names">
            {links.map((link, i) => React.cloneElement(link as React.ReactElement<{ "data-lead"?: boolean }>, { "data-lead": i === lead || undefined }))}
          </div>
          {links[lead] ? (
            <div key={lead} data-slot="navigation-menu-lead" aria-hidden="true" className="ot-navmenu-lead">
              {links[lead].props.children}
            </div>
          ) : null}
        </>
      ) : (
        children
      )}
    </NavigationMenuPrimitive.Content>
  )
}

function NavigationMenuLink({ className, ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
  return <NavigationMenuPrimitive.Link data-slot="navigation-menu-link" className={className} {...props} />
}

export { type NavigationMenuProps, NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink }
