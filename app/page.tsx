import NextLink from "next/link"

import "./landing.css"

import { Overture } from "@/components/site/overture"
import { Cue, Hello, LeftOut, Loudness, PieceLink, Tempi, TuneSentence } from "@/components/site/landing"
import { catalog } from "@/lib/site/catalog"
import { entries } from "@/lib/site/entries"
import { principles } from "@/lib/site/principles"
import { Button } from "@/registry/0db/ui/button"
import { Calligram } from "@/registry/0db/ui/calligram"
import { CommandLine } from "@/registry/0db/ui/command-line"
import { Contour } from "@/registry/0db/ui/contour"
import { Gather } from "@/registry/0db/ui/gather"
import { Link } from "@/registry/0db/ui/link"
import { Melody } from "@/registry/0db/ui/melody"
import { Meta } from "@/registry/0db/ui/meta"
import { Reverb } from "@/registry/0db/ui/reverb"

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

type PassageProps = {
  id: string
  mark: string
  title: React.ReactNode
  note?: React.ReactNode
  /** The passage modulates into its own key: its accent, named in the margin. */
  keyName?: string
  /** What to do, said plainly above the instrument. */
  direction?: string
  /** The title's letters settle into place as it comes into view. Plain-text titles only. */
  gather?: boolean
  /** Its name on the page rail. */
  rail: string
  children: React.ReactNode
}

function Passage({ id, mark, title, note, keyName, direction, gather, rail, children }: PassageProps) {
  return (
    <section className="passage" aria-labelledby={id} data-key={keyName}>
      <div className="passage-margin margin">
        <p className="passage-mark" lang="it">
          <abbr title={DYNAMICS[mark]}>{mark}</abbr>
          {keyName ? <span className="passage-key"> in {keyName}</span> : null}
        </p>
        {note ? <p className="passage-note">{note}</p> : null}
      </div>
      <div className="stave">
        {gather && typeof title === "string" ? (
          <Gather as="h2" id={id} data-rail={rail} className="passage-title">
            {title}
          </Gather>
        ) : (
          <h2 id={id} data-rail={rail} className="passage-title">
            {title}
          </h2>
        )}
        {direction ? <p className="passage-direction">{direction}</p> : null}
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
      <Overture>
        <p className="what-lead">A React component library, set in type.</p>
        <p className="what-body">
          {inWords(pieces)} components for the shadcn CLI. Two typefaces, one accent colour and no icons: every control is made of words, hairlines and space, so the work
          on your screen is the loudest thing there.
        </p>
        <Meta className="what-meta">
          <span>React 19</span>
          <span>Tailwind 4</span>
          <span>Radix</span>
          <span>MIT</span>
        </Meta>
        <div className="what-actions">
          <Button variant="ink" asChild>
            <NextLink href="/docs/">Read the docs</NextLink>
          </Button>
          <Button variant="crescendo" asChild>
            <NextLink href="/docs/install/">Install it</NextLink>
          </Button>
        </div>
      </Overture>

      <p className="try-these">Five of the pieces, playing the five rules. Each one is live: try it.</p>

      <Passage id="yours" rail="Yours" mark="p" keyName="ultramarine" title={yours.text} note={yours.note} direction="Write your name on the line.">
        <Cue>
          <Hello />
        </Cue>
      </Passage>
      <Passage id="silence" rail="Silence" mark="mp" keyName="viridian" title={silence.text} note={silence.note} direction="Each struck word is a checkbox. Unstrike one to put it back.">
        <Cue>
          <LeftOut />
        </Cue>
      </Passage>
      <Passage id="colour" rail="Colour" mark="mf" title={colour.text} note={colour.note} direction="Every italic word is a choice. Change one and the whole page follows.">
        <Cue>
          <TuneSentence />
        </Cue>
      </Passage>
      <Passage id="ornament" rail="Ornament" mark="ff" keyName="ember" title={ornament.text} note={ornament.note} direction="Drag the hand along the ruler, or use the arrow keys.">
        <Cue>
          <Loudness />
        </Cue>
      </Passage>
      <Passage id="moves" rail="Motion" mark="mf" keyName="violet" title={moves.text} note={moves.note} direction="Point at a tempo to hear it move, or play all four together.">
        <Cue>
          <Tempi />
        </Cue>
      </Passage>

      <section className="interlude" aria-label="Interlude">
        <p className="interlude-note margin">Point at a word, or focus the line and press Enter, to hear the rest of it.</p>
        <Melody className="interlude-melody stave">Every piece keeps time with the others, so a page made of them reads as one line of music.</Melody>
      </section>

      <Passage
        id="programme" rail="The pieces"
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
                    <PieceLink href={`/docs/${e.meta.name}/`} title={e.meta.title} summary={e.meta.summary}>
                      <e.example.default />
                    </PieceLink>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </Passage>

      <Passage
        id="install" rail="Install"
        mark="p"
        gather
        title="One line."
        note="0dB is a shadcn registry. Each piece arrives as source in your project, with its styles and the tokens it stands on. Nothing to update, nothing to wrap."
      >
        <CommandLine runner command="shadcn@latest add https://0db.cojeev.com/r/button.json" emphasis="button" className="install-line" />
        <div className="install-foot">
          <Button variant="overture" asChild>
            <NextLink href="/docs/">Read the docs</NextLink>
          </Button>
          <Button variant="stave" asChild>
            <NextLink href="/docs/install/">Set up a project</NextLink>
          </Button>
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
      <section className="hold" aria-label="Fermata">
        <p className="hold-note margin">
          A <i className="db-term">fermata</i> over a note: hold it past the beat, for as long as it needs.
        </p>
        <Calligram shape="fermata" fade size="30rem" className="hold-shape stave">
          Hold it here. Past the count, past the bar line, past the point where anyone is still keeping time, and stay until the room is quiet again. Then let go, and let the
          next thing begin in its own time.
        </Calligram>
      </section>
      <Reverb from="ff" echoes={4} className="fine" lang="it">
        Fine.
      </Reverb>
      <footer className="landing-foot">
        <p>0dB is MIT licensed. Its typefaces are under the SIL Open Font Licence.</p>
        <p>
          Made by Cojeev.{" "}
          <Link href="/specimen/">The specimen</Link>. <Link href="https://github.com/luv-jeri/0dB" external>
            Source on GitHub
          </Link>
        </p>
      </footer>
    </main>
  )
}
