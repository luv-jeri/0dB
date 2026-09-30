import { Gather } from "@/registry/0db/ui/gather"
import { State } from "@/components/site/state"

export default function Example() {
  return (
    <Gather as="h2" className="db-f">
      Everything settles in the end.
    </Gather>
  )
}

export function States() {
  return (
    <>
      <State label="Heading">
        <Gather as="h3" className="db-mf" style={{ width: "16rem", maxWidth: "100%" }}>
          Nothing is lost, only set down.
        </Gather>
      </State>
      <State label="Paragraph">
        <Gather className="db-mp" style={{ width: "16rem", maxWidth: "100%" }}>
          Point at it before it has arrived and it comes to you.
        </Gather>
      </State>
    </>
  )
}
