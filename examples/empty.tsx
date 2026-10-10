import { Button } from "@/registry/0nlytype/ui/button"
import { Empty, EmptyActions, EmptyDescription, EmptyFigure, EmptyTitle } from "@/registry/0nlytype/ui/empty"
import { State } from "@/components/site/state"

// Three ways to say there's nothing here yet, each with the one thing to do about it.
export default function Example() {
  return (
    <div className="grid w-full gap-(--db-space-9)">
      <div className="grid gap-4">
        <span className="db-label">arc</span>
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
      </div>
      <div className="grid gap-4">
        <span className="db-label">tacet</span>
        <Empty variant="tacet">
          <EmptyFigure>Tacet</EmptyFigure>
          <EmptyTitle>No replies yet.</EmptyTitle>
          <EmptyDescription>When someone answers your thread, their reply appears here. Ask a question to start one.</EmptyDescription>
          <EmptyActions>
            <Button>Ask a question</Button>
          </EmptyActions>
        </Empty>
      </div>
      <div className="grid gap-4">
        <span className="db-label">blank</span>
        <Empty variant="blank">
          <EmptyFigure>This space is left blank on purpose.</EmptyFigure>
          <EmptyTitle>No drafts yet.</EmptyTitle>
          <EmptyDescription>A draft keeps what you write until you publish it. Start one and it waits here.</EmptyDescription>
          <EmptyActions>
            <Button>Start a draft</Button>
          </EmptyActions>
        </Empty>
      </div>
    </div>
  )
}

const small = { inlineSize: "16rem" }

export function States() {
  return (
    <>
      {([false, true] as const).map((reach) => (
        <State key={`arc-${reach}`} label={reach ? "Arc, reaching for the action" : "Arc, at rest"}>
          <Empty style={small}>
            <EmptyFigure style={{ fontSize: "7rem" }} />
            <EmptyTitle style={{ fontSize: "var(--db-mp)" }}>Nothing archived yet.</EmptyTitle>
            <EmptyActions>
              <Button data-force={reach ? "hover" : undefined}>Archive a note</Button>
            </EmptyActions>
          </Empty>
        </State>
      ))}
      {([false, true] as const).map((reach) => (
        <State key={`tacet-${reach}`} label={reach ? "Tacet, reaching for the action" : "Tacet, at rest"}>
          <Empty variant="tacet" style={small}>
            <EmptyFigure style={{ fontSize: "calc(var(--db-expression-scale) * var(--db-ff))" }}>Tacet</EmptyFigure>
            <EmptyTitle style={{ fontSize: "var(--db-mp)" }}>No replies yet.</EmptyTitle>
            <EmptyActions>
              <Button data-force={reach ? "hover" : undefined}>Ask a question</Button>
            </EmptyActions>
          </Empty>
        </State>
      ))}
      {([false, true] as const).map((reach) => (
        <State key={`blank-${reach}`} label={reach ? "Blank, reaching for the action" : "Blank, at rest"}>
          <Empty variant="blank" style={{ ...small, minBlockSize: "18rem" }}>
            <EmptyFigure>Left blank on purpose.</EmptyFigure>
            <EmptyTitle>No drafts yet.</EmptyTitle>
            <EmptyDescription>Start one and it waits here.</EmptyDescription>
            <EmptyActions>
              <Button data-force={reach ? "hover" : undefined}>Start a draft</Button>
            </EmptyActions>
          </Empty>
        </State>
      ))}
    </>
  )
}
