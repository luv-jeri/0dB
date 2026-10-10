"use client"

import * as React from "react"

import { useComposedRefs } from "@/registry/0nlytype/lib/refs"
import { cn } from "@/registry/0nlytype/lib/utils"
import { Badge } from "@/registry/0nlytype/ui/badge"
import { Command, CommandEmpty, CommandHint, CommandInput, CommandItem, CommandList } from "@/registry/0nlytype/ui/command"
import { Field, useFieldControl, useLineOrigin } from "@/registry/0nlytype/ui/field"
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from "@/registry/0nlytype/ui/popover"

type ComboboxOption = { value: string; label: string; hint?: string }

type ComboboxOptions = {
  /** Labels should be unique: they are what the list is matched and marked on. */
  options: ComboboxOption[]
  /** Set above the line. Left out, label it with a Field, or with aria-label. */
  label?: string
  /** What the closed line says before anything is chosen. */
  placeholder?: string
  /** Shown when nothing matches. Name something to try. */
  empty?: string
  /** Pins a state for documentation ("hover", "focus"); set on the trigger. */
  "data-force"?: string
}

type ComboboxBase = Omit<React.ComponentProps<"button">, "value" | "defaultValue" | "onChange" | "type"> & ComboboxOptions

type ComboboxOne = ComboboxBase & {
  multiple?: false
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  /**
   * list (default): a line that opens a list; what you type is marked in each match.
   * concordance: the matches hang from what you typed, lined up on it, as a concordance sets a word.
   * pencil: you type on the line itself, and the rest of the best match is pencilled in after the caret.
   */
  variant?: "list" | "concordance"
}

type ComboboxPencilProps = Omit<React.ComponentProps<"input">, "value" | "defaultValue" | "type"> & ComboboxOptions & {
  multiple?: false
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  variant: "pencil"
}

type ComboboxMany = ComboboxBase & {
  /**
   * Any number of choices. They are written on the line as one sentence in your italic ("Didot, Futura and Univers"),
   * each struck and taken out by pressing it; the list stays open while you choose, and a chosen row turns italic.
   */
  multiple: true
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  /** With `name`, each chosen value is sent with the form as its own entry. */
  name?: string
  variant?: "list" | "concordance"
}

type ComboboxProps = ComboboxOne | ComboboxMany | ComboboxPencilProps

/** A tempo token in milliseconds: the tokens are written in seconds or milliseconds. */
const ms = (v: string, fallback: number) => (v.trim().endsWith("ms") ? parseFloat(v) : parseFloat(v) * 1000) || fallback
const still = () => typeof matchMedia === "undefined" || matchMedia("(prefers-reduced-motion: reduce)").matches

/**
 * A field that suggests. Open it, type, and the letters you typed are marked in each match.
 * The chosen label is yours, so it sits on the line in italic. Enter, Space or the down arrow
 * opens the list; Enter picks; Escape closes it and puts focus back on the line.
 */
function Combobox(props: ComboboxProps) {
  const inField = Boolean(useFieldControl().id)
  const { label, id } = props
  // On its own, a label brings its own Field so the line, the label and the hint wire up the same way.
  const own = Boolean(label && !inField)
  const control = { ...props, id: own ? undefined : id }
  const node = control.variant === "pencil" ? <ComboboxPencil {...control} /> : <ComboboxControl {...control} />
  return own ? (
    <Field label={label} id={id} className="db-combo-field">
      {node}
    </Field>
  ) : (
    node
  )
}

/** Where the query first sits in a label: the words before it, the match, and the words after. */
function split(label: string, query: string) {
  const q = query.trim()
  const i = q ? label.toLowerCase().indexOf(q.toLowerCase()) : -1
  return i < 0 ? ["", "", label] : [label.slice(0, i), label.slice(i, i + q.length), label.slice(i + q.length)]
}

function ComboboxControl({
  options,
  value: valueProp,
  defaultValue,
  onValueChange,
  multiple,
  variant,
  label,
  placeholder = multiple ? "Choose any" : "Choose one",
  empty = "Nothing matches. Try part of a name.",
  className,
  id,
  onKeyDown,
  name,
  ...props
}: ComboboxOne | ComboboxMany) {
  const field = useFieldControl()
  const [open, setOpen] = React.useState(false)
  const listId = React.useId()
  const [own, setOwn] = React.useState<string | string[] | undefined>(defaultValue)
  const value = valueProp ?? own
  // Single or many, the choices are one list here: what's chosen, in the order it was chosen.
  const picked = multiple ? ((value as string[] | undefined) ?? []) : value ? [value as string] : []
  const chosen = multiple ? undefined : options.find((o) => o.value === value)
  const concordance = variant === "concordance"
  const [query, setQuery] = React.useState("")
  const list = React.useRef<HTMLDivElement>(null)
  const was = React.useRef<Map<string, number> | null>(null)

  const set = (next: string | string[]) => {
    if (valueProp === undefined) setOwn(next)
    ;(onValueChange as ((v: string | string[]) => void) | undefined)?.(next)
  }
  const pick = (next: string) => {
    if (!multiple) {
      set(next)
      return setOpen(false)
    }
    // Many: the row toggles and the list stays open for the next.
    set(picked.includes(next) ? picked.filter((v) => v !== next) : [...picked, next])
  }

  // The concordance's glide: each row's words were somewhere before the query changed; they slide to the new axis.
  const starts = () => new Map(Array.from(list.current?.querySelectorAll<HTMLElement>("[cmdk-item]") ?? [], (row) => [row.dataset.value ?? "", row.querySelector(".db-combo-pre > span")?.getBoundingClientRect().left ?? 0]))
  React.useLayoutEffect(() => {
    const before = was.current
    was.current = null
    if (!before || !list.current || still()) return
    const css = getComputedStyle(list.current)
    const now = starts()
    list.current.querySelectorAll<HTMLElement>("[cmdk-item]").forEach((row) => {
      const from = before.get(row.dataset.value ?? "")
      const to = now.get(row.dataset.value ?? "")
      if (from === undefined || to === undefined || Math.abs(from - to) < 0.5) return
      row.animate([{ translate: `${from - to}px 0` }, { translate: "0 0" }], { duration: ms(css.getPropertyValue("--db-moderato"), 320), easing: css.getPropertyValue("--db-breath").trim() || "ease" })
    })
  }, [query])

  const button = (
    <PopoverTrigger asChild>
      <button
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        data-slot="combobox"
        data-placeholder={picked.length ? undefined : ""}
        className={cn("db-combo", !multiple && className)}
        name={multiple ? undefined : name}
        {...props}
        id={id ?? field.id}
        aria-label={props["aria-label"]}
        aria-invalid={props["aria-invalid"] ?? field["aria-invalid"]}
        aria-describedby={props["aria-describedby"] ?? field["aria-describedby"]}
        onKeyDown={(e) => {
          onKeyDown?.(e)
          if (e.key === "ArrowDown" && !e.defaultPrevented) {
            e.preventDefault()
            setOpen(true)
          }
        }}
      >
        <span data-slot="combobox-value" className="db-combo-value">
          {multiple ? picked.length ? <span className="db-sr">{picked.length} chosen</span> : placeholder : (chosen?.label ?? placeholder)}
        </span>
      </button>
    </PopoverTrigger>
  )

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) setQuery("")
      }}
    >
      {multiple ? (
        // The line holds the sentence of what you chose, then the rest of the line opens the list. The words are
        // series tags, siblings of the trigger, so taking out the last one hands focus on to it.
        <PopoverAnchor asChild>
          <div data-slot="combobox-line" className={cn("db-combo-many", className)} data-disabled={props.disabled || undefined}>
            {picked.map((v) => (
              <Badge
                key={v}
                variant="series"
                onRemove={props.disabled ? undefined : () => set(picked.filter((x) => x !== v))}
              >
                {options.find((o) => o.value === v)?.label ?? v}
              </Badge>
            ))}
            {button}
            {name ? picked.map((v) => <input key={v} type="hidden" name={name} value={v} disabled={props.disabled} />) : null}
          </div>
        </PopoverAnchor>
      ) : (
        button
      )}
      <PopoverContent
        data-slot="combobox-content"
        data-variant={concordance ? "concordance" : undefined}
        data-multiple={multiple ? "" : undefined}
        className="db-combo-pop"
        aria-label={label ?? placeholder}
      >
        <Command id={listId} loop label={label ?? placeholder} defaultValue={chosen?.label}>
          <CommandInput
            placeholder="Type to narrow the list"
            onValueChange={(next) => {
              if (concordance) was.current = starts()
              setQuery(next)
            }}
          />
          <CommandList ref={list} data-slot="combobox-list" aria-multiselectable={multiple || undefined}>
            <CommandEmpty>{empty}</CommandEmpty>
            {options.map((o) => {
              const [pre, hit, post] = split(o.label, query)
              const on = picked.includes(o.value)
              return (
                <CommandItem key={o.value} value={o.label} keywords={o.hint ? [o.hint] : undefined} data-chosen={on ? "" : undefined} aria-checked={multiple ? on : undefined} onSelect={() => pick(o.value)}>
                  {concordance ? (
                    <>
                      <span className="db-combo-pre">
                        <span>{pre}</span>
                      </span>
                      <span className="db-combo-hit">{hit ? <mark>{hit}</mark> : null}</span>
                      <span className="db-combo-post">
                        {post}
                        {o.hint ? <CommandHint>{o.hint}</CommandHint> : null}
                      </span>
                    </>
                  ) : (
                    o.label
                  )}
                  {!concordance && o.hint ? <CommandHint>{o.hint}</CommandHint> : null}
                </CommandItem>
              )
            })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

/** The highlighter over what you typed, as the list's rows mark it. */
function Marked({ text, query }: { text: string; query: string }) {
  const [pre, hit, post] = split(text, query)
  return (
    <span className="db-combo-name">
      {pre}
      {hit ? <mark>{hit}</mark> : null}
      {post}
    </span>
  )
}

const SHOWN = 5 // ponytail: the pencil lists the first five matches, so it never scrolls; typing narrows the rest.

/**
 * The pencil: an input on the line itself. The best match's remaining letters are pencilled in after the caret,
 * in our roman; Tab or the right arrow (at the end) takes them and they ink into your italic. Up and Down move
 * through the few matches below the line, Enter picks one, Escape puts the line back.
 */
function ComboboxPencil({ options, value: valueProp, defaultValue, onValueChange, label, placeholder = "Start typing", empty = "Nothing matches. Try part of a name.", className, id, disabled, readOnly, dir = "auto", "aria-label": named, "data-force": force, ref, onFocus, onPointerDown, onChange, onClick, onKeyDown, onBlur, variant, multiple, ...props }: ComboboxPencilProps) {
  void variant
  void multiple
  const field = useFieldControl()
  const listId = React.useId()
  const input = React.useRef<HTMLInputElement>(null)
  const composedRef = useComposedRefs(input, ref)
  const [own, setOwn] = React.useState(defaultValue)
  const value = valueProp ?? own
  const chosen = options.find((o) => o.value === value)
  const [text, setText] = React.useState(chosen?.label ?? "")
  const [open, setOpen] = React.useState(false)
  const [at, setAt] = React.useState(0)
  // A controlled value that changes from outside rewrites the line (unless you're typing on it).
  const [seen, setSeen] = React.useState(chosen?.label)
  if (seen !== chosen?.label) {
    setSeen(chosen?.label)
    if (!open) setText(chosen?.label ?? "")
  }

  const q = text.trim().toLowerCase()
  const found = q ? options.filter((o) => o.label.toLowerCase().includes(q) || o.hint?.toLowerCase().includes(q)) : options
  // Rows that begin with what you typed come first: they are the ones the pencil can finish.
  const shown = [...found.filter((o) => o.label.toLowerCase().startsWith(q)), ...found.filter((o) => !o.label.toLowerCase().startsWith(q))].slice(0, SHOWN)
  const active = open ? shown[Math.min(at, shown.length - 1)] : undefined
  const rest = active && text && active.label.toLowerCase().startsWith(text.toLowerCase()) ? active.label.slice(text.length) : ""
  const origin = useLineOrigin<HTMLInputElement>((el) => el, { onFocus, onPointerDown })

  const choose = (o: ComboboxOption) => {
    if (disabled || readOnly) return
    if (valueProp === undefined) setOwn(o.value)
    onValueChange?.(o.value)
    setText(o.label)
    setOpen(false)
    // What was pencil is now yours: the word inks in.
    const el = input.current
    if (el && !still()) {
      const css = getComputedStyle(el)
      el.animate([{ color: css.getPropertyValue("--db-pencil").trim() }, { color: css.color }], { duration: ms(css.getPropertyValue("--db-moderato"), 320), easing: css.getPropertyValue("--db-exhale").trim() || "ease-out" })
    }
  }

  const key = (e: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(e)
    if (e.defaultPrevented || readOnly) return
    const atEnd = e.currentTarget.selectionStart === text.length
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault()
      if (!open) return setOpen(true)
      const n = shown.length || 1
      setAt((i) => (Math.min(i, n - 1) + (e.key === "ArrowDown" ? 1 : n - 1)) % n)
    } else if (e.key === "Enter" && active) {
      e.preventDefault()
      choose(active)
    } else if ((e.key === "Tab" && !e.shiftKey) || (e.key === (getComputedStyle(e.currentTarget).direction === "rtl" ? "ArrowLeft" : "ArrowRight") && atEnd)) {
      if (!rest || !active) return
      e.preventDefault()
      choose(active)
    } else if (e.key === "Escape" && open) {
      e.preventDefault()
      setOpen(false)
      setText(chosen?.label ?? "")
    }
  }

  return (
    <div data-slot="combobox" data-variant="pencil" data-force={force} className={cn("db-combo-pencil", className)}>
      <span className="db-combo-line">
        <input
          {...props}
          ref={composedRef}
          type="text"
          dir={dir} // the line and its pencil copy both take the direction of what's typed, so they stay in register
          role="combobox"
          autoComplete={props.autoComplete ?? "off"}
          spellCheck={props.spellCheck ?? false}
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={listId}
          aria-activedescendant={active ? `${listId}-${shown.indexOf(active)}` : undefined}
          aria-label={named ?? (label && !field.id ? label : undefined)}
          aria-invalid={props["aria-invalid"] ?? field["aria-invalid"]}
          aria-describedby={props["aria-describedby"] ?? field["aria-describedby"]}
          id={id ?? field.id}
          disabled={disabled}
          readOnly={readOnly}
          placeholder={placeholder}
          value={text}
          className="db-input"
          onChange={(e) => {
            onChange?.(e)
            if (e.defaultPrevented) return
            setText(e.target.value)
            setOpen(true)
            setAt(0)
          }}
          onClick={(e) => {
            onClick?.(e)
            if (!e.defaultPrevented && !readOnly) setOpen(true)
          }}
          onKeyDown={key}
          onBlur={(e) => {
            onBlur?.(e)
            if (e.defaultPrevented) return
            setOpen(false)
            const exact = options.find((o) => o.label.toLowerCase() === q)
            if (exact && exact.value !== value) choose(exact)
            else setText(chosen?.label ?? "")
          }}
          {...origin}
        />
        <span className="db-combo-ghost" dir={dir} aria-hidden="true">
          {text}
          <span>{rest}</span>
        </span>
      </span>
      <ul id={listId} role="listbox" aria-label={label ?? placeholder} hidden={!open || !shown.length} className="db-combo-list">
        {shown.map((o, i) => (
          <li
            key={o.value}
            id={`${listId}-${i}`}
            role="option"
            aria-selected={o === active}
            data-chosen={o.value === value ? "" : undefined}
            onMouseDown={(e) => e.preventDefault()} // keep focus on the line, so the pick lands before the blur
            onPointerMove={() => setAt(i)}
            onClick={() => choose(o)}
          >
            <Marked text={o.label} query={q} />
            {o.hint ? <span className="db-command-hint">{o.hint}</span> : null}
          </li>
        ))}
      </ul>
      {open && !shown.length ? (
        <p className="db-combo-empty" role="status">
          {empty}
        </p>
      ) : null}
    </div>
  )
}

export { Combobox, type ComboboxOption, type ComboboxProps }
