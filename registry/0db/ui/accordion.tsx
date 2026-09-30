"use client"

import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"

const AccordionContext = React.createContext<string | undefined>(undefined)

type AccordionProps = React.ComponentProps<"div"> & {
  /** single: opening one closes the others (native details name grouping). */
  type?: "single" | "multiple"
}

/** A group of questions, each ruled off. Built on native <details>. */
function Accordion({ type = "multiple", className, ...props }: AccordionProps) {
  const name = React.useId()
  return (
    <AccordionContext.Provider value={type === "single" ? name : undefined}>
      <div data-slot="accordion" className={cn("db-accordion", className)} {...props} />
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

/** The question. A plus that turns into a cross when it opens. */
function AccordionTrigger({ className, ...props }: React.ComponentProps<"summary">) {
  return <summary data-slot="accordion-trigger" className={className} {...props} />
}

function AccordionContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="accordion-content" className={cn("db-disclose-body", className)} {...props} />
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent, type AccordionProps, type AccordionItemProps }
