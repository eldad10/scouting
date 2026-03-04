"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Wifi, WifiOff, Database, RefreshCw, AlertCircle, Loader2, Radio } from "lucide-react"
import { useNetworkStatus } from "@/hooks/use-network-status"
import { getStoredSnapshot } from "@/components/analytics-snapshot"
import { AnalyticsSnapshot } from "@/components/analytics-snapshot"
import { api, Form, RankingData } from "@/lib/api"

// ── Types ────────────────────────────────────────────────────────────────────

type DataSource = "live" | "snapshot" | "empty"

interface DashboardData {
  forms: Form[]
  rankings: RankingData[]
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getBallPoints(range: string, isTeleop: boolean): number {
  if (isTeleop) {
    const map: Record<string, number> = {
      "0-10": 5, "10-20": 15, "20-40": 30, "40-60": 50,
      "60-80": 70, "80-100": 90, "100+": 110,
    }
    return map[range] ?? 0
  }
  const map: Record<string, number> = {
    "0-5": 2.5, "5-10": 7.5, "10-15": 12.5, "15-20": 17.5, "20+": 22.5,
  }
  return map[range] ?? 0
}

const CHART_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"]

// ── Sub-charts ────────────────────────────────────────────────────────────────

function ScoreDistributionChart({ forms }: { forms: Form[] }) {
  if (forms.length === 0) return null

  // Bucket total scores
  const buckets: Record<string, number> = {
    "0-20": 0, "21-40": 0, "41-60": 0, "61-80": 0, "81-100": 0, "100+": 0,
  }
  forms.forEach((f) => {
    const total =
      getBallPoints(f.autoBalls, false) +
      (f.autoClimb ? 15 : 0) +
      getBallPoints(f.teleopBalls, true) +
      (f.teleopClimbLevel === 3 ? 30 : f.teleopClimbLevel === 2 ? 20 : f.teleopClimbLevel === 1 ? 10 : 0)

    if (total <= 20) buckets["0-20"]++
    else if (total <= 40) buckets["21-40"]++
    else if (total <= 60) buckets["41-60"]++
    else if (total <= 80) buckets["61-80"]++
    else if (total <= 100) buckets["81-100"]++
    else buckets["100+"]++
  })

  const data = Object.entries(buckets).map(([range, count]) => ({ range, count }))

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
        <XAxis dataKey="range" tick={{ fontSize: 10 }} />
        <YAxis tick={{ fontSize: 10 }} />
        <Tooltip />
        <Bar dataKey="count" fill="#3b82f6" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

function ClimbDistributionChart({ forms }: { forms: Form[] }) {
  if (forms.length === 0) return null

  const counts = [0, 1, 2, 3].map((lvl) => ({
    name: `Level ${lvl}`,
    value: forms.filter((f) => f.teleopClimbLevel === lvl).length,
  }))

  return (
    <ResponsiveContainer width="100%" height={180}>
      <PieChart>
        <Pie
          data={counts}
          cx="50%"
          cy="50%"
          innerRadius={45}
          outerRadius={70}
          dataKey="value"
          label={({ name, percent }) =>
            percent > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : null
          }
          labelLine={false}
        >
          {counts.map((_, i) => (
            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  )
}

function TopTeamsChart({ rankings }: { rankings: RankingData[] }) {
  const top = rankings.slice(0, 6).map((r) => ({
    team: r.teamNumber,
    overall: Math.round(r.overallAvg * 10) / 10,
    auto: Math.round(r.autoAvg * 10) / 10,
    teleop: Math.round(r.teleopAvg * 10) / 10,
  }))

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={top} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
        <XAxis dataKey="team" tick={{ fontSize: 10 }} />
        <YAxis tick={{ fontSize: 10 }} />
        <Tooltip />
        <Bar dataKey="auto" fill="#3b82f6" name="Auto" stackId="a" radius={[0, 0, 0, 0]} />
        <Bar dataKey="teleop" fill="#10b981" name="Teleop" stackId="a" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

function MatchTrendChart({ forms }: { forms: Form[] }) {
  if (forms.length === 0) return null

  const byMatch: Record<number, number[]> = {}
  forms.forEach((f) => {
    const score =
      getBallPoints(f.autoBalls, false) +
      (f.autoClimb ? 15 : 0) +
      getBallPoints(f.teleopBalls, true) +
      (f.teleopClimbLevel === 3 ? 30 : f.teleopClimbLevel === 2 ? 20 : f.teleopClimbLevel === 1 ? 10 : 0)
    if (!byMatch[f.matchNumber]) byMatch[f.matchNumber] = []
    byMatch[f.matchNumber].push(score)
  })

  const data = Object.entries(byMatch)
    .sort(([a], [b]) => Number(a) - Number(b))
    .slice(-12)
    .map(([match, scores]) => ({
      match: `M${match}`,
      avg: Math.round((scores.reduce((s, v) => s + v, 0) / scores.length) * 10) / 10,
    }))

  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
        <XAxis dataKey="match" tick={{ fontSize: 10 }} />
        <YAxis tick={{ fontSize: 10 }} />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="avg"
          stroke="#f59e0b"
          strokeWidth={2}
          dot={{ r: 3, fill: "#f59e0b" }}
          connectNulls
          name="Avg Score"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export function OfflineAnalyticsDashboard() {
  const { isOnline } = useNetworkStatus()
  const [data, setData] = useState<DashboardData | null>(null)
  const [source, setSource] = useState<DataSource>("empty")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [snapshotKey, setSnapshotKey] = useState(0)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)

    if (isOnline) {
      try {
        const [forms, rankings] = await Promise.all([
          api.getForms(),
          api.getRankings(),
        ])
        setData({ forms, rankings })
        setSource("live")
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch live data")
        // Fall back to snapshot if available
        const snap = getStoredSnapshot()
        if (snap) {
          setData({ forms: snap.forms as Form[], rankings: snap.rankings as RankingData[] })
          setSource("snapshot")
        } else {
          setSource("empty")
        }
      }
    } else {
      const snap = getStoredSnapshot()
      if (snap) {
        setData({ forms: snap.forms as Form[], rankings: snap.rankings as RankingData[] })
        setSource("snapshot")
      } else {
        setSource("empty")
        setData(null)
      }
    }

    setLoading(false)
  }, [isOnline])

  // Reload whenever network state changes or a new snapshot is saved
  useEffect(() => {
    loadData()
  }, [loadData, snapshotKey])

  const snap = getStoredSnapshot()
  const formCount = data?.forms.length ?? 0
  const teamCount = data ? new Set(data.forms.map((f) => f.teamNumber)).size : 0
  const autoClimbRate = formCount > 0
    ? Math.round((data!.forms.filter((f) => f.autoClimb).length / formCount) * 100)
    : 0

  return (
    <div className="space-y-4">
      {/* Source banner */}
      <div
        className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-3 rounded-lg border ${
          source === "live"
            ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
            : source === "snapshot"
            ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
            : "bg-muted border-border"
        }`}
      >
        <div className="flex items-center gap-2">
          {source === "live" ? (
            <>
              <Radio className="h-4 w-4 text-green-600 dark:text-green-400 animate-pulse" />
              <span className="text-sm font-semibold text-green-800 dark:text-green-300">
                Live Data
              </span>
              <Badge className="text-xs bg-green-600 text-white border-0">Remote DB</Badge>
            </>
          ) : source === "snapshot" ? (
            <>
              <Database className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <span className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                Offline Snapshot
              </span>
              {snap?.meta && (
                <Badge variant="secondary" className="text-xs">
                  Saved{" "}
                  {new Date(snap.meta.savedAt).toLocaleString([], {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Badge>
              )}
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-muted-foreground">No Data Available</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isOnline && (
            <AnalyticsSnapshot onSnapshotSaved={() => setSnapshotKey((k) => k + 1)} />
          )}
          <Button size="sm" variant="ghost" onClick={loadData} disabled={loading} className="h-8 px-2">
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Error */}
      {error && source !== "live" && (
        <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded border border-amber-200 dark:border-amber-800">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>Live fetch failed: {error}. Showing snapshot.</span>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span className="text-sm">
            {isOnline ? "Fetching from Remote DB..." : "Reading offline snapshot..."}
          </span>
        </div>
      )}

      {/* Empty state */}
      {!loading && source === "empty" && (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <WifiOff className="h-10 w-10 text-muted-foreground opacity-40" />
          <p className="font-semibold text-muted-foreground">You are offline with no snapshot</p>
          <p className="text-sm text-muted-foreground max-w-xs">
            Go online and use the <strong>Download Snapshot</strong> button to save data for offline viewing.
          </p>
        </div>
      )}

      {/* Charts */}
      {!loading && data && source !== "empty" && (
        <>
          {/* KPI cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Total Forms", value: formCount },
              { label: "Teams Scouted", value: teamCount },
              { label: "Auto Climb Rate", value: `${autoClimbRate}%` },
              { label: "Top Climb Avg", value: data.rankings.length > 0 ? `${Math.round(data.rankings[0]?.climbAvg ?? 0)}` : "—" },
            ].map(({ label, value }) => (
              <Card key={label}>
                <CardContent className="pt-4 pb-3 px-4">
                  <div className="text-2xl font-bold">{value}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Chart grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2 px-4 pt-4">
                <CardTitle className="text-sm">Score Distribution</CardTitle>
                <CardDescription className="text-xs">Number of matches per score bucket</CardDescription>
              </CardHeader>
              <CardContent className="px-2 pb-3">
                <ScoreDistributionChart forms={data.forms} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2 px-4 pt-4">
                <CardTitle className="text-sm">Climb Level Distribution</CardTitle>
                <CardDescription className="text-xs">All matches by teleop climb level</CardDescription>
              </CardHeader>
              <CardContent className="px-2 pb-3">
                <ClimbDistributionChart forms={data.forms} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2 px-4 pt-4">
                <CardTitle className="text-sm">Top 6 Teams</CardTitle>
                <CardDescription className="text-xs">Average auto + teleop points</CardDescription>
              </CardHeader>
              <CardContent className="px-2 pb-3">
                <TopTeamsChart rankings={data.rankings} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2 px-4 pt-4">
                <CardTitle className="text-sm">Match Score Trend</CardTitle>
                <CardDescription className="text-xs">Avg score per match (last 12)</CardDescription>
              </CardHeader>
              <CardContent className="px-2 pb-3">
                <MatchTrendChart forms={data.forms} />
              </CardContent>
            </Card>
          </div>

          {/* Data-source footnote */}
          <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
            {source === "live" ? (
              <>
                <Wifi className="h-3 w-3" />
                Showing live data from remote database
              </>
            ) : (
              <>
                <Database className="h-3 w-3" />
                Showing offline snapshot &mdash; data may be outdated
              </>
            )}
          </p>
        </>
      )}
    </div>
  )
}
