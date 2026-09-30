"use client"

import * as React from "react"

function setRef<T>(ref: React.Ref<T> | undefined, node: T | null) {
  if (typeof ref === "function") return ref(node)
  if (ref) ref.current = node
}

/** Each ref keeps its own detach contract: a returned cleanup, or a legacy null call. */
export function composeRefs<T>(own: React.Ref<T> | undefined, forwarded: React.Ref<T> | undefined): React.RefCallback<T> {
  return (node) => {
    const refs = [own, forwarded]
    const cleanups = refs.map((ref) => setRef(ref, node))
    return () => {
      refs.forEach((ref, i) => {
        const cleanup = cleanups[i]
        if (typeof cleanup === "function") cleanup()
        else setRef(ref, null)
      })
    }
  }
}

export function useComposedRefs<T>(own: React.Ref<T> | undefined, forwarded: React.Ref<T> | undefined) {
  return React.useMemo(() => composeRefs(own, forwarded), [own, forwarded])
}
