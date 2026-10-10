"use client"

import * as React from "react"

import { cn } from "@/registry/0nlytype/lib/utils"

const AccordionContext = React.createContext<string | undefined>(undefined)

type AccordionProps = React.ComponentProps<"div"> & {
  /** single: opening one closes the others (native details name grouping). */
  type?: "single" | "multiple"
  /**
   * cross: questions ruled off; the + winds into × and the open question swells into a heading.
   * run-in: the book's run-in head; the answer continues the question's own line as one paragraph.
   * gloss: the answer is hung beside its question in the outer column, as a sidenote glosses a line.
   */
  variant?: "cross" | "run-in" | "gloss"
  /**
   * vertical (the default): questions stacked down the page. horizontal: the questions stand side by side as
   * narrow columns, each name stacked a word to a line, and the open one widens until its name steps up onto
   * one line over its answer. The variant is set aside; below 40rem the columns stack again.
   */
  orientation?: "vertical" | "horizontal"
}

/** A group of questions. Built on native <details>. */
function Accordion({ type = "multiple", variant = "cross", orientation = "vertical", className, onKeyDown, ...props }: AccordionProps) {
  const name = React.useId()
  const across = orientation === "horizontal"
  return (
    <AccordionContext.Provider value={type === "single" ? name : undefined}>
      <div
        data-slot="accordion"
        data-variant={across ? undefined : variant /* side by side has its own form */}
        data-orientation={across ? orientation : undefined}
        className={cn("db-accordion", className)}
        onKeyDown={(e) => {
          onKeyDown?.(e)
          // Side by side, the arrows walk the columns (mirrored right to left); Enter and Space still open, natively.
          const at = e.target as HTMLElement
          if (!across || e.defaultPrevented || at.tagName !== "SUMMARY" || at.parentElement?.parentElement !== e.currentTarget) return
          const names = [...e.currentTarget.querySelectorAll<HTMLElement>(":scope > details > summary")]
          const i = names.indexOf(at)
          const back = getComputedStyle(e.currentTarget).direction === "rtl" ? "ArrowRight" : "ArrowLeft"
          const next = { Home: 0, End: names.length - 1 }[e.key] ?? (e.key === back ? i - 1 : e.key === (back === "ArrowLeft" ? "ArrowRight" : "ArrowLeft") ? i + 1 : NaN)
          if (Number.isNaN(next)) return
          e.preventDefault()
          names[(next + names.length) % names.length]?.focus()
        }}
        {...props}
      />
    </AccordionContext.Provider>
  )
}

type AccordionItemProps = Omit<React.ComponentProps<"details">, "open"> & {
  /** Start open. The browser owns the state afterwards; listen with onToggle. */
  defaultOpen?: boolean
}

function AccordionItem({ defaultOpen, className, ...props }: AccordionItemProps) {
  const name = React.useContext(AccordionContext)
  return (
    <details
      data-slot="accordion-item"
      name={name}
      open={defaultOpen}
      className={cn("db-disclose", className)}
      {...props}
    />
  )
}

/** The question. Native, so Enter and Space open it. */
function AccordionTrigger({ className, ...props }: React.ComponentProps<"summary">) {
  return <summary data-slot="accordion-trigger" className={className} {...props} />
}

function AccordionContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="accordion-content" className={cn("db-disclose-body", className)} {...props} />
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent, type AccordionProps, type AccordionItemProps }
