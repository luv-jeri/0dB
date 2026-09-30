import { State } from "@/components/site/state"
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
} from "@/registry/0db/ui/message"

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
      <State label="Sent"><MessageFooter><MessageStatus /></MessageFooter></State>
      <State label="Read"><MessageFooter><MessageStatus read /></MessageFooter></State>
    </>
  )
}
