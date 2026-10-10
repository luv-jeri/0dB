"use client"

import * as React from "react"
import { flushSync } from "react-dom"

import { DEMO_SCORES } from "@/components/site/demo-scores"
import type { Lane, Conductor } from "@/components/site/demo-choreography"

export { DEMO_SCORES } from "@/components/site/demo-scores"

export function useDemoClock() {
  const ref = React.useRef<HTMLDivElement>(null)
  const [step, setStep] = React.useState(0)
  React.useEffect(() => {
    const el = ref.current
    const tick = (e: Event) => setStep((e as CustomEvent<number>).detail)
    el?.addEventListener("preview-step", tick)
    return () => el?.removeEventListener("preview-step", tick)
  }, [])
  return { ref, step }
}

export type DemoState = "waiting" | "playing" | "finished" | "stopped" | "static"

/** Owns discovery, load/idle gating, choreography and cancellation of one explicit demonstration.
 * Nothing moves until the person presses Demonstrate: discovery only finds out whether there is something to show
 * (and loads the choreography to do it), and never clicks, types or starts. Stop, or any real touch of the example,
 * hands it back. Reset is the host's keyed example remount: React remains the owner of every real default. */
export function useDemoPlayer({ root, host = root, item, identity = item, reset }: { root: React.RefObject<HTMLElement | null>; host?: React.RefObject<HTMLElement | null>; item: string; identity?: string; reset: () => void }) {
  // Both belong to one piece on one mount: a new piece starts with nothing to offer until it has been looked at.
  const key = `${item}\n${identity}`
  const [shown, setShown] = React.useState<{ key: string; state: DemoState; interactive: boolean }>({ key, state: "waiting", interactive: false })
  const state = shown.key === key ? shown.state : "waiting"
  const interactive = shown.key === key && shown.interactive
  const control = React.useRef<{ demonstrate: () => void; stop: () => void }>({ demonstrate: () => {}, stop: () => {} })
  const resetRef = React.useRef(reset)
  React.useLayoutEffect(() => { resetRef.current = reset }, [reset])
  React.useEffect(() => {
    const el = root.current, surface = host.current
    if (!el || !surface) return
    const setState = (next: DemoState) => setShown((now) => ({ key, state: next, interactive: now.key === key && now.interactive }))
    const setInteractive = (next: boolean) => setShown((now) => ({ key, state: now.key === key ? now.state : "waiting", interactive: next }))
    const motion = matchMedia("(prefers-reduced-motion: reduce)")
    let disposed = false, ready = false, visible = false, started = false, available = false, pristine = true
    let run: AbortController | null = null, idle = 0, deferred = 0
    let choreography: typeof import("@/components/site/demo-choreography") | null = null, loading = false
    let lanes: Lane[] = [], driving = false, sheetHeight = 0
    const heldSheets = new Set<HTMLElement>()
    // The landing fits its specimen to a stage. Keep the default panel's room while a shorter
    // state is read, so the type does not jump in scale with each tab or disclosure.
    const stabilize = () => {
      const sheet = el.querySelector<HTMLElement>(".pieces-preview-scale[data-fitted]")
      if (!sheet) return
      sheetHeight ||= sheet.offsetHeight
      sheet.style.minHeight = `${sheetHeight}px`
      heldSheets.add(sheet)
    }
    const release = () => { heldSheets.forEach((sheet) => sheet.style.removeProperty("min-height")); heldSheets.clear() }
    const publish = (next: DemoState) => { if (!disposed) { el.dataset.demoState = next; setState(next) } }
    const wait = (ms: number, signal: AbortSignal) => new Promise<void>((resolve, reject) => {
      if (signal.aborted) { reject(signal.reason); return }
      const abort = () => { clearTimeout(timer); reject(signal.reason) }
      const timer = window.setTimeout(() => { signal.removeEventListener("abort", abort); resolve() }, ms)
      signal.addEventListener("abort", abort, { once: true })
    })
    const conductor = (signal: AbortSignal): Conductor => {
      const t = choreography!.tempo(el)
      return { tempo: t, wait: (ms) => wait(ms, signal), move: async (apply) => {
        if (signal.aborted) throw signal.reason
        if (t.reduced) { apply(1); return }
        const from = performance.now(), duration = t.andante * 2
        while (!signal.aborted) {
          const p = Math.min(1, (performance.now() - from) / duration)
          apply(p * p * (3 - 2 * p))
          if (p === 1) return
          await wait(1000 / 60, signal)
        }
      } }
    }
    const invoke = (fn: () => void | Promise<void>) => {
      driving = true
      try { return fn() } finally { driving = false }
    }
    const cancel = (handover: boolean) => {
      const running = run !== null
      run?.abort(); run = null
      if (handover) release()
      // Remove synthetic pointer presence; preserve the value the person is taking over.
      if (DEMO_SCORES[item]?.script === "wake" || DEMO_SCORES[item]?.script === "timer") lanes.forEach((l) => l.restore && invoke(l.restore))
      lanes = []
      if (running) publish("stopped")
    }
    const quiet = () => { if (item === "word-relay") choreography?.all(el, ".ot-relay-pause").filter((b) => b.textContent?.trim() === "pause").forEach((b) => invoke(() => b.click())) }
    const remount = () => { driving = true; try { flushSync(() => resetRef.current()); quiet(); stabilize() } finally { driving = false } }
    // Only ever called by the person's own press of Demonstrate. It starts from the example's defaults (remounting
    // only when something has already happened to it) and plays once.
    const start = async () => {
      if (disposed || !available) return
      cancel(false)
      started = true
      const current = new AbortController()
      run = current
      const signal = current.signal, c = conductor(signal)
      try {
        if (!pristine) { remount(); await c.wait(c.tempo.moderato) }
        pristine = false
        stabilize()
        publish("playing")
        el.dataset.demoCycle = "1"
        lanes = choreography!.compose(el, item, c).filter((l) => l.steps.length)
        await Promise.all(lanes.map(async (lane, i) => {
          // A short canon: lead, answer, inner voice, cadence. Entries overlap; no serial tour.
          const entry = [0, 1, 0.5, 1.5][i % 4] * c.tempo.moderato
          await c.wait(entry)
          for (const step of lane.steps) {
            if (signal.aborted) throw signal.reason
            await invoke(step)
            await c.wait(c.tempo.breath + (i % 2) * c.tempo.moderato / 2)
          }
        }))
        if (signal.aborted) return
        await Promise.all(lanes.map((l) => l.restore && invoke(l.restore)))
        await c.wait(c.tempo.andante)
        remount()
        await c.wait(c.tempo.breath)
        run = null; lanes = []
        publish("finished")
      } catch (error) {
        if (!signal.aborted) { cancel(false); publish("stopped"); console.error("Demo could not finish", item, error) }
      }
    }
    control.current = {
      demonstrate: () => { void start() },
      stop: () => { if (run) cancel(true) },
    }
    // Finds out whether there is a demonstration to give. It acts on nothing.
    const discover = () => {
      if (disposed || !ready || !visible) return
      if (!DEMO_SCORES[item]?.script) { publish("static"); return }
      if (!choreography) {
        if (!loading) {
          loading = true
          import("@/components/site/demo-choreography").then((module) => {
            if (!disposed) { choreography = module; discover() }
          }).catch(() => { if (!disposed) publish("stopped") })
        }
        return
      }
      const found = choreography.compose(el, item, conductor(new AbortController().signal)).some((l) => l.steps.length)
      if (found !== available) { available = found; setInteractive(found) }
    }
    // A page that scrolls under a still pointer (the demonstration focusing a field, say) makes the browser report the
    // pointer entering whatever slid beneath it. That is the page moving, not the person.
    let scrolledAt = -1e9
    const scrolled = () => { scrolledAt = performance.now() }
    addEventListener("scroll", scrolled, { passive: true, capture: true })
    const hands = (event: Event) => {
      // The Demonstrate and Stop control is the person asking, not the person taking over.
      if (event.target instanceof Element && event.target.closest("[data-demo-control]")) return
      if (event.type === "pointerenter" && performance.now() - scrolledAt < 600) return
      if (event.isTrusted && !driving) { pristine = false; cancel(true) }
    }
    const events = ["pointerenter", "pointerdown", "keydown", "focusin", "click"]
    events.forEach((e) => surface.addEventListener(e, hands, true))
    const away = () => { if (run && document.hidden) cancel(true) }
    document.addEventListener("visibilitychange", away)
    const changed = () => { if (motion.matches) cancel(true) }
    motion.addEventListener("change", changed)
    const view = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (!visible && run) cancel(true)
      else discover()
    }, { threshold: 0 })
    view.observe(surface)
    const changes = new MutationObserver(() => { if (!started) discover() })
    changes.observe(el, { childList: true, subtree: true })
    const afterLoad = () => {
      const next = () => { if (!disposed) { ready = true; discover() } }
      if (typeof window.requestIdleCallback === "function") idle = window.requestIdleCallback(next, { timeout: 1400 })
      else deferred = window.setTimeout(next, 320)
    }
    // Discovery can measure controls. Load its choreography only after load + idle + intersection.
    if (document.readyState === "complete") afterLoad()
    else window.addEventListener("load", afterLoad, { once: true })
    return () => {
      disposed = true; run?.abort(); release(); control.current = { demonstrate: () => {}, stop: () => {} }
      changes.disconnect(); view.disconnect(); clearTimeout(deferred)
      if (idle) window.cancelIdleCallback(idle)
      window.removeEventListener("load", afterLoad)
      events.forEach((e) => surface.removeEventListener(e, hands, true))
      removeEventListener("scroll", scrolled, true)
      document.removeEventListener("visibilitychange", away)
      motion.removeEventListener("change", changed)
      delete el.dataset.demoState; delete el.dataset.demoCycle
    }
  }, [root, host, item, key])
  return { state, interactive, demonstrate: () => control.current.demonstrate(), stop: () => control.current.stop() }
}
