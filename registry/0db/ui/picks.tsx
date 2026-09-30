"use client"

import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"

type Variant = "pizzicato" | "rubric" | "watermark" | "register"
type PicksContextValue = { name: string; value: string | undefined; select: (value: string) => void }

const PicksContext = React.createContext<PicksContextValue | null>(null)

type PicksProps = Omit<React.ComponentProps<"fieldset">, "defaultValue" | "onChange"> & {
  /** How the choice is marked. pizzicato: a dot in the margin that slides to the pick and plucks a string; rubric: the chosen title's initial hangs in the margin two lines deep, in the italic and the accent; watermark: the chosen title lies huge and faint behind the list; register: two registration crosses mark the chosen pick's corners and turn as they travel. */
  variant?: Variant
  /** Shared by every radio, so a form submits the choice. Defaults to a generated name. */
  name?: string
  /** The small label over the list. Without one, give the group an aria-label. */
  legend?: React.ReactNode
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
}

/**
 * A list of choices that carry their own content. The chosen title turns italic, because it's yours now.
 * Pizzicato hangs one accent dot beside it; choosing another slides the dot along a string that rings and falls silent.
 * Rubric hangs the chosen title's initial in the margin, two lines deep, like a rubricated capital.
 * Watermark lays the chosen title behind the list, huge and faint, as a sheet shows its mark held to the light.
 * Register marks the chosen pick's two far corners with the printer's registration crosses.
 */
function Picks({ variant = "pizzicato", name, legend, value: controlled, defaultValue, onValueChange, className, children, ...props }: PicksProps) {
  const generated = React.useId()
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue)
  const value = controlled ?? uncontrolled
  const box = React.useRef<HTMLFieldSetElement>(null)
  const was = React.useRef(value)
  const turn = React.useRef(0) // register: quarter turns the crosses have made
  const plucked = variant === "pizzicato"
  const measured = plucked || variant === "register"

  const select = React.useCallback(
    (next: string) => {
      if (controlled === undefined) setUncontrolled(next)
      onValueChange?.(next)
    },
    [controlled, onValueChange],
  )
  const ctx = React.useMemo(() => ({ name: name ?? generated, value, select }), [name, generated, value, select])

  // The string runs the length of the picks; the dot hangs where the chosen pick's ring would (its ::before sets the height).
  const place = React.useCallback(() => {
    const el = box.current
    const picks = el ? [...el.querySelectorAll<HTMLElement>(":scope > label")] : []
    if (el && variant === "register") return register(el, picks, turn)
    const string = el?.querySelector<HTMLElement>(":scope > .db-picks-string")
    if (!el || !string || !picks.length) return
    // A fieldset starts its positioned children below the legend and offsetTop can't be trusted inside one, so measure
    // everything from where the string's own top: 0 would be (the string has no transform, unlike the dot).
    el.setAttribute("data-placed", "")
    const origin = string.getBoundingClientRect().top - (parseFloat(getComputedStyle(string).top) || 0)
    const at = (l: HTMLElement) => l.getBoundingClientRect().top - origin
    const first = at(picks[0])
    const last = picks[picks.length - 1]
    el.style.setProperty("--db-picks-top", `${first}px`)
    el.style.setProperty("--db-picks-len", `${at(last) + last.offsetHeight - first}px`)
    const chosen = picks.find((l) => l.querySelector("input:checked"))
    if (chosen) el.style.setProperty("--db-picks-y", `${at(chosen) + (parseFloat(getComputedStyle(chosen, "::before").top) || 0)}px`)
  }, [variant])

  React.useLayoutEffect(() => {
    const el = box.current
    const from = was.current
    was.current = value
    if (!el || !measured) return
    // The dot glides only from an earlier choice; a first choice is plucked where it lands.
    if (from !== undefined && from !== value) el.setAttribute("data-ready", "")
    place()
    if (from === value || value === undefined || !plucked) return
    // Restart the pluck: the CSS animation runs again only if the attribute comes back after a style flush.
    el.removeAttribute("data-plucked")
    void el.offsetWidth
    el.setAttribute("data-plucked", "")
  }, [value, plucked, measured, place])

  // Picks re-flow on resize and when the fonts arrive; the dot and the string follow.
  // ponytail: watches the picks present at mount; add a MutationObserver if picks come and go.
  React.useEffect(() => {
    const el = box.current
    if (!el || !measured) return
    // A re-flow moves the marks without travel.
    const settle = () => {
      el.setAttribute("data-still", "")
      place()
      void el.offsetWidth
      el.removeAttribute("data-still")
    }
    const ro = new ResizeObserver(settle)
    ro.observe(el)
    el.querySelectorAll(":scope > label").forEach((l) => ro.observe(l))
    document.fonts?.ready.then(settle)
    return () => ro.disconnect()
  }, [measured, place])

  return (
    <PicksContext.Provider value={ctx}>
      <fieldset ref={box} data-slot="picks" data-variant={variant} className={cn("db-picks", className)} {...props}>
        {legend ? <legend className="db-label">{legend}</legend> : null}
        {children}
        {plucked ? (
          <>
            <span data-slot="picks-string" className="db-picks-string" aria-hidden="true" />
            <span data-slot="picks-dot" className="db-picks-dot" aria-hidden="true" />
          </>
        ) : null}
        {variant === "register" ? (
          <>
            <span className="db-picks-origin" aria-hidden="true" />
            <span data-slot="picks-cross" className="db-picks-cross" data-corner="start" aria-hidden="true" />
            <span data-slot="picks-cross" className="db-picks-cross" data-corner="end" aria-hidden="true" />
          </>
        ) : null}
      </fieldset>
    </PicksContext.Provider>
  )
}

// Register: a cross stands off each of the chosen pick's two far corners (the top of its start side, the foot of its end
// side), by --db-picks-out. Physical px from the origin, a zero box at the fieldset's top left, so direction only
// decides which corners. Each move turns the crosses a quarter, the way the pick went.
function register(el: HTMLElement, picks: HTMLElement[], turn: React.RefObject<number>) {
  const chosen = picks.find((l) => l.querySelector("input:checked"))
  const origin = el.querySelector(":scope > .db-picks-origin")?.getBoundingClientRect()
  if (!chosen || !origin) return
  el.setAttribute("data-placed", "")
  const k = el.getBoundingClientRect().width / (el.offsetWidth || 1) || 1 // a zoomed preview
  const r = chosen.getBoundingClientRect()
  const out = parseFloat(getComputedStyle(el).getPropertyValue("--db-picks-out")) || 12
  const rtl = getComputedStyle(chosen).direction === "rtl"
  const [left, right] = [(r.left - origin.left) / k - out, (r.right - origin.left) / k + out]
  const [top, foot] = [(r.top - origin.top) / k - out, (r.bottom - origin.top) / k + out]
  const was = parseFloat(el.style.getPropertyValue("--db-picks-y0"))
  if (el.hasAttribute("data-ready") && !el.hasAttribute("data-still") && Number.isFinite(was) && Math.abs(top - was) > 1) turn.current += top > was ? 90 : -90
  const set = (p: string, v: number, u = "px") => el.style.setProperty(`--db-picks-${p}`, `${v}${u}`)
  set("x0", rtl ? right : left)
  set("y0", top)
  set("x1", rtl ? left : right)
  set("y1", foot)
  set("turn", turn.current, "deg")
}

type PickProps = Omit<React.ComponentProps<"input">, "type" | "name" | "checked" | "defaultChecked" | "value" | "children"> & {
  value: string
  /** Anything: a PickTitle and a PickDescription, a swatch, a specimen. Plain text is taken as the title. */
  children: React.ReactNode
  /** Classes for the label, which is the root. className goes to the input. */
  labelClassName?: string
  /** Pins a state for documentation ("hover", "focus"); set on the root. */
  "data-force"?: string
}

function Pick({ value, children, className, labelClassName, "data-force": force, onChange, ...props }: PickProps) {
  const group = React.useContext(PicksContext)
  if (!group) throw new Error("Pick must sit inside <Picks>.")
  return (
    <label data-slot="pick" data-force={force} className={labelClassName}>
      <input
        type="radio"
        name={group.name}
        value={value}
        checked={group.value === value}
        className={className}
        onChange={(e) => {
          onChange?.(e)
          group.select(value)
        }}
        {...props}
      />
      {typeof children === "string" ? <PickTitle>{children}</PickTitle> : children}
    </label>
  )
}

type PickTitleProps = React.ComponentProps<"span"> & {
  /** The pick's name. Plain text turns italic when chosen, and its initial is the one rubric hangs (a name without capitals gets a pilcrow instead). */
  children: React.ReactNode
}

/** The pick's name. Set in the voice; the chosen one crosses into the italic. */
function PickTitle({ className, children, ...props }: PickTitleProps) {
  if (typeof children !== "string") {
    return <span data-slot="pick-title" className={cn("db-pick-title", className)} {...props}>{children}</span>
  }
  // The first letter (a whole grapheme) is its own span so rubric can hang it, and the rest its own so it can turn
  // italic beside it. data-initial feeds the ghost that holds the letter's place. Readers get the name whole.
  const first = new Intl.Segmenter().segment(children)[Symbol.iterator]().next().value?.segment ?? ""
  // A script without capitals (Arabic, Hebrew, Devanagari, Han), or a name that opens on a figure or a mark, has no
  // initial to hang, and lifting one out would break a joined word. Rubric paints the rubricator's other mark there,
  // the pilcrow, and leaves the name whole.
  if (first.toLocaleUpperCase() === first.toLocaleLowerCase()) {
    return (
      <span data-slot="pick-title" data-text={children} data-caseless="" className={cn("db-pick-title", className)} {...props}>
        <span aria-hidden="true" data-initial="">
          <span className="db-pick-initial" data-text={"\u00b6"}>
            <span />
          </span>
          <span className="db-pick-rest" data-text={children}>
            <span>{children}</span>
          </span>
        </span>
        <span className="db-sr">{children}</span>
      </span>
    )
  }
  const rest = children.slice(first.length)
  return (
    <span data-slot="pick-title" data-text={children} className={cn("db-pick-title", className)} {...props}>
      <span aria-hidden="true" data-initial={first}>
        <span className="db-pick-initial" data-text={first}><span>{first}</span></span>
        <span className="db-pick-rest" data-text={rest}><span>{rest}</span></span>
      </span>
      <span className="db-sr">{children}</span>
    </span>
  )
}

/** A line under the title, in the pencil. */
function PickDescription({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="pick-description" className={cn("db-pick-description", className)} {...props} />
}

export { Picks, Pick, PickTitle, PickDescription, type PicksProps, type PickProps, type PickTitleProps }
