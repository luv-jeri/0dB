import { Card, CardDescription, CardFigure, CardFooter, CardLink, CardSum, CardTitle } from "@/registry/0db/ui/card"
import { State } from "@/components/site/state"

const services = [
  { letter: "I", name: "Identity", body: "Names, marks, and the rules that keep them from drifting.", facts: ["Three projects", "From six weeks"] },
  { letter: "W", name: "Websites", body: "Built to be read slowly and used for years, then handed over.", facts: ["Three projects", "A season"] },
  { letter: "M", name: "Motion", body: "Titles and idents: things that move once, and mean it.", facts: ["One project", "Four weeks"] },
]

const fee = [
  ["Discovery", "2,400"],
  ["Design", "9,600"],
  ["Handover", "1,200"],
  ["Total", "13,200"],
]

export default function Example() {
  return (
    <div className="grid gap-y-16">
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
      <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2">
        <Card variant="epigraph">
          <CardDescription>“They took our name away for a month and gave it back with a spine.”</CardDescription>
          <CardFooter>
            <span>Ines Halden, founder</span>
          </CardFooter>
          <CardTitle>
            <CardLink href="#card">Halden, an identity</CardLink>
          </CardTitle>
        </Card>
        <Card variant="ledger">
          <CardTitle>
            <CardLink href="#card">A website, in pounds</CardLink>
          </CardTitle>
          <CardDescription>Fixed before we start, paid in three parts.</CardDescription>
          <CardSum>
            {fee.map(([what, sum]) => (
              <div key={what}>
                <dt>{what}</dt>
                <dd>{sum}</dd>
              </div>
            ))}
          </CardSum>
        </Card>
      </div>
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
      <State label="epigraph, rest">
        <Card variant="epigraph">
          <CardDescription>“It gave us back our name.”</CardDescription>
          <CardFooter><span>Ines Halden</span></CardFooter>
          <CardTitle>Halden</CardTitle>
        </Card>
      </State>
      <State label="epigraph, pointed at">
        <Card variant="epigraph" data-force="hover">
          <CardDescription>“It gave us back our name.”</CardDescription>
          <CardFooter><span>Ines Halden</span></CardFooter>
          <CardTitle>Halden</CardTitle>
        </Card>
      </State>
      <State label="ledger, rest">
        <Card variant="ledger">
          <CardTitle>A website</CardTitle>
          <CardSum>
            <div><dt>Design</dt><dd>9,600</dd></div>
            <div><dt>Handover</dt><dd>1,200</dd></div>
            <div><dt>Total</dt><dd>10,800</dd></div>
          </CardSum>
        </Card>
      </State>
      <State label="ledger, pointed at">
        <Card variant="ledger" data-force="hover">
          <CardTitle>A website</CardTitle>
          <CardSum>
            <div><dt>Design</dt><dd>9,600</dd></div>
            <div><dt>Handover</dt><dd>1,200</dd></div>
            <div><dt>Total</dt><dd>10,800</dd></div>
          </CardSum>
        </Card>
      </State>
    </>
  )
}
