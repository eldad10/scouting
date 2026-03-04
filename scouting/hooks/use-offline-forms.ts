"use client"

import { useState, useEffect, useCallback } from "react"

export interface QueuedForm {
  id: string
  payload: Record<string, unknown>
  queuedAt: string // ISO timestamp
}

const OUTBOX_KEY = "roboscout_outbox"

function readOutbox(): QueuedForm[] {
  if (typeof window === "undefined") return []
  try {
    return JSON.parse(localStorage.getItem(OUTBOX_KEY) ?? "[]") as QueuedForm[]
  } catch {
    return []
  }
}

function writeOutbox(items: QueuedForm[]) {
  localStorage.setItem(OUTBOX_KEY, JSON.stringify(items))
}

export function useOfflineForms() {
  const [outbox, setOutbox] = useState<QueuedForm[]>([])

  // Hydrate from localStorage on mount
  useEffect(() => {
    setOutbox(readOutbox())
  }, [])

  const enqueue = useCallback((payload: Record<string, unknown>) => {
    const item: QueuedForm = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      payload,
      queuedAt: new Date().toISOString(),
    }
    setOutbox((prev) => {
      const next = [...prev, item]
      writeOutbox(next)
      return next
    })
    return item.id
  }, [])

  /**
   * Simulates uploading all queued forms to the remote DB.
   * In a real app replace the inner fetch call with your actual API call.
   */
  const syncOutbox = useCallback(
    async (
      onProgress?: (done: number, total: number) => void
    ): Promise<{ success: number; failed: number }> => {
      const items = readOutbox()
      let success = 0
      let failed = 0

      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        try {
          const res = await fetch("/api/insertForm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item.payload),
          })
          if (res.ok || res.status === 201) {
            success++
          } else {
            failed++
          }
        } catch {
          failed++
        }
        onProgress?.(i + 1, items.length)
      }

      if (success > 0) {
        // Remove successfully synced items (keep failed ones)
        // For simplicity: if all succeeded, clear; otherwise keep all failed
        if (failed === 0) {
          writeOutbox([])
          setOutbox([])
        }
      }

      return { success, failed }
    },
    []
  )

  const clearOutbox = useCallback(() => {
    writeOutbox([])
    setOutbox([])
  }, [])

  const removeFromOutbox = useCallback((id: string) => {
    setOutbox((prev) => {
      const next = prev.filter((item) => item.id !== id)
      writeOutbox(next)
      return next
    })
  }, [])

  return { outbox, enqueue, syncOutbox, clearOutbox, removeFromOutbox }
}
