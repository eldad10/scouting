"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Bot, Trophy, Zap, Shield, ChevronsUpDown,
  Search, ChevronUp, ChevronDown, CheckCircle2, XCircle,
  Crosshair, Target,
} from "lucide-react"
import { api, TeamInfo } from "@/lib/api"

type SortKey = "statboticsRank" | "deliveryRating" | "defenceRating" | "speedBalanceRating"
type SortDir = "asc" | "desc"

function RatingDots({ value, max = 5, color }: { value: number; max?: number; color: string }) {
  return (
    <div className="flex gap-0.5 items-center">
      {Array.from({ length: max }).map((_, i) => (
        <div
          key={i}
          className={`w-2.5 h-2.5 rounded-full ${i < value ? color : "bg-muted"}`}
        />
      ))}
    </div>
  )
}

function ShooterBadge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    fixed: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    turret: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  }
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${colors[type] ?? "bg-muted text-muted-foreground"}`}>
      {type}
    </span>
  )
}

export default function TeamIntelPage() {
  const [teams, setTeams] = useState<TeamInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [sortKey, setSortKey] = useState<SortKey>("statboticsRank")
  const [sortDir, setSortDir] = useState<SortDir>("asc")
  const [selected, setSelected] = useState<TeamInfo | null>(null)

  useEffect(() => {
    api.getAllTeamInfo().then((data) => {
      setTeams(data)
      setLoading(false)
    })
  }, [])

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDir(key === "statboticsRank" ? "asc" : "desc")
    }
  }

  const SortIcon = ({ k }: { k: SortKey }) => {
    if (sortKey !== k) return <ChevronUp className="w-3 h-3 text-muted-foreground/40" />
    return sortDir === "asc"
      ? <ChevronUp className="w-3 h-3 text-primary" />
      : <ChevronDown className="w-3 h-3 text-primary" />
  }

  const sorted = useMemo(() => {
    const filtered = teams.filter((t) =>
      t.teamNumber.toLowerCase().includes(search.toLowerCase()) ||
      t.shootingDescription?.toLowerCase().includes(search.toLowerCase()) ||
      t.advantages?.toLowerCase().includes(search.toLowerCase())
    )
    return [...filtered].sort((a, b) => {
      let va: number, vb: number
      if (sortKey === "statboticsRank") {
        va = a.statboticsRank ?? 9999
        vb = b.statboticsRank ?? 9999
      } else {
        va = (a[sortKey] as number) ?? 0
        vb = (b[sortKey] as number) ?? 0
      }
      return sortDir === "asc" ? va - vb : vb - va
    })
  }, [teams, search, sortKey, sortDir])

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <Bot className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Team Intelligence</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Scouted robot profiles, ratings, and strategic analysis for all teams
        </p>
      </div>

      {/* Summary stats row */}
      {!loading && teams.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="py-4 px-5">
              <p className="text-2xl font-bold">{teams.length}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mt-0.5">Teams Scouted</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4 px-5">
              <p className="text-2xl font-bold">
                {(teams.reduce((s, t) => s + t.deliveryRating, 0) / teams.length).toFixed(1)}
              </p>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mt-0.5">Avg Delivery</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4 px-5">
              <p className="text-2xl font-bold">
                {(teams.reduce((s, t) => s + t.defenceRating, 0) / teams.length).toFixed(1)}
              </p>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mt-0.5">Avg Defence</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4 px-5">
              <p className="text-2xl font-bold">
                {teams.filter((t) => t.shooterType === "turret").length}
              </p>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mt-0.5">Turret Robots</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search teams, notes..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24 text-muted-foreground">
          <Bot className="w-5 h-5 mr-2 animate-pulse" />
          Loading team intel...
        </div>
      ) : sorted.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-20 gap-3">
            <Bot className="w-10 h-10 text-muted-foreground/40" />
            <p className="text-muted-foreground font-medium">
              {teams.length === 0 ? "No team intel in the database yet." : "No teams match your search."}
            </p>
            {teams.length === 0 && (
              <p className="text-sm text-muted-foreground/70 text-center max-w-sm">
                Add robot profiles from the Statistics page by selecting a team and clicking &ldquo;Add Intel&rdquo;.
              </p>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Table */}
          <div className="flex-1 overflow-x-auto">
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wide text-muted-foreground w-10">#</th>
                      <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wide text-muted-foreground">Team</th>
                      <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wide text-muted-foreground">Shooter</th>
                      <th className="px-4 py-3 text-center">
                        <button
                          className="flex items-center gap-1 mx-auto text-xs uppercase tracking-wide font-semibold text-muted-foreground hover:text-foreground"
                          onClick={() => toggleSort("statboticsRank")}
                        >
                          <Trophy className="w-3 h-3" /> Rank <SortIcon k="statboticsRank" />
                        </button>
                      </th>
                      <th className="px-4 py-3 text-center">
                        <button
                          className="flex items-center gap-1 mx-auto text-xs uppercase tracking-wide font-semibold text-muted-foreground hover:text-foreground"
                          onClick={() => toggleSort("deliveryRating")}
                        >
                          <Zap className="w-3 h-3" /> Delivery <SortIcon k="deliveryRating" />
                        </button>
                      </th>
                      <th className="px-4 py-3 text-center">
                        <button
                          className="flex items-center gap-1 mx-auto text-xs uppercase tracking-wide font-semibold text-muted-foreground hover:text-foreground"
                          onClick={() => toggleSort("defenceRating")}
                        >
                          <Shield className="w-3 h-3" /> Defence <SortIcon k="defenceRating" />
                        </button>
                      </th>
                      <th className="px-4 py-3 text-center">
                        <button
                          className="flex items-center gap-1 mx-auto text-xs uppercase tracking-wide font-semibold text-muted-foreground hover:text-foreground"
                          onClick={() => toggleSort("speedBalanceRating")}
                        >
                          <ChevronsUpDown className="w-3 h-3" /> Speed <SortIcon k="speedBalanceRating" />
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map((team, idx) => (
                      <tr
                        key={team.teamNumber}
                        className={`border-b border-border last:border-0 cursor-pointer transition-colors hover:bg-muted/40 ${
                          selected?.teamNumber === team.teamNumber ? "bg-primary/5" : ""
                        }`}
                        onClick={() => setSelected(selected?.teamNumber === team.teamNumber ? null : team)}
                      >
                        <td className="px-4 py-3 text-muted-foreground text-xs font-mono">{idx + 1}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="font-bold">{team.teamNumber}</span>
                            <ShooterBadge type={team.shooterType} />
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs text-muted-foreground capitalize">
                            {team.shootingPosition.replace("_", " ")} · {team.shooterWidth}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {team.statboticsRank != null ? (
                            <span className="font-bold text-amber-600 dark:text-amber-400">#{team.statboticsRank}</span>
                          ) : (
                            <span className="text-muted-foreground/40">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center">
                            <RatingDots value={team.deliveryRating} color="bg-cyan-500" />
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center">
                            <RatingDots value={team.defenceRating} color="bg-red-500" />
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center">
                            <RatingDots value={team.speedBalanceRating} color="bg-violet-500" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Detail panel */}
          {selected && (
            <div className="lg:w-80 shrink-0">
              <Card className="sticky top-20 overflow-hidden">
                <div className="bg-primary/5 border-b border-border px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-primary" />
                    <span className="font-bold">Team {selected.teamNumber}</span>
                  </div>
                  <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground">
                    <ChevronsUpDown className="w-4 h-4" />
                  </button>
                </div>
                <CardContent className="p-4 space-y-4 text-sm">
                  {/* Rank + shooter */}
                  <div className="flex items-center gap-3 flex-wrap">
                    {selected.statboticsRank != null && (
                      <div className="flex items-center gap-1">
                        <Trophy className="w-3.5 h-3.5 text-amber-500" />
                        <span className="font-bold text-amber-600 dark:text-amber-400">#{selected.statboticsRank}</span>
                        <span className="text-xs text-muted-foreground">Statbotics</span>
                      </div>
                    )}
                    <ShooterBadge type={selected.shooterType} />
                    <Badge variant="outline" className="text-xs capitalize">{selected.shootingPosition.replace("_", " ")}</Badge>
                  </div>

                  {selected.shootingDescription && (
                    <p className="text-muted-foreground italic text-xs leading-relaxed">
                      &ldquo;{selected.shootingDescription}&rdquo;
                    </p>
                  )}

                  {/* Ratings */}
                  <div className="space-y-2.5">
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <Zap className="w-3 h-3 text-cyan-500" />
                        <span className="text-xs text-muted-foreground">Delivery</span>
                        <span className="ml-auto text-xs font-bold">{selected.deliveryRating}/5</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${(selected.deliveryRating / 5) * 100}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <Shield className="w-3 h-3 text-red-500" />
                        <span className="text-xs text-muted-foreground">Defence</span>
                        <span className="ml-auto text-xs font-bold">{selected.defenceRating}/5</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-red-500 rounded-full" style={{ width: `${(selected.defenceRating / 5) * 100}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <ChevronsUpDown className="w-3 h-3 text-violet-500" />
                        <span className="text-xs text-muted-foreground">Speed / Balance</span>
                        <span className="ml-auto text-xs font-bold">{selected.speedBalanceRating}/5</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-violet-500 rounded-full" style={{ width: `${(selected.speedBalanceRating / 5) * 100}%` }} />
                      </div>
                    </div>
                  </div>

                  {selected.advantages && (
                    <div className="flex gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[11px] font-semibold text-green-600 dark:text-green-400 uppercase tracking-wide mb-0.5">Advantages</p>
                        <p className="text-xs text-foreground leading-relaxed">{selected.advantages}</p>
                      </div>
                    </div>
                  )}
                  {selected.disadvantages && (
                    <div className="flex gap-2">
                      <XCircle className="w-3.5 h-3.5 text-red-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[11px] font-semibold text-red-600 dark:text-red-400 uppercase tracking-wide mb-0.5">Disadvantages</p>
                        <p className="text-xs text-foreground leading-relaxed">{selected.disadvantages}</p>
                      </div>
                    </div>
                  )}
                  {selected.additionalInfo && (
                    <div>
                      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">Notes</p>
                      <p className="text-xs text-foreground leading-relaxed">{selected.additionalInfo}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
