"use client"

import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"

import { useComposedRefs } from "@/registry/0db/lib/refs"
import { cn } from "@/registry/0db/lib/utils"

type ToggleProps = Omit<React.ComponentProps<typeof TogglePrimitive.Root>, "asChild"> & {
  /**
   * The sign a held word wears. fermata: an arc is sketched over the word, a dot lands under it, and the word
   * leans into the italic. tenuto: a pen runs along a line under the word and rewrites it in the italic as it passes.
   * aside: a small note in our voice is hung beside the held word on a hairline arrow. guides: the two lines the word
   * is set on, baseline and x-height, are drawn through it in dots.
   */
  variant?: "fermata" | "tenuto" | "aside" | "guides"
  /** aside only: what the note beside the held word says. */
  note?: string
  /** Pins a state for documentation ("hover", "focus"); set on the root. */
  "data-force"?: string
}

/**
 * The word and its italic copy start at the same edge but aren't the same width, so a mark centred on
 * the button would sit off the word you see. This reads both widths (--db-toggle-r, --db-toggle-i) and
 * the stylesheet centres or ends the marks on whichever face is showing. Fonts arriving and resizes put
 * the marks straight there (data-still); only a press moves them.
 */
function useFaces(variant: string, children: React.ReactNode) {
  const ref = React.useRef<HTMLButtonElement | null>(null)
  React.useLayoutEffect(() => {
    const button = ref.current
    const label = button?.firstElementChild as HTMLElement | null
    const roman = label?.firstElementChild as HTMLElement | null
    if (!button || !label?.dataset.text || !roman || variant === "tenuto") return
    // The face's own width: its box less the overhang (--over) it keeps on each side, whatever the box-sizing.
    const width = (cs: CSSStyleDeclaration) =>
      `${parseFloat(cs.width) - (cs.boxSizing === "border-box" ? parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight) : 0)}px`
    const read = () => {
      button.setAttribute("data-still", "")
      button.style.setProperty("--db-toggle-r", width(getComputedStyle(roman)))
      button.style.setProperty("--db-toggle-i", width(getComputedStyle(label, "::after")))
      void button.offsetWidth
      button.removeAttribute("data-still")
    }
    read()
    const resize = new ResizeObserver(read)
    resize.observe(label)
    resize.observe(roman)
    return () => resize.disconnect()
  }, [variant, children])
  return ref
}

/**
 * A word you can hold down: a native button with aria-pressed. Held, the word is yours, so it turns italic.
 * The label shares its grid cell with an italic copy of itself (drawn by the stylesheet from data-text),
 * so the button is always as wide as its wider state and nothing beside it moves.
 */
function Toggle({ className, variant = "fermata", note = "on", children, ref, ...props }: ToggleProps) {
  const ownRef = useFaces(variant, children)
  const composedRef = useComposedRefs(ownRef, ref)
  return (
    <TogglePrimitive.Root
      ref={composedRef}
      data-slot="toggle"
      data-variant={variant}
      className={cn("db-toggle", className)}
      {...props}
    >
      <span className="db-toggle-label" data-text={typeof children === "string" ? children : undefined}>
        <span>{children}</span>
        {variant === "aside" ? (
          <small className="db-toggle-note" aria-hidden="true">
            <span className="db-toggle-arrow" />
            {note}
          </small>
        ) : null}
      </span>
    </TogglePrimitive.Root>
  )
}

export { Toggle, type ToggleProps }
