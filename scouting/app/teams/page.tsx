"use client"

import { useState, useEffect } from "react"
import { Search, Users, Trophy } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { api, type Team } from "@/lib/api"

export default function TeamsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterBy, setFilterBy] = useState("all")
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true)
      try {
        const teamsData = await api.getTeams()
        setTeams(teamsData)
      } catch (error) {
        console.error("Failed to fetch teams:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchTeams()
  }, [])

  useEffect(() => {
    const searchTeams = async () => {
      if (searchTerm.trim()) {
        setLoading(true)
        try {
          const searchResults = await api.getTeams(searchTerm)
          setTeams(searchResults)
        } catch (error) {
          console.error("Failed to search teams:", error)
        } finally {
          setLoading(false)
        }
      } else {
        // If search is empty, fetch all teams
        const fetchAllTeams = async () => {
          const allTeams = await api.getTeams()
          setTeams(allTeams)
        }
        fetchAllTeams()
      }
    }

    const debounceTimer = setTimeout(searchTeams, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchTerm])

  const filteredTeams = teams
    .filter((team) => {
      switch (filterBy) {
        case "top5":
          return team.ranking && team.ranking <= 5
        case "top10":
          return team.ranking && team.ranking <= 10
        case "ranked":
          return team.ranking !== undefined && team.ranking !== null
        case "unranked":
          return !team.ranking
        case "all":
        default:
          return true
      }
    })
    .sort((a, b) => {
      // Default sort by team number
      return Number.parseInt(a.teamNumber) - Number.parseInt(b.teamNumber)
    })

  // Function to get ranking badge color
  const getRankingBadgeColor = (ranking: number) => {
    if (ranking === 1) return "bg-yellow-500 text-yellow-900"
    if (ranking === 2) return "bg-gray-400 text-gray-900"
    if (ranking === 3) return "bg-amber-600 text-amber-900"
    if (ranking <= 5) return "bg-blue-500 text-blue-900"
    return "bg-slate-500 text-slate-900"
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Team Search</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Search and explore robotics teams in this competition
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-6 sm:mb-8 space-y-3 sm:space-y-4">
        <div className="flex flex-col gap-3 sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by team name or number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:gap-4">
          <Select value={filterBy} onValueChange={setFilterBy}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter teams" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Teams</SelectItem>
              <SelectItem value="top5">Top 5 Teams</SelectItem>
              <SelectItem value="top10">Top 10 Teams</SelectItem>
              <SelectItem value="ranked">Ranked Teams</SelectItem>
              <SelectItem value="unranked">Unranked Teams</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-4 sm:mb-6">
        <p className="text-xs sm:text-sm text-muted-foreground">
          {loading ? "Loading teams..." : `Showing ${filteredTeams.length} teams`}
        </p>
      </div>

      {/* Team Results Grid */}
      {loading ? (
        <div className="text-center py-8 sm:py-12">
          <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-3 sm:mt-4 text-sm sm:text-base">Loading teams...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {filteredTeams.map((team) => (
            <Card key={team.teamNumber} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3 sm:pb-6">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-base sm:text-lg truncate">Team {team.teamNumber}</CardTitle>
                    <CardDescription className="font-medium text-foreground text-sm sm:text-base truncate">
                      {team.teamName}
                    </CardDescription>
                  </div>
                  {team.ranking && (
                    <div
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ml-2 ${getRankingBadgeColor(team.ranking)}`}
                    >
                      <Trophy className="h-3 w-3" />#{team.ranking}
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 pt-0">
                <Link href={`/statistics?team=${team.teamNumber}`}>
                  <Button className="w-full text-sm sm:text-base" size="sm">
                    View Statistics
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && filteredTeams.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <Users className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
          <h3 className="text-base sm:text-lg font-medium text-foreground mb-2">No teams found</h3>
          <p className="text-muted-foreground text-sm sm:text-base">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  )
}
