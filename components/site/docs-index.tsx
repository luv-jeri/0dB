"use client"

import NextLink from "next/link"
import { usePathname } from "next/navigation"

import { Sidebar, SidebarGroup, SidebarLink } from "@/registry/0db/ui/sidebar"

export type IndexGroup = { label: string; links: { href: string; title: string }[] }

/** The docs' left index: the pages, then every item by movement. The page you're on takes the accent. */
export function DocsIndex({ groups }: { groups: IndexGroup[] }) {
  const path = usePathname()
  const here = path.endsWith("/") ? path : path + "/"
  return (
    <Sidebar label="Documentation" className="docs-index">
      {groups.map((g) => (
        <SidebarGroup key={g.label} label={g.label}>
          {g.links.map((l) => (
            <SidebarLink key={l.href} asChild current={here === l.href}>
              <NextLink href={l.href}>{l.title}</NextLink>
            </SidebarLink>
          ))}
        </SidebarGroup>
      ))}
    </Sidebar>
  )
}
