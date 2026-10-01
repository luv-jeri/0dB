"use client"

import * as React from "react"

import { Button } from "@/registry/0db/ui/button"
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "@/registry/0db/ui/popover"
import { State } from "@/components/site/state"

function Share() {
  return (
    <>
      <p className="db-label">Anyone with the link can view</p>
      <p className="db-yours">studio.com/halden</p>
      <PopoverClose asChild>
        <Button variant="quiet" className="justify-self-start" onClick={() => navigator.clipboard?.writeText("studio.com/halden")}>Copy the link</Button>
      </PopoverClose>
    </>
  )
}

function Faces() {
  return (
    <>
      <p className="db-label">Set in two faces</p>
      <p>Archivo for what the page says, <span className="db-yours">Bodoni Moda</span> for what you say back.</p>
    </>
  )
}

function Rename() {
  return (
    <>
      <p className="db-label">Last renamed 12 September</p>
      <p className="db-yours">Spring notes, second draft</p>
      <PopoverClose asChild>
        <Button variant="quiet" className="justify-self-start">Rename it</Button>
      </PopoverClose>
    </>
  )
}

const variants = [
  { variant: "leader", open: "Share Halden", Body: Share },
  { variant: "brace", open: "Two faces", Body: Faces },
  { variant: "cut", open: "Spring notes", Body: Rename },
] as const

export default function Example() {
  return (
    <div className="grid justify-items-start gap-x-10 gap-y-12 sm:grid-cols-3">
      {variants.map(({ variant, open, Body }) => (
        <div key={variant} className="grid justify-items-start gap-4">
          <span className="db-label">{variant}</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="bracket">{open}</Button>
            </PopoverTrigger>
            <PopoverContent variant={variant} aria-label={open} className="grid gap-3">
              <Body />
            </PopoverContent>
          </Popover>
        </div>
      ))}
    </div>
  )
}

// Pinned open in place, without Radix placing them: each panel sits in the flow under a copy of its
// trigger, with the attributes Radix would give it. The brace's point stands where Radix's arrow would.
function Pinned({ variant, open, Body }: (typeof variants)[number]) {
  const brace = variant === "brace"
  return (
    <div className="grid justify-items-start" style={{ rowGap: variant === "cut" ? 0 : brace ? 26 : 27 }}>
      <Button variant="bracket" tabIndex={-1} aria-hidden="true" className={brace ? "justify-self-center" : undefined}>{open}</Button>
      <div
        className="db-pop grid gap-3"
        data-state="open"
        data-side="bottom"
        data-align={brace ? "center" : "start"}
        data-variant={variant === "leader" ? undefined : variant}
        style={{ "--db-pop-gap": "27px", "--radix-popover-trigger-height": "44px", width: "18rem", marginTop: variant === "cut" ? 0 : undefined } as React.CSSProperties}
      >
        <Body />
        {brace && (
          <span className="db-pop-brace" aria-hidden="true">
            <span className="db-pop-brace-arms">
              <span style={{ position: "absolute", left: "calc(9rem - var(--db-pop-brace-in) - var(--db-pop-brace-r))", top: 0, transformOrigin: "center 0", transform: "rotate(180deg)" }}>
                <span className="db-pop-brace-point" style={{ display: "block" }} />
              </span>
            </span>
          </span>
        )}
      </div>
    </div>
  )
}

export function States() {
  return (
    <>
      {variants.map((v) => (
        <State key={v.variant} label={`${v.variant}, open`}>
          <Popover>
            <Pinned {...v} />
          </Popover>
        </State>
      ))}
    </>
  )
}
