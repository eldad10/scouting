"use client"

import { OfflineAnalyticsDashboard } from "@/components/offline-analytics-dashboard"
import { Database } from "lucide-react"

export default function OfflinePage() {
  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
          <Database className="h-6 w-6 sm:h-7 sm:w-7" />
          Analytics
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Live data when online — switches automatically to your saved snapshot when offline.
        </p>
      </div>

      <OfflineAnalyticsDashboard />
    </div>
  )
}
