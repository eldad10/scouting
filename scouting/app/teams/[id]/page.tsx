import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Trophy, Calendar, ArrowLeft } from "lucide-react"
import Link from "next/link"

// Mock detailed team data
const mockTeamDetails = {
  "254": {
    id: 1,
    number: "254",
    name: "The Cheesy Poofs",
    location: "San Jose, CA",
    founded: 1999,
    rank: 1,
    wins: 45,
    losses: 3,
    ties: 2,
    awards: ["Regional Winner", "Excellence in Engineering", "Chairman's Award", "Innovation in Control"],
    region: "California",
    description:
      "Team 254, The Cheesy Poofs, is a FIRST Robotics Competition team from Bellarmine College Preparatory in San Jose, California. Known for their innovative designs and competitive excellence.",
    stats: {
      avgScore: 156.8,
      highScore: 234,
      autoPoints: 45.2,
      teleopPoints: 89.6,
      endgamePoints: 22.0,
    },
    recentMatches: [
      { opponent: "Team 1678", score: "156-142", result: "Win" },
      { opponent: "Team 148", score: "178-134", result: "Win" },
      { opponent: "Team 2056", score: "145-167", result: "Loss" },
    ],
  },
}

interface TeamDetailPageProps {
  params: {
    id: string
  }
}

export default function TeamDetailPage({ params }: TeamDetailPageProps) {
  const team = mockTeamDetails[params.id as keyof typeof mockTeamDetails]

  if (!team) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="outline" size="sm" asChild className="mb-4 bg-transparent">
          <Link href="/teams">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Teams
          </Link>
        </Button>

        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Team {team.number}</h1>
            <h2 className="text-xl text-muted-foreground">{team.name}</h2>
          </div>
          <Badge variant="secondary" className="bg-accent text-accent-foreground text-lg px-3 py-1">
            Rank #{team.rank}
          </Badge>
        </div>

        <div className="flex items-center space-x-4 text-muted-foreground">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            {team.location}
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Founded {team.founded}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{team.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-muted rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-foreground">{team.stats.avgScore}</div>
                  <div className="text-sm text-muted-foreground">Avg Score</div>
                </div>
                <div className="bg-muted rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-foreground">{team.stats.highScore}</div>
                  <div className="text-sm text-muted-foreground">High Score</div>
                </div>
                <div className="bg-muted rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-foreground">{team.stats.autoPoints}</div>
                  <div className="text-sm text-muted-foreground">Auto Points</div>
                </div>
                <div className="bg-muted rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-foreground">{team.stats.teleopPoints}</div>
                  <div className="text-sm text-muted-foreground">Teleop Points</div>
                </div>
                <div className="bg-muted rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-foreground">{team.stats.endgamePoints}</div>
                  <div className="text-sm text-muted-foreground">Endgame Points</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Matches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {team.recentMatches.map((match, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <div className="font-medium">vs {match.opponent}</div>
                      <div className="text-sm text-muted-foreground">Score: {match.score}</div>
                    </div>
                    <Badge variant={match.result === "Win" ? "default" : "destructive"}>{match.result}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Season Record</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">{team.wins}</div>
                    <div className="text-xs text-green-600 dark:text-green-400">Wins</div>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">{team.losses}</div>
                    <div className="text-xs text-red-600 dark:text-red-400">Losses</div>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3">
                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{team.ties}</div>
                    <div className="text-xs text-yellow-600 dark:text-yellow-400">Ties</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">
                    Win Rate: {Math.round((team.wins / (team.wins + team.losses + team.ties)) * 100)}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-accent" />
                Awards & Recognition
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {team.awards.map((award, index) => (
                  <Badge key={index} variant="outline" className="w-full justify-center py-2">
                    {award}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
