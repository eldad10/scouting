"use client"

import { useState, useEffect } from "react"
import { ArrowUpDown, ArrowUp, ArrowDown, Trophy, Medal, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { api } from "@/lib/api"

type SortField = "ranking" | "teamNumber" | "autoAvg" | "teleopAvg" | "endgameAvg" | "overallAvg"
type SortDirection = "asc" | "desc"

export default function RankingsPage() {
  const [sortField, setSortField] = useState<SortField>("ranking")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [rankingType, setRankingType] = useState("overall")
  const [rankings, setRankings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        setLoading(true)
        const rankingsData = await api.getRankings()
        setRankings(rankingsData)
      } catch (err) {
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
          <p className="text-sm sm:text-base text-muted-foreground">
            Competition standings by coral scoring performance
          </p>
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
          <p className="text-sm sm:text-base text-muted-foreground">
            Competition standings by coral scoring performance
          </p>
        </div>
        <div className="text-center py-8 sm:py-12">
          <h3 className="text-base sm:text-lg font-medium text-foreground mb-2">Error loading rankings</h3>
          <p className="text-muted-foreground text-sm sm:text-base">{error}</p>
        </div>
      </div>
    )
  }

  const filteredRankings = rankings.sort((a, b) => {
    let aValue: number | string
    let bValue: number | string

    // Sort by selected ranking type
    switch (rankingType) {
      case "auto":
        aValue = a.autoAvg || 0
        bValue = b.autoAvg || 0
        break
      case "teleop":
        aValue = a.teleopAvg || 0
        bValue = b.teleopAvg || 0
        break
      case "endgame":
        aValue = a.endgameAvg || 0
        bValue = b.endgameAvg || 0
        break
      default:
        aValue = a[sortField] || 0
        bValue = b[sortField] || 0
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    }

    return 0
  })

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
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

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
      case 3:
        return <Award className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Team Rankings</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Competition standings by coral scoring performance</p>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {filteredRankings.slice(0, 3).map((team, index) => (
          <Card
            key={team.teamNumber}
            className={`${index === 0 ? "sm:order-2" : index === 1 ? "sm:order-1" : "sm:order-3"} hover:shadow-lg transition-shadow`}
          >
            <CardHeader className="text-center pb-2 sm:pb-4">
              <div className="flex items-center justify-center mb-1 sm:mb-2">{getRankIcon(team.ranking)}</div>
              <CardTitle className="text-base sm:text-lg">#{team.ranking}</CardTitle>
              <div className="text-xs sm:text-sm text-muted-foreground">Team {team.teamNumber}</div>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <h3 className="font-semibold text-foreground mb-2 text-sm sm:text-base truncate">{team.teamName}</h3>
              <div className="space-y-1 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span>Auto Avg:</span>
                  <span className="font-medium">{(team.autoAvg || 0).toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Teleop Avg:</span>
                  <span className="font-medium">{(team.teleopAvg || 0).toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Overall Avg:</span>
                  <span className="font-medium">{(team.overallAvg || 0).toFixed(1)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
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
        <CardContent className="p-0 sm:p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 sm:w-16 px-2 sm:px-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("ranking")}
                      className="h-6 sm:h-8 p-0 font-semibold text-xs sm:text-sm"
                    >
                      Rank
                      {getSortIcon("ranking")}
                    </Button>
                  </TableHead>
                  <TableHead className="px-2 sm:px-4">
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
                  <TableHead className="px-1 sm:px-4 hidden sm:table-cell">
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
                  <TableHead className="px-1 sm:px-4 hidden sm:table-cell">
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
                  <TableHead className="px-1 sm:px-4 hidden md:table-cell">
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
                  <TableHead className="px-2 sm:px-4">
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRankings.map((team) => (
                  <TableRow key={team.teamNumber} className="hover:bg-muted/50">
                    <TableCell className="font-medium px-2 sm:px-4">
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        {getRankIcon(team.ranking)}
                        <span className="text-xs sm:text-sm">{team.ranking}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-2 sm:px-4">
                      <Link href={`/statistics?team=${team.teamNumber}`} className="hover:underline">
                        <div>
                          <div className="font-medium text-xs sm:text-sm">Team {team.teamNumber}</div>
                          <div className="text-xs text-muted-foreground truncate max-w-[100px] sm:max-w-none">
                            {team.teamName}
                          </div>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell className="font-medium px-1 sm:px-4 text-xs sm:text-sm hidden sm:table-cell">
                      {(team.autoAvg || 0).toFixed(1)}
                    </TableCell>
                    <TableCell className="font-medium px-1 sm:px-4 text-xs sm:text-sm hidden sm:table-cell">
                      {(team.teleopAvg || 0).toFixed(1)}
                    </TableCell>
                    <TableCell className="font-medium px-1 sm:px-4 text-xs sm:text-sm hidden md:table-cell">
                      {(team.endgameAvg || 0).toFixed(1)}
                    </TableCell>
                    <TableCell className="font-medium px-2 sm:px-4">
                      <Badge variant="outline" className="font-medium text-xs sm:text-sm">
                        {(team.overallAvg || 0).toFixed(1)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
