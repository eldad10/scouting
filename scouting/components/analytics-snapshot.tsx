"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, CheckCircle2, AlertCircle, Loader2, Clock } from "lucide-react"
import { api } from "@/lib/api"

const SNAPSHOT_KEY = "roboscout_analytics_snapshot"

export interface AnalyticsSnapshotMeta {
  savedAt: string
  formCount: number
  teamCount: number
}

export function getStoredSnapshot() {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(SNAPSHOT_KEY)
    if (!raw) return null
    return JSON.parse(raw) as {
      meta: AnalyticsSnapshotMeta
      forms: unknown[]
      rankings: unknown[]
    }
  } catch {
    return null
  }
}

interface Props {
  /** Called after a new snapshot is saved so consumers can re-read it */
  onSnapshotSaved?: () => void
}

export function AnalyticsSnapshot({ onSnapshotSaved }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [meta, setMeta] = useState<AnalyticsSnapshotMeta | null>(() => {
    const snap = getStoredSnapshot()
    return snap?.meta ?? null
  })
  const [errorMsg, setErrorMsg] = useState("")

  const handleDownload = useCallback(async () => {
    setStatus("loading")
    setErrorMsg("")
    try {
      const [forms, rankings] = await Promise.all([
        api.getForms(),
        api.getRankings(),
      ])

      const uniqueTeams = new Set(forms.map((f) => f.teamNumber))
      const snapshotMeta: AnalyticsSnapshotMeta = {
        savedAt: new Date().toISOString(),
        formCount: forms.length,
        teamCount: uniqueTeams.size,
      }

      const snapshot = { meta: snapshotMeta, forms, rankings }
      localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(snapshot))

      setMeta(snapshotMeta)
      setStatus("success")
      onSnapshotSaved?.()

      setTimeout(() => setStatus("idle"), 3000)
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to fetch data")
      setStatus("error")
      setTimeout(() => setStatus("idle"), 4000)
    }
  }, [onSnapshotSaved])

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
      <Button
        onClick={handleDownload}
        disabled={status === "loading"}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        {status === "loading" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : status === "success" ? (
          <CheckCircle2 className="h-4 w-4 text-green-600" />
        ) : status === "error" ? (
          <AlertCircle className="h-4 w-4 text-red-500" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        {status === "loading"
          ? "Downloading..."
          : status === "success"
          ? "Snapshot Saved"
          : status === "error"
          ? "Failed"
          : "Download Snapshot"}
      </Button>

      {status === "error" && (
        <span className="text-xs text-red-500">{errorMsg}</span>
      )}

      {meta && status !== "error" && (
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="text-xs gap-1 flex items-center">
            <Clock className="h-3 w-3" />
            {new Date(meta.savedAt).toLocaleString([], {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {meta.formCount} forms
          </Badge>
          <Badge variant="outline" className="text-xs">
            {meta.teamCount} teams
          </Badge>
        </div>
      )}
    </div>
  )
}
