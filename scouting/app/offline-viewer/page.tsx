"use client"

import { api, type Team, type Form } from "@/lib/api"
import { useCachedData } from "@/hooks/use-cached-data"
import { useNetwork } from "@/hooks/use-network-status"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, FileText, WifiOff, RefreshCw, Trophy, User, Clock, AlertCircle } from "lucide-react"
import Link from "next/link"

// ─── helpers ──────────────────────────────────────────────────────────────────

function OfflineBadge() {
  return (
    <Badge
      variant="outline"
      className="text-amber-700 border-amber-400 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-700 gap-1 text-xs"
    >
      <WifiOff className="h-3 w-3" />
      Viewing Offline Data
    </Badge>
  )
}

function CachedAt({ date }: { date: Date | null }) {
  if (!date) return null
  return (
    <span className="text-xs text-muted-foreground flex items-center gap-1">
      <Clock className="h-3 w-3" />
      Cached {date.toLocaleString([], { dateStyle: "short", timeStyle: "short" })}
    </span>
  )
}

function EmptyState({ icon: Icon, title, message }: { icon: React.ElementType; title: string; message: string }) {
  return (
    <div className="text-center py-16 flex flex-col items-center gap-3">
      <Icon className="h-12 w-12 text-muted-foreground" />
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-xs">{message}</p>
    </div>
  )
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="text-center py-16 flex flex-col items-center gap-3">
      <AlertCircle className="h-12 w-12 text-red-500" />
      <h3 className="text-base font-semibold">Could not load data</h3>
      <p className="text-sm text-muted-foreground max-w-xs">{message}</p>
      <Button size="sm" variant="outline" onClick={onRetry}>
        <RefreshCw className="h-4 w-4 mr-2" />
        Retry
      </Button>
    </div>
  )
}

function Skeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-32 rounded-xl bg-muted animate-pulse" />
      ))}
    </div>
  )
}

const getRankColor = (rank?: number | null) => {
  if (!rank) return "bg-slate-500 text-white"
  if (rank === 1) return "bg-yellow-500 text-yellow-900"
  if (rank === 2) return "bg-gray-400 text-gray-900"
  if (rank === 3) return "bg-amber-600 text-white"
  if (rank <= 5) return "bg-blue-500 text-white"
  return "bg-slate-500 text-white"
}

// ─── sub-panels ───────────────────────────────────────────────────────────────

function TeamsPanel() {
  const { data: teams, isLoading, isStale, cachedAt, error, refresh } = useCachedData<Team[]>(
    "roboscout_cache_teams",
    () => api.getTeams(),
    []
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          {isStale && <OfflineBadge />}
          {isStale && <CachedAt date={cachedAt} />}
        </div>
        <Button size="sm" variant="outline" onClick={refresh} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {isLoading && <Skeleton />}
      {!isLoading && error && <ErrorState message={error} onRetry={refresh} />}
      {!isLoading && !error && teams.length === 0 && (
        <EmptyState icon={Users} title="No teams found" message="No teams are available yet." />
      )}
      {!isLoading && !error && teams.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {teams.map((team) => (
            <Card key={team.teamNumber} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <CardTitle className="text-base truncate">Team {team.teamNumber}</CardTitle>
                    <CardDescription className="truncate">{team.teamName}</CardDescription>
                  </div>
                  {team.ranking != null && (
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 shrink-0 ${getRankColor(team.ranking)}`}>
                      <Trophy className="h-3 w-3" />#{team.ranking}
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Link href={`/statistics?team=${team.teamNumber}`}>
                  <Button size="sm" className="w-full" variant="outline">View Statistics</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function FormsPanel() {
  const { data: forms, isLoading, isStale, cachedAt, error, refresh } = useCachedData<Form[]>(
    "roboscout_cache_forms",
    () => api.getForms(),
    []
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          {isStale && <OfflineBadge />}
          {isStale && <CachedAt date={cachedAt} />}
        </div>
        <Button size="sm" variant="outline" onClick={refresh} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {isLoading && <Skeleton />}
      {!isLoading && error && <ErrorState message={error} onRetry={refresh} />}
      {!isLoading && !error && forms.length === 0 && (
        <EmptyState icon={FileText} title="No forms found" message="No scouting forms are available yet." />
      )}
      {!isLoading && !error && forms.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          {forms.map((form) => (
            <Card key={`${form.teamNumber}-${form.matchNumber}`} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <CardTitle className="text-sm font-semibold truncate">
                      Team {form.teamNumber} — Match {form.matchNumber}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 text-xs mt-0.5">
                      <User className="h-3 w-3 shrink-0" />
                      <span className="truncate">{form.scouterName}</span>
                    </CardDescription>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-lg font-bold text-foreground">{form.totalScore}</div>
                    <div className="text-xs text-muted-foreground">pts</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Link href={`/forms/${form.teamNumber}-${form.matchNumber}`}>
                  <Button size="sm" className="w-full" variant="outline">View Details</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function OfflineViewerPage() {
  const { isOnline } = useNetwork()

  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-10 max-w-5xl">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Offline Viewer</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Browse cached teams and forms — data is available even without a connection.
          </p>
        </div>
        <Badge
          variant="outline"
          className={
            isOnline
              ? "text-green-700 border-green-400 bg-green-50 dark:bg-green-900/20 dark:text-green-300 gap-1 text-xs self-start"
              : "text-amber-700 border-amber-400 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-300 gap-1 text-xs self-start"
          }
        >
          {isOnline ? (
            <>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Live — syncing from server
            </>
          ) : (
            <>
              <WifiOff className="h-3 w-3" />
              Offline — reading local cache
            </>
          )}
        </Badge>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="teams">
        <TabsList className="mb-6 w-full sm:w-auto">
          <TabsTrigger value="teams" className="flex-1 sm:flex-none gap-2">
            <Users className="h-4 w-4" />
            My Teams
          </TabsTrigger>
          <TabsTrigger value="forms" className="flex-1 sm:flex-none gap-2">
            <FileText className="h-4 w-4" />
            My Forms
          </TabsTrigger>
        </TabsList>

        <TabsContent value="teams">
          <TeamsPanel />
        </TabsContent>

        <TabsContent value="forms">
          <FormsPanel />
        </TabsContent>
      </Tabs>
    </div>
  )
}
