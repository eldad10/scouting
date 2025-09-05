import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, Trophy, BarChart3, Zap, Plus, UserPlus } from "lucide-react"

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <Zap className="h-12 w-12 text-accent mr-3" />
          <h1 className="text-4xl font-bold text-foreground">RoboScout</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your comprehensive scouting platform for robotics competitions. Track teams, manage forms, analyze rankings,
          and dive deep into statistics.
        </p>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <Users className="h-8 w-8 text-accent mx-auto mb-2" />
            <CardTitle>Teams</CardTitle>
            <CardDescription>Search and explore team profiles</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/teams">Browse Teams</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <FileText className="h-8 w-8 text-accent mx-auto mb-2" />
            <CardTitle>Forms</CardTitle>
            <CardDescription>Manage scouting forms and data</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/forms">View Forms</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <Trophy className="h-8 w-8 text-accent mx-auto mb-2" />
            <CardTitle>Rankings</CardTitle>
            <CardDescription>View competition rankings</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/rankings">See Rankings</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <BarChart3 className="h-8 w-8 text-accent mx-auto mb-2" />
            <CardTitle>Statistics</CardTitle>
            <CardDescription>Analyze team performance data</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/statistics">View Stats</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Create New
            </CardTitle>
            <CardDescription>Add new forms and teams to the competition</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                <Link href="/create-form">
                  <FileText className="h-4 w-4 mr-2" />
                  Create Scouting Form
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                <Link href="/create-team">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add New Team
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="h-5 w-5 mr-2" />
              Competition Overview
            </CardTitle>
            <CardDescription>Current competition status and highlights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
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
