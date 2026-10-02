"use client"

import { useState } from "react"
import { Invitation } from "@/registry/0db/ui/invitation"
import { Field, Textarea } from "@/registry/0db/ui/field"
import { Button } from "@/registry/0db/ui/button"
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription, SheetClose, SheetActions } from "@/registry/0db/ui/sheet"
import { State } from "@/components/site/state"

export default function Example() {
  const [thought, setThought] = useState("")
  return (
    <div className="grid max-w-xl gap-10">
      <h3 className="db-f">You can start in the middle.</h3>
      <p>An idea to explore. A product to improve. A problem to solve.</p>
      <p>The invitation waits at the foot of the page.</p>
      <Sheet>
        <SheetTrigger asChild><Invitation label="Tell me what you need" hint="Start with what you have." state={thought.trim() ? "Your brief · Edit" : undefined} /></SheetTrigger>
        <SheetContent>
          <SheetTitle>What would you like to make or improve?</SheetTitle>
          <SheetDescription>You can start in the middle.</SheetDescription>
          <Field label="Your thought"><Textarea grow minRows={3} maxRows={8} value={thought} onChange={(event) => setThought(event.target.value)} placeholder="Start with what you have." data-autofocus /></Field>
          <SheetActions><SheetClose asChild><Button variant="bracket">Keep my thought</Button></SheetClose></SheetActions>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export function States() {
  const position = { position: "relative" as const, inset: "auto", maxWidth: "100%" }
  return <>
    <State label="An open invitation"><Invitation style={position} label="Tell me what you need" hint="Start with what you have." /></State>
    <State label="Your thought is here"><Invitation style={position} label="Tell me what you need" state="Your brief · Edit" /></State>
    <State label="Keyboard"><Invitation style={position} label="Tell me what you need" data-force="focus" /></State>
  </>
}
