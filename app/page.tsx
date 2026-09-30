import NextLink from "next/link"

import { Overture } from "@/components/site/overture"
import { Hello, LeftOut, Loudness, Tempi, TuneSentence } from "@/components/site/landing"
import { catalog } from "@/lib/site/catalog"
import { entries } from "@/lib/site/entries"
import { principles } from "@/lib/site/principles"
import { Button } from "@/registry/0db/ui/button"
import { CommandLine } from "@/registry/0db/ui/command-line"
import { Contour } from "@/registry/0db/ui/contour"
import { Link } from "@/registry/0db/ui/link"

// The page is a hairpin: it swells from the overture's quiet to the loudest passage, then
// closes back to nothing. Each passage carries its dynamic in the margin, the way a score does.

const DYNAMICS: Record<string, string> = {
  pp: "pianissimo",
  p: "piano",
  mp: "mezzo piano",
  mf: "mezzo forte",
  f: "forte",
  ff: "fortissimo",
}

function Passage({ id, mark, title, note, children }: { id: string; mark: string; title: React.ReactNode; note?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="passage" aria-labelledby={id}>
      <div className="passage-margin margin">
        <p className="passage-mark" lang="it">
          <abbr title={DYNAMICS[mark]}>{mark}</abbr>
        </p>
        {note ? <p className="passage-note">{note}</p> : null}
      </div>
      <div className="stave">
        <h2 id={id} className="passage-title">
          {title}
        </h2>
        <div className="passage-body">{children}</div>
      </div>
    </section>
  )
}

const ONES = [
  "",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
]
const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"]

/** A count as it would be written in a sentence, up to ninety-nine. */
function inWords(n: number) {
  const words = n < 20 ? ONES[n] : TENS[Math.floor(n / 10)] + (n % 10 ? `-${ONES[n % 10]}` : "")
  return words ? words[0].toUpperCase() + words.slice(1) : String(n)
}

const [silence, ornament, yours, colour, moves] = principles
const pieces = entries.length

export default function Home() {
  return (
    <main id="content" className="page landing">
      <Overture />
      <div className="overture-foot">
        <Button variant="statement" asChild>
          <NextLink href="/docs/">Read the docs</NextLink>
        </Button>
        <Link asChild>
          <NextLink href="/docs/install/">Install it</NextLink>
        </Link>
        <Link href="/specimen/">See the specimen</Link>
      </div>

      <Passage id="yours" mark="p" title={yours.text} note={yours.note}>
        <Hello />
      </Passage>
      <Passage id="silence" mark="mp" title={silence.text} note={silence.note}>
        <LeftOut />
      </Passage>
      <Passage id="colour" mark="mf" title={colour.text} note={colour.note}>
        <TuneSentence />
      </Passage>
      <Passage id="ornament" mark="ff" title={ornament.text} note={ornament.note}>
        <Loudness />
      </Passage>
      <Passage id="moves" mark="mf" title={moves.text} note={moves.note}>
        <Tempi />
      </Passage>

      <Passage
        id="programme"
        mark="mp"
        title={`${inWords(pieces)} pieces in ${inWords(catalog.length).toLowerCase()} movements.`}
        note="Each one a page: what it is, how it behaves, every state it can be in, and the line that installs it."
      >
        <ol className="programme">
          {catalog.map((m) => (
            <li key={m.num} className="programme-movement">
              <p className="programme-name">
                <span className="programme-num">{m.num}</span> {m.name}
              </p>
              <ul className="programme-items">
                {m.items.map((e) => (
                  <li key={e.meta.name}>
                    <Link asChild>
                      <NextLink href={`/docs/${e.meta.name}/`}>{e.meta.title}</NextLink>
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </Passage>

      <Passage
        id="install"
        mark="p"
        title="One line."
        note="0dB is a shadcn registry. Each piece arrives as source in your project, with its styles and the tokens it stands on. Nothing to update, nothing to wrap."
      >
        <CommandLine runner command="shadcn@latest add https://0db.cojeev.com/r/button.json" emphasis="button" className="install-line" />
        <div className="install-foot">
          <Button variant="statement" asChild>
            <NextLink href="/docs/">Read the docs</NextLink>
          </Button>
          <Link asChild>
            <NextLink href="/docs/install/">Set up a project</NextLink>
          </Link>
        </div>
      </Passage>

      <section className="coda" aria-label="Coda">
        <p className="passage-mark coda-mark margin" lang="it">
          <abbr title="pianissimo">pp</abbr>
        </p>
        <Contour fade least={0.45} className="coda-text stave">
          Put it down when you are done. The page will be here as you left it: paper, ink, one note of colour, and the room between them, which was always the point. Work slowly.
          Read what you wrote. The rest is silence.
        </Contour>
      </section>
      <p className="fine" lang="it">
        Fine.
      </p>
      <footer className="landing-foot">
        <p>0dB is MIT licensed. Its typefaces are under the SIL Open Font Licence.</p>
        <p>
          Made by Cojeev.{" "}
          <Link href="https://github.com/luv-jeri/0dB" external>
            Source on GitHub
          </Link>
        </p>
      </footer>
    </main>
  )
}
