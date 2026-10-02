import { Strata, StrataPlane } from "@/registry/0db/ui/strata"
import { State } from "@/components/site/state"

function Opening({ trigger = "scroll" }: { trigger?: "scroll" | "load" }) {
  return (
    <Strata trigger={trigger}>
      <StrataPlane depth={1} tilt="y" from="start"><p className="db-mp">An idea to explore.</p></StrataPlane>
      <StrataPlane depth={0.7} tilt="x" from="above"><p className="db-mp">A product to improve.</p></StrataPlane>
      <StrataPlane depth={0.4} tilt="y" from="end"><p className="db-mp">A problem to solve.</p></StrataPlane>
      <StrataPlane depth={0.2} tilt="none" from="below"><h2 className="db-f">Start with what you have.</h2></StrataPlane>
    </Strata>
  )
}

export default function Example() {
  return <Opening />
}

export function States() {
  return (
    <>
      <State label="Scroll"><Opening /></State>
      <State label="Load, once"><Opening trigger="load" /></State>
      <State label="Already at the reading plane"><Strata><StrataPlane depth={0} tilt="none"><p className="db-mf">You can start in the middle.</p></StrataPlane></Strata></State>
    </>
  )
}
