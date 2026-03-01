"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { TrendingUp, BarChart3, Activity, Target, X } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { api, Form } from "@/lib/api"

export default function StatisticsPage() {
  const searchParams = useSearchParams()
  const [selectedTeam, setSelectedTeam] = useState("")
  const [teams, setTeams] = useState<string[]>([])
  const [allForms, setAllForms] = useState<Form[]>([])
  const [filteredForms, setFilteredForms] = useState<Form[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [lastNGames, setLastNGames] = useState<string>("")
  const [excludedMatches, setExcludedMatches] = useState<number[]>([])
  const [newExcludedMatch, setNewExcludedMatch] = useState<string>("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const formsData = await api.getForms()
        setAllForms(formsData)

        // Extract unique team numbers
        const uniqueTeams = [...new Set(formsData.map((form) => form.teamNumber))]
        setTeams(uniqueTeams)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (!selectedTeam) {
      setFilteredForms([])
      return
    }

    let filtered = allForms.filter((form) => form.teamNumber === selectedTeam)

    // Apply excluded matches filter
    if (excludedMatches.length > 0) {
      filtered = filtered.filter((form) => !excludedMatches.includes(form.matchNumber))
    }

    // Apply last N games filter
    if (lastNGames && Number.parseInt(lastNGames) > 0) {
      const n = Number.parseInt(lastNGames)
      // Sort by match number descending and take last N
      filtered = filtered
        .sort((a, b) => b.matchNumber - a.matchNumber)
        .slice(0, n)
        .sort((a, b) => a.matchNumber - b.matchNumber) // Sort back to ascending for display
    }

    setFilteredForms(filtered)
  }, [allForms, selectedTeam, lastNGames, excludedMatches])

  useEffect(() => {
    const teamParam = searchParams.get("team")
    if (teamParam) {
      setSelectedTeam(teamParam)
    }
  }, [searchParams])

  // Helper function to get ball points from range
  const getBallPoints = (range: string, isTeleop: boolean): number => {
    if (isTeleop) {
      switch(range) {
        case '0-10': return 5
        case '10-20': return 15
        case '20-40': return 30
        case '40-60': return 50
        case '60-80': return 70
        case '80-100': return 90
        case '100+': return 110
        default: return 0
      }
    } else {
      switch(range) {
        case '0-5': return 2.5
        case '5-10': return 7.5
        case '10-15': return 12.5
        case '15-20': return 17.5
        case '20+': return 22.5
        default: return 0
      }
    }
  }

  const avgAutoScore =
    filteredForms.length > 0
      ? (
          filteredForms.reduce(
            (sum, form) => sum + getBallPoints(form.autoBalls, false) + (form.autoClimb ? 15 : 0),
            0,
          ) / filteredForms.length
        ).toFixed(1)
      : "0.0"

  const avgTeleopScore =
    filteredForms.length > 0
      ? (
          filteredForms.reduce(
            (sum, form) => sum + getBallPoints(form.teleopBalls, true),
            0,
          ) / filteredForms.length
        ).toFixed(1)
      : "0.0"

  const avgClimbScore =
    filteredForms.length > 0
      ? (
          filteredForms.reduce(
            (sum, form) => {
              let climbPts = 0
              if (form.autoClimb) climbPts += 15
              if (form.teleopClimbLevel === 1) climbPts += 10
              else if (form.teleopClimbLevel === 2) climbPts += 20
              else if (form.teleopClimbLevel === 3) climbPts += 30
              return sum + climbPts
            },
            0,
          ) / filteredForms.length
        ).toFixed(1)
      : "0.0"

  const climbSuccessRate =
    filteredForms.length > 0
      ? ((filteredForms.filter((form) => form.autoClimb || form.teleopClimbLevel > 0).length / filteredForms.length) * 100).toFixed(
          0,
        )
      : "0"

  const avgDefence =
    filteredForms.length > 0
      ? (filteredForms.reduce((sum, form) => sum + form.defenceRating, 0) / filteredForms.length).toFixed(1)
      : "0.0"

  const avgDelivery =
    filteredForms.length > 0
      ? (filteredForms.reduce((sum, form) => sum + form.deliveryRating, 0) / filteredForms.length).toFixed(1)
      : "0.0"

  const scoringData = filteredForms.map((form) => {
    const autoClimbPts = form.autoClimb ? 15 : 0
    const teleopClimbPts = form.teleopClimbLevel === 1 ? 10 : form.teleopClimbLevel === 2 ? 20 : form.teleopClimbLevel === 3 ? 30 : 0
    return {
      match: `Match ${form.matchNumber}`,
      auto: getBallPoints(form.autoBalls, false) + autoClimbPts,
      teleop: getBallPoints(form.teleopBalls, true) + teleopClimbPts,
      total: getBallPoints(form.autoBalls, false) + autoClimbPts + getBallPoints(form.teleopBalls, true) + teleopClimbPts,
    }
  })

  const climbSuccessData = filteredForms.map((form) => {
    let climbLevel = 0
    if (form.autoClimb) climbLevel = 1
    if (form.teleopClimbLevel > 0) climbLevel = form.teleopClimbLevel + 1
    return {
      match: form.matchNumber,
      successful: climbLevel > 0 ? 1 : 0,
      climbLevel: climbLevel,
    }
  })

  const defenceDeliveryData = filteredForms.map((form) => ({
    match: `Match ${form.matchNumber}`,
    defence: form.defenceRating,
    delivery: form.deliveryRating,
  }))

  // Label frequency calculations from all labels (auto + teleop)
  const allLabels = new Map<string, number>()
  filteredForms.forEach((form) => {
    const labels = new Set([...form.autoLabels, ...form.teleopLabels])
    labels.forEach((label) => {
      allLabels.set(label, (allLabels.get(label) || 0) + 1)
    })
  })

  // Get top 5 labels
  const topLabels = Array.from(allLabels.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  const labelFrequencyData = topLabels.map(([name, count]) => ({
    name,
    count,
    percentage: filteredForms.length > 0 ? parseFloat(((count / filteredForms.length) * 100).toFixed(1)) : 0,
  }))

  const labelOverTimeData = filteredForms.map((form) => {
    const labelObj: Record<string, number> = { match: form.matchNumber }
    topLabels.forEach(([label]) => {
      labelObj[label] = form.autoLabels.includes(label) || form.teleopLabels.includes(label) ? 1 : 0
    })
    return labelObj
  })

  const addExcludedMatch = () => {
    const matchNum = Number.parseInt(newExcludedMatch)
    if (matchNum && !excludedMatches.includes(matchNum)) {
      setExcludedMatches([...excludedMatches, matchNum])
      setNewExcludedMatch("")
    }
  }

  const removeExcludedMatch = (matchNum: number) => {
    setExcludedMatches(excludedMatches.filter((m) => m !== matchNum))
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">Team Statistics</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Ball scoring, climbing performance, and gameplay analytics</p>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading team statistics...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">Team Statistics</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Ball scoring, climbing performance, and gameplay analytics</p>
        </div>
        <div className="text-center py-12">
          <h3 className="text-base sm:text-lg font-medium text-foreground mb-2">Error loading statistics</h3>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div className="mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
          {selectedTeam ? `Team ${selectedTeam} Statistics` : "No Team Selected"}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          {selectedTeam
            ? `Ball scoring, climbing, defence & delivery analytics for Team ${selectedTeam}`
            : "Select a team to view detailed statistics and performance analytics"}
        </p>
      </div>

      <div className="mb-8 sm:mb-10 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
          <Select value={selectedTeam} onValueChange={setSelectedTeam}>
            <SelectTrigger className="w-full sm:w-56 h-12">
              <SelectValue placeholder="Select a team to view statistics" />
            </SelectTrigger>
            <SelectContent>
              {teams.map((team) => (
                <SelectItem key={team} value={team}>
                  Team {team}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-3 items-center">
            <Input
              type="number"
              placeholder="Last N games (e.g., 5)"
              value={lastNGames}
              onChange={(e) => setLastNGames(e.target.value)}
              className="w-48 h-12"
            />
            <Button variant="outline" onClick={() => setLastNGames("")} disabled={!lastNGames} className="h-12 px-6">
              Clear
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex gap-3 items-center">
            <Input
              type="number"
              placeholder="Exclude match number (e.g., 3)"
              value={newExcludedMatch}
              onChange={(e) => setNewExcludedMatch(e.target.value)}
              className="w-56 h-12"
            />
            <Button onClick={addExcludedMatch} disabled={!newExcludedMatch} className="h-12 px-6">
              Add Exclusion
            </Button>
          </div>

          {excludedMatches.length > 0 && (
            <div className="flex flex-wrap gap-3">
              <span className="text-sm text-muted-foreground py-2">Excluded matches:</span>
              {excludedMatches.map((matchNum) => (
                <Badge key={matchNum} variant="secondary" className="flex items-center gap-2 px-3 py-2">
                  Match {matchNum}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      removeExcludedMatch(matchNum)
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {selectedTeam && (
          <p className="text-sm text-muted-foreground">
            Showing {filteredForms.length} matches for Team {selectedTeam}
          </p>
        )}
      </div>

      {selectedTeam && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 mb-8 sm:mb-10">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 p-4 sm:p-8">
                <CardTitle className="text-xs sm:text-sm font-medium">AVG Auto Score</CardTitle>
                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-4 sm:p-8 pt-0">
                <div className="text-lg sm:text-2xl font-bold">{avgAutoScore}</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  Per match
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 p-4 sm:p-8">
                <CardTitle className="text-xs sm:text-sm font-medium">AVG Teleop Score</CardTitle>
                <Target className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-4 sm:p-8 pt-0">
                <div className="text-lg sm:text-2xl font-bold">{avgTeleopScore}</div>
                <p className="text-xs text-muted-foreground">Ball scoring</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 p-4 sm:p-8">
                <CardTitle className="text-xs sm:text-sm font-medium">AVG Climb Score</CardTitle>
                <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-4 sm:p-8 pt-0">
                <div className="text-lg sm:text-2xl font-bold">{avgClimbScore}</div>
                <p className="text-xs text-muted-foreground">Auto + Teleop climb</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 p-4 sm:p-8">
                <CardTitle className="text-xs sm:text-sm font-medium">Climb Success</CardTitle>
                <Target className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-4 sm:p-8 pt-0">
                <div className="text-lg sm:text-2xl font-bold">{climbSuccessRate}%</div>
                <p className="text-xs text-muted-foreground">Successful climbs</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 p-4 sm:p-8">
                <CardTitle className="text-xs sm:text-sm font-medium">AVG Defence</CardTitle>
                <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-4 sm:p-8 pt-0">
                <div className="text-lg sm:text-2xl font-bold">{avgDefence}/10</div>
                <p className="text-xs text-muted-foreground">Defence rating</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 p-4 sm:p-8">
                <CardTitle className="text-xs sm:text-sm font-medium">AVG Delivery</CardTitle>
                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-4 sm:p-8 pt-0">
                <div className="text-lg sm:text-2xl font-bold">{avgDelivery}/10</div>
                <p className="text-xs text-muted-foreground">Delivery rating</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:gap-8 mb-8 sm:mb-10">
            {/* Total Scoring Over Time */}
            <Card>
              <CardHeader className="p-6 sm:p-8">
                <CardTitle className="text-base sm:text-lg">Total Scoring Over Time - Team {selectedTeam}</CardTitle>
                <CardDescription className="text-sm">Auto, Teleop and Total score progression across matches</CardDescription>
              </CardHeader>
              <CardContent className="p-6 sm:p-8 pt-0">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={scoringData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="match" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="auto" stroke="#3b82f6" strokeWidth={2} name="Auto Score" />
                    <Line type="monotone" dataKey="teleop" stroke="#10b981" strokeWidth={2} name="Teleop Score" />
                    <Line type="monotone" dataKey="total" stroke="#f59e0b" strokeWidth={2} name="Total Score" />
                  </LineChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-6 mt-6 text-xs sm:text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-[#3b82f6] rounded mr-2"></div>Auto Score
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-[#10b981] rounded mr-2"></div>Teleop Score
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-[#f59e0b] rounded mr-2"></div>Total Score
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              <Card>
                <CardHeader className="p-6 sm:p-8">
                  <CardTitle className="text-base sm:text-lg">Climbing Performance - Team {selectedTeam}</CardTitle>
                  <CardDescription className="text-sm">Success rate and climb level progression</CardDescription>
                </CardHeader>
                <CardContent className="p-6 sm:p-8 pt-0">
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={climbSuccessData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="match" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} label={{ value: "Climb Level", angle: -90, position: "insideLeft" }} />
                      <Tooltip
                        labelFormatter={(label) => `Match ${label}`}
                        formatter={(value) => {
                          if (value === 0) return ["No Climb", "Status"]
                          if (value === 1) return ["Auto Climb", "Status"]
                          if (value === 2) return ["Level 1", "Status"]
                          if (value === 3) return ["Level 2", "Status"]
                          if (value === 4) return ["Level 3", "Status"]
                          return [value, "Level"]
                        }}
                      />
                      <Bar dataKey="climbLevel" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-6 sm:p-8">
                  <CardTitle className="text-base sm:text-lg">Defence & Delivery Ratings</CardTitle>
                  <CardDescription className="text-sm">Scout ratings for defence and delivery consistency</CardDescription>
                </CardHeader>
                <CardContent className="p-6 sm:p-8 pt-0">
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={defenceDeliveryData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="match" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} domain={[0, 10]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="defence" stroke="#ef4444" strokeWidth={2} name="Defence" />
                      <Line type="monotone" dataKey="delivery" stroke="#06b6d4" strokeWidth={2} name="Delivery" />
                    </LineChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-8 mt-6 text-xs sm:text-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-[#ef4444] rounded mr-2"></div>Defence
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-[#06b6d4] rounded mr-2"></div>Delivery
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Most Used Labels - Progress Bars */}
            <Card>
              <CardHeader className="p-6 sm:p-8">
                <CardTitle className="text-base sm:text-lg">Top Scout Labels - Team {selectedTeam}</CardTitle>
                <CardDescription className="text-sm">Shows which scout observations appear most frequently and their consistency</CardDescription>
              </CardHeader>
              <CardContent className="p-6 sm:p-8 pt-0">
                <div className="space-y-5">
                  {labelFrequencyData.length > 0 ? (
                    labelFrequencyData.map((item, idx) => (
                      <div key={item.name} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium truncate flex-1">{item.name}</span>
                          <span className="text-sm font-bold text-primary ml-2">{item.percentage}%</span>
                          <span className="text-xs text-muted-foreground ml-2">({item.count} times)</span>
                        </div>
                        <div className="w-full h-7 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden border border-slate-300 dark:border-slate-600">
                          <div
                            className={`h-full flex items-center justify-start px-2 text-white text-xs font-semibold transition-all ${
                              idx === 0 ? 'bg-amber-500' :
                              idx === 1 ? 'bg-blue-500' :
                              idx === 2 ? 'bg-green-500' :
                              idx === 3 ? 'bg-purple-500' :
                              'bg-orange-500'
                            }`}
                            style={{ width: `${Math.max(item.percentage, 3)}%` }}
                          >
                            {item.percentage > 15 && item.percentage}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No labels used yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Label Consistency Chart */}
            <Card>
              <CardHeader className="p-6 sm:p-8">
                <CardTitle className="text-base sm:text-lg">Label Pattern Over Matches</CardTitle>
                <CardDescription className="text-sm">Tracks which labels were used in each match to identify patterns</CardDescription>
              </CardHeader>
              <CardContent className="p-6 sm:p-8 pt-0">
                {labelOverTimeData.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left p-2 font-semibold">Match</th>
                          {topLabels.map(([label]) => (
                            <th key={label} className="text-center p-2 font-semibold text-xs max-w-[100px]">
                              <div className="truncate">{label}</div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {labelOverTimeData.map((row: any, idx) => (
                          <tr key={row.match} className={idx % 2 === 0 ? 'bg-slate-50 dark:bg-slate-900/30' : ''}>
                            <td className="p-2 font-medium">Match {row.match}</td>
                            {topLabels.map(([label]) => (
                              <td key={`${row.match}-${label}`} className="text-center p-2">
                                {row[label] === 1 ? (
                                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                                ) : (
                                  <span className="inline-block w-2 h-2 bg-slate-300 dark:bg-slate-600 rounded-full"></span>
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="mt-4 flex gap-4 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                        <span>Label used</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-block w-2 h-2 bg-slate-300 dark:bg-slate-600 rounded-full"></span>
                        <span>Not used</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No matches recorded</p>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
