"use client"

import { Curtain, CurtainTrigger, CurtainContent, CurtainLink } from "@/registry/0db/ui/curtain"
import { Button } from "@/registry/0db/ui/button"
import { State } from "@/components/site/state"

export default function Example() {
  return (
    <Curtain>
      <div className="grid max-w-xl gap-10" data-curtain-page>
        <h3 className="db-f">Start with what you have.</h3>
        <p>An idea to explore. A product to improve. A problem to solve.</p>
        <CurtainTrigger asChild><Button variant="bracket">Explore the portfolio</Button></CurtainTrigger>
      </div>
      <CurtainContent label="Sanjay Kumar">
        <CurtainLink href="#example" number="01" description="A thought becoming real.">Work</CurtainLink>
        <CurtainLink href="#example" number="02" description="Open. Align. Release.">How I work</CurtainLink>
        <CurtainLink href="#example" number="03" description="Sanjay Kumar.">About me</CurtainLink>
        <CurtainLink href="#example" number="04" description="You can start in the middle.">Let&apos;s talk</CurtainLink>
      </CurtainContent>
    </Curtain>
  )
}

export function States() {
  return <>
    <State label="A destination"><Curtain><CurtainLink href="#example" number="01" description="A thought becoming real." style={{ opacity: 1, transform: "none" }}>Work</CurtainLink></Curtain></State>
    <State label="A conversation"><Curtain><CurtainLink href="#example" description="You can start in the middle." style={{ opacity: 1, transform: "none" }}>Let&apos;s talk</CurtainLink></Curtain></State>
  </>
}
