import { Grid } from "@/registry/0nlytype/ui/grid"
import { State } from "@/components/site/state"

export default function Example() {
  return (
    <div className="grid w-full gap-(--ot-space-7) lg:grid-cols-2">
      <Grid>
        <p className="ot-label">Sheet 1, rules</p>
        <p className="ot-f mt-(--ot-space-5) max-w-[9ch]">Space does the layout.</p>
        <p className="ot-p mt-(--ot-space-5) max-w-[34ch] text-(--ot-graphite)">The construction stays on the page, faint enough to read through, so every line still knows where it stands.</p>
      </Grid>
      <Grid variant="dots" cell={40}>
        <p className="ot-label">Sheet 2, dots</p>
        <p className="ot-f mt-(--ot-space-5) max-w-[9ch]">Every word on a crossing.</p>
        <p className="ot-p mt-(--ot-space-5) max-w-[34ch] text-(--ot-graphite)">A point where two lines would meet, and nothing between: the grid is there when you look for it.</p>
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
