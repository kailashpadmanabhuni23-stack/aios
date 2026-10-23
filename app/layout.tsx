import { Analytics } from "@vercel/analytics/next"
import type { Metadata, Viewport } from "next"
import { Bodoni_Moda, Geist_Mono, Outfit } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-bodoni",
  display: "swap",
})
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-outfit",
  display: "swap",
})
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" })

export const metadata: Metadata = {
  title: "AIOS | Autonomous AI Lead Operations",
  description: "Real-time visibility into AI lead qualification, calls, follow-ups, 4 C's framework, and campaign performance.",
}

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf8f5" },
    { media: "(prefers-color-scheme: dark)", color: "#22201d" },
  ],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="bg-background">
      <body
        className={`${outfit.variable} ${bodoni.variable} ${geistMono.variable} font-sans antialiased`}
      >
        {children}
        <Toaster />
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
