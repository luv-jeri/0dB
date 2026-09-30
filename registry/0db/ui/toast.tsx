"use client"

import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"
import { Button } from "@/registry/0db/ui/button"

type ToastOptions = {
  /** An action keeps its name: "Undo", then the toast says what happened. */
  action?: { label: string; onClick: () => void }
  /** How long it stays, in milliseconds. Pointing at it holds the pause. */
  duration?: number
}

type ToastItem = {
  id: string
  message: React.ReactNode
  action?: ToastOptions["action"]
  duration: number
  leaving: boolean
}

// A tiny module-level store: toast() can be called from anywhere, <Toaster /> renders it.
let items: ToastItem[] = []
let count = 0
const listeners = new Set<() => void>()
const none: ToastItem[] = []

function set(next: ToastItem[]) {
  items = next
  listeners.forEach((l) => l())
}

/** Say one thing, once. Returns the id, for dismiss(). At most three stay on screen. */
function toast(message: React.ReactNode, opts: ToastOptions = {}): string {
  const id = `toast-${++count}`
  set([...items, { id, message, action: opts.action, duration: opts.duration ?? 5000, leaving: false }].slice(-3))
  return id
}

/** Send one toast away (or all of them). It sinks, then it is removed. */
function dismiss(id?: string) {
  set(items.map((t) => (id === undefined || t.id === id ? { ...t, leaving: true } : t)))
}

const remove = (id: string) => set(items.filter((t) => t.id !== id))
const subscribe = (l: () => void) => (listeners.add(l), () => void listeners.delete(l))

function ToastView({ item }: { item: ToastItem }) {
  const { id, message, action, duration, leaving } = item
  return (
    <div
      data-slot="toast"
      data-leaving={leaving || undefined}
      className="db-toast"
      style={{ "--life": `${duration}ms` } as React.CSSProperties}
      onAnimationEnd={(e) => {
        if (leaving && e.target === e.currentTarget) remove(id)
      }}
    >
      {/* The timer is a fermata: its arc empties, and when it's gone so is the toast. */}
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
      <p data-slot="toast-message">{message}</p>
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

/** Render once, near the root. Toasts rise from the bottom-left and are announced politely. */
function Toaster({ className, ...props }: React.ComponentProps<"section">) {
  const list = React.useSyncExternalStore(subscribe, () => items, () => none)
  return (
    <section
      data-slot="toaster"
      role="status"
      aria-live="polite"
      aria-label="Notifications"
      className={cn("db-toaster", className)}
      {...props}
    >
      {list.map((item) => (
        <ToastView key={item.id} item={item} />
      ))}
    </section>
  )
}

export { toast, dismiss, Toaster, type ToastOptions }
