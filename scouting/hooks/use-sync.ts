"use client"

import { useState, useEffect, useCallback } from "react"
import { useNetwork } from "./use-network-status"
import { syncEngine, type SyncResult } from "@/lib/sync-engine"
import { localDbHelpers } from "@/lib/local-db"

export interface SyncState {
  isSyncing: boolean
  lastSyncResult: SyncResult | null
  pendingForms: number
  pendingTeams: number
  lastTeamsSync: number | null
  lastFormsSync: number | null
  lastRankingsSync: number | null
}

export function useSync() {
  const { isOnline } = useNetwork()
  const [state, setState] = useState<SyncState>({
    isSyncing: false,
    lastSyncResult: null,
    pendingForms: 0,
    pendingTeams: 0,
    lastTeamsSync: null,
    lastFormsSync: null,
    lastRankingsSync: null,
  })

  // Load sync status from IndexedDB
  const refreshStatus = useCallback(async () => {
    try {
      const status = await localDbHelpers.getSyncStatus()
      setState((prev) => ({
        ...prev,
        pendingForms: status.pendingForms,
        pendingTeams: status.pendingTeams,
        lastTeamsSync: status.lastTeamsSync,
        lastFormsSync: status.lastFormsSync,
        lastRankingsSync: status.lastRankingsSync,
      }))
    } catch (err) {
      console.error("Failed to get sync status:", err)
    }
  }, [])

  // Full sync
  const sync = useCallback(async (): Promise<SyncResult | null> => {
    if (!isOnline) {
      return null
    }

    setState((prev) => ({ ...prev, isSyncing: true }))

    try {
      const result = await syncEngine.fullSync()
      setState((prev) => ({
        ...prev,
        isSyncing: false,
        lastSyncResult: result,
      }))
      await refreshStatus()
      return result
    } catch (err) {
      const errorResult: SyncResult = {
        success: false,
        pushed: { forms: 0, teams: 0 },
        pulled: { forms: 0, teams: 0, rankings: 0 },
        errors: [err instanceof Error ? err.message : "Unknown error"],
      }
      setState((prev) => ({
        ...prev,
        isSyncing: false,
        lastSyncResult: errorResult,
      }))
      return errorResult
    }
  }, [isOnline, refreshStatus])

  // Push only (for when you want to upload without pulling)
  const pushChanges = useCallback(async () => {
    if (!isOnline) return null
    setState((prev) => ({ ...prev, isSyncing: true }))
    try {
      const result = await syncEngine.pushToRemote()
      await refreshStatus()
      setState((prev) => ({ ...prev, isSyncing: false }))
      return result
    } catch (err) {
      setState((prev) => ({ ...prev, isSyncing: false }))
      return null
    }
  }, [isOnline, refreshStatus])

  // Pull only (for refreshing local cache)
  const pullData = useCallback(async () => {
    if (!isOnline) return null
    setState((prev) => ({ ...prev, isSyncing: true }))
    try {
      const result = await syncEngine.pullFromRemote()
      await refreshStatus()
      setState((prev) => ({ ...prev, isSyncing: false }))
      return result
    } catch (err) {
      setState((prev) => ({ ...prev, isSyncing: false }))
      return null
    }
  }, [isOnline, refreshStatus])

  // Load initial status
  useEffect(() => {
    refreshStatus()
  }, [refreshStatus])

  // Auto-sync when coming back online
  useEffect(() => {
    if (isOnline && (state.pendingForms > 0 || state.pendingTeams > 0)) {
      // Small delay to ensure network is stable
      const timer = setTimeout(() => {
        sync()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isOnline]) // Intentionally not including sync/state to avoid loops

  // Listen for service worker sync requests
  useEffect(() => {
    const handleSyncRequest = () => {
      if (isOnline) {
        sync()
      }
    }
    window.addEventListener("sw-sync-requested", handleSyncRequest)
    return () => window.removeEventListener("sw-sync-requested", handleSyncRequest)
  }, [isOnline, sync])

  return {
    ...state,
    isOnline,
    sync,
    pushChanges,
    pullData,
    refreshStatus,
  }
}
