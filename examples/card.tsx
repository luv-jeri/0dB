import { Card, CardDescription, CardFigure, CardFooter, CardLink, CardTitle } from "@/registry/0db/ui/card"
import { State } from "@/components/site/state"

const services = [
  { letter: "I", name: "Identity", body: "Names, marks, and the rules that keep them from drifting.", facts: ["Three projects", "From six weeks"] },
  { letter: "W", name: "Websites", body: "Built to be read slowly and used for years, then handed over.", facts: ["Three projects", "A season"] },
  { letter: "M", name: "Motion", body: "Titles and idents: things that move once, and mean it.", facts: ["One project", "Four weeks"] },
]

export default function Example() {
  return (
    <div className="grid gap-x-10 gap-y-12 sm:grid-cols-3">
      {services.map((s) => (
        <Card key={s.name}>
          <CardFigure>{s.letter}</CardFigure>
          <CardTitle>
            <CardLink href="#card">{s.name}</CardLink>
          </CardTitle>
          <CardDescription>{s.body}</CardDescription>
          <CardFooter>
            {s.facts.map((f) => (
              <span key={f}>{f}</span>
            ))}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

export function States() {
  return (
    <>
      <State label="Rest">
        <Card>
          <CardTitle>Identity</CardTitle>
          <CardDescription>Names and marks.</CardDescription>
        </Card>
      </State>
      <State label="Pointed at">
        <Card data-force="hover">
          <CardTitle>Identity</CardTitle>
          <CardDescription>Names and marks.</CardDescription>
        </Card>
      </State>
    </>
  )
}
