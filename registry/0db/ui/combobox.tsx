"use client"

import * as React from "react"

import { cn } from "@/registry/0db/lib/utils"
import { Command, CommandEmpty, CommandHint, CommandInput, CommandItem, CommandList } from "@/registry/0db/ui/command"
import { Field, useFieldControl } from "@/registry/0db/ui/field"
import { Popover, PopoverContent, PopoverTrigger } from "@/registry/0db/ui/popover"

type ComboboxOption = { value: string; label: string; hint?: string }

type ComboboxProps = Omit<React.ComponentProps<"button">, "value" | "defaultValue" | "onChange" | "type"> & {
  /** Labels should be unique: they are what the list is matched and marked on. */
  options: ComboboxOption[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  /** Set above the line. Left out, label it with a Field, or with aria-label. */
  label?: string
  /** What the closed line says before anything is chosen. */
  placeholder?: string
  /** Shown when nothing matches. Name something to try. */
  empty?: string
  /** Pins a state for documentation ("focus"); set on the trigger. */
  "data-force"?: string
}

/**
 * A field that suggests. Open it, type, and the letters you typed are marked in each match.
 * The chosen label is yours, so it sits on the line in italic. Enter, Space or the down arrow
 * opens the list; Enter picks; Escape closes it and puts focus back on the line.
 */
function Combobox({ label, id, ...props }: ComboboxProps) {
  const inField = Boolean(useFieldControl().id)
  // On its own, a label brings its own Field so the line, the label and the hint wire up the same way.
  return label && !inField ? (
    <Field label={label} id={id} className="db-combo-field">
      <ComboboxControl label={label} {...props} />
    </Field>
  ) : (
    <ComboboxControl label={label} id={id} {...props} />
  )
}

function ComboboxControl({
  options,
  value: valueProp,
  defaultValue,
  onValueChange,
  label,
  placeholder = "Choose one",
  empty = "Nothing matches. Try part of a name.",
  className,
  id,
  onKeyDown,
  ...props
}: ComboboxProps) {
  const field = useFieldControl()
  const [open, setOpen] = React.useState(false)
  const listId = React.useId()
  const [own, setOwn] = React.useState(defaultValue)
  const value = valueProp ?? own
  const chosen = options.find((o) => o.value === value)

  const pick = (next: string) => {
    if (valueProp === undefined) setOwn(next)
    onValueChange?.(next)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          data-slot="combobox"
          data-placeholder={chosen ? undefined : ""}
          className={cn("db-combo", className)}
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
            {chosen?.label ?? placeholder}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent data-slot="combobox-content" className="db-combo-pop" aria-label={label ?? placeholder}>
        <Command id={listId} loop label={label ?? placeholder} defaultValue={chosen?.label}>
          <CommandInput placeholder="Type to narrow the list" />
          <CommandList data-slot="combobox-list">
            <CommandEmpty>{empty}</CommandEmpty>
            {options.map((o) => (
              <CommandItem key={o.value} value={o.label} keywords={o.hint ? [o.hint] : undefined} data-chosen={o.value === value ? "" : undefined} onSelect={() => pick(o.value)}>
                {o.label}
                {o.hint ? <CommandHint>{o.hint}</CommandHint> : null}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export { Combobox, type ComboboxOption, type ComboboxProps }
