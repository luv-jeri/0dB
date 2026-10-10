"use client"

import * as React from "react"

import { Button } from "@/registry/0nlytype/ui/button"
import { RadioGroup, RadioGroupItem } from "@/registry/0nlytype/ui/radio-group"
import { Toast, Toaster, dismiss, toast, type ToastVariant } from "@/registry/0nlytype/ui/toast"
import { State } from "@/components/site/state"

const still = () => () => {}

export default function Example() {
  const [variant, setVariant] = React.useState<ToastVariant>("fermata")
  // The site already mounts a Toaster; this one mounts a commit later, so it's the latest and speaks for the page.
  const mounted = React.useSyncExternalStore(still, () => true, () => false)
  return (
    <div className="grid justify-items-start gap-(--db-space-7)">
      <RadioGroup legend="Toasts as" value={variant} onValueChange={(v) => setVariant(v as ToastVariant)}>
        <RadioGroupItem value="fermata">Fermata</RadioGroupItem>
        <RadioGroupItem value="footnote">Footnote</RadioGroupItem>
        <RadioGroupItem value="dateline">Dateline</RadioGroupItem>
      </RadioGroup>
      <div className="flex flex-wrap items-baseline gap-10">
        <Button onClick={() => toast("Changes saved.")}>Save changes</Button>
        <Button
          onClick={() =>
            toast("Halden archived.", {
              action: { label: "Undo", onClick: () => toast("Halden restored.") },
            })
          }
        >
          Archive project
        </Button>
        <Button variant="quiet" onClick={() => dismiss()}>Clear all</Button>
      </div>
      {mounted ? <Toaster variant={variant} /> : null}
    </div>
  )
}

// Pinned: a toaster set in place, its clock held as if pointed at.
function Still({ variant, children }: { variant: ToastVariant; children: React.ReactNode }) {
  return (
    <div className="db-toaster" data-variant={variant === "fermata" ? undefined : variant} style={{ position: "static", zIndex: "auto", maxInlineSize: "100%" }}>
      {children}
    </div>
  )
}

export function States() {
  const at = new Date(2026, 8, 30, 18, 47).getTime()
  return (
    <>
      <State label="Fermata">
        <Still variant="fermata"><Toast message="Changes saved." data-force="hover" /></Still>
      </State>
      <State label="Fermata, with an action">
        <Still variant="fermata"><Toast message="Halden archived." action={{ label: "Undo", onClick: () => {} }} data-force="hover" /></Still>
      </State>
      <State label="Footnote, two notes">
        <Still variant="footnote">
          <Toast variant="footnote" n={1} message="Changes saved." data-force="hover" />
          <Toast variant="footnote" n={2} message="Halden archived." action={{ label: "Undo", onClick: () => {} }} data-force="hover" />
        </Still>
      </State>
      <State label="Dateline">
        <Still variant="dateline"><Toast variant="dateline" at={at} message="Changes saved." data-force="hover" /></Still>
      </State>
    </>
  )
}
