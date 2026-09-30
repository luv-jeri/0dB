import { Button } from "@/registry/0db/ui/button"
import { Empty, EmptyActions, EmptyDescription, EmptyFigure, EmptyTitle } from "@/registry/0db/ui/empty"

export default function Example() {
  return (
    <Empty>
      <EmptyFigure />
      <EmptyTitle>Nothing archived yet.</EmptyTitle>
      <EmptyDescription>
        Archive a note to keep it out of the way without deleting it. It will wait here until you need it.
      </EmptyDescription>
      <EmptyActions>
        <Button>Archive a note</Button>
      </EmptyActions>
    </Empty>
  )
}
