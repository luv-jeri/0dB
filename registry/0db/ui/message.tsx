"use client"

import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"
import { roll } from "@/registry/0db/lib/roll"
import { Avatar, type AvatarProps } from "@/registry/0db/ui/avatar"

type MessageProps = React.ComponentProps<"article"> & {
  /** Theirs sit at the start in roman; yours sit at the end, in italic. */
  from?: "them" | "you"
  /** Writes the body in from the left when it mounts. */
  arriving?: boolean
}

/** A message: what they wrote is roman, what you wrote is italic. */
function Message({ className, from = "them", arriving, ...props }: MessageProps) {
  return (
    <article data-slot="message" data-from={from} data-arriving={arriving || undefined} className={cn("db-msg", className)} {...props} />
  )
}

/** The face beside the message. It sits in the message's grid, so it must be a direct child. */
function MessageAvatar({ className, ...props }: AvatarProps) {
  // The header already names the person, so the ring is decoration for assistive tech.
  return <Avatar data-slot="message-avatar" aria-hidden="true" className={className} {...props} />
}

type MessageHeaderProps = Omit<React.ComponentProps<"header">, "children"> & {
  name: React.ReactNode
  time: React.ReactNode
  /** The machine-readable time, such as 2026-09-30T09:40. */
  dateTime?: string
}

/** The name and the time. Yours flips them, time first, so the name stays beside your avatar. */
function MessageHeader({ name, time, dateTime, className, ...props }: MessageHeaderProps) {
  return (
    <header data-slot="message-header" className={cn("db-msg-head", className)} {...props}>
      <b>{name}</b>
      <time dateTime={dateTime}>{time}</time>
    </header>
  )
}

function MessageBody({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="message-body" className={cn("db-msg-body", className)} {...props} />
}

type MessageBubbleProps = React.ComponentProps<"p"> & {
  /** Which side the tail leans to. Set "end" for what you wrote. */
  align?: "start" | "end"
  /** ink: reversed type in a block, the tail under it. mark: a highlighter behind the words. */
  variant?: "default" | "ink" | "mark"
}

/** No balloon. Of the speech bubble only its tail is left, a leaning hairline. */
function MessageBubble({ align = "start", variant = "default", className, children, ...props }: MessageBubbleProps) {
  const shared = {
    "data-slot": "message-bubble",
    "data-align": align === "end" ? "end" : undefined,
    "data-variant": variant === "default" ? undefined : variant,
  }
  // The highlighter needs an inline paragraph inside the block, so the marker wraps.
  if (variant === "mark") {
    return (
      <div {...shared} className={cn("db-bubble", className)} {...(props as React.ComponentProps<"div">)}>
        <p>{children}</p>
      </div>
    )
  }
  return (
    <p {...shared} className={cn("db-bubble", className)} {...props}>
      {children}
    </p>
  )
}

function MessageFooter({ className, ...props }: React.ComponentProps<"footer">) {
  return <footer data-slot="message-footer" className={cn("db-msg-foot", className)} {...props} />
}

type MessageStatusProps = Omit<React.ComponentProps<"span">, "children"> & {
  /** Sent is a ring; read, it fills to a dot. */
  read?: boolean
  /** The word. Defaults to "Sent" or "Read". */
  children?: React.ReactNode
}

/** The word and its dot, side by side in the footer. */
function MessageStatus({ read, children, className, ...props }: MessageStatusProps) {
  return (
    <>
      <span>{children ?? (read ? "Read" : "Sent")}</span>
      <span data-slot="message-status" data-read={read || undefined} aria-hidden="true" className={cn("db-msg-status", className)} {...props} />
    </>
  )
}

function MessageReactions({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="message-reactions" role="group" aria-label="Reactions" className={cn("db-reactions", className)} {...props} />
}

type MessageReactionProps = Omit<React.ComponentProps<"button">, "onClick"> & {
  defaultPressed?: boolean
  /** How many people reacted, including you if pressed. */
  defaultCount?: number
  /** Called after the count has rolled. */
  onPressedChange?: (pressed: boolean, count: number) => void
}

/** A reaction: a tag you can press. Yours turns italic and the count rolls. */
// ponytail: uncontrolled; lift pressed and count to props when a thread needs to own them.
function MessageReaction({ defaultPressed = false, defaultCount = 0, onPressedChange, className, children, ...props }: MessageReactionProps) {
  const [pressed, setPressed] = React.useState(defaultPressed)
  const [count, setCount] = React.useState(defaultCount)
  const counter = React.useRef<HTMLSpanElement>(null)

  const toggle = () => {
    const on = !pressed
    const n = count + (on ? 1 : -1)
    setPressed(on)
    if (counter.current) roll(counter.current, () => setCount(n), "0.5em", on ? 1 : -1)
    else setCount(n)
    onPressedChange?.(on, n)
  }

  return (
    <button type="button" data-slot="message-reaction" aria-pressed={pressed} className={cn("db-tag", className)} onClick={toggle} {...props}>
      <span>{children}</span>
      <span ref={counter} className="db-reaction-count">{count}</span>
    </button>
  )
}

export {
  Message,
  MessageAvatar,
  MessageHeader,
  MessageBody,
  MessageBubble,
  MessageFooter,
  MessageStatus,
  MessageReactions,
  MessageReaction,
  type MessageProps,
}
