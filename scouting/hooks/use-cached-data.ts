"use client"

import { useState, useEffect, useCallback } from "react"
import { useNetwork } from "@/hooks/use-network-status"

export interface CachedDataState<T> {
  data: T
  isLoading: boolean
  isOffline: boolean
  isStale: boolean          // true when showing cached data because we are offline
  cachedAt: Date | null     // when the cache was last written
  error: string | null
  refresh: () => void
}

function readCache<T>(key: string): { data: T; cachedAt: Date } | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { data: T; cachedAt: string }
    return { data: parsed.data, cachedAt: new Date(parsed.cachedAt) }
  } catch {
    return null
  }
}

function writeCache<T>(key: string, data: T) {
  try {
    localStorage.setItem(key, JSON.stringify({ data, cachedAt: new Date().toISOString() }))
  } catch {
    // Quota exceeded or private mode — silently ignore
  }
}

/**
 * Generic offline-aware data hook.
 *
 * @param key          localStorage cache key
 * @param fetcher      async function that returns fresh data when online
 * @param initialData  default value before any data is available
 *
 * When online:  fetches fresh data, saves it to localStorage, returns it.
 * When offline: immediately returns whatever is in localStorage (stale flag = true).
 */
export function useCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  initialData: T
): CachedDataState<T> {
  const { isOnline } = useNetwork()
  const [data, setData] = useState<T>(initialData)
  const [isLoading, setIsLoading] = useState(true)
  const [isStale, setIsStale] = useState(false)
  const [cachedAt, setCachedAt] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(
    async (online: boolean) => {
      setIsLoading(true)
      setError(null)

      if (!online) {
        // Offline path — return cache immediately
        const cached = readCache<T>(key)
        if (cached) {
          setData(cached.data)
          setCachedAt(cached.cachedAt)
          setIsStale(true)
        } else {
          setError("No cached data available. Connect to the internet to load data.")
        }
        setIsLoading(false)
        return
      }

      // Online path — fetch fresh, then cache
      try {
        const fresh = await fetcher()
        writeCache(key, fresh)
        setData(fresh)
        setCachedAt(new Date())
        setIsStale(false)
      } catch (err) {
        // Fetch failed even though online — fall back to cache
        const cached = readCache<T>(key)
        if (cached) {
          setData(cached.data)
          setCachedAt(cached.cachedAt)
          setIsStale(true)
        } else {
          setError(err instanceof Error ? err.message : "Failed to load data")
        }
      } finally {
        setIsLoading(false)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key]
  )

  // Re-run whenever the network status changes
  useEffect(() => {
    load(isOnline)
  }, [isOnline, load])

  const refresh = useCallback(() => load(isOnline), [isOnline, load])

  return { data, isLoading, isOffline: !isOnline, isStale, cachedAt, error, refresh }
}
