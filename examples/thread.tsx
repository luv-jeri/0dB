"use client"

import * as React from "react"

import { Button } from "@/registry/0db/ui/button"
import { Message, MessageAvatar, MessageBody, MessageBubble, MessageFooter, MessageHeader, MessageStatus } from "@/registry/0db/ui/message"
import { Thread, ThreadDay } from "@/registry/0db/ui/thread"

const updates = [
  "The stamp size holds. The anchor is gone, the flag stays.",
  "I redrew the timetable grid. It reads better from a distance.",
  "Sending the second round to the ferry office this afternoon.",
  "They asked for the flag in one colour. I have it in ink.",
]

export default function Example() {
  const [arrived, setArrived] = React.useState(0)
  const time = (n: number) => `09:${String(46 + n).padStart(2, "0")}`
  return (
    <div className="grid max-w-xl justify-items-start gap-6">
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
          <MessageBody><MessageBubble>That was the idea. I&apos;ll take it further tomorrow.</MessageBubble></MessageBody>
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
      <p className="db-label">Scroll up, then ask Ada for an update: the thread stays where you are and counts what arrived.</p>
    </div>
  )
}
