"use client"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  type NavigationMenuProps,
} from "@/registry/0db/ui/navigation-menu"
import { State } from "@/components/site/state"

const menu = {
  Work: [
    ["Identity", "Names, marks, and the rules that keep them"],
    ["Websites", "Built to be read slowly and used for years"],
    ["Motion", "Titles, idents and things that move once"],
  ],
  Studio: [
    ["People", "Six of us, in Stockholm and Lisbon"],
    ["Process", "How a project runs, week by week"],
    ["Journal", "Notes on type, space and slowness"],
  ],
}

type Menu = Pick<NavigationMenuProps, "variant" | "value"> & { label: string; force?: string }

function Studio({ variant, value, label, force }: Menu) {
  return (
    <NavigationMenu aria-label={label} variant={variant} value={value}>
      <NavigationMenuList>
        {Object.entries(menu).map(([word, names], i) => (
          <NavigationMenuItem key={word} value={word.toLowerCase()}>
            <NavigationMenuTrigger data-force={i === 0 ? force : undefined}>{word}</NavigationMenuTrigger>
            <NavigationMenuContent>
              {names.map(([name, line]) => (
                <NavigationMenuLink key={name} href={`#${name.toLowerCase()}`}>{name}<small>{line}</small></NavigationMenuLink>
              ))}
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
        <NavigationMenuItem>
          <NavigationMenuLink href="#contact">Contact</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

export default function Example() {
  return (
    <div className="grid w-full gap-12">
      <div className="grid content-start gap-3" style={{ minHeight: "17rem" }}>
        <span className="db-label">Names</span>
        <Studio label="Studio" />
      </div>
      <div className="grid content-start gap-3" style={{ minHeight: "19rem" }}>
        <span className="db-label">Lead</span>
        <Studio label="Studio, as contents" variant="lead" />
      </div>
      <div className="grid content-start gap-3">
        <span className="db-label">Inline, press a word</span>
        <Studio label="Studio, in a line" variant="inline" />
      </div>
    </div>
  )
}

export function States() {
  return (
    <>
      <State label="Rest"><Studio label="Rest" /></State>
      <State label="Pointed at"><Studio label="Pointed at" force="hover" /></State>
      <State label="Lead, open">
        <div style={{ minHeight: "19rem", minWidth: "min(36rem, 80vw)" }}><Studio label="Lead, open" variant="lead" value="work" /></div>
      </State>
      <State label="Inline, open"><Studio label="Inline, open" variant="inline" value="studio" /></State>
      <State label="Inline, open, right to left"><div dir="rtl"><Studio label="Inline, open, right to left" variant="inline" value="studio" /></div></State>
    </>
  )
}
