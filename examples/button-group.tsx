import { Button } from "@/registry/0db/ui/button"
import { ButtonGroup } from "@/registry/0db/ui/button-group"
import { State } from "@/components/site/state"

export default function Example() {
  return (
    <ButtonGroup aria-label="Share Halden">
      <Button>Copy link</Button>
      <Button>Email</Button>
      <Button>Export PDF</Button>
    </ButtonGroup>
  )
}

export function States() {
  return (
    <>
      <State label="Rest">
        <ButtonGroup aria-label="Share"><Button>Copy</Button><Button>Email</Button></ButtonGroup>
      </State>
      <State label="Pointed at">
        <ButtonGroup aria-label="Share"><Button data-force="hover">Copy</Button><Button>Email</Button></ButtonGroup>
      </State>
      <State label="Disabled">
        <ButtonGroup aria-label="Share"><Button disabled>Copy</Button><Button>Email</Button></ButtonGroup>
      </State>
    </>
  )
}
