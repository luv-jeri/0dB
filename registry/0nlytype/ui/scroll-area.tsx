"use client"

import * as React from "react"

import { useComposedRefs } from "@/registry/0nlytype/lib/refs"
import { cn } from "@/registry/0nlytype/lib/utils"
import { Scrollbar, type ScrollbarSection } from "@/registry/0nlytype/ui/scrollbar"

type ScrollAreaProps = React.ComponentProps<"div"> & {
  /** Marks on the rail, one per section inside: pointing at the rail brings their numbers down it, and pressing one scrolls there. */
  sections?: ScrollbarSection[]
  /** ruled: a rule at an edge while there's more beyond it. catchword: the first word below the edge waits on the foot rule. wheel: the rows turn on an arc as it scrolls. */
  variant?: "ruled" | "catchword" | "wheel"
}

/** The first word whose line runs under the foot line (the edge), and where it stands, or null at the end. */
function wordBelow(box: HTMLElement, foot: HTMLElement) {
  if (box.scrollTop + box.clientHeight >= box.scrollHeight - 1) return null
  const edge = foot.getBoundingClientRect().top + 0.5
  const skip = (n: Node) => (n.parentElement?.closest("[aria-hidden=true]") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT)
  const walk = document.createTreeWalker(box, NodeFilter.SHOW_TEXT, { acceptNode: skip })
  const range = document.createRange()
  for (let n = walk.nextNode() as Text | null; n; n = walk.nextNode() as Text | null) {
    range.selectNodeContents(n)
    const all = range.getBoundingClientRect()
    if (!all.height || all.bottom <= edge) continue // wholly in view, or above it
    for (const m of n.data.matchAll(/\S+/g)) {
      range.setStart(n, m.index)
      range.setEnd(n, m.index + m[0].length)
      const r = range.getBoundingClientRect()
      if (r.bottom > edge) return { word: m[0], top: r.top }
    }
  }
  return null
}

/**
 * The catchword, after the printer's: the first word of the next page set at the foot of this one. While there's more
 * below, the first word cut off by the foot waits on the rule at the far end; pressing it turns the box to that line.
 */
function useCatchword(box: React.RefObject<HTMLDivElement | null>, on: boolean) {
  React.useEffect(() => {
    const host = box.current
    const word = host?.querySelector<HTMLElement>("[data-slot=scroll-catchword]")
    const foot = word?.parentElement
    if (!on || !host || !word || !foot) return
    let frame = 0, top = 0
    const read = () => {
      const hit = wordBelow(host, foot)
      word.toggleAttribute("data-idle", !hit)
      if (!hit || hit.word === word.textContent) return
      top = hit.top
      word.textContent = hit.word
      word.removeAttribute("data-turn") // the new word turns in (the tempo token collapses it for reduced motion)
      void word.offsetWidth
      word.setAttribute("data-turn", "")
    }
    const soon = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(read)
    }
    const turn = (e: PointerEvent) => {
      if (e.button) return
      e.preventDefault() // keep focus where it is
      const hit = wordBelow(host, foot)
      if (hit) top = hit.top
      const y = host.scrollTop + top - (host.getBoundingClientRect().top + host.clientTop) - 8
      host.scrollTo({ top: y, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" })
    }
    const resize = new ResizeObserver(soon)
    const mutation = new MutationObserver(soon)
    resize.observe(host)
    mutation.observe(host, { childList: true, subtree: true, characterData: true })
    host.addEventListener("scroll", soon, { passive: true })
    word.addEventListener("pointerdown", turn)
    document.fonts.ready.then(soon)
    read()
    return () => {
      cancelAnimationFrame(frame)
      resize.disconnect()
      mutation.disconnect()
      host.removeEventListener("scroll", soon)
      word.removeEventListener("pointerdown", turn)
    }
  }, [box, on])
}

/**
 * A box that scrolls. A rule appears at an edge only while there's more beyond it, and the
 * scrollbar is the page's own ruler rail: down the side, and along the bottom when the content runs sideways
 * (each rail stays hidden until there's something to scroll its way). Give it a height (or max-height) and a
 * name: it takes focus so the keyboard can scroll it, and a name says what it holds.
 * variant="catchword" sets the first word waiting below on the foot rule; variant="wheel" turns the children of
 * what you put inside on an arc, the one in the middle in ink.
 */
function ScrollArea({ className, children, sections, variant = "ruled", ref: forwardedRef, ...props }: ScrollAreaProps) {
  const named = props["aria-label"] || props["aria-labelledby"]
  const box = React.useRef<HTMLDivElement>(null)
  const composedRef = useComposedRefs(box, forwardedRef)
  useCatchword(box, variant === "catchword")
  return (
    <div ref={composedRef} data-slot="scroll-area" data-variant={variant} tabIndex={0} role={named ? "region" : undefined} className={cn("ot-scroll", className)} {...props}>
      {children}
      {variant === "catchword" && (
        <div className="ot-scroll-foot" aria-hidden="true">
          <span data-slot="scroll-catchword" data-idle="" className="ot-scroll-catchword" />
        </div>
      )}
      <Scrollbar sections={sections} />
      <Scrollbar axis="x" sections={sections} />
    </div>
  )
}

export { ScrollArea }
