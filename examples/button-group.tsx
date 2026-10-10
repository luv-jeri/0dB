import { Button } from "@/registry/0nlytype/ui/button"
import { ButtonGroup } from "@/registry/0nlytype/ui/button-group"
import { State } from "@/components/site/state"

export default function Example() {
  return (
    <div className="grid justify-items-start gap-(--ot-space-8)">
      <ButtonGroup aria-label="Share Halden">
        <Button>Copy link</Button>
        <Button>Email</Button>
        <Button>Export PDF</Button>
      </ButtonGroup>
      <ButtonGroup variant="column" aria-label="Halden">
        <Button>Open</Button>
        <Button>Rename</Button>
        <Button>Duplicate</Button>
        <Button>Move to archive</Button>
      </ButtonGroup>
      <p className="ot-mp max-w-[34ch] text-(--ot-graphite)">
        Halden is ready to share. You can{" "}
        <ButtonGroup variant="sentence" aria-label="Share Halden">
          <Button>copy the link</Button>
          <Button>email it</Button>
          <Button>export a PDF</Button>
        </ButtonGroup>
        .
      </p>
    </div>
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
      <State label="Column">
        <ButtonGroup variant="column" aria-label="File"><Button>Open</Button><Button>Rename</Button><Button>Delete</Button></ButtonGroup>
      </State>
      <State label="Pointed at">
        <ButtonGroup variant="column" aria-label="File"><Button>Open</Button><Button data-force="hover">Rename</Button><Button>Delete</Button></ButtonGroup>
      </State>
      <State label="Disabled">
        <ButtonGroup variant="column" aria-label="File"><Button>Open</Button><Button disabled>Rename</Button><Button>Delete</Button></ButtonGroup>
      </State>
      <State label="Sentence">
        <span>Then <ButtonGroup variant="sentence" aria-label="Next"><Button>save</Button><Button>send</Button></ButtonGroup>.</span>
      </State>
      <State label="Pointed at">
        <span>Then <ButtonGroup variant="sentence" aria-label="Next"><Button data-force="hover">save</Button><Button>send</Button></ButtonGroup>.</span>
      </State>
      <State label="Disabled">
        <span>Then <ButtonGroup variant="sentence" aria-label="Next"><Button disabled>save</Button><Button>send</Button></ButtonGroup>.</span>
      </State>
    </>
  )
}
