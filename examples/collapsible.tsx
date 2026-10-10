import type { ComponentProps } from "react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleList,
  CollapsibleTrigger,
} from "@/registry/0nlytype/ui/collapsible"
import { State } from "@/components/site/state"

const shown = ["Halden", "Northlight", "Oda Studio"]
const rest = ["Tidewater", "Marram", "Quiet Hours", "Felt & Field"]

function Rows({ names }: { names: string[] }) {
  return (
    <CollapsibleList>
      {names.map((n) => (
        <li key={n}>{n}</li>
      ))}
    </CollapsibleList>
  )
}

function Tail(props: ComponentProps<typeof Collapsible>) {
  return (
    <Collapsible {...props}>
      <CollapsibleTrigger openLabel="Hide these 4">and 4 more</CollapsibleTrigger>
      <CollapsibleContent>
        <Rows names={rest} />
      </CollapsibleContent>
    </Collapsible>
  )
}

/** The catchword is the first of the rest; the content holds the others. */
function Catchword(props: ComponentProps<typeof Collapsible>) {
  return (
    <Collapsible variant="catchword" {...props}>
      <CollapsibleTrigger aria-label="Show 4 more, from Tidewater" openLabel="Hide these 4">
        {rest[0]}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <Rows names={rest.slice(1)} />
      </CollapsibleContent>
    </Collapsible>
  )
}

function Sotto(props: ComponentProps<typeof Collapsible>) {
  return (
    <Collapsible variant="sotto" {...props}>
      <CollapsibleTrigger openLabel="Set them small again">Show these 4 in full</CollapsibleTrigger>
      <CollapsibleContent>
        <Rows names={rest} />
      </CollapsibleContent>
    </Collapsible>
  )
}

export default function Example() {
  return (
    <div className="grid gap-x-10 gap-y-12 md:grid-cols-3" style={{ maxWidth: "60rem" }}>
      {[Tail, Catchword, Sotto].map((Part, i) => (
        <div key={i}>
          <Rows names={shown} />
          <Part />
        </div>
      ))}
    </div>
  )
}

export function States() {
  return (
    <>
      <State label="Closed"><div style={{ width: "14rem" }}><Rows names={shown.slice(0, 2)} /><Tail /></div></State>
      <State label="Pointed at"><div style={{ width: "14rem" }}><Rows names={shown.slice(0, 2)} /><Collapsible><CollapsibleTrigger data-force="hover">and 4 more</CollapsibleTrigger><CollapsibleContent><Rows names={rest} /></CollapsibleContent></Collapsible></div></State>
      <State label="Open"><div style={{ width: "14rem" }}><Rows names={shown.slice(0, 2)} /><Tail open /></div></State>
      <State label="catchword, closed"><div style={{ width: "14rem" }}><Rows names={shown.slice(0, 2)} /><Catchword /></div></State>
      <State label="catchword, pointed at"><div style={{ width: "14rem" }}><Rows names={shown.slice(0, 2)} /><Collapsible variant="catchword"><CollapsibleTrigger data-force="hover" aria-label="Show 4 more, from Tidewater">Tidewater</CollapsibleTrigger><CollapsibleContent><Rows names={rest.slice(1)} /></CollapsibleContent></Collapsible></div></State>
      <State label="catchword, open"><div style={{ width: "14rem" }}><Rows names={shown.slice(0, 2)} /><Catchword open /></div></State>
      <State label="sotto, closed"><div style={{ width: "14rem" }}><Rows names={shown.slice(0, 2)} /><Sotto /></div></State>
      <State label="sotto, pointed at"><div style={{ width: "14rem" }}><Rows names={shown.slice(0, 2)} /><Collapsible variant="sotto"><CollapsibleTrigger data-force="hover">Show these 4 in full</CollapsibleTrigger><CollapsibleContent><Rows names={rest} /></CollapsibleContent></Collapsible></div></State>
      <State label="sotto, open"><div style={{ width: "14rem" }}><Rows names={shown.slice(0, 2)} /><Sotto open /></div></State>
    </>
  )
}
