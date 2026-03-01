'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { api } from '@/lib/api'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { Trophy, TrendingUp, Zap, Target, Shield } from 'lucide-react'

interface TrendData {
  match: number
  auto: number
  teleop: number
  total: number
  climb: number
  defence: number
  delivery: number
}

export default function TrendsPage() {
  const [selectedTeam, setSelectedTeam] = useState<string>('')
  const [trendData, setTrendData] = useState<TrendData[]>([])
  const [teams, setTeams] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({ avgScore: 0, maxScore: 0, minScore: 0, consistency: 0 })

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const forms = await api.getForms()
        const uniqueTeams = [...new Set(forms.map((f) => f.teamNumber))].sort()
        setTeams(uniqueTeams)
        if (uniqueTeams.length > 0) {
          setSelectedTeam(uniqueTeams[0])
        }
      } catch (err) {
        console.error('Failed to fetch teams')
      }
    }
    fetchTeams()
  }, [])

  useEffect(() => {
    const fetchTrends = async () => {
      if (!selectedTeam) return

      setLoading(true)
      try {
        const forms = await api.getForms()
        const teamForms = forms
          .filter((f) => f.teamNumber === selectedTeam)
          .sort((a, b) => a.matchNumber - b.matchNumber)

        const data: TrendData[] = teamForms.map((form) => {
          const autoScore =
            (form.autoBalls === '0-5'
              ? 2.5
              : form.autoBalls === '5-10'
                ? 7.5
                : form.autoBalls === '10-15'
                  ? 12.5
                  : form.autoBalls === '15-20'
                    ? 17.5
                    : form.autoBalls === '20+'
                      ? 22.5
                      : 0) + (form.autoClimb ? 15 : 0)

          const teleopScore =
            (form.teleopBalls === '0-10'
              ? 5
              : form.teleopBalls === '10-20'
                ? 15
                : form.teleopBalls === '20-40'
                  ? 30
                  : form.teleopBalls === '40-60'
                    ? 50
                    : form.teleopBalls === '60-80'
                      ? 70
                      : form.teleopBalls === '80-100'
                        ? 90
                        : form.teleopBalls === '100+'
                          ? 110
                          : 0) +
            (form.teleopClimbLevel === 1
              ? 10
              : form.teleopClimbLevel === 2
                ? 20
                : form.teleopClimbLevel === 3
                  ? 30
                  : 0)

          const climbScore =
            (form.autoClimb ? 15 : 0) +
            (form.teleopClimbLevel === 1
              ? 10
              : form.teleopClimbLevel === 2
                ? 20
                : form.teleopClimbLevel === 3
                  ? 30
                  : 0)

          return {
            match: form.matchNumber,
            auto: Math.round(autoScore * 10) / 10,
            teleop: Math.round(teleopScore * 10) / 10,
            climb: Math.round(climbScore * 10) / 10,
            total: Math.round((autoScore + teleopScore) * 10) / 10,
            defence: form.defenceRating || 0,
            delivery: form.deliveryRating || 0
          }
        })

        setTrendData(data)

        // Calculate statistics
        const totalScores = data.map((d) => d.total)
        const avgScore = totalScores.length > 0 ? Math.round((totalScores.reduce((a, b) => a + b) / totalScores.length) * 10) / 10 : 0
        const maxScore = totalScores.length > 0 ? Math.max(...totalScores) : 0
        const minScore = totalScores.length > 0 ? Math.min(...totalScores) : 0

        // Standard deviation for consistency (lower = more consistent)
        let consistency = 0
        if (totalScores.length > 1) {
          const variance = totalScores.reduce((sum, score) => sum + Math.pow(score - avgScore, 2), 0) / totalScores.length
          consistency = Math.round(Math.sqrt(variance) * 10) / 10
        }

        setStats({ avgScore, maxScore, minScore, consistency })
      } finally {
        setLoading(false)
      }
    }

    fetchTrends()
  }, [selectedTeam])

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-900 p-2 rounded border border-border shadow-lg">
          <p className="font-semibold text-sm">Match {payload[0].payload.match}</p>
          {payload.map((entry: any) => (
            <p key={entry.name} style={{ color: entry.color }} className="text-xs">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-6xl">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Performance Trends</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Track team performance across multiple matches with detailed analytics
        </p>
      </div>

      {/* Team Selector */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Select Team to Analyze</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedTeam} onValueChange={setSelectedTeam}>
            <SelectTrigger className="w-full sm:w-64">
              <SelectValue placeholder="Select a team..." />
            </SelectTrigger>
            <SelectContent>
              {teams.map((team) => (
                <SelectItem key={team} value={team}>
                  Team {team}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {trendData.length > 0 && (
        <>
          {/* Statistics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-accent mb-2" />
                  <div className="text-lg sm:text-2xl font-bold text-foreground">{stats.avgScore}</div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Average Score</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 mb-2" />
                  <div className="text-lg sm:text-2xl font-bold text-green-600">{stats.maxScore}</div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Best Match</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mb-2" />
                  <div className="text-lg sm:text-2xl font-bold text-red-600">{stats.minScore}</div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Worst Match</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 mb-2" />
                  <div className="text-lg sm:text-2xl font-bold text-blue-600">{stats.consistency}</div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Variability</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Total Score Trend */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg flex items-center">
                <Trophy className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-accent" />
                Total Score Trend
              </CardTitle>
              <CardDescription>Overall score performance across matches</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-80 sm:h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis
                      dataKey="match"
                      stroke="var(--color-muted-foreground)"
                      label={{ value: 'Match Number', position: 'insideBottomRight', offset: -5 }}
                    />
                    <YAxis stroke="var(--color-muted-foreground)" label={{ value: 'Score', angle: -90, position: 'insideLeft' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                      type="linear"
                      dataKey="total"
                      stroke="hsl(var(--accent))"
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--accent))', r: 5 }}
                      activeDot={{ r: 7 }}
                      isAnimationActive={true}
                      name="Total"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Match Details Table */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Match Details</CardTitle>
              <CardDescription>Detailed score breakdown for each match</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border">
                    <tr>
                      <th className="text-left py-2 px-2 font-semibold">Match</th>
                      <th className="text-right py-2 px-2 font-semibold">Auto</th>
                      <th className="text-right py-2 px-2 font-semibold">Teleop</th>
                      <th className="text-right py-2 px-2 font-semibold">Climb</th>
                      <th className="text-right py-2 px-2 font-semibold">Total</th>
                      <th className="text-center py-2 px-2 font-semibold">Defence</th>
                      <th className="text-center py-2 px-2 font-semibold">Delivery</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trendData.map((row) => (
                      <tr key={row.match} className="border-b border-border hover:bg-slate-50 dark:hover:bg-slate-900/30">
                        <td className="py-2 px-2 font-semibold">{row.match}</td>
                        <td className="text-right py-2 px-2 text-blue-600 dark:text-blue-400">{row.auto}</td>
                        <td className="text-right py-2 px-2 text-green-600 dark:text-green-400">{row.teleop}</td>
                        <td className="text-right py-2 px-2 text-purple-600 dark:text-purple-400">{row.climb}</td>
                        <td className="text-right py-2 px-2 font-bold text-accent">{row.total}</td>
                        <td className="text-center py-2 px-2">{row.defence}/5</td>
                        <td className="text-center py-2 px-2">{row.delivery}/5</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Score Breakdown */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg flex items-center">
                <Zap className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-600" />
                Phase Breakdown
              </CardTitle>
              <CardDescription>Auto, Teleop, and Climb scores across matches</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-80 sm:h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis
                      dataKey="match"
                      stroke="var(--color-muted-foreground)"
                      label={{ value: 'Match Number', position: 'insideBottomRight', offset: -5 }}
                    />
                    <YAxis stroke="var(--color-muted-foreground)" label={{ value: 'Score', angle: -90, position: 'insideLeft' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line type="monotone" dataKey="auto" stroke="#3b82f6" strokeWidth={2} name="Auto" />
                    <Line type="monotone" dataKey="teleop" stroke="#10b981" strokeWidth={2} name="Teleop" />
                    <Line type="monotone" dataKey="climb" stroke="#8b5cf6" strokeWidth={2} name="Climb" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Defense & Delivery Ratings */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg flex items-center">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-green-600" />
                Quality Ratings
              </CardTitle>
              <CardDescription>Defence and Delivery performance ratings (0-5 scale)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-80 sm:h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis
                      dataKey="match"
                      stroke="var(--color-muted-foreground)"
                      label={{ value: 'Match Number', position: 'insideBottomRight', offset: -5 }}
                    />
                    <YAxis
                      stroke="var(--color-muted-foreground)"
                      domain={[0, 5]}
                      label={{ value: 'Rating', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="defence" fill="#10b981" name="Defence" />
                    <Bar dataKey="delivery" fill="#f59e0b" name="Delivery" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>


        </>
      )}

      {selectedTeam && trendData.length === 0 && !loading && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Trophy className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">No match data available for Team {selectedTeam} yet</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
