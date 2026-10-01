"use client"

import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"
import { AgentState, type AgentStateValue } from "@/registry/0db/ui/agent-state"
import { Attachment, AttachmentList } from "@/registry/0db/ui/attachment"
import { Button } from "@/registry/0db/ui/button"
import { Dialog, DialogActions, DialogClose, DialogContent, DialogDescription, DialogMeta, DialogTitle } from "@/registry/0db/ui/dialog"
import { Field, Textarea } from "@/registry/0db/ui/field"
import { Kbd } from "@/registry/0db/ui/kbd"
import { Marker, type MarkerProps } from "@/registry/0db/ui/marker"
import { Progress, type ProgressProps } from "@/registry/0db/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/registry/0db/ui/radio-group"
import { Thread, type ThreadProps } from "@/registry/0db/ui/thread"

type AgentChatProps = React.ComponentProps<"section"> & {
  /**
   * default: the agent's work and your answers run in the conversation as quiet lines. callout: after Weingart's
   * letter, they hang at the far side in reversed pills, each on a leader line that ends in a dot.
   */
  variant?: "default" | "callout"
}

/** Talk to an agent. A header, a thread and a composer, stacked; give it a height and the thread takes what's left. */
function AgentChat({ variant = "default", className, ...props }: AgentChatProps) {
  return <section data-slot="agent-chat" data-variant={variant === "default" ? undefined : variant} className={cn("db-agent-chat", className)} {...props} />
}

type AgentChatHeaderProps = Omit<React.ComponentProps<"header">, "title" | "children"> & {
  title: React.ReactNode
  /** Where the agent is. The words default to the state's own ("Working"). */
  state: AgentStateValue
  /** Other words for the state: "Reading the brief". */
  status?: string
}

/** The agent's name, and where it is. */
function AgentChatHeader({ title, state, status, className, ...props }: AgentChatHeaderProps) {
  return (
    <header data-slot="agent-chat-header" className={cn("db-agent-chat-head", className)} {...props}>
      <h2>{title}</h2>
      <AgentState state={state}>{status}</AgentState>
    </header>
  )
}

/** The conversation: a Thread that takes the room the header and the composer leave. */
function AgentChatThread({ className, ...props }: ThreadProps) {
  return <Thread data-slot="agent-chat-thread" className={cn("db-agent-chat-thread", className)} {...props} />
}

/** A quiet line from the agent's side of things: "Opened the Halden folder." Hangs as a callout in that variant. */
function AgentChatNote({ dot = true, className, ...props }: MarkerProps) {
  return (
    <div data-slot="agent-chat-note" className={cn("db-agent-note", className)}>
      <Marker dot={dot} {...props} />
    </div>
  )
}

/** What the agent is doing, as a sentence that inks in as it goes. */
function AgentChatWork({ className, ...props }: Omit<ProgressProps, "variant">) {
  return (
    <div data-slot="agent-chat-work" className={cn("db-agent-note", className)}>
      <Progress variant="sentence" {...props} />
    </div>
  )
}

type Decision = "pending" | "allowed" | "denied"

type AgentChatPermissionProps = {
  /** The question, in the agent's words: "Read last season's timetable?" */
  title: string
  description?: React.ReactNode
  /** One fact over the question: what it reaches, "Halden folder, read only". */
  scope?: React.ReactNode
  /** Pending asks, in a dialog that must be answered; answered, only the receipt stays in the thread. */
  decision: Decision
  onDecision: (decision: "allowed" | "denied") => void
  allowLabel?: string
  denyLabel?: string
  /** The receipt's word for each answer; an action keeps its name. */
  allowedLabel?: string
  deniedLabel?: string
  /** The word over the question, before the scope. */
  metaLabel?: string
  /** The receipt while the question waits. */
  pendingLabel?: string
}

/**
 * The agent asks before it acts. The question is ours, heavy and narrow; the answers are yours, large in italic.
 * Deny has the focus, and Escape denies too, so nothing is allowed by default. The question and your answer stay
 * in the thread as a receipt: "Read last season's timetable? Allowed once."
 */
function AgentChatPermission({
  title,
  description,
  scope,
  decision,
  onDecision,
  allowLabel = "Allow once",
  denyLabel = "Deny",
  allowedLabel = "Allowed once",
  deniedLabel = "Denied",
  metaLabel = "Permission",
  pendingLabel = "Waiting for your answer.",
}: AgentChatPermissionProps) {
  // The close that follows an answer mustn't count as a second answer, so the answer is kept at once, not on re-render.
  const answered = React.useRef(false)
  React.useEffect(() => {
    if (decision === "pending") answered.current = false
  }, [decision])
  const decide = (d: "allowed" | "denied") => {
    if (decision !== "pending" || answered.current) return
    answered.current = true
    onDecision(d)
  }
  return (
    <>
      <Dialog alert open={decision === "pending"} onOpenChange={(open) => !open && decide("denied")}>
        <DialogContent variant="reply">
          {scope ? <DialogMeta><span>{metaLabel}</span><hr /><span>{scope}</span></DialogMeta> : null}
          <DialogTitle>{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
          <DialogActions>
            <DialogClose onClick={() => decide("allowed")}>{allowLabel}</DialogClose>
            <DialogClose data-autofocus onClick={() => decide("denied")}>{denyLabel}</DialogClose>
          </DialogActions>
        </DialogContent>
      </Dialog>
      <AgentChatNote data-slot="agent-chat-receipt" data-decision={decision} dot={decision !== "pending"}>
        {title}{" "}
        {decision === "pending" ? <span>{pendingLabel}</span> : <span className="db-yours">{decision === "allowed" ? allowedLabel : deniedLabel}.</span>}
      </AgentChatNote>
    </>
  )
}

type AgentChatChoiceProps = Omit<React.ComponentProps<"div">, "defaultValue"> & {
  /** The agent's question: "Which way should the timetable read?" */
  question: React.ReactNode
  options: readonly { value: string; label: string }[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  onConfirm: (value: string) => void
  confirmLabel?: string
  /** The value you confirmed. The choice closes: the words stay, your word in italic, and nothing can be changed. */
  answer?: string
}

/** The agent needs you to pick one. The words are the radios; Continue answers. */
function AgentChatChoice({ question, options, value, defaultValue, onValueChange, onConfirm, confirmLabel = "Continue", answer, className, ...props }: AgentChatChoiceProps) {
  const [local, setLocal] = React.useState(defaultValue)
  const chosen = answer ?? value ?? local
  return (
    <div data-slot="agent-chat-choice" data-answered={answer !== undefined || undefined} className={cn("db-agent-choice", className)} {...props}>
      <RadioGroup
        legend={question}
        value={chosen}
        orientation="vertical"
        onValueChange={(v) => {
          if (value === undefined) setLocal(v)
          onValueChange?.(v)
        }}
      >
        {options.map((o) => (
          <RadioGroupItem key={o.value} value={o.value} disabled={answer !== undefined}>
            {o.label}
          </RadioGroupItem>
        ))}
      </RadioGroup>
      {answer === undefined ? (
        <Button variant="bracket" disabled={!chosen} onClick={() => chosen && onConfirm(chosen)}>
          {confirmLabel}
        </Button>
      ) : null}
    </div>
  )
}

type ComposerAttachment = { id: string; name: string; size?: string; state?: "uploading" | "processing" | "done" | "error"; progress?: number; status?: string }

type AgentChatComposerProps = Omit<React.ComponentProps<"form">, "onSubmit"> & {
  /** Names the box: "Write to Ada". */
  label: string
  placeholder?: string
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  /** Called with the words when you send. Held here, the box then clears; held by you, clear it yourself. */
  onSend: (value: string) => void
  /** The agent is answering: Send gives way to Stop, and the box stays open for your next words. */
  busy?: boolean
  onStop?: () => void
  attachments?: readonly ComposerAttachment[]
  /** Files chosen with Attach or dropped on the composer. Without it there is no Attach. */
  onAttach?: (files: File[]) => void
  onRemoveAttachment?: (id: string) => void
  accept?: string
  /** What to fix, in plain words, hung from the box as a callout. */
  error?: React.ReactNode
  maxLength?: number
  disabled?: boolean
  sendLabel?: string
  stopLabel?: string
  attachLabel?: string
  /** The word after the keys in the hint: "⌘ Enter sends". */
  sendsLabel?: string
  /** What the enclosure line says while files are dragged over, given how many. */
  dropLabel?: (count: number) => string
}

const noop = () => () => {}
const onMac = () => /Mac|iPhone|iPad|iPod/.test(navigator.userAgent)

/**
 * Where you write to the agent: a ruled box your words arrive on in italic, the files enclosed under it as a
 * letter's "Encl. (2)", Attach and Send. Enter starts a new line; ⌘ Enter (Ctrl Enter) sends. Drag files over and
 * the enclosure line counts them in before you let go.
 */
function AgentChatComposer({
  label,
  placeholder,
  value,
  defaultValue = "",
  onValueChange,
  onSend,
  busy = false,
  onStop,
  attachments = [],
  onAttach,
  onRemoveAttachment,
  accept,
  error,
  maxLength,
  disabled = false,
  sendLabel = "Send",
  stopLabel = "Stop",
  attachLabel = "Attach",
  sendsLabel = "sends",
  dropLabel = (n) => `Let go to enclose ${n === 1 ? "it" : `all ${n}`}.`,
  className,
  ...props
}: AgentChatComposerProps) {
  const [local, setLocal] = React.useState(defaultValue)
  const text = value ?? local
  const [incoming, setIncoming] = React.useState(0)
  const picker = React.useRef<HTMLInputElement>(null)
  const mod = React.useSyncExternalStore(noop, () => (onMac() ? "⌘" : "Ctrl"), () => "⌘")
  const canSend = !disabled && !busy && (text.trim() !== "" || attachments.length > 0)

  const write = (v: string) => {
    if (value === undefined) setLocal(v)
    onValueChange?.(v)
  }
  const send = () => {
    if (!canSend) return
    onSend(text)
    if (value === undefined) setLocal("")
  }
  const files = (e: React.DragEvent) => onAttach && !disabled && e.dataTransfer.types.includes("Files")
  const shown = attachments.length + incoming

  return (
    <form
      data-slot="agent-chat-composer"
      data-over={incoming > 0 || undefined}
      className={cn("db-agent-compose", className)}
      onSubmit={(e) => {
        e.preventDefault()
        send()
      }}
      onDragOver={(e) => {
        if (!files(e)) return
        e.preventDefault()
        e.dataTransfer.dropEffect = "copy"
        setIncoming(e.dataTransfer.items.length || 1)
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setIncoming(0)
      }}
      onDrop={(e) => {
        if (!files(e)) return
        e.preventDefault()
        setIncoming(0)
        onAttach?.(Array.from(e.dataTransfer.files))
      }}
      {...props}
    >
      <Field label={label} error={error} maxLength={maxLength} count={maxLength !== undefined}>
        <Textarea
          value={text}
          placeholder={placeholder}
          disabled={disabled}
          rows={2}
          aria-keyshortcuts="Meta+Enter Control+Enter"
          onChange={(e) => write(e.target.value)}
          onKeyDown={(e) => {
            if (e.key !== "Enter" || !(e.metaKey || e.ctrlKey)) return
            e.preventDefault()
            send()
          }}
        />
      </Field>
      {shown > 0 ? (
        <AttachmentList variant="enclosure" data-count={shown} className="db-agent-encl">
          {attachments.map((a) => (
            <Attachment
              key={a.id}
              name={a.name}
              size={a.size}
              state={a.state}
              progress={a.progress}
              status={a.status}
              onRemove={onRemoveAttachment && !disabled ? () => onRemoveAttachment(a.id) : undefined}
            />
          ))}
          {incoming > 0 ? <li className="db-agent-drop">{dropLabel(incoming)}</li> : null}
        </AttachmentList>
      ) : null}
      <div className="db-agent-compose-actions">
        {onAttach ? (
          <>
            <Button variant="bracket" type="button" disabled={disabled} onClick={() => picker.current?.click()}>
              {attachLabel}
            </Button>
            <input
              ref={picker}
              type="file"
              multiple
              accept={accept}
              tabIndex={-1}
              aria-hidden="true"
              hidden
              onChange={(e) => {
                onAttach(Array.from(e.target.files ?? []))
                e.target.value = "" // the same file can be chosen again
              }}
            />
          </>
        ) : null}
        <p className="db-agent-compose-hint">
          <Kbd>{mod}</Kbd> <Kbd>Enter</Kbd> {sendsLabel}
        </p>
        {busy && onStop ? (
          <Button variant="bracket" type="button" onClick={onStop}>
            {stopLabel}
          </Button>
        ) : (
          <Button variant="statement" type="submit" disabled={!canSend}>
            {sendLabel}
          </Button>
        )}
      </div>
    </form>
  )
}

export {
  AgentChat,
  AgentChatChoice,
  AgentChatComposer,
  AgentChatHeader,
  AgentChatNote,
  AgentChatPermission,
  AgentChatThread,
  AgentChatWork,
  type AgentChatChoiceProps,
  type AgentChatComposerProps,
  type AgentChatHeaderProps,
  type AgentChatPermissionProps,
  type AgentChatProps,
}
