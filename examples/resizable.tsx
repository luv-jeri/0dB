import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/registry/0db/ui/resizable"

export default function Example() {
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={50} minSize={20}>
        <p className="db-label">The brief</p>
        <p>A new identity for a ferry line that has run between the islands since 1911.</p>
      </ResizablePanel>
      <ResizableHandle aria-label="Width of the brief" />
      <ResizablePanel defaultSize={50} minSize={20}>
        <p className="db-label">The notes</p>
        <p>Keep the flag. Lose the anchor. The timetable is the real product.</p>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
