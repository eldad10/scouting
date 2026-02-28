"use client"

import { useEffect, useState } from "react"
import { FlaskConical } from "lucide-react"

export function DemoBanner() {
  const [isDemo, setIsDemo] = useState(false)

  useEffect(() => {
    fetch("/api/mode")
      .then((r) => r.json())
      .then((d) => setIsDemo(d.demo))
      .catch(() => {})
  }, [])

  if (!isDemo) return null

  return (
    <div className="w-full bg-amber-500 text-amber-950 text-xs sm:text-sm font-medium px-4 py-1.5 flex items-center justify-center gap-2 text-center">
      <FlaskConical className="h-3.5 w-3.5 shrink-0" />
      Demo Mode — no database connected. Showing fake data. Forms you submit are saved in memory only.
    </div>
  )
}
