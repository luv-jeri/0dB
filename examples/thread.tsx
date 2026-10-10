"use client"

import * as React from "react"

import { State } from "@/components/site/state"
import { Button } from "@/registry/0nlytype/ui/button"
import { Message, MessageAvatar, MessageBody, MessageBubble, MessageFooter, MessageHeader, MessageStatus } from "@/registry/0nlytype/ui/message"
import { Thread, ThreadDay } from "@/registry/0nlytype/ui/thread"

const updates = [
  "The stamp size holds. The anchor is gone, the flag stays.",
  "I redrew the timetable grid. It reads better from a distance.",
  "Sending the second round to the ferry office this afternoon.",
  "They asked for the flag in one colour. I have it in ink.",
]

/** [who, "YYYY-MM-DDTHH:MM", words]; a string on its own is a day divider. */
type Line = [who: "Ada" | "You", at: string, words: string] | string

function Lines({ lines }: { lines: Line[] }) {
  return lines.map((l, i) => {
    if (typeof l === "string") return <ThreadDay key={i}>{l}</ThreadDay>
    const [who, at, words] = l
    const you = who === "You"
    return (
      <Message key={i} from={you ? "you" : "them"}>
        <MessageAvatar alt={you ? "You" : "Ada Lindqvist"} />
        <MessageHeader name={you ? "You" : "Ada Lindqvist"} time={at.slice(11)} dateTime={at} />
        <MessageBody><MessageBubble align={you ? "end" : "start"}>{words}</MessageBubble></MessageBody>
      </Message>
    )
  })
}

const proofs: Line[] = [
  ["Ada", "2026-09-30T08:02", "The proofs are back from the printer."],
  ["Ada", "2026-09-30T08:03", "The blue ran on page four."],
  ["You", "2026-09-30T08:09", "Can you send a photo?"],
  ["Ada", "2026-09-30T08:31", "It's in the drive."],
  ["You", "2026-09-30T11:40", "Seen it. We reprint four."],
  ["Ada", "2026-09-30T11:41", "I'll call them now."],
]

const week: Line[] = [
  "Monday",
  ["Ada", "2026-09-28T15:10", "Brief is signed. We start Wednesday."],
  ["You", "2026-09-28T15:12", "Good. Keep the harbour in mind."],
  "Yesterday",
  ["Ada", "2026-09-29T16:02", "First round of marks is up. Three directions, one arc."],
  ["You", "2026-09-29T16:20", "The second one. The arc feels like a harbour."],
  "Today",
  ["Ada", "2026-09-30T09:40", "The Halden marks are ready for review."],
  ["You", "2026-09-30T09:44", "Looking now. Can we see it at stamp size too?"],
  ["Ada", "2026-09-30T09:51", "The anchor fills in at stamp size. The flag holds."],
]

export default function Example() {
  const [arrived, setArrived] = React.useState(0)
  const time = (n: number) => `09:${String(46 + n).padStart(2, "0")}`
  return (
    <div className="grid gap-(--db-space-8)">
      <div className="grid max-w-xl justify-items-start gap-(--db-space-5)">
        <Thread label="Halden thread" className="w-full">
          <ThreadDay>Yesterday</ThreadDay>
          <Message>
            <MessageAvatar alt="Ada Lindqvist" />
            <MessageHeader name="Ada Lindqvist" time="16:02" />
            <MessageBody><MessageBubble>First round of marks is up. Three directions, one arc.</MessageBubble></MessageBody>
          </Message>
          <Message from="you">
            <MessageAvatar alt="You" />
            <MessageHeader name="You" time="16:20" />
            <MessageBody><MessageBubble align="end">The second one. The arc feels like a harbour.</MessageBubble></MessageBody>
          </Message>
          <Message>
            <MessageAvatar alt="Ada Lindqvist" />
            <MessageHeader name="Ada Lindqvist" time="16:31" />
            <MessageBody><MessageBubble>That was the idea. I&rsquo;ll take it further tomorrow.</MessageBubble></MessageBody>
          </Message>
          <ThreadDay>Today</ThreadDay>
          <Message>
            <MessageAvatar alt="Ada Lindqvist" />
            <MessageHeader name="Ada Lindqvist" time="09:40" dateTime="2026-09-30T09:40" />
            <MessageBody><MessageBubble>The Halden marks are ready for review.</MessageBubble></MessageBody>
          </Message>
          <Message from="you">
            <MessageAvatar alt="You" />
            <MessageHeader name="You" time="09:44" dateTime="2026-09-30T09:44" />
            <MessageBody><MessageBubble align="end">Looking now. Can we see it at stamp size too?</MessageBubble></MessageBody>
            <MessageFooter><MessageStatus read /></MessageFooter>
          </Message>
          {Array.from({ length: arrived }, (_, i) => (
            <Message key={i} arriving>
              <MessageAvatar alt="Ada Lindqvist" />
              <MessageHeader name="Ada Lindqvist" time={time(i)} />
              <MessageBody><MessageBubble>{updates[i % updates.length]}</MessageBubble></MessageBody>
            </Message>
          ))}
        </Thread>
        <Button variant="bracket" onClick={() => setArrived((n) => n + 1)}>Ask Ada for an update</Button>
        <p className="db-pp">Scroll up, then ask Ada for an update: the thread stays where you are and counts what arrived.</p>
      </div>
      <div className="grid max-w-[64rem] gap-(--db-space-7) lg:grid-cols-2">
        <Thread label="Proofs thread" variant="rests" className="h-[34rem]"><Lines lines={proofs} /></Thread>
        <Thread label="Halden week" variant="running" className="h-[34rem]"><Lines lines={week} /></Thread>
      </div>
    </div>
  )
}

export function States() {
  return (
    <>
      <State label="Rests, quick replies">
        <Thread label="Quick replies" variant="rests" className="h-68 w-[min(24rem,calc(100vw-2*var(--db-margin)))]"><Lines lines={proofs.slice(0, 3)} /></Thread>
      </State>
      <State label="Rests, a long pause">
        <Thread label="A long pause" variant="rests" className="h-68 w-[min(24rem,calc(100vw-2*var(--db-margin)))]"><Lines lines={proofs.slice(3, 5)} /></Thread>
      </State>
      <State label="Running head, scrolled back">
        <Thread label="Scrolled back" variant="running" className="h-68 w-[min(24rem,calc(100vw-2*var(--db-margin)))]"><Lines lines={week.slice(3)} /></Thread>
      </State>
    </>
  )
}
