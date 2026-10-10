"use client"

import * as React from "react"

/** Re-read native values after React commits, child changes and the browser's form reset. */
export function useFormPresentation(root: React.RefObject<HTMLElement | null>, sync: () => void) {
  React.useLayoutEffect(sync)
  React.useEffect(() => {
    const el = root.current
    if (!el) return
    let resetTimer = 0
    const watch = new MutationObserver(sync)
    watch.observe(el, { childList: true, characterData: true, subtree: true, attributes: true, attributeFilter: ["value", "checked", "type"] })
    const reset = (event: Event) => {
      if (![...el.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input, textarea")].some((control) => control.form === event.target)) return
      // A user-triggered reset can drain microtasks before its default action restores the controls.
      window.clearTimeout(resetTimer)
      resetTimer = window.setTimeout(sync, 0)
    }
    el.ownerDocument.addEventListener("reset", reset, true)
    return () => {
      window.clearTimeout(resetTimer)
      watch.disconnect()
      el.ownerDocument.removeEventListener("reset", reset, true)
    }
  }, [root, sync])
}
