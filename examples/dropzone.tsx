"use client"

import * as React from "react"

import { Dropzone } from "@/registry/0db/ui/dropzone"
import { State } from "@/components/site/state"

// ponytail: stand-in files of the right size, made once, so the docs can show what's held.
const file = (name: string, bytes: number, type: string) => new File([new Uint8Array(bytes)], name, { type, lastModified: 0 })
const useHeld = () => React.useMemo(() => [file("Halden brief, second round.pdf", 2_400_000, "application/pdf"), file("Stamp sizes.png", 3_600_000, "image/png")], [])

export default function Example() {
  return (
    <div className="grid w-full max-w-[40rem] gap-(--db-space-8)">
      <Dropzone accept=".pdf,.png,.svg" maxSize={10e6} name="marks" hint="PDF, PNG or SVG, up to 10 MB each." />
      <Dropzone variant="ghost" prompt="Drop the second round here" hint="Anything you've marked up. It stays until you send it." defaultFiles={useHeld()} />
    </div>
  )
}

export function States() {
  const held = useHeld()
  return (
    <>
      <State label="Rest"><Dropzone className="w-64" hint="PDF, up to 10 MB." /></State>
      <State label="Hover"><Dropzone className="w-64" hint="PDF, up to 10 MB." data-force="hover" /></State>
      <State label="Focus"><Dropzone className="w-64" hint="PDF, up to 10 MB." data-force="focus" /></State>
      <State label="Files over it"><Dropzone className="w-64" hint="PDF, up to 10 MB." data-force="over" /></State>
      <State label="ghost, holding two"><Dropzone variant="ghost" className="w-64" hint="PDF, up to 10 MB." defaultFiles={held} list={false} /></State>
      <State label="ghost, files over it"><Dropzone variant="ghost" className="w-64" hint="PDF, up to 10 MB." defaultFiles={held} list={false} data-force="over" /></State>
      <State label="Disabled"><Dropzone className="w-64" hint="Sending is closed for today." disabled /></State>
    </>
  )
}
