"use client"

import { ViewTransition, type ReactNode } from "react"

type PageTurnProps = { children: ReactNode; share?: string }

/** Wrap each page (not its persistent layout). Add a forward/back type inside startTransition. */
function PageTurn({ children, share }: PageTurnProps) {
  return (
    <ViewTransition
      name={share}
      default="none"
      enter={{ default: "db-page-turn-enter", forward: "db-page-turn-enter", back: "db-page-turn-enter-back" }}
      exit={{ default: "db-page-turn-exit", forward: "db-page-turn-exit", back: "db-page-turn-exit-back" }}
      share={share ? "db-page-turn-share" : "none"}
    >
      {children}
    </ViewTransition>
  )
}

export { PageTurn, type PageTurnProps }
