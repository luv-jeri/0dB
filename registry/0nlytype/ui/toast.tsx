"use client"

import * as React from "react"

import { cn } from "@/registry/0nlytype/lib/utils"
import { Button } from "@/registry/0nlytype/ui/button"

type ToastOptions = {
  /** An action keeps its name: "Undo", then the toast says what happened. */
  action?: { label: string; onClick: () => void }
  /** How long it stays, in milliseconds. Pointing at it holds the pause. */
  duration?: number
}

type ToastVariant = "fermata" | "footnote" | "dateline"

type ToastItem = {
  id: string
  message: React.ReactNode
  action?: ToastOptions["action"]
  duration: number
  leaving: boolean
  /** The footnote's number: counts up while notes stand, and starts again at 1 on an empty page. */
  n: number
  at: number
}

// A tiny module-level store: toast() can be called from anywhere, <Toaster /> renders it.
let items: ToastItem[] = []
let count = 0
// Every mounted Toaster, in mount order. Only the latest one shows and announces the toasts, so a page that
// mounts its own Toaster inside an app that already has one doesn't say everything twice.
let toasters: string[] = []
const listeners = new Set<() => void>()
const none: ToastItem[] = []

function set(next: ToastItem[]) {
  items = next
  listeners.forEach((l) => l())
}

/** Say one thing, once. Returns the id, for dismiss(). At most three stay on screen. */
function toast(message: React.ReactNode, opts: ToastOptions = {}): string {
  const id = `toast-${++count}`
  const n = (items.at(-1)?.n ?? 0) + 1
  set([...items, { id, message, action: opts.action, duration: opts.duration ?? 5000, leaving: false, n, at: Date.now() }].slice(-3))
  return id
}

/** Send one toast away (or all of them). It sinks, then it is removed. */
function dismiss(id?: string) {
  set(items.map((t) => (id === undefined || t.id === id ? { ...t, leaving: true } : t)))
}

const remove = (id: string) => set(items.filter((t) => t.id !== id))
const subscribe = (l: () => void) => (listeners.add(l), () => void listeners.delete(l))
const speaker = () => toasters.at(-1)
const clock = (at: number) => new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit" }).format(at)

type ToastProps = Omit<React.ComponentProps<"div">, "id"> &
  Partial<Omit<ToastItem, "message">> & { message: React.ReactNode; variant?: ToastVariant }

/** One toast. <Toaster /> renders these from the store; render one yourself only to show it still (documentation). */
function Toast({ id = "", message, action, duration = 5000, leaving = false, n = 1, at, variant = "fermata", className, style, ...props }: ToastProps) {
  return (
    <div
      data-slot="toast"
      data-leaving={leaving || undefined}
      className={cn("db-toast", className)}
      style={{ "--life": `${duration}ms`, ...style } as React.CSSProperties}
      onAnimationEnd={(e) => {
        if (leaving && e.target === e.currentTarget) remove(id)
      }}
      {...props}
    >
      {variant === "footnote" ? <sup className="db-toast-n" aria-hidden="true">{n}</sup> : null}
      <p data-slot="toast-message">{message}</p>
      {/* The timer is a fermata held over the sentence's last note: its arc empties, and when it's gone so is the toast.
          The footnote and the dateline keep it, unseen, as their clock. */}
      <svg
        data-slot="toast-timer"
        className="db-toast-timer"
        viewBox="0 0 22 14"
        aria-hidden="true"
        onAnimationEnd={() => dismiss(id)}
      >
        <path d="M2 12.5 A9 9 0 0 1 20 12.5" pathLength="1" strokeDasharray="1" />
        <circle cx="11" cy="10.4" r="1.9" />
      </svg>
      {variant === "dateline" ? (
        <>
          <span className="db-toast-rule" aria-hidden="true" />
          <time className="db-toast-time" suppressHydrationWarning dateTime={new Date(at ?? 0).toISOString()}>{at === undefined ? "" : clock(at)}</time>
        </>
      ) : null}
      {action ? (
        <Button
          data-slot="toast-action"
          variant="bracket"
          onClick={() => {
            dismiss(id)
            action.onClick()
          }}
        >
          {action.label}
        </Button>
      ) : null}
    </div>
  )
}

type ToasterProps = React.ComponentProps<"section"> & {
  /**
   * fermata: each toast is framed, with a fermata over its last word whose arc empties while it stays.
   * footnote: notes at the foot of the page under a short rule, numbered as they come.
   * dateline: the sentence and the time it happened on one hairline, which runs out toward the time.
   */
  variant?: ToastVariant
}

/** Render once, near the root. Toasts rise from the bottom-left and are announced politely. If more than one is mounted, the latest speaks and the rest stay quiet. */
function Toaster({ className, variant = "fermata", ...props }: ToasterProps) {
  const me = React.useId()
  React.useEffect(() => {
    toasters = [...toasters, me]
    listeners.forEach((l) => l())
    return () => {
      toasters = toasters.filter((t) => t !== me)
      listeners.forEach((l) => l())
    }
  }, [me])
  const all = React.useSyncExternalStore(subscribe, () => items, () => none)
  const list = React.useSyncExternalStore(subscribe, speaker, () => undefined) === me ? all : none
  return (
    <section
      data-slot="toaster"
      data-variant={variant === "fermata" ? undefined : variant}
      role="status"
      aria-live="polite"
      aria-label="Notifications"
      className={cn("db-toaster", className)}
      {...props}
    >
      {list.map((item) => (
        <Toast key={item.id} {...item} variant={variant} />
      ))}
    </section>
  )
}

export { toast, dismiss, Toast, Toaster, type ToastOptions, type ToastVariant }
