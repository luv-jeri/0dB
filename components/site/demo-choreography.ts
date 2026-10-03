import { DEMO_SCORES } from "@/components/site/demo-scores"

export type Lane = { steps: (() => void | Promise<void>)[]; restore?: () => void | Promise<void> }
type Tempo = { moderato: number; andante: number; breath: number; reduced: boolean }
export type Conductor = { wait: (ms: number) => Promise<void>; move: (apply: (p: number) => void) => Promise<void>; tempo: Tempo }
export const all = <T extends HTMLElement = HTMLElement>(root: HTMLElement, selector: string) => [...root.querySelectorAll<T>(selector)].filter((el) => !el.closest('[inert], [data-perform="off"]') && !el.matches(':disabled, [aria-disabled="true"], [readonly]'))
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
export function tempo(root: HTMLElement): Tempo {
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
export function compose(root: HTMLElement, item: string, c: Conductor): Lane[] {
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
  if (script === "proof") return all(root, "[data-slot=text-diff]").map((el) => {
    const buttons = all<HTMLButtonElement>(el, "[data-slot=text-diff-views] > button")
    const initial = buttons.find((button) => button.getAttribute("aria-pressed") === "true")
    return { steps: buttons.slice(1).map(click), restore: initial ? click(initial) : undefined }
  })
  if (script === "find") return all<HTMLInputElement>(root, "[data-slot=text-search-input]").map((el) => {
    const initial = el.value
    return { steps: [() => write(el, "space"), () => write(el, "word")], restore: () => write(el, initial) }
  })
  if (script === "interval") return all<HTMLInputElement>(root, "[data-slot=time-range-end]").map((el) => {
    const initial = el.value
    const minutes = Number(initial.slice(0, 2)) * 60 + Number(initial.slice(3)) + 15
    const next = `${String(Math.floor(minutes / 60) % 24).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`
    return { steps: [() => write(el, next)], restore: () => write(el, initial) }
  })
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

