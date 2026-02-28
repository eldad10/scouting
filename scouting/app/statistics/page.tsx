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

  const avgAutoCorals =
    filteredForms.length > 0
      ? (
          filteredForms.reduce(
            (sum, form) => sum + form.l1CoralsAuto + form.l2CoralsAuto + form.l3CoralsAuto + form.l4CoralsAuto,
            0,
          ) / filteredForms.length
        ).toFixed(1)
      : "0.0"

  const avgTeleopCorals =
    filteredForms.length > 0
      ? (
          filteredForms.reduce(
            (sum, form) => sum + form.l1CoralsTele + form.l2CoralsTele + form.l3CoralsTele + form.l4CoralsTele,
            0,
          ) / filteredForms.length
        ).toFixed(1)
      : "0.0"

  const avgNet =
    filteredForms.length > 0
      ? (filteredForms.reduce((sum, form) => sum + form.netAuto + form.netTele, 0) / filteredForms.length).toFixed(1)
      : "0.0"

  const climbSuccessRate =
    filteredForms.length > 0
      ? ((filteredForms.filter((form) => form.highClimb || form.lowClimb).length / filteredForms.length) * 100).toFixed(
          0,
        )
      : "0"

  const netScoringData = filteredForms.map((form) => ({
    match: `Match ${form.matchNumber}`,
    netAuto: form.netAuto,
    netTeleop: form.netTele,
    totalNet: form.netAuto + form.netTele,
  }))

  const coralByLevelData = filteredForms.map((form) => ({
    match: form.matchNumber,
    L1: form.l1CoralsAuto + form.l1CoralsTele,
    L2: form.l2CoralsAuto + form.l2CoralsTele,
    L3: form.l3CoralsAuto + form.l3CoralsTele,
    L4: form.l4CoralsAuto + form.l4CoralsTele,
    total:
      form.l1CoralsAuto +
      form.l1CoralsTele +
      form.l2CoralsAuto +
      form.l2CoralsTele +
      form.l3CoralsAuto +
      form.l3CoralsTele +
      form.l4CoralsAuto +
      form.l4CoralsTele,
  }))

  const autoVsTeleopData = filteredForms.map((form) => ({
    match: form.matchNumber,
    auto: form.l1CoralsAuto + form.l2CoralsAuto + form.l3CoralsAuto + form.l4CoralsAuto,
    teleop: form.l1CoralsTele + form.l2CoralsTele + form.l3CoralsTele + form.l4CoralsTele,
    total:
      form.l1CoralsAuto +
      form.l2CoralsAuto +
      form.l3CoralsAuto +
      form.l4CoralsAuto +
      form.l1CoralsTele +
      form.l2CoralsTele +
      form.l3CoralsTele +
      form.l4CoralsTele,
  }))

  const climbingOverTimeData = filteredForms.map((form) => ({
    match: form.matchNumber,
    climbed: form.highClimb || form.lowClimb ? 1 : 0,
    climbType: form.highClimb ? "High" : form.lowClimb ? "Low" : "None",
  }))

  // Label frequency calculations
  const mobilityCount = filteredForms.filter((form) => form.labels?.includes("mobility")).length
  const dockedCount = filteredForms.filter((form) => form.labels?.includes("docked")).length
  const balancedCount = filteredForms.filter((form) => form.labels?.includes("balanced")).length

  const mobilityPercentage = filteredForms.length > 0 ? ((mobilityCount / filteredForms.length) * 100).toFixed(1) : "0.0"
  const dockedPercentage = filteredForms.length > 0 ? ((dockedCount / filteredForms.length) * 100).toFixed(1) : "0.0"
  const balancedPercentage = filteredForms.length > 0 ? ((balancedCount / filteredForms.length) * 100).toFixed(1) : "0.0"

  const labelFrequencyData = [
    { name: "Mobility", count: mobilityCount, percentage: parseFloat(mobilityPercentage) },
    { name: "Docked", count: dockedCount, percentage: parseFloat(dockedPercentage) },
    { name: "Balanced", count: balancedCount, percentage: parseFloat(balancedPercentage) },
  ]

  const labelOverTimeData = filteredForms.map((form) => ({
    match: form.matchNumber,
    mobility: form.labels?.includes("mobility") ? 1 : 0,
    docked: form.labels?.includes("docked") ? 1 : 0,
    balanced: form.labels?.includes("balanced") ? 1 : 0,
  }))

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
          <p className="text-sm sm:text-base text-muted-foreground">Coral scoring performance and climbing analytics</p>
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
          <p className="text-sm sm:text-base text-muted-foreground">Coral scoring performance and climbing analytics</p>
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
            ? `Coral scoring performance and climbing analytics for Team ${selectedTeam}`
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
                <CardTitle className="text-xs sm:text-sm font-medium">AVG Auto Corals</CardTitle>
                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-4 sm:p-8 pt-0">
                <div className="text-lg sm:text-2xl font-bold">{avgAutoCorals}</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  Per match average
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 p-4 sm:p-8">
                <CardTitle className="text-xs sm:text-sm font-medium">AVG Teleop Corals</CardTitle>
                <Target className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-4 sm:p-8 pt-0">
                <div className="text-lg sm:text-2xl font-bold">{avgTeleopCorals}</div>
                <p className="text-xs text-muted-foreground">Teleop scoring</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 p-4 sm:p-8">
                <CardTitle className="text-xs sm:text-sm font-medium">AVG Net (Both)</CardTitle>
                <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-4 sm:p-8 pt-0">
                <div className="text-lg sm:text-2xl font-bold">{avgNet}</div>
                <p className="text-xs text-muted-foreground">Auto + Teleop net</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 p-4 sm:p-8">
                <CardTitle className="text-xs sm:text-sm font-medium">Climb Success Rate</CardTitle>
                <Target className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-4 sm:p-8 pt-0">
                <div className="text-lg sm:text-2xl font-bold">{climbSuccessRate}%</div>
                <p className="text-xs text-muted-foreground">Successful climbs</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 p-4 sm:p-8">
                <CardTitle className="text-xs sm:text-sm font-medium">Mobility Rate</CardTitle>
                <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-4 sm:p-8 pt-0">
                <div className="text-lg sm:text-2xl font-bold">{mobilityPercentage}%</div>
                <p className="text-xs text-muted-foreground">{mobilityCount} matches</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 p-4 sm:p-8">
                <CardTitle className="text-xs sm:text-sm font-medium">Docked Rate</CardTitle>
                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-4 sm:p-8 pt-0">
                <div className="text-lg sm:text-2xl font-bold">{dockedPercentage}%</div>
                <p className="text-xs text-muted-foreground">{dockedCount} matches</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 p-4 sm:p-8">
                <CardTitle className="text-xs sm:text-sm font-medium">Balanced Rate</CardTitle>
                <Target className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-4 sm:p-8 pt-0">
                <div className="text-lg sm:text-2xl font-bold">{balancedPercentage}%</div>
                <p className="text-xs text-muted-foreground">{balancedCount} matches</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:gap-8 mb-8 sm:mb-10">
            {/* Net Scoring Chart - kept as requested */}
            <Card>
              <CardHeader className="p-6 sm:p-8">
                <CardTitle className="text-base sm:text-lg">Net Scoring Over Time - Team {selectedTeam}</CardTitle>
                <CardDescription className="text-sm">Net scoring performance across matches</CardDescription>
              </CardHeader>
              <CardContent className="p-6 sm:p-8 pt-0">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={netScoringData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="match" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="netAuto" stroke="#4f46e5" strokeWidth={2} name="Net Auto" />
                    <Line type="monotone" dataKey="netTeleop" stroke="#06b6d4" strokeWidth={2} name="Net Teleop" />
                    <Line type="monotone" dataKey="totalNet" stroke="#f59e0b" strokeWidth={2} name="Total Net" />
                  </LineChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-6 mt-6 text-xs sm:text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-[#4f46e5] rounded mr-2"></div>Net Auto
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-[#06b6d4] rounded mr-2"></div>Net Teleop
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-[#f59e0b] rounded mr-2"></div>Total Net
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              <Card>
                <CardHeader className="p-6 sm:p-8">
                  <CardTitle className="text-base sm:text-lg">Coral Scoring by Level - Team {selectedTeam}</CardTitle>
                  <CardDescription className="text-sm">
                    Performance across different coral levels with totals
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 sm:p-8 pt-0">
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={coralByLevelData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="match" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="L1" stackId="a" fill="#4f46e5" />
                      <Bar dataKey="L2" stackId="a" fill="#06b6d4" />
                      <Bar dataKey="L3" stackId="a" fill="#8b5cf6" />
                      <Bar dataKey="L4" stackId="a" fill="#f59e0b" />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap justify-center gap-6 mt-6 text-xs sm:text-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-[#4f46e5] rounded mr-2"></div>L1
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-[#06b6d4] rounded mr-2"></div>L2
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-[#8b5cf6] rounded mr-2"></div>L3
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-[#f59e0b] rounded mr-2"></div>L4
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-6 sm:p-8">
                  <CardTitle className="text-base sm:text-lg">Auto vs Teleop Performance</CardTitle>
                  <CardDescription className="text-sm">Coral scoring comparison between game periods</CardDescription>
                </CardHeader>
                <CardContent className="p-6 sm:p-8 pt-0">
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={autoVsTeleopData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="match" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="auto" stroke="#4f46e5" strokeWidth={2} name="Auto Corals" />
                      <Line type="monotone" dataKey="teleop" stroke="#06b6d4" strokeWidth={2} name="Teleop Corals" />
                      <Line type="monotone" dataKey="total" stroke="#f59e0b" strokeWidth={2} name="Total Corals" />
                    </LineChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-8 mt-6 text-xs sm:text-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-[#4f46e5] rounded mr-2"></div>Auto Corals
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-[#06b6d4] rounded mr-2"></div>Teleop Corals
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-[#f59e0b] rounded mr-2"></div>Total Corals
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="p-6 sm:p-8">
                <CardTitle className="text-base sm:text-lg">Climbing Performance Over Time</CardTitle>
                <CardDescription className="text-sm">Climbing success across matches</CardDescription>
              </CardHeader>
              <CardContent className="p-6 sm:p-8 pt-0">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={climbingOverTimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="match" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} domain={[0, 1]} />
                    <Tooltip
                      formatter={(value, name) => [value === 1 ? "Climbed" : "No Climb", "Status"]}
                      labelFormatter={(label) => `Match ${label}`}
                    />
                    <Bar dataKey="climbed" fill="#4f46e5" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              <Card>
                <CardHeader className="p-6 sm:p-8">
                  <CardTitle className="text-base sm:text-lg">Label Frequency - Team {selectedTeam}</CardTitle>
                  <CardDescription className="text-sm">Percentage of matches with each label applied</CardDescription>
                </CardHeader>
                <CardContent className="p-6 sm:p-8 pt-0">
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={labelFrequencyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Bar dataKey="percentage" fill="#4f46e5" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-6 sm:p-8">
                  <CardTitle className="text-base sm:text-lg">Label Frequency Over Time</CardTitle>
                  <CardDescription className="text-sm">Label application across matches</CardDescription>
                </CardHeader>
                <CardContent className="p-6 sm:p-8 pt-0">
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={labelOverTimeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="match" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} domain={[0, 1]} />
                      <Tooltip
                        formatter={(value) => (value === 1 ? "Yes" : "No")}
                        labelFormatter={(label) => `Match ${label}`}
                      />
                      <Line type="monotone" dataKey="mobility" stroke="#4f46e5" strokeWidth={2} name="Mobility" />
                      <Line type="monotone" dataKey="docked" stroke="#06b6d4" strokeWidth={2} name="Docked" />
                      <Line type="monotone" dataKey="balanced" stroke="#f59e0b" strokeWidth={2} name="Balanced" />
                    </LineChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap justify-center gap-6 mt-6 text-xs sm:text-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-[#4f46e5] rounded mr-2"></div>Mobility
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-[#06b6d4] rounded mr-2"></div>Docked
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-[#f59e0b] rounded mr-2"></div>Balanced
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
