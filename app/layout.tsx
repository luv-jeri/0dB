import type { Metadata } from "next"

import { ThemeScript } from "@/components/site/theme-script"
import { TopRow } from "@/components/site/top-row"
import { SmoothScroll } from "@/components/site/smooth-scroll"
import { PageRail } from "@/components/site/page-rail"
import { Toaster } from "@/registry/0db/ui/toast"
import { TooltipProvider } from "@/registry/0db/ui/tooltip"
import { places, searchGroups } from "@/lib/site/nav"
import "./globals.css"

export const metadata: Metadata = {
  title: { default: "0dB", template: "%s · 0dB" },
  description: "A component library for type and silence: two typefaces, one accent and a great deal of space. Installs with the shadcn CLI.",
  metadataBase: new URL("https://0db.cojeev.com"),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <a className="skip db-link" href="#content">Skip to the content</a>
        <TooltipProvider>
          <TopRow places={places} groups={searchGroups} />
          {children}
        </TooltipProvider>
        <PageRail />
        <Toaster />
        <SmoothScroll />
      </body>
    </html>
  )
}
