import { DocsIndex, type IndexGroup } from "@/components/site/docs-index"
import { catalog } from "@/lib/site/catalog"

const groups: IndexGroup[] = [
  {
    label: "Start",
    links: [
      { href: "/docs/", title: "Index", summary: "Every item, by movement." },
      { href: "/docs/install/", title: "Install", summary: "The base, then any item, with the shadcn CLI." },
      { href: "/docs/build-with-ai/", title: "Build with AI", summary: "Rules, references and prompts for your AI tool." },
      { href: "/docs/principles/", title: "Principles", summary: "What the library will and won't do." },
      { href: "/docs/tokens/", title: "Tokens", summary: "Type, space, tempo and colour, each to copy." },
    ],
  },
  ...catalog.map((m) => ({
    label: `${m.num} ${m.name}`,
    links: m.items.map((e) => ({
      href: `/docs/${e.meta.name}/`,
      title: e.meta.title,
      summary: e.meta.summary,
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
