"use client"

import { useState, useEffect } from "react"

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== "undefined" ? navigator.onLine : true
  )
  const [lastOnlineAt, setLastOnlineAt] = useState<Date | null>(null)
  const [lastOfflineAt, setLastOfflineAt] = useState<Date | null>(null)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setLastOnlineAt(new Date())
    }
    const handleOffline = () => {
      setIsOnline(false)
      setLastOfflineAt(new Date())
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  return { isOnline, lastOnlineAt, lastOfflineAt }
}
