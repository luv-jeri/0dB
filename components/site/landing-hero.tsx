import { registryURL } from "@/lib/site/config.mjs"
import NextLink from "next/link"

import { CopyCommand } from "@/components/site/landing"
import { Noise } from "@/components/site/landing-noise"

// The hero, after "It has to be design.": one idea set huge, heavy condensed roman over light wide roman, the
// accent only on the full stop. The noise around it (landing-noise) is everything 0nlyType turned down.
// Server-rendered: the headline is plain text in the HTML and paints before any script.

/**
 * A word of the headline, with a zero-size probe standing on its baseline for the noise to measure from. Its
 * box reserves the word at its widest (`text`, the quiet line's resting state), so as a word exhales the
 * words after it never move.
 */
function Word({ text, stop }: { text: string; stop?: boolean }) {
  return (
    <span className="hero-word" data-noise-word data-text={stop ? `${text}.` : text}>
      <span className="hero-ink">
        <span className="hero-base" data-noise-base />
        {text}
      </span>
      {/* The full stop stands where the word will end, so the word exhales up to it and it never moves. */}
      {stop ? <span className="hero-stop">.</span> : null}
    </span>
  )
}

/**
 * The big call to action: light type on a hairline. Coming to it, the letters swell to heavy one after another,
 * a crescendo read left to right, and the accent full stop lands. The heaviest state is reserved, so nothing moves.
 */
export function Cta({ href, children, size, className }: { href: string; children: string; size?: "l"; className?: string }) {
  return (
    <NextLink href={href} prefetch={false} className={className ? `cta ${className}` : "cta"} data-size={size}>
      <span className="db-sr">{children}</span>
      <span className="cta-word" aria-hidden="true" data-text={children}>
        <span className="cta-letters">
          {Array.from(children).map((c, i) => (
            <span key={i} style={{ "--i": i } as React.CSSProperties}>
              {c}
            </span>
          ))}
        </span>
      </span>
      <span className="cta-stop" aria-hidden="true">
        .
      </span>
    </NextLink>
  )
}

export function Hero({ count }: { count: number }) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <Noise className="hero-noise" />
      <h1 className="hero-title" id="hero-title" data-noise-center>
        <span className="hero-line" data-line="loud" data-noise-glyphs>
          <Word text="All" /> <Word text="type." />
        </span>{" "}
        <span className="hero-line" data-line="quiet" data-noise-glyphs>
          <Word text="No" />
          <span className="hero-gap"> </span>
          <Word text="noise" stop />
        </span>
      </h1>
      <div className="hero-foot">
        {/* The mark, as a reading: the noise swells it to 111 and the silence brings it down to where it rests. */}
        <p className="hero-level" data-hush>
          <span className="hero-meter" dir="ltr" aria-hidden="true" data-noise-meter=" dB">
            0 dB
          </span>
          <span className="db-sr">0 dB: </span>
          <span className="hero-meter-def">The quietest sound a person can hear.</span>
        </p>
        <p className="hero-promise" data-hush>
          {count} React components, set in type. <span className="hero-promise-quiet">For the shadcn CLI.</span>
        </p>
        <span data-hush className="hero-cta">
          <Cta href="/docs/" size="l">
            Read the docs
          </Cta>
        </span>
        <span data-hush className="hero-install">
          <CopyCommand command={`npx shadcn@latest add ${registryURL("button")}`} emphasis="button" />
        </span>
      </div>
    </section>
  )
}
