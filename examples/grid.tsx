import { Grid } from "@/registry/0db/ui/grid"
import { State } from "@/components/site/state"

export default function Example() {
  return (
    <div className="grid w-full gap-(--db-space-7) lg:grid-cols-2">
      <Grid>
        <p className="db-label">Sheet 1, rules</p>
        <p className="db-f mt-(--db-space-5) max-w-[9ch]">Space does the layout.</p>
        <p className="db-p mt-(--db-space-5) max-w-[34ch] text-(--db-graphite)">The construction stays on the page, faint enough to read through, so every line still knows where it stands.</p>
      </Grid>
      <Grid variant="dots" cell={40}>
        <p className="db-label">Sheet 2, dots</p>
        <p className="db-f mt-(--db-space-5) max-w-[9ch]">Every word on a crossing.</p>
        <p className="db-p mt-(--db-space-5) max-w-[34ch] text-(--db-graphite)">A point where two lines would meet, and nothing between: the grid is there when you look for it.</p>
      </Grid>
    </div>
  )
}

export function States() {
  return (
    <>
      <State label="Rules, cell 27">
        <Grid cell={27} className="h-[12rem] w-[16rem]" />
      </State>
      <State label="Dots, cell 27">
        <Grid variant="dots" cell={27} className="h-[12rem] w-[16rem]" />
      </State>
      <State label="Right to left">
        <Grid dir="rtl" cell={40} className="h-[12rem] w-[16rem]" />
      </State>
    </>
  )
}
