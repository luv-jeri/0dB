"use client"

import * as React from "react"
import { flushSync } from "react-dom"

type Script = "check" | "choice" | "switch" | "range" | "number" | "text" | "select" | "tabs" | "toggle" | "accordion" | "details" | "calendar" | "drop" | "chart" | "radial" | "pie" | "radar" | "resize" | "measure" | "action" | "scroll" | "carousel" | "note" | "table" | "wake" | "melody" | "tree" | "swapy" | "tiling" | "relay" | "timer"
type Score = { script: Script; phrase: string } | { script: null; reason: string }
const play = (script: Script, phrase: string): Score => ({ script, phrase })
const rest = (reason: string): Score => ({ script: null, reason })

/** Deliberate coverage, not a selector that clicks whatever happens to be on the page.
 * The same score serves the docs Example and the landing's fitted variations. */
export const DEMO_SCORES: Record<string, Score> = {
  "accordion": play("accordion", "The second answer opens, then the first returns"),
  "activity-feed": play("details", "Open the older entries and put them away"),
  "agent-chat": play("text", "Compose a timetable request without sending it"),
  "agent-state": play("action", "Ready, thinking, working, ready"),
  "alert": rest("Messages already say their state; the example actions have no outcome."),
  "appearance": rest("Would change the reader's saved site preferences."),
  "area-chart": play("chart", "Read two months across the series"),
  "aspect-ratio": play("toggle", "Choose a square, then a landscape crop"),
  "attachment": play("action", "Send two more local parts of the example attachment"),
  "avatar": rest("Identity specimen; spreading or hover alone adds no state to explain."),
  "badge": rest("Removing an example tag deliberately moves focus to the next tag."),
  "breadcrumb": rest("Navigation belongs to the reader; no local state change."),
  "button": rest("These example actions are labels without outcomes; no pretend hover."),
  "button-group": rest("Grouped example actions have no local outcomes."),
  "calendar": play("calendar", "Choose an available day and the next one"),
  "calligram": rest("A typographic composition, without an interaction."),
  "card": rest("A linked specimen; no local state to demonstrate."),
  "carousel": play("carousel", "The next project arrives, then the first returns"),
  "chart": play("chart", "Two months answer with their actual figures"),
  "checkbox": play("check", "One task completes, another answers, then both return"),
  "collapsible": play("details", "Read what is folded away, then close it"),
  "combobox": play("text", "Find Garamond and Halden in the actual options"),
  "command": play("text", "Search for Halden in both live indexes"),
  "command-line": play("text", "Fill the synopsis with a component name; never copy or execute"),
  "context-menu": rest("Requires the reader's context click; landing layers are pinned specimens."),
  "contour": rest("Text composition; hover-only emphasis would be decorative."),
  "corners": rest("Framing specimen; simulated hover would not explain an outcome."),
  "data-table": play("table", "Sort the local project rows by kind and year"),
  "date-picker": rest("Opening its portalled calendar would move the reader's focus."),
  "dial": play("range", "Set a nearby tempo, volume and year, with the arc answering"),
  "dialog": rest("Opening a modal would take focus and block the documentation."),
  "drawer": rest("A modal drawer would take focus and cover the documentation."),
  "dropdown-menu": rest("Opening the menu would take keyboard focus; landing menus are pinned."),
  "dropzone": play("drop", "A small local SVG arrives and is accepted by both drop zones"),
  "empty": rest("The empty state is the content; its example actions have no outcomes."),
  "field": play("text", "Write Ada and a short project brief"),
  "figure": play("toggle", "Recrop the photograph using its actual ratio controls"),
  "form": play("text", "Write a name and email without submitting"),
  "fraction": play("action", "Complete one, then one more, of the real tally"),
  "gather": rest("Has its own once-on-arrival entrance; replay would require remounting the text."),
  "grid": rest("A static construction grid, without a control."),
  "hover-card": rest("Portalled supporting content needs the reader's intentional hover."),
  "input-group": play("text", "Search for Halden and write a studio email"),
  "input-otp": play("text", "Type the documented valid code, 246810"),
  "item": rest("Linked rows have no safe local state change."),
  "kbd": rest("A key legend, not an input; no artificial key press."),
  "line-chart": play("chart", "Read two months along the line"),
  "link": rest("Navigation belongs to the reader; no fake hover or navigation."),
  "marker": play("action", "Draw the section marks once and let them settle"),
  "marquee": rest("Already has its own approved, pausable drift and reduced-motion behavior."),
  "measure": play("measure", "Narrow the reading measure and restore it"),
  "melody": play("melody", "Sound a phrase with its own arpeggio, then let it rest"),
  "menubar": rest("Menu activation takes focus; the reader should open it deliberately."),
  "message": play("toggle", "Add and remove a real reaction; leave sending to the reader"),
  "meta": rest("Static metadata, without an interaction."),
  "mode-toggle": rest("Would change the reader's saved day/nocturne preference."),
  "navigation-menu": rest("Navigation and its portalled panels belong to the reader."),
  "note": play("note", "An abbreviation unfolds and a correction replaces its word"),
  "number-input": play("number", "Increase each example by its own step, then return"),
  "pagination": rest("Its local paging example moves keyboard focus after each change."),
  "picks": play("choice", "Choose the next paper, ink and format"),
  "pie-chart": play("pie", "Read two named shares of the whole"),
  "popover": rest("Opening a portal can take focus; landing popovers are pinned."),
  "progress": rest("The docs upload owns a random timed loop that cannot hand over immediately; use its Upload control."),
  "questionnaire": play("choice", "Choose a website, then an identity, without submitting"),
  "radar-chart": play("radar", "Measure two real axes"),
  "radial-chart": play("radial", "Read two named rings"),
  "radio-group": play("choice", "One choice leads, the other variations answer"),
  "reading-trail": rest("Tracks the reader's page scroll; autoplay must not move their page."),
  "resizable": play("resize", "Move the divider with its supported keyboard controls"),
  "reverb": rest("Hover-only echoes; no independent state change to demonstrate."),
  "rows": rest("Navigation rows; no fake hover or automatic navigation."),
  "scroll-area": play("scroll", "Read on inside each bounded scroll area, then return"),
  "scrollbar": play("scroll", "Move only the specimen's local scroll containers"),
  "scroll-expand": rest("Docs plates follow page scroll; autoplay must not move the reader's page."),
  "segue": play("action", "Go to the next local scene, then the one after it"),
  "select": play("select", "Choose actual options, then restore the defaults"),
  "sheet": rest("Opening a modal sheet would take focus and cover the page."),
  "sidebar": rest("App navigation and folding would distract from the docs."),
  "skeleton": rest("A loading placeholder already expresses its state."),
  "slider": play("range", "Volume and brightness rise gently, then return"),
  "source": rest("Copying would overwrite the reader's clipboard."),
  "spinner": rest("Already expresses ongoing work through its own motion."),
  "stat": play("select", "Compare the studio's real example years"),
  "steps": play("action", "Advance the brief together, then return"),
  "swapy": play("swapy", "Pick up a row, move it down, and set it down"),
  "switch": play("switch", "A lead switch changes, the others answer, all return"),
  "table": play("table", "Sort the actual project rows by another column"),
  "tabs": play("tabs", "Read the next panel and return to the first"),
  "text-ribbon": rest("Already has its own approved, pausable drift and reduced-motion behavior."),
  "thread": play("action", "Ask for one local update and let the new message arrive"),
  "tiling": play("tiling", "Pick up the first tile, move a column, then set it down"),
  "timer": play("timer", "Start the local clock, read it, then pause"),
  "toast": rest("Would announce and display a page-wide notification outside the example."),
  "toggle": play("toggle", "Pin, keep and mute, with the variations answering one another"),
  "toggle-group": play("toggle", "A format changes; the other choice groups answer"),
  "tooltip": rest("Transient portalled help belongs to the reader's hover or focus."),
  "tour": rest("A tour would take focus and guide the reader away from the example."),
  "tree": play("tree", "Open a folder in each tree, then close it"),
  "typography": rest("A reading specimen, without an interaction."),
  "wake": play("wake", "Draw one smooth passage through the text, then let it close"),
  "waterfall": rest("A typographic specimen; solo hover alone is not a state demo."),
  "word-relay": play("relay", "Read the next word, hold it, then the next"),
}

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

type Lane = { steps: (() => void | Promise<void>)[]; restore?: () => void | Promise<void> }
type Tempo = { moderato: number; andante: number; breath: number; reduced: boolean }
type Conductor = { wait: (ms: number) => Promise<void>; move: (apply: (p: number) => void) => Promise<void>; tempo: Tempo }
const all = <T extends HTMLElement = HTMLElement>(root: HTMLElement, selector: string) => [...root.querySelectorAll<T>(selector)].filter((el) => !el.closest('[inert], [data-perform="off"]') && !el.matches(':disabled, [aria-disabled="true"], [readonly]'))
const key = (el: HTMLElement, value: string) => { el.dispatchEvent(new KeyboardEvent("keydown", { key: value, bubbles: true, cancelable: true })) }
function write(el: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, value: string) {
  const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : el instanceof HTMLSelectElement ? HTMLSelectElement.prototype : HTMLInputElement.prototype
  Object.getOwnPropertyDescriptor(proto, "value")?.set?.call(el, value)
  el.dispatchEvent(new Event("input", { bubbles: true }))
  el.dispatchEvent(new Event("change", { bubbles: true }))
}
function point(el: HTMLElement, entering: boolean) {
  el.dispatchEvent(new PointerEvent(entering ? "pointerover" : "pointerout", { bubbles: true, pointerType: "mouse", relatedTarget: entering ? null : document.body }))
}
function tempo(root: HTMLElement): Tempo {
  const css = getComputedStyle(root)
  const ms = (name: string, fallback: number) => {
    const s = css.getPropertyValue(name).trim(), n = parseFloat(s) * (s.endsWith("ms") ? 1 : 1000)
    // Reduced motion collapses the CSS tokens; reading time must not collapse too.
    return n > 1 ? n : fallback
  }
  const moderato = ms("--db-moderato", 320), andante = ms("--db-andante", 640)
  return { moderato, andante, breath: Math.max(ms("--db-adagio", 1400), 2 * andante), reduced: matchMedia("(prefers-reduced-motion: reduce)").matches }
}

function textFor(el: HTMLInputElement | HTMLTextAreaElement, item: string, i: number) {
  if (item === "input-otp") return "246810"
  if (item === "command" || item === "data-table") return "Halden"
  if (item === "combobox") return el.placeholder.includes("project") ? "Halden" : "Garamond"
  if (item === "command-line") return "button"
  if (el.type === "email") return "ada@studio.com"
  if (el.inputMode === "numeric") return "6"
  if (el.type === "search") return "Halden"
  if (el instanceof HTMLTextAreaElement) return item === "agent-chat" ? "Keep the flag." : "A quieter identity."
  return item === "input-group" ? "Halden" : i % 2 ? "Halden" : "Ada"
}

/** Only real controls and documented state APIs are driven. No navigation, submit, clipboard,
 * global theme change, fake hover styling, or modal focus theft. */
function compose(root: HTMLElement, item: string, c: Conductor): Lane[] {
  const score = DEMO_SCORES[item]
  if (!score?.script) return []
  const clocks = all(root, "[data-demo-clock]")
  if (clocks.length && item !== "tiling") return clocks.map((el) => ({ steps: [1, 2].map((step) => () => { el.dispatchEvent(new CustomEvent("preview-step", { detail: step })) }), restore: () => { el.dispatchEvent(new CustomEvent("preview-step", { detail: 0 })) } }))
  const { script } = score
  if (item === "measure" && all(root, ".db-measure").some((el) => !el.querySelector(".db-measure-lines"))) return []
  if (item === "melody" && all(root, ".db-melody").some((el) => !el.querySelector(".db-melody-note"))) return []
  const click = (el: HTMLElement) => () => { el.click() }
  const grouped = (selector: string, parent: string) => {
    const groups = new Map<Element, HTMLElement[]>()
    for (const el of all(root, selector)) {
      const group = el.closest(parent) ?? el
      groups.set(group, [...(groups.get(group) ?? []), el])
    }
    return [...groups.values()]
  }
  if (script === "text") return all<HTMLInputElement | HTMLTextAreaElement>(root, 'input:not([type=hidden]):not([type=file]):not([type=checkbox]):not([type=radio]):not([type=range]):not([type=number]), textarea:not([readonly])').filter((el) => el.getAttribute("aria-invalid") !== "true").map((el, i) => {
    const initial = el.value, words = textFor(el, item, i).slice(0, el.maxLength > 0 ? el.maxLength : undefined)
    return { steps: [async () => {
      write(el, "")
      for (let n = 1; n <= words.length; n++) { await c.wait(c.tempo.moderato); write(el, words.slice(0, n)) }
    }], restore: () => { write(el, initial); key(el, "Escape") } }
  })
  if (script === "select") return all<HTMLSelectElement>(root, "select").map((el) => {
    const initial = el.value, options = [...el.options].filter((o) => !o.disabled && o.value !== initial)
    return { steps: options.slice(0, 2).map((o) => () => write(el, o.value)), restore: () => write(el, initial) }
  })
  if (script === "number") return all(root, '[data-slot=number-input-control]').map((el) => ({ steps: [() => key(el, "ArrowUp"), () => key(el, "ArrowUp")], restore: () => { key(el, "ArrowDown"); key(el, "ArrowDown") } }))
  if (script === "range") {
    const lanes: Lane[] = all<HTMLInputElement>(root, 'input[type=range], input[type=number], input[role=spinbutton]').map((el) => {
      const initial = el.value, start = +initial, min = el.min ? +el.min : 0, max = el.max ? +el.max : start + 100, step = +el.step || 1
      const distance = el.type === "range" ? Math.max(step, Math.round((max - min) / 5 / step) * step) : step * 2
      const target = Math.max(min, Math.min(max, start + (start + distance <= max ? distance : -distance)))
      return { steps: [() => c.move((p) => write(el, String(Math.round((start + (target - start) * p) / step) * step)))], restore: () => write(el, initial) }
    })
    if (script === "range") lanes.push(...grouped('input[type=radio]', "fieldset").map((els) => {
      const initial = els.find((el) => (el as HTMLInputElement).checked)
      return { steps: els.filter((el) => el !== initial).slice(1, 3).map(click), restore: initial ? click(initial) : undefined }
    }))
    return lanes
  }
  if (script === "check" || script === "choice" || script === "switch" || script === "toggle" || script === "tabs") {
    const selector = script === "check" ? 'input[type=checkbox]' : script === "choice" ? 'input[type=radio]' : script === "switch" ? 'input[type=checkbox], [role=switch]' : script === "tabs" ? '[role=tab]' : '[aria-pressed], .db-toggles [role=radio]'
    return grouped(selector, 'fieldset, [role=tablist], .db-toggles, .db-reactions').map((els) => {
      const selected = (el: HTMLElement) => (el instanceof HTMLInputElement && el.checked) || el.getAttribute("aria-selected") === "true" || el.getAttribute("aria-pressed") === "true" || el.getAttribute("aria-checked") === "true"
      const initial = els.filter(selected)
      const targets = els.filter((el) => !selected(el)).slice(0, 2)
      if (!targets.length) targets.push(els[0])
      const activate = (el: HTMLElement) => () => {
        if (script === "tabs") el.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, button: 0, cancelable: true }))
        el.click()
      }
      return { steps: targets.map(activate), restore: () => {
        if (script === "choice" || script === "tabs") initial.forEach((el) => activate(el)())
        else els.forEach((el) => { if (selected(el) !== initial.includes(el)) el.click() })
      } }
    })
  }
  if (script === "accordion") return all(root, ".db-accordion").map((group) => {
    const ds = all<HTMLDetailsElement>(group, ":scope > details"), initial = ds.map((d) => d.open)
    return { steps: [1, 2].map((n) => () => { ds.forEach((d, i) => { d.open = i === n % ds.length }) }), restore: () => ds.forEach((d, i) => { d.open = initial[i] }) }
  })
  if (script === "details" || script === "tree") return all<HTMLDetailsElement>(root, script === "tree" ? '.db-tree > .db-tree-list > li > details' : "details.db-collapse").map((el) => {
    const initial = el.open
    return { steps: [() => { el.open = !initial }], restore: () => { el.open = initial } }
  })
  if (script === "calendar") return all(root, ".db-month").map((el) => ({ steps: all(el, '.db-month-day:not([aria-pressed=true])').slice(-3, -1).map(click) }))
  if (script === "drop") return all<HTMLInputElement>(root, '.db-drop input[type=file]').map((el) => ({ steps: [() => {
    const data = new DataTransfer()
    data.items.add(new File(['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 40"><text y="30">Halden</text></svg>'], "Halden mark.svg", { type: "image/svg+xml", lastModified: 0 }))
    el.files = data.files
    el.dispatchEvent(new Event("change", { bubbles: true }))
  }] }))
  if (["chart", "radial", "pie", "radar"].includes(script)) {
    const selector = script === "chart" ? ".db-chart" : script === "radial" ? ".db-radial" : script === "pie" ? ".db-pie" : ".db-radar"
    const targets = script === "chart" ? '[data-slot=chart-bar]' : script === "radial" ? ".db-radial-key button" : script === "pie" ? ".db-pie-key button" : ".db-radar-axis"
    return all(root, selector).map((el) => {
      const picks = all(el, targets), take = [picks[1] ?? picks[0], picks[Math.min(3, picks.length - 1)]].filter(Boolean)
      return { steps: take.map((t) => () => point(t, true)), restore: () => take.forEach((t) => point(t, false)) }
    })
  }
  if (script === "resize" || script === "measure") return all(root, script === "resize" ? ".db-resize-handle" : ".db-measure:has(.db-measure-lines) .db-measure-handle").map((el) => ({ steps: [() => key(el, "ArrowLeft"), () => key(el, "ArrowLeft")], restore: () => { key(el, "ArrowRight"); key(el, "ArrowRight") } }))
  if (script === "scroll") return all(root, script === "scroll" && item === "scroll-area" ? ".db-scroll" : '[role=region]').filter((el) => el.scrollHeight > el.clientHeight + 4 || el.scrollWidth > el.clientWidth + 4).map((el) => {
    const top = el.scrollTop, left = el.scrollLeft
    return { steps: [() => c.move((p) => el.scrollTo({ top: top + Math.min(el.clientHeight * 0.65, el.scrollHeight - el.clientHeight) * p, left: left + Math.min(el.clientWidth * 0.5, el.scrollWidth - el.clientWidth) * p, behavior: "instant" }))], restore: () => { const y = el.scrollTop, x = el.scrollLeft; return c.move((p) => el.scrollTo({ top: y + (top - y) * p, left: x + (left - x) * p, behavior: "instant" })) } }
  })
  if (script === "carousel") return all(root, ".db-carousel").map((el) => {
    if (el.dataset.variant === "shelf") return { steps: [() => el.querySelector<HTMLButtonElement>('[data-slot=carousel-next]')?.click()], restore: () => el.querySelector<HTMLButtonElement>('[data-slot=carousel-previous]')?.click() }
    const track = el.querySelector<HTMLElement>(".db-carousel-track")!, initial = track.scrollLeft
    const travel = async (to: number) => {
      const from = track.scrollLeft, snap = track.style.scrollSnapType
      track.style.scrollSnapType = "none"
      try { await c.move((p) => track.scrollTo({ left: from + (to - from) * p, behavior: "instant" })) }
      finally { track.style.scrollSnapType = snap }
    }
    return { steps: [() => {
      const next = track.children[1] as HTMLElement | undefined
      if (!next) return
      const side = getComputedStyle(track).direction === "rtl" ? "right" : "left"
      const scale = track.getBoundingClientRect().width / track.offsetWidth
      return travel(track.scrollLeft + (next.getBoundingClientRect()[side] - track.getBoundingClientRect()[side]) / scale)
    }], restore: () => travel(initial) }
  })
  if (script === "note") return all(root, '.db-note[data-variant=expand], .db-note[data-variant=revise]').map((el) => ({ steps: [click(el)], restore: () => key(el, "Escape") }))
  if (script === "table") return all(root, "table").map((el) => ({ steps: all(el, "th button").slice(1, 3).map(click) }))
  if (script === "swapy" || script === "tiling") return all(root, script === "swapy" ? ".db-swap" : ".db-tiling-editor").slice(0, clocks.length ? 1 : undefined).map((el) => {
    const handle = el.querySelector<HTMLElement>(script === "swapy" ? ".db-swap-move" : '.db-tile[tabindex]')
    return { steps: handle ? [() => { if (script === "swapy") handle.click(); else key(handle, " ") }, () => key(handle, script === "swapy" ? "ArrowDown" : "ArrowRight"), () => { if (script === "swapy") handle.click(); else key(handle, " ") }] : [] }
  })
  if (script === "relay") return all(root, ".db-relay").map((el) => ({ steps: [() => key(el, "ArrowRight"), () => key(el, "ArrowRight")], restore: () => key(el, "Home") }))
  if (script === "melody") return all(root, ".db-melody").filter((el) => el.querySelector(".db-melody-note")).map((el) => ({ steps: [() => key(el, "Enter"), () => key(el, "Home")] }))
  if (script === "wake") return all(root, ".db-wake").map((el) => ({ steps: [() => c.move((p) => {
    const b = el.getBoundingClientRect()
    el.dispatchEvent(new PointerEvent("pointermove", { clientX: b.left + b.width * (0.3 + p * 0.35), clientY: b.top + b.height * 0.45, pointerType: "mouse" }))
  })], restore: () => { el.dispatchEvent(new PointerEvent("pointerleave", { pointerType: "mouse" })) } }))
  if (script === "timer") return all(root, ".db-timer").map((el) => ({ steps: [() => all(el, "button").find((b) => b.textContent?.trim() === "Start")?.click(), () => all(el, "button").find((b) => b.textContent?.trim() === "Pause")?.click()], restore: () => all(el, "button").find((b) => b.textContent?.trim() === "Pause")?.click() }))
  if (script === "action") {
    const actions: Record<string, RegExp> = { "agent-state": /^Next state$/, "attachment": /^Send the next part$/, "fraction": /^Do one$/, "marker": /^Draw them again$/, "segue": /^Next scene$/, "steps": /^Next step$/, "thread": /^Ask Ada for an update$/ }
    const pattern = actions[item]
    return pattern ? all(root, "button").filter((el) => pattern.test(el.textContent?.trim() ?? "")).map((el) => ({ steps: Array.from({ length: ["marker", "thread"].includes(item) ? 1 : 2 }, () => click(el)) })) : []
  }
  return []
}

export type DemoState = "waiting" | "playing" | "finished" | "stopped" | "static"

/** Owns discovery, load/idle gating, choreography, cancellation, and the two performances.
 * Reset is the host's keyed example remount: React remains the owner of every real default. */
export function useDemoPlayer({ root, host = root, item, identity = item, reset }: { root: React.RefObject<HTMLElement | null>; host?: React.RefObject<HTMLElement | null>; item: string; identity?: string; reset: () => void }) {
  const [state, setState] = React.useState<DemoState>("waiting")
  const [interactive, setInteractive] = React.useState(false)
  const control = React.useRef<() => void>(() => {})
  const resetRef = React.useRef(reset)
  React.useLayoutEffect(() => { resetRef.current = reset }, [reset])
  React.useEffect(() => {
    const el = root.current, surface = host.current
    if (!el || !surface) return
    const motion = matchMedia("(prefers-reduced-motion: reduce)")
    let disposed = false, ready = false, visible = false, touched = false, started = false, available = false
    let run: AbortController | null = null, idle = 0, deferred = 0
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
      const t = tempo(el)
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
      run?.abort(); run = null
      if (handover) { touched = true; started = true; release() }
      // Remove synthetic pointer presence; preserve the value the person is taking over.
      if (DEMO_SCORES[item]?.script === "wake" || DEMO_SCORES[item]?.script === "timer") lanes.forEach((l) => l.restore && invoke(l.restore))
      lanes = []
      if (started) publish("stopped")
    }
    const quiet = () => { if (item === "word-relay") all(el, ".db-relay-pause").filter((b) => b.textContent?.trim() === "pause").forEach((b) => invoke(() => b.click())) }
    const remount = () => { driving = true; try { flushSync(() => resetRef.current()); quiet(); stabilize() } finally { driving = false } }
    const start = async (replay = false) => {
      if (disposed || !available || (!replay && (!ready || !visible || touched || started || motion.matches))) return
      cancel(false)
      started = true
      const current = new AbortController()
      run = current
      const signal = current.signal, c = conductor(signal)
      try {
        if (replay) { remount(); await c.wait(c.tempo.moderato) }
        stabilize()
        publish("playing")
        for (let cycle = 0; cycle < 2; cycle++) {
          el.dataset.demoCycle = String(cycle + 1)
          lanes = compose(el, item, c).filter((l) => l.steps.length)
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
        }
        run = null; lanes = []
        publish("finished")
      } catch (error) {
        if (!signal.aborted) { cancel(false); publish("stopped"); console.error("Demo could not finish", item, error) }
      }
    }
    control.current = () => { touched = false; void start(true) }
    const discover = () => {
      quiet()
      const found = compose(el, item, conductor(new AbortController().signal)).some((l) => l.steps.length)
      if (found !== available) { available = found; setInteractive(found) }
      if (!DEMO_SCORES[item]?.script) publish("static")
      if (found) void start()
    }
    const hands = (event: Event) => {
      if (event.isTrusted && !driving) cancel(true)
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
      else void start()
    }, { threshold: 0 })
    view.observe(surface)
    const changes = new MutationObserver(() => { if (!started) discover() })
    changes.observe(el, { childList: true, subtree: true })
    const afterLoad = () => {
      const next = () => { if (!disposed) { ready = true; discover() } }
      if (typeof window.requestIdleCallback === "function") idle = window.requestIdleCallback(next, { timeout: 1400 })
      else deferred = window.setTimeout(next, tempo(el).moderato)
    }
    // Discovery is cheap and does not act. Playback waits for load + idle + intersection.
    deferred = window.setTimeout(discover, 0)
    if (document.readyState === "complete") afterLoad()
    else window.addEventListener("load", afterLoad, { once: true })
    return () => {
      disposed = true; run?.abort(); release(); control.current = () => {}
      changes.disconnect(); view.disconnect(); clearTimeout(deferred)
      if (idle) window.cancelIdleCallback(idle)
      window.removeEventListener("load", afterLoad)
      events.forEach((e) => surface.removeEventListener(e, hands, true))
      document.removeEventListener("visibilitychange", away)
      motion.removeEventListener("change", changed)
      delete el.dataset.demoState; delete el.dataset.demoCycle
    }
  }, [root, host, item, identity])
  return { state, interactive, replay: () => control.current() }
}
