import { registryURL, sitePath } from "@/lib/site/config.mjs"
import NextLink from "next/link"

import "./landing.css"

import { AskFor, LeftOut, Share, TuneSentence } from "@/components/site/landing"
import { Cta, Hero } from "@/components/site/landing-hero"
import { PassageTitle, PieceIndex, type Movement } from "@/components/site/landing-index"
import { ShareCall } from "@/components/site/landing-share"
import { Toy } from "@/components/site/landing-toy"
import { catalog } from "@/lib/site/catalog"
import { entries } from "@/lib/site/entries"
import { CommandLine } from "@/registry/0nlytype/ui/command-line"
import { Link } from "@/registry/0nlytype/ui/link"

// The home page arrives as noise and turns it down to 0 dB. Then, in order: the whole library, playing; your
// own words to turn down; what it leaves out; one sentence that retunes the page; the line that installs it;
// the kit that teaches your AI; how to help build it; and a last call. Each passage carries its dynamic in
// the margin, the way a score does.

const DYNAMICS: Record<string, string> = { pp: "pianissimo", p: "piano", mp: "mezzo piano", mf: "mezzo forte", f: "forte", ff: "fortissimo" }

type PassageProps = {
  id: string
  mark: string
  title: string
  note?: React.ReactNode
  rail: string
  className?: string
  /** The body leaves the stave for the whole width, under the margin too. */
  wide?: boolean
  children: React.ReactNode
}

/** A passage: its dynamic and a note in the margin, a title whose lines rise through their baselines as it comes into view. */
function Passage({ id, mark, title, note, rail, className, wide, children }: PassageProps) {
  return (
    <section className={className ? `passage ${className}` : "passage"} aria-labelledby={id}>
      <div className="passage-margin margin">
        <p className="passage-mark" lang="it">
          <abbr title={DYNAMICS[mark]}>{mark}</abbr>
        </p>
        {note ? <p className="passage-note">{note}</p> : null}
      </div>
      <div className="stave">
        <PassageTitle id={id} data-rail={rail} className="passage-title">
          {title}
        </PassageTitle>
        {wide ? null : <div className="passage-body">{children}</div>}
      </div>
      {wide ? <div className="passage-wide">{children}</div> : null}
    </section>
  )
}

const movements: Movement[] = catalog.map((m) => ({
  num: m.num,
  name: m.name,
  pieces: m.items.map((e) => ({ name: e.meta.name, title: e.meta.title, summary: e.meta.summary })),
}))
const count = entries.length

const REPO = "https://github.com/luv-jeri/0nlyType"

export default function Home() {
  return (
    <main id="content" className="page landing">
      <Hero count={count} />

      <Passage
        id="pieces"
        rail="The pieces"
        mark="p"
        className="passage-pieces"
        wide
        title={`${count} pieces. Try one.`}
        note="Point at a name, or scroll through them: the piece plays on the stage, live. Every name opens its page."
      >
        <PieceIndex movements={movements} total={count} />
      </Passage>

      <Passage
        id="noise"
        rail="Noise"
        mark="ff"
        className="passage-noise"
        wide
        title="Make some noise."
        note="Type anything, as loud as you like. Then turn it down, and send it to someone."
      >
        <Toy />
      </Passage>

      <Passage id="less" rail="Less" mark="mp" title="Less, on purpose." note="Each struck word is a checkbox. Unstrike one to see why it went.">
        <LeftOut />
      </Passage>

      <Passage id="tune" rail="Tune" mark="mf" title="One sentence retunes the page." note="Every italic word is a choice. Change one, and everything follows: the noise at the top too.">
        <TuneSentence />
      </Passage>

      <Passage
        id="install"
        rail="Install"
        mark="f"
        title="One line."
        note="0nlyType is a shadcn registry. Each piece arrives as source in your project, with its styles and the tokens it stands on."
      >
        <CommandLine runner command={`shadcn@latest add ${registryURL("button")}`} emphasis="button" className="install-line" />
        <p className="install-then">Nothing to update. Nothing to wrap. It&rsquo;s yours now.</p>
        <p className="install-links">
          <Link asChild>
            <NextLink href="/docs/install/">Set up a project</NextLink>
          </Link>
        </p>
      </Passage>

      <Passage id="ask" rail="Ask" mark="mf" title="Or ask for it." note="The AI kit puts 0nlyType's rules and every contract in your project, so your assistant builds in type too.">
        <ol className="ask-steps">
          <li>
            <p className="ask-step">Add the kit.</p>
            <CommandLine runner command={`shadcn@latest add ${registryURL("ai")}`} emphasis="ai" className="install-line" />
          </li>
          <li>
            <p className="ask-step">Say what you want.</p>
            <AskFor />
          </li>
        </ol>
        <p className="install-links">
          <Link asChild>
            <NextLink href="/docs/build-with-ai/">Build with AI</NextLink>
          </Link>
        </p>
      </Passage>

      <Passage
        id="help"
        rail="Help"
        mark="mp"
        className="passage-help"
        title="Help build it."
        note="0nlyType is made by a small team, in the open. You don't need to write code to shape what it becomes."
      >
        <ul className="help-list">
          <li>
            <Cta href="/requests/">Request a component</Cta>
            <p className="help-note">The piece you need and can&rsquo;t find. The most asked for are built first.</p>
          </li>
          <li>
            <Cta href="/feedback/?kind=bug">Report a bug</Cta>
            <p className="help-note">Something that breaks, reads wrong, or moves when it shouldn&rsquo;t.</p>
          </li>
          <li>
            <Cta href={REPO}>Star it on GitHub</Cta>
            <p className="help-note">We need your support to keep working on this. A star is how we know it&rsquo;s wanted.</p>
          </li>
          <li>
            <ShareCall url="/" text="0nlyType: React components, set in type" note="Send it to someone who builds interfaces. It's how a small library gets found.">
              Share it
            </ShareCall>
          </li>
        </ul>
      </Passage>

      <section className="coda" aria-labelledby="coda-title">
        <h2 className="coda-title" id="coda-title">
          Now make something quiet.
        </h2>
        <div className="coda-actions">
          <Cta href="/docs/">Read the docs</Cta>
          <Share url="/" title="0nlyType: React components, set in type">
            Share 0nlyType
          </Share>
        </div>
        <p className="fine" lang="it">
          Fine.
        </p>
      </section>

      <footer className="landing-foot">
        <p>0nlyType is MIT licensed. Its typefaces are under the SIL Open Font Licence.</p>
        <p>
          <Link href={sitePath("/requests/")}>Request a component</Link>. <Link href={sitePath("/feedback/?kind=bug")}>Report a bug</Link>.{" "}
          <Link href={REPO} external>
            Star it on GitHub
          </Link>
        </p>
        <p>
          <Link href={sitePath("/specimen/")}>The specimen</Link>.
        </p>
      </footer>
    </main>
  )
}
