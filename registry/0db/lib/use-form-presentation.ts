"use client"

import * as React from "react"

/** Re-read native values after React commits, child changes and the browser's form reset. */
export function useFormPresentation(root: React.RefObject<HTMLElement | null>, sync: () => void) {
  React.useLayoutEffect(sync)
  React.useEffect(() => {
    const el = root.current
    if (!el) return
    let live = true
    const watch = new MutationObserver(sync)
    watch.observe(el, { childList: true, characterData: true, subtree: true, attributes: true, attributeFilter: ["value", "checked", "type"] })
    const reset = (event: Event) => {
      if (![...el.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input, textarea")].some((control) => control.form === event.target)) return
      queueMicrotask(() => { if (live) sync() })
    }
    el.ownerDocument.addEventListener("reset", reset, true)
    return () => {
      live = false
      watch.disconnect()
      el.ownerDocument.removeEventListener("reset", reset, true)
    }
  }, [root, sync])
}
