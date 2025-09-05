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
  const [teams, setTeams] = useState([])
  const [coralPerformanceData, setCoralPerformanceData] = useState([])
  const [autoVsTeleopData, setAutoVsTeleopData] = useState([])
  const [climbingPerformanceData, setClimbingPerformanceData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const teamsData = await api.getTeams()
        setTeams(teamsData.map((team) => team.teamNumber))
      } catch (err) {
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
        }
      } catch (err) {
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

  const avgProcessor = "2.1" // Static for now since it's in the API response

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
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Team Statistics</h1>
          <p className="text-muted-foreground">
            Coral scoring performance and climbing analytics for Team {selectedTeam}
          </p>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading team statistics...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Team Statistics</h1>
          <p className="text-muted-foreground">
            Coral scoring performance and climbing analytics for Team {selectedTeam}
          </p>
        </div>
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-foreground mb-2">Error loading statistics</h3>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Team Statistics</h1>
        <p className="text-muted-foreground">
          Coral scoring performance and climbing analytics for Team {selectedTeam}
        </p>
      </div>

      {/* Controls */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <Select value={selectedTeam} onValueChange={setSelectedTeam}>
          <SelectTrigger className="sm:w-48">
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
          <SelectTrigger className="sm:w-48">
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="season">Full Season</SelectItem>
            <SelectItem value="recent">Last 10 Matches</SelectItem>
            <SelectItem value="playoffs">Playoffs Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg L1 Corals</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgL1Corals}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              Per match average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg L4 Corals</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgL4Corals}</div>
            <p className="text-xs text-muted-foreground">High-level scoring</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Processor</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgProcessor}</div>
            <p className="text-xs text-muted-foreground">Processor points per match</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Climb Success</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{climbSuccessRate}%</div>
            <p className="text-xs text-muted-foreground">Successful climbs</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Coral Scoring by Level - Team {selectedTeam}</CardTitle>
            <CardDescription>Performance across different coral levels</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={coralPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="match" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="L1" stackId="a" fill="#4f46e5" />
                <Bar dataKey="L2" stackId="a" fill="#06b6d4" />
                <Bar dataKey="L3" stackId="a" fill="#8b5cf6" />
                <Bar dataKey="L4" stackId="a" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-4 mt-4 text-sm">
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
          <CardHeader>
            <CardTitle>Auto vs Teleop Performance</CardTitle>
            <CardDescription>Coral scoring comparison between game periods</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={autoVsTeleopData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="match" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="auto" stroke="#4f46e5" strokeWidth={2} />
                <Line type="monotone" dataKey="teleop" stroke="#06b6d4" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-6 mt-4 text-sm">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Climbing Performance</CardTitle>
            <CardDescription>Climbing success distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={climbingPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
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
