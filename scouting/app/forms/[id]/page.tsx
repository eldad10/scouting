"use client"

import { useState, useEffect } from "react"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User, ArrowLeft, Trophy, Target, Zap, Clock } from "lucide-react"
import Link from "next/link"
import { api, Form } from "@/lib/api"

interface FormDetailPageProps {
  params: {
    id: string
  }
}

export default function FormDetailPage({ params }: FormDetailPageProps) {
  const [form, setForm] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchForm = async () => {
      try {
        setLoading(true)
        const formData = await api.getFormById(params.id)
        if (!formData) {
          notFound()
        }
        setForm(formData)
      } catch (err:any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchForm()
  }, [params.id])

  if (loading) {
    return (
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="text-center py-8 sm:py-12">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-primary mx-auto mb-3 sm:mb-4"></div>
          <p className="text-muted-foreground text-sm sm:text-base">Loading form details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="text-center py-8 sm:py-12">
          <h3 className="text-base sm:text-lg font-medium text-foreground mb-2">Error loading form</h3>
          <p className="text-muted-foreground text-sm sm:text-base">{error}</p>
        </div>
      </div>
    )
  }

  if (!form) {
    notFound()
  }

const {autoScore, teleopScore, endgameScore, totalScore} = form
console.log({autoScore, teleopScore, endgameScore, totalScore});
  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className="mb-4 sm:mb-6">
        <Button variant="outline" size="sm" asChild className="mb-3 sm:mb-4 bg-transparent">
          <Link href="/forms">
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="text-sm sm:text-base">Back to Forms</span>
          </Link>
        </Button>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 sm:mb-4 gap-2 sm:gap-0">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-3xl font-bold text-foreground text-balance">
              Team {form.teamNumber} - Match {form.matchNumber}
            </h1>
            <h2 className="text-base sm:text-xl text-muted-foreground">Qualification Match</h2>
          </div>
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-sm sm:text-lg px-2 sm:px-3 py-1 self-start">
            Completed
          </Badge>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 text-muted-foreground gap-2 sm:gap-0">
          <div className="flex items-center">
            <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="text-sm sm:text-base">Scout: {form.scouterName}</span>
          </div>
          <div className="flex items-center sm:text-right">
            <div className="text-base sm:text-lg font-semibold text-foreground mr-2">{totalScore}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Total Score</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Score Breakdown */}
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center text-base sm:text-lg">
              <Trophy className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-accent" />
              Score Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 sm:p-4 text-center">
                <div className="text-lg sm:text-2xl font-bold text-blue-600 dark:text-blue-400">{autoScore}</div>
                <div className="text-xs sm:text-sm text-blue-600 dark:text-blue-400">Auto</div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2 sm:p-4 text-center">
                <div className="text-lg sm:text-2xl font-bold text-green-600 dark:text-green-400">{teleopScore}</div>
                <div className="text-xs sm:text-sm text-green-600 dark:text-green-400">Teleop</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-2 sm:p-4 text-center">
                <div className="text-lg sm:text-2xl font-bold text-purple-600 dark:text-purple-400">{endgameScore}</div>
                <div className="text-xs sm:text-sm text-purple-600 dark:text-purple-400">Endgame</div>
              </div>
              <div className="bg-accent/10 rounded-lg p-2 sm:p-4 text-center">
                <div className="text-lg sm:text-2xl font-bold text-accent">{totalScore}</div>
                <div className="text-xs sm:text-sm text-accent">Total</div>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div>
                <h4 className="font-semibold mb-2 flex items-center text-sm sm:text-base">
                  <Zap className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Autonomous Period
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-4 text-xs sm:text-sm">
                  <div className="flex justify-between py-1">
                    <span>Start Position:</span>
                    <span className={form.startPosition==="Side" ? "text-green-600" : "text-red-600"}>
                      {form.startPosition}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Passed Line:</span>
                    <span className={form.passedLine ? "text-green-600" : "text-red-600"}>
                      {form.passedLine ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>L1 Corals:</span>
                    <span>{form.l1CoralsAuto || 0}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>L2 Corals:</span>
                    <span>{form.l2CoralsAuto || 0}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>L3 Corals:</span>
                    <span>{form.l3CoralsAuto || 0}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>L4 Corals:</span>
                    <span>{form.l4CoralsAuto || 0}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Net:</span>
                    <span>{form.netAuto || 0}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2 flex items-center text-sm sm:text-base">
                  <Target className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Teleoperated Period
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-4 text-xs sm:text-sm">
                  <div className="flex justify-between py-1">
                    <span>L1 Corals:</span>
                    <span>{form.l1CoralsTele || 0}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>L2 Corals:</span>
                    <span>{form.l2CoralsTele || 0}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>L3 Corals:</span>
                    <span>{form.l3CoralsTele || 0}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>L4 Corals:</span>
                    <span>{form.l4CoralsTele || 0}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Net:</span>
                    <span>{form.netTele || 0}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Processor:</span>
                    <span>{form.processor || 0}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2 flex items-center text-sm sm:text-base">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Endgame
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-4 text-xs sm:text-sm">
                  <div className="flex justify-between py-1">
                    <span>High Climb:</span>
                    <span className={form.highClimb ? "text-green-600" : "text-red-600"}>
                      {form.highClimb ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Low Climb:</span>
                    <span className={form.lowClimb ? "text-green-600" : "text-red-600"}>
                      {form.lowClimb ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scout Notes */}
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-base sm:text-lg">Scout Notes & Comments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">{form.comments}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
