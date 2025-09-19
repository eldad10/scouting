"use client"

import { useState, useEffect } from "react"
import { ArrowUpDown, ArrowUp, ArrowDown, Trophy, Medal, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { api, RankingData } from "@/lib/api"

type SortField = "ranking" | "teamNumber" | "autoAvg" | "teleopAvg" | "endgameAvg" | "overallAvg"
type SortDirection = "asc" | "desc"

export default function RankingsPage() {
  const [sortField, setSortField] = useState<SortField>("overallAvg")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [rankingType, setRankingType] = useState("overall")
  const [rankings, setRankings] = useState<RankingData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        setLoading(true)
        const rankingsData = await api.getRankings()
        setRankings(rankingsData)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchRankings()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Team Rankings</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Competition standings by overall performance</p>
        </div>
        <div className="text-center py-8 sm:py-12">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-primary mx-auto mb-3 sm:mb-4"></div>
          <p className="text-muted-foreground text-sm sm:text-base">Loading rankings...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Team Rankings</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Competition standings by overall performance</p>
        </div>
        <div className="text-center py-8 sm:py-12">
          <h3 className="text-base sm:text-lg font-medium text-foreground mb-2">Error loading rankings</h3>
          <p className="text-muted-foreground text-sm sm:text-base">{error}</p>
        </div>
      </div>
    )
  }

  const overallRankings = [...rankings].sort((a, b) => (b.overallAvg || 0) - (a.overallAvg || 0))
  const teamsWithOverallRank = rankings.map((team) => {
    const overallRank = overallRankings.findIndex((t) => t.teamNumber === team.teamNumber) + 1
    return { ...team, overallRank }
  })

  const filteredRankings = teamsWithOverallRank.sort((a, b) => {
    let aValue: number | string
    let bValue: number | string

    switch (sortField) {
      case "teamNumber":
        aValue = a.teamNumber || 0
        bValue = b.teamNumber || 0
        break
      case "autoAvg":
        aValue = a.autoAvg || 0
        bValue = b.autoAvg || 0
        break
      case "teleopAvg":
        aValue = a.teleopAvg || 0
        bValue = b.teleopAvg || 0
        break
      case "endgameAvg":
        aValue = a.endgameAvg || 0
        bValue = b.endgameAvg || 0
        break
      default:
        aValue = a.overallAvg || 0
        bValue = b.overallAvg || 0
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "desc" ? bValue - aValue : aValue - bValue
    }

    return 0
  })

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection(field === "teamNumber" ? "asc" : "desc") // Team number ascending by default, others descending
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-3 w-3 sm:h-4 sm:w-4" />
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="h-3 w-3 sm:h-4 sm:w-4" />
    ) : (
      <ArrowDown className="h-3 w-3 sm:h-4 sm:w-4" />
    )
  }

  const getRankIcon = (overallRank: number) => {
    switch (overallRank) {
      case 1:
        return <Crown className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
      case 2:
        return <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
      case 3:
        return <Medal className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
      default:
        return null
    }
  }

  const overallRankingsTopThree = overallRankings.slice(0, 3)

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Team Rankings</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Competition standings by overall performance</p>
      </div>

      <div className="mb-4 sm:mb-8">
        <div className="flex justify-center items-end gap-1 sm:gap-4 mb-4">
          {/* Second Place */}
          {overallRankingsTopThree[1] && (
            <Card className="w-20 sm:w-32 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center pb-1 sm:pb-2 p-2 sm:p-4">
                <div className="flex items-center justify-center mb-1">
                  <Trophy className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                </div>
                <CardTitle className="text-xs sm:text-sm">#2</CardTitle>
                <div className="text-xs text-muted-foreground">Team {overallRankingsTopThree[1].teamNumber}</div>
              </CardHeader>
              <CardContent className="text-center pt-0 p-1 sm:p-4">
                <h3 className="font-semibold text-xs sm:text-sm truncate mb-1">
                  {overallRankingsTopThree[1].teamName}
                </h3>
                <div className="text-xs font-medium">{(overallRankingsTopThree[1].overallAvg || 0).toFixed(1)}</div>
              </CardContent>
            </Card>
          )}

          {/* First Place - Elevated */}
          {overallRankingsTopThree[0] && (
            <Card className="w-24 sm:w-36 hover:shadow-lg transition-shadow transform -translate-y-2 sm:-translate-y-4">
              <CardHeader className="text-center pb-1 sm:pb-2 p-2 sm:p-4">
                <div className="flex items-center justify-center mb-1">
                  <Crown className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
                </div>
                <CardTitle className="text-sm sm:text-base">#1</CardTitle>
                <div className="text-xs text-muted-foreground">Team {overallRankingsTopThree[0].teamNumber}</div>
              </CardHeader>
              <CardContent className="text-center pt-0 p-1 sm:p-4">
                <h3 className="font-semibold text-xs sm:text-sm truncate mb-1">
                  {overallRankingsTopThree[0].teamName}
                </h3>
                <div className="text-xs sm:text-sm font-medium">
                  {(overallRankingsTopThree[0].overallAvg || 0).toFixed(1)}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Third Place */}
          {overallRankingsTopThree[2] && (
            <Card className="w-20 sm:w-32 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center pb-1 sm:pb-2 p-2 sm:p-4">
                <div className="flex items-center justify-center mb-1">
                  <Medal className="h-3 w-3 sm:h-4 sm:w-4 text-amber-600" />
                </div>
                <CardTitle className="text-xs sm:text-sm">#3</CardTitle>
                <div className="text-xs text-muted-foreground">Team {overallRankingsTopThree[2].teamNumber}</div>
              </CardHeader>
              <CardContent className="text-center pt-0 p-1 sm:p-4">
                <h3 className="font-semibold text-xs sm:text-sm truncate mb-1">
                  {overallRankingsTopThree[2].teamName}
                </h3>
                <div className="text-xs font-medium">{(overallRankingsTopThree[2].overallAvg || 0).toFixed(1)}</div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <div className="mb-4 sm:mb-6 flex flex-col gap-3 sm:gap-4">
        <Select value={rankingType} onValueChange={setRankingType}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Ranking Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="overall">Overall Ranking</SelectItem>
            <SelectItem value="auto">Auto Ranking</SelectItem>
            <SelectItem value="teleop">Teleop Ranking</SelectItem>
            <SelectItem value="endgame">Endgame Ranking</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Rankings Table */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-base sm:text-lg">Team Rankings</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="min-w-[500px] sm:min-w-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16 px-2 sticky left-0 bg-background">
                      <div className="font-semibold text-xs sm:text-sm">Rank</div>
                    </TableHead>
                    <TableHead className="px-2 min-w-[120px] sticky left-16 bg-background">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort("teamNumber")}
                        className="h-6 sm:h-8 p-0 font-semibold text-xs sm:text-sm"
                      >
                        Team
                        {getSortIcon("teamNumber")}
                      </Button>
                    </TableHead>
                    <TableHead className="px-2 min-w-[80px]">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort("overallAvg")}
                        className="h-6 sm:h-8 p-0 font-semibold text-xs sm:text-sm"
                      >
                        Overall
                        {getSortIcon("overallAvg")}
                      </Button>
                    </TableHead>
                    <TableHead className="px-2 min-w-[80px]">
                      <div className="font-semibold text-xs sm:text-sm">Overall Rank</div>
                    </TableHead>
                    <TableHead className="px-2 min-w-[80px]">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort("autoAvg")}
                        className="h-6 sm:h-8 p-0 font-semibold text-xs sm:text-sm"
                      >
                        Auto
                        {getSortIcon("autoAvg")}
                      </Button>
                    </TableHead>
                    <TableHead className="px-2 min-w-[80px]">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort("teleopAvg")}
                        className="h-6 sm:h-8 p-0 font-semibold text-xs sm:text-sm"
                      >
                        Teleop
                        {getSortIcon("teleopAvg")}
                      </Button>
                    </TableHead>
                    <TableHead className="px-2 min-w-[80px]">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort("endgameAvg")}
                        className="h-6 sm:h-8 p-0 font-semibold text-xs sm:text-sm"
                      >
                        Endgame
                        {getSortIcon("endgameAvg")}
                      </Button>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRankings.map((team, index) => (
                    <TableRow key={team.teamNumber} className="hover:bg-muted/50">
                      <TableCell className="font-medium px-2 sticky left-0 bg-background">
                        <div className="flex items-center space-x-1">
                          {getRankIcon(team.overallRank)}
                          <span className="text-xs sm:text-sm">{index + 1}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-2 sticky left-16 bg-background">
                        <Link href={`/statistics?team=${team.teamNumber}`} className="hover:underline">
                          <div>
                            <div className="font-medium text-xs sm:text-sm">Team {team.teamNumber}</div>
                            <div className="text-xs text-muted-foreground truncate max-w-[100px]">{team.teamName}</div>
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell className="font-medium px-2">
                        <Badge variant="outline" className="font-medium text-xs sm:text-sm">
                          {(team.overallAvg || 0).toFixed(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium px-2 text-xs sm:text-sm">
                        <div className="flex items-center space-x-1">
                          {getRankIcon(team.overallRank)}
                          <span>#{team.overallRank}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium px-2 text-xs sm:text-sm">
                        {(team.autoAvg || 0).toFixed(1)}
                      </TableCell>
                      <TableCell className="font-medium px-2 text-xs sm:text-sm">
                        {(team.teleopAvg || 0).toFixed(1)}
                      </TableCell>
                      <TableCell className="font-medium px-2 text-xs sm:text-sm">
                        {(team.endgameAvg || 0).toFixed(1)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 sm:mt-8 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-lg sm:text-2xl font-bold text-foreground">{filteredRankings.length}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Total Teams</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-lg sm:text-2xl font-bold text-foreground">
              {Math.max(...filteredRankings.map((t) => t.overallAvg || 0)).toFixed(1)}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">Highest Avg</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-lg sm:text-2xl font-bold text-foreground">
              {(filteredRankings.reduce((sum, t) => sum + (t.autoAvg || 0), 0) / filteredRankings.length).toFixed(1)}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">Avg Auto</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-lg sm:text-2xl font-bold text-foreground">
              {(filteredRankings.reduce((sum, t) => sum + (t.teleopAvg || 0), 0) / filteredRankings.length).toFixed(1)}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">Avg Teleop</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
