import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Navigation } from "@/components/navigation"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "RoboScout - Robotics Competition Scouting",
  description: "A comprehensive scouting app for robotics competitions",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <Navigation />
        </Suspense>
        <main className="min-h-screen bg-background">{children}</main>
        <Analytics />
      </body>
    </html>
  )
}
