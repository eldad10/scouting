import type React from "react"
import type { Metadata, Viewport } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Navigation } from "@/components/navigation"
import { DemoBanner } from "@/components/demo-banner"
import { SyncManager } from "@/components/sync-manager"
import { ServiceWorkerRegistrar } from "@/components/service-worker-registrar"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "RoboScout - Robotics Competition Scouting",
  description: "A comprehensive scouting app for robotics competitions - Works Offline",
  generator: "v0.app",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "RoboScout",
  },
  formatDetection: {
    telephone: false,
  },
}

export const viewport: Viewport = {
  themeColor: "#3b82f6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ServiceWorkerRegistrar />
        <Suspense fallback={<div>Loading...</div>}>
          <Navigation />
        </Suspense>
        <DemoBanner />
        <SyncManager />
        <main className="min-h-screen bg-background">{children}</main>
        <Analytics />
      </body>
    </html>
  )
}
