import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, Trophy, BarChart3, Zap, Plus, UserPlus } from "lucide-react"

export default function HomePage() {
  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 pb-20 sm:pb-8">
      {/* Hero Section */}
      <div className="text-center mb-8 sm:mb-12">
        <div className="flex items-center justify-center mb-3 sm:mb-4">
          <Zap className="h-8 w-8 sm:h-12 sm:w-12 text-accent mr-2 sm:mr-3" />
          <h1 className="text-2xl sm:text-4xl font-bold text-foreground">RoboScout</h1>
        </div>
        <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
          Your comprehensive scouting platform for robotics competitions. Track teams, manage forms, analyze rankings,
          and dive deep into statistics.
        </p>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8 sm:mb-12">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center p-3 sm:p-6">
            <Users className="h-6 w-6 sm:h-8 sm:w-8 text-accent mx-auto mb-1 sm:mb-2" />
            <CardTitle className="text-sm sm:text-base">Teams</CardTitle>
            <CardDescription className="text-xs sm:text-sm hidden sm:block">
              Search and explore team profiles
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <Button asChild className="w-full text-xs sm:text-sm h-8 sm:h-10">
              <Link href="/teams">Browse Teams</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center p-3 sm:p-6">
            <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-accent mx-auto mb-1 sm:mb-2" />
            <CardTitle className="text-sm sm:text-base">Forms</CardTitle>
            <CardDescription className="text-xs sm:text-sm hidden sm:block">
              Manage scouting forms and data
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <Button asChild className="w-full text-xs sm:text-sm h-8 sm:h-10">
              <Link href="/forms">View Forms</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center p-3 sm:p-6">
            <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-accent mx-auto mb-1 sm:mb-2" />
            <CardTitle className="text-sm sm:text-base">Rankings</CardTitle>
            <CardDescription className="text-xs sm:text-sm hidden sm:block">View competition rankings</CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <Button asChild className="w-full text-xs sm:text-sm h-8 sm:h-10">
              <Link href="/rankings">See Rankings</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center p-3 sm:p-6">
            <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-accent mx-auto mb-1 sm:mb-2" />
            <CardTitle className="text-sm sm:text-base">Statistics</CardTitle>
            <CardDescription className="text-xs sm:text-sm hidden sm:block">
              Analyze team performance data
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <Button asChild className="w-full text-xs sm:text-sm h-8 sm:h-10">
              <Link href="/statistics">View Stats</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 gap-4 sm:gap-8">
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center text-base sm:text-lg">
              <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Create New
            </CardTitle>
            <CardDescription className="text-sm">Add new forms and teams to the competition</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="space-y-2 sm:space-y-3">
              <Button variant="outline" className="w-full justify-start bg-transparent text-sm h-9 sm:h-10" asChild>
                <Link href="/create-form">
                  <FileText className="h-4 w-4 mr-2" />
                  Create Scouting Form
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent text-sm h-9 sm:h-10" asChild>
                <Link href="/create-team">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add New Team
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center text-base sm:text-lg">
              <Trophy className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Competition Overview
            </CardTitle>
            <CardDescription className="text-sm">Current competition status and highlights</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="space-y-2 sm:space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Teams Registered</span>
                <span className="font-semibold">64</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Forms Submitted</span>
                <span className="font-semibold">156</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Matches Played</span>
                <span className="font-semibold">32</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
