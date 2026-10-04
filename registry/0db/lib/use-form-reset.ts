"use client"

import * as React from "react"

/** Custom values follow their native form's reset, after its cancelable default action. */
export function useFormReset(root: React.RefObject<HTMLElement | null>, reset: () => void) {
  const latest = React.useRef(reset)
  React.useLayoutEffect(() => { latest.current = reset })
  React.useEffect(() => {
    const el = root.current
    if (!el) return
    let timer = 0
    const onReset = (event: Event) => {
      const form = el instanceof HTMLFieldSetElement ? el.form : el.closest("form")
      const controls = [...el.querySelectorAll<HTMLInputElement>("input")]
      if (form !== event.target && !controls.some((control) => control.form === event.target)) return
      window.clearTimeout(timer)
      timer = window.setTimeout(() => { if (!event.defaultPrevented) latest.current() }, 0)
    }
    el.ownerDocument.addEventListener("reset", onReset, true)
    return () => { window.clearTimeout(timer); el.ownerDocument.removeEventListener("reset", onReset, true) }
  }, [root])
}
