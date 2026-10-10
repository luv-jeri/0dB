import { ResizableHandle, ResizablePanel, ResizablePanelGroup, ResizableTitle } from "@/registry/0nlytype/ui/resizable"
import { State } from "@/components/site/state"

const story =
  "The ferry line has run between the islands since 1911, and for most of that time its timetable was the only thing anyone read. The flag stayed; the anchor came and went with each new owner. What the islanders asked for was simple: a timetable large enough to read from the quay, the boats' names where they could find them, and nothing on the hulls that the type did not already say."

function Rule({ at = 50, force }: { at?: number; force?: boolean }) {
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={at} minSize={20}>
        <p className="ot-mp mb-2 text-ink">The brief</p>
        <p>A new identity for a ferry line that has run between the islands since 1911.</p>
      </ResizablePanel>
      <ResizableHandle aria-label="Width of the brief" data-force={force ? "hover" : undefined} />
      <ResizablePanel defaultSize={100 - at} minSize={20}>
        <p className="ot-mp mb-2 text-ink">The notes</p>
        <p>Keep the flag. Lose the anchor. The timetable is the real product.</p>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

function Fit({ at = 62 }: { at?: number }) {
  return (
    <ResizablePanelGroup direction="horizontal" variant="fit">
      <ResizablePanel defaultSize={at} minSize={15}>
        <ResizableTitle>Halden</ResizableTitle>
        <p>The line, its flag and its timetable.</p>
      </ResizablePanel>
      <ResizableHandle aria-label="Width of Halden" />
      <ResizablePanel defaultSize={100 - at} minSize={15}>
        <ResizableTitle>Quay</ResizableTitle>
        <p>Where the timetable is read.</p>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

function Flow({ at = 50 }: { at?: number }) {
  return (
    <ResizablePanelGroup direction="horizontal" variant="flow" text={story}>
      <ResizablePanel defaultSize={at} minSize={25} />
      <ResizableHandle aria-label="Width of the first column" />
      <ResizablePanel defaultSize={100 - at} minSize={25} />
    </ResizablePanelGroup>
  )
}

export default function Example() {
  return (
    <div className="grid gap-10">
      <Rule />
      <Fit />
      <Flow />
    </div>
  )
}

export function States() {
  return (
    <>
      <State label="At rest">
        <div style={{ width: "24rem", maxWidth: "100%" }}><Rule /></div>
      </State>
      <State label="The rule taken">
        <div style={{ width: "24rem", maxWidth: "100%" }}><Rule at={40} force /></div>
      </State>
      <State label="fit, a narrow pane">
        <div style={{ width: "24rem", maxWidth: "100%" }}><Fit at={30} /></div>
      </State>
      <State label="fit, a wide pane">
        <div style={{ width: "24rem", maxWidth: "100%" }}><Fit at={75} /></div>
      </State>
      <State label="flow, the break moved">
        <div style={{ width: "24rem", maxWidth: "100%" }}><Flow at={62} /></div>
      </State>
    </>
  )
}
