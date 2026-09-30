import { HoverCard, HoverCardContent, HoverCardMeta, HoverCardName, HoverCardTrigger } from "@/registry/0db/ui/hover-card"

export default function Example() {
  return (
    <p>
      The work is led by{" "}
      <HoverCard>
        <HoverCardTrigger asChild>
          <a className="db-link" href="#hover-card">Ada Lindqvist</a>
        </HoverCardTrigger>
        <HoverCardContent>
          <HoverCardName>Lindqvist</HoverCardName>
          <span>Design director. Twelve years of identities for museums and publishers, and the reason the studio sets everything in two faces.</span>
          <HoverCardMeta>Stockholm, with the studio since 2019</HoverCardMeta>
        </HoverCardContent>
      </HoverCard>
      .
    </p>
  )
}
