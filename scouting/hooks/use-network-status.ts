"use client"

import { useState, useEffect } from "react"

/**
 * Initializes as `true` (safe SSR default) and only reads
 * navigator.onLine inside useEffect to prevent hydration mismatches.
 */
export function useNetwork() {
  const [isOnline, setIsOnline] = useState(true)
  const [lastOnlineAt, setLastOnlineAt] = useState<Date | null>(null)
  const [lastOfflineAt, setLastOfflineAt] = useState<Date | null>(null)

  useEffect(() => {
    // Sync actual browser state after hydration
    setIsOnline(navigator.onLine)

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

/** @deprecated Use `useNetwork` instead */
export const useNetworkStatus = useNetwork
