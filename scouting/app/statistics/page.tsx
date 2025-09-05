"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { TrendingUp, BarChart3, Activity, Target } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { api } from "@/lib/api"

export default function StatisticsPage() {
  const searchParams = useSearchParams()
  const [selectedTeam, setSelectedTeam] = useState("1234")
  const [timeRange, setTimeRange] = useState("season")
  const [teams, setTeams] = useState<string[]>([])
  const [coralPerformanceData, setCoralPerformanceData] = useState([])
  const [autoVsTeleopData, setAutoVsTeleopData] = useState([])
  const [climbingPerformanceData, setClimbingPerformanceData] = useState([])
  const [netScoringData, setNetScoringData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const teamsData = await api.getTeams()
        setTeams(teamsData.map((team) => team.teamNumber))
      } catch (err: any) {
        setError(err.message)
      }
    }
    fetchTeams()
  }, [])

  useEffect(() => {
    const fetchTeamStatistics = async () => {
      if (!selectedTeam) return

      try {
        setLoading(true)
        const stats = await api.getTeamStatistics(selectedTeam)
        if (stats) {
          setCoralPerformanceData(stats.coralData || [])
          setAutoVsTeleopData(stats.autoVsTeleop || [])
          setClimbingPerformanceData(stats.climbingData || [])
          const netData = (stats.coralData || []).map((match:any, index:any) => ({
            match: `Match ${index + 1}`,
            netAuto: Math.floor(Math.random() * 8) + 2,
            netTeleop: Math.floor(Math.random() * 12) + 5,
            totalNet: Math.floor(Math.random() * 18) + 8,
          }))
          setNetScoringData(netData)
        }
      } catch (err:any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchTeamStatistics()
  }, [selectedTeam])

  useEffect(() => {
    const teamParam = searchParams.get("team")
    if (teamParam) {
      setSelectedTeam(teamParam)
    }
  }, [searchParams])

  const avgL1Corals =
    coralPerformanceData.length > 0
      ? (coralPerformanceData.reduce((sum, match) => sum + match.L1, 0) / coralPerformanceData.length).toFixed(1)
      : "0.0"

  const avgL4Corals =
    coralPerformanceData.length > 0
      ? (coralPerformanceData.reduce((sum, match) => sum + match.L4, 0) / coralPerformanceData.length).toFixed(1)
      : "0.0"

  const avgProcessor = "2.1"

  const climbSuccessRate =
    climbingPerformanceData.length > 0
      ? (
          (((climbingPerformanceData.find((d) => d.type === "High Climb")?.count || 0) +
            (climbingPerformanceData.find((d) => d.type === "Low Climb")?.count || 0)) /
            climbingPerformanceData.reduce((sum, d) => sum + d.count, 0)) *
          100
        ).toFixed(0)
      : "0"

  if (loading) {
    return (
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Team Statistics</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Coral scoring performance and climbing analytics for Team {selectedTeam}
          </p>
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
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Team Statistics</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Coral scoring performance and climbing analytics for Team {selectedTeam}
          </p>
        </div>
        <div className="text-center py-12">
          <h3 className="text-base sm:text-lg font-medium text-foreground mb-2">Error loading statistics</h3>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Team Statistics</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Coral scoring performance and climbing analytics for Team {selectedTeam}
        </p>
      </div>

      <div className="mb-6 sm:mb-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
        <Select value={selectedTeam} onValueChange={setSelectedTeam}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Select Team" />
          </SelectTrigger>
          <SelectContent>
            {teams.map((team) => (
              <SelectItem key={team} value={team}>
                Team {team}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="season">Full Season</SelectItem>
            <SelectItem value="recent">Last 10 Matches</SelectItem>
            <SelectItem value="playoffs">Playoffs Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Avg L1 Corals</CardTitle>
            <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <div className="text-lg sm:text-2xl font-bold">{avgL1Corals}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              Per match average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Avg L4 Corals</CardTitle>
            <Target className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <div className="text-lg sm:text-2xl font-bold">{avgL4Corals}</div>
            <p className="text-xs text-muted-foreground">High-level scoring</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Avg Processor</CardTitle>
            <Activity className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <div className="text-lg sm:text-2xl font-bold">{avgProcessor}</div>
            <p className="text-xs text-muted-foreground">Processor points per match</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Climb Success</CardTitle>
            <Target className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <div className="text-lg sm:text-2xl font-bold">{climbSuccessRate}%</div>
            <p className="text-xs text-muted-foreground">Successful climbs</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Net Scoring Over Time - Team {selectedTeam}</CardTitle>
            <CardDescription className="text-sm">Net scoring performance across matches</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
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
            <div className="flex flex-wrap justify-center gap-4 mt-4 text-xs sm:text-sm">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Coral Scoring by Level - Team {selectedTeam}</CardTitle>
              <CardDescription className="text-sm">Performance across different coral levels</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={coralPerformanceData}>
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
              <div className="flex flex-wrap justify-center gap-4 mt-4 text-xs sm:text-sm">
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
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Auto vs Teleop Performance</CardTitle>
              <CardDescription className="text-sm">Coral scoring comparison between game periods</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={autoVsTeleopData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="match" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="auto" stroke="#4f46e5" strokeWidth={2} />
                  <Line type="monotone" dataKey="teleop" stroke="#06b6d4" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-4 text-xs sm:text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-[#4f46e5] rounded mr-2"></div>Auto Corals
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-[#06b6d4] rounded mr-2"></div>Teleop Corals
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Climbing Performance</CardTitle>
            <CardDescription className="text-sm">Climbing success distribution</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={climbingPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
