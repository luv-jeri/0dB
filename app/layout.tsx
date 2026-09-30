import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "0dB",
  description: "A type-led design system. Whitespace is the design, text is the hero.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
