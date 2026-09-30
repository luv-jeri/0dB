import { HoverCard, HoverCardContent, HoverCardMeta, HoverCardName, HoverCardTrigger } from "@/registry/0db/ui/hover-card"
import { State } from "@/components/site/state"

function Person() {
  return (
    <>
      <HoverCardName>Lindqvist</HoverCardName>
      <span>Design director. Twelve years of identities for museums and publishers, and the reason the studio sets everything in two faces.</span>
      <HoverCardMeta>Stockholm, with the studio since 2019</HoverCardMeta>
    </>
  )
}

function Entry() {
  return (
    <>
      <HoverCardName>gro·ˈtesque</HoverCardName>
      <p className="db-term">noun</p>
      <ol>
        <li>A sans serif of the nineteenth century, heavier and less even than the ones that came after.</li>
        <li>The voice of this page.</li>
      </ol>
      <HoverCardMeta>From the Italian <span className="db-term">grottesca</span>, the painting found on the walls of grottoes</HoverCardMeta>
    </>
  )
}

function Quote() {
  return (
    <>
      <blockquote>Two faces are enough for anything worth saying.</blockquote>
      <HoverCardMeta>Ada Lindqvist, design director</HoverCardMeta>
    </>
  )
}

export default function Example() {
  return (
    <div className="grid max-w-[34rem] gap-6">
      <p>
        The work is led by{" "}
        <HoverCard>
          <HoverCardTrigger asChild>
            <a className="db-link" href="#hover-card">Ada Lindqvist</a>
          </HoverCardTrigger>
          <HoverCardContent>
            <Person />
          </HoverCardContent>
        </HoverCard>
        .
      </p>
      <p>
        Everything the page says is set in a{" "}
        <HoverCard>
          <HoverCardTrigger asChild>
            <a className="db-link" href="#hover-card">grotesque</a>
          </HoverCardTrigger>
          <HoverCardContent variant="entry">
            <Entry />
          </HoverCardContent>
        </HoverCard>
        , and everything you say back in an italic.
      </p>
      <p>
        The two faces were{" "}
        <HoverCard>
          <HoverCardTrigger asChild>
            <a className="db-link" href="#hover-card">her choice</a>
          </HoverCardTrigger>
          <HoverCardContent variant="quote">
            <Quote />
          </HoverCardContent>
        </HoverCard>
        , made in the first week.
      </p>
    </div>
  )
}

// Pinned open in place: each card as Radix would open it, in the flow instead of beside a name.
export function States() {
  return (
    <>
      {([["name", Person], ["entry", Entry], ["quote", Quote]] as const).map(([variant, Body]) => (
        <State key={variant} label={`${variant}, open`}>
          <div className="db-peek" data-state="open" data-side="bottom" data-align="start" data-variant={variant === "name" ? undefined : variant}>
            <Body />
          </div>
        </State>
      ))}
    </>
  )
}
