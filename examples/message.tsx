"use client"

import * as React from "react"

import { State } from "@/components/site/state"
import { Button } from "@/registry/0db/ui/button"
import {
  Message,
  MessageAvatar,
  MessageBody,
  MessageBubble,
  MessageFooter,
  MessageHeader,
  MessageReaction,
  MessageReactions,
  MessageStatus,
  MessageTyping,
} from "@/registry/0db/ui/message"

/** Ask, and Ada writes back: the periods show only while she's writing, then her words write in. */
function Reply() {
  const [said, setSaid] = React.useState<"asked" | "writing" | "sent">("asked")
  const timer = React.useRef<number>(undefined)
  React.useEffect(() => () => clearTimeout(timer.current), [])
  const ask = () => {
    setSaid("writing")
    clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setSaid("sent"), 2600)
  }
  return (
    <>
      {said === "sent" ? (
        <Message arriving>
          <MessageAvatar alt="Ada Lindqvist" />
          <MessageHeader name="Ada Lindqvist" time="09:46" dateTime="2026-09-30T09:46" />
          <MessageBody><MessageBubble>Here it is, at stamp size.</MessageBubble></MessageBody>
        </Message>
      ) : null}
      <Message>
        <MessageAvatar alt="Ada Lindqvist" />
        <MessageBody><MessageTyping writing={said === "writing"} label="Ada is writing" /></MessageBody>
      </Message>
      <Button variant="quiet" className="justify-self-start" disabled={said === "writing"} onClick={ask}>
        {said === "sent" ? "Ask again" : "Ask Ada"}
      </Button>
    </>
  )
}

export default function Example() {
  return (
    <div className="grid gap-(--db-space-6)">
      <Message>
        <MessageAvatar alt="Ada Lindqvist" />
        <MessageHeader name="Ada Lindqvist" time="09:40" dateTime="2026-09-30T09:40" />
        <MessageBody>
          <MessageBubble>The Halden marks are ready for review. I kept the arc from the first round.</MessageBubble>
        </MessageBody>
        <MessageFooter>
          <MessageReactions>
            <MessageReaction defaultPressed defaultCount={2}>Agreed</MessageReaction>
            <MessageReaction defaultCount={1}>Lovely</MessageReaction>
          </MessageReactions>
        </MessageFooter>
      </Message>
      <Message from="you">
        <MessageAvatar alt="You" />
        <MessageHeader name="You" time="09:44" dateTime="2026-09-30T09:44" />
        <MessageBody>
          <MessageBubble align="end">Looking now. Can we see it at stamp size too?</MessageBubble>
        </MessageBody>
        <MessageFooter>
          <MessageStatus read />
        </MessageFooter>
      </Message>
      <Reply />
      <div className="grid gap-(--db-space-4) pt-(--db-space-6)">
        <Message variant="script">
          <MessageHeader name="Ada" time="09:46" dateTime="2026-09-30T09:46" />
          <MessageBody><MessageBubble>At stamp size the anchor fills in. The flag holds.</MessageBubble></MessageBody>
        </Message>
        <Message variant="script" from="you">
          <MessageHeader name="You" time="09:47" dateTime="2026-09-30T09:47" />
          <MessageBody><MessageBubble align="end">Then let the anchor go.</MessageBubble></MessageBody>
        </Message>
      </div>
      <div className="grid gap-(--db-space-6) pt-(--db-space-6)">
        <Message variant="quote">
          <MessageHeader name="Ada Lindqvist" time="10:02" dateTime="2026-09-30T10:02" />
          <MessageBody><MessageBubble>A harbour is where the arc comes to rest.</MessageBubble></MessageBody>
        </Message>
        <Message variant="quote" from="you">
          <MessageHeader name="You" time="10:05" dateTime="2026-09-30T10:05" />
          <MessageBody><MessageBubble align="end">Put that on the cover.</MessageBubble></MessageBody>
        </Message>
      </div>
    </div>
  )
}

export function States() {
  return (
    <>
      <State label="Tail"><MessageBubble>Ready for review.</MessageBubble></State>
      <State label="Tail, yours"><MessageBubble align="end" className="db-yours">Looking now.</MessageBubble></State>
      <State label="Reversed"><MessageBubble variant="ink">Published.</MessageBubble></State>
      <State label="Marked"><MessageBubble variant="mark">Read this first.</MessageBubble></State>
      <State label="Typing"><MessageTyping writing label="Ada is writing" /></State>
      <State label="Typing, with the face">
        <Message><MessageAvatar alt="Ada Lindqvist" /><MessageBody><MessageTyping writing label="Ada is writing" /></MessageBody></Message>
      </State>
      <State label="Typing, script">
        <Message variant="script"><MessageHeader name="Ada" time="09:46" /><MessageBody><MessageTyping writing label="Ada is writing" /></MessageBody></Message>
      </State>
      <State label="Sent"><MessageFooter><MessageStatus /></MessageFooter></State>
      <State label="Read"><MessageFooter><MessageStatus read /></MessageFooter></State>
      <State label="Script">
        <Message variant="script"><MessageHeader name="Ada" time="09:46" /><MessageBody><MessageBubble>The flag holds.</MessageBubble></MessageBody></Message>
      </State>
      <State label="Script, yours">
        <Message variant="script" from="you"><MessageHeader name="You" time="09:47" /><MessageBody><MessageBubble align="end">Let it go.</MessageBubble></MessageBody></Message>
      </State>
      <State label="Quote">
        <Message variant="quote"><MessageHeader name="Ada" time="10:02" /><MessageBody><MessageBubble>Where the arc rests.</MessageBubble></MessageBody></Message>
      </State>
      <State label="Quote, yours">
        <Message variant="quote" from="you"><MessageHeader name="You" time="10:05" /><MessageBody><MessageBubble align="end">On the cover.</MessageBubble></MessageBody></Message>
      </State>
    </>
  )
}
