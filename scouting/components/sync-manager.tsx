"use client"

import { useState } from "react"
import { useNetworkStatus } from "@/hooks/use-network-status"
import { useOfflineForms } from "@/hooks/use-offline-forms"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff, RefreshCw, CheckCircle2, AlertCircle, ChevronDown, ChevronUp, Inbox } from "lucide-react"
import { cn } from "@/lib/utils"

export function SyncManager() {
  const { isOnline } = useNetworkStatus()
  const { outbox, syncOutbox, clearOutbox } = useOfflineForms()
  const [syncing, setSyncing] = useState(false)
  const [syncResult, setSyncResult] = useState<{ success: number; failed: number } | null>(null)
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null)
  const [expanded, setExpanded] = useState(false)

  const pendingCount = outbox.length
  const showBanner = !isOnline || pendingCount > 0 || syncResult !== null

  const handleSync = async () => {
    setSyncing(true)
    setSyncResult(null)
    setProgress(null)

    const result = await syncOutbox((done, total) => {
      setProgress({ done, total })
    })

    setSyncing(false)
    setProgress(null)
    setSyncResult(result)

    // Auto-dismiss success banner after 4 s
    if (result.failed === 0) {
      setTimeout(() => setSyncResult(null), 4000)
    }
  }

  if (!showBanner) return null

  return (
    <div
      className={cn(
        "sticky top-14 sm:top-16 z-40 w-full border-b text-sm transition-colors",
        !isOnline
          ? "bg-amber-500 border-amber-600 text-white"
          : syncResult?.failed
          ? "bg-red-500 border-red-600 text-white"
          : syncResult
          ? "bg-green-600 border-green-700 text-white"
          : pendingCount > 0
          ? "bg-blue-600 border-blue-700 text-white"
          : "bg-muted border-border text-foreground"
      )}
    >
      {/* Main bar */}
      <div className="container mx-auto px-3 sm:px-4 py-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          {!isOnline ? (
            <WifiOff className="h-4 w-4 shrink-0" />
          ) : syncResult?.failed ? (
            <AlertCircle className="h-4 w-4 shrink-0" />
          ) : syncResult ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <Wifi className="h-4 w-4 shrink-0" />
          )}

          <span className="font-medium truncate">
            {!isOnline
              ? "You are offline"
              : syncResult?.failed
              ? `Sync failed for ${syncResult.failed} form(s)`
              : syncResult
              ? `${syncResult.success} form(s) synced successfully`
              : pendingCount > 0
              ? `${pendingCount} form(s) waiting to sync`
              : null}
          </span>

          {pendingCount > 0 && (
            <Badge
              variant="secondary"
              className="shrink-0 bg-white/20 text-white border-0 text-xs px-1.5"
            >
              {pendingCount}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isOnline && pendingCount > 0 && !syncing && (
            <Button
              size="sm"
              variant="secondary"
              className="h-7 px-3 bg-white/20 hover:bg-white/30 text-white border-0 text-xs font-semibold"
              onClick={handleSync}
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1" />
              Sync Now
            </Button>
          )}

          {syncing && (
            <span className="text-xs opacity-80">
              {progress ? `${progress.done}/${progress.total}` : "Syncing..."}
            </span>
          )}

          {pendingCount > 0 && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="opacity-70 hover:opacity-100 transition-opacity"
              aria-label="Toggle queue details"
            >
              {expanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Expandable outbox list */}
      {expanded && pendingCount > 0 && (
        <div className="container mx-auto px-3 sm:px-4 pb-3 border-t border-white/20 mt-0">
          <div className="pt-2 space-y-1 max-h-48 overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wide opacity-70 flex items-center gap-1">
                <Inbox className="h-3 w-3" />
                Outbox Queue
              </span>
              <button
                className="text-xs opacity-60 hover:opacity-100 underline"
                onClick={() => { clearOutbox(); setExpanded(false) }}
              >
                Clear all
              </button>
            </div>
            {outbox.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-white/10 rounded px-2 py-1.5 text-xs"
              >
                <span className="truncate">
                  Team {(item.payload as any).teamnumber ?? "?"} &mdash; Match{" "}
                  {(item.payload as any).matchnumber ?? "?"}
                </span>
                <span className="opacity-60 shrink-0 ml-2">
                  {new Date(item.queuedAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
