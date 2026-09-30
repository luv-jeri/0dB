import type { Metadata } from "next"

import { ThemeScript } from "@/components/site/theme-script"
import { TopRow } from "@/components/site/top-row"
import { SmoothScroll } from "@/components/site/smooth-scroll"
import { PageRail } from "@/components/site/page-rail"
import { RegistryStyles } from "@/components/site/registry-styles"
import { Toaster } from "@/registry/0db/ui/toast"
import { TooltipProvider } from "@/registry/0db/ui/tooltip"
import { places, searchGroups } from "@/lib/site/nav"
import "./globals.css"

export const metadata: Metadata = {
  title: { default: "0dB", template: "%s · 0dB" },
  description: "A component library for type and silence: two typefaces, one accent and a great deal of space. Installs with the shadcn CLI.",
  metadataBase: new URL("https://0db.cojeev.com"),
  alternates: { canonical: "./" },
  openGraph: {
    type: "website",
    siteName: "0dB",
    locale: "en_US",
    url: "./",
    title: { default: "0dB", template: "%s · 0dB" },
    description: "A component library for type and silence: two typefaces, one accent and a great deal of space. Installs with the shadcn CLI.",
  },
  twitter: {
    card: "summary",
    title: { default: "0dB", template: "%s · 0dB" },
    description: "A component library for type and silence: two typefaces, one accent and a great deal of space. Installs with the shadcn CLI.",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
        <link rel="preload" href="/fonts/archivo-normal-e3a28eade2.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/bodoni-moda-italic-b737328c13.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <RegistryStyles />
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
