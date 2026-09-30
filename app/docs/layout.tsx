import { DocsIndex, type IndexGroup } from "@/components/site/docs-index"
import { catalog } from "@/lib/site/catalog"

const groups: IndexGroup[] = [
  {
    label: "Start",
    links: [
      { href: "/docs/", title: "Index" },
      { href: "/docs/install/", title: "Install" },
      { href: "/docs/principles/", title: "Principles" },
      { href: "/docs/tokens/", title: "Tokens" },
    ],
  },
  ...catalog.map((m) => ({
    label: `${m.num} ${m.name}`,
    links: m.items.map((e) => ({
      href: `/docs/${e.meta.name}/`,
      title: e.meta.title,
    })),
  })),
]

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="docs">
      <DocsIndex groups={groups} />
      <main id="content" className="docs-main">
        {children}
      </main>
    </div>
  )
}
