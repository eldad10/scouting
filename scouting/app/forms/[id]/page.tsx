"use client"

import { useState, useEffect } from "react"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User, ArrowLeft, Trophy, Target, Zap, Clock } from "lucide-react"
import Link from "next/link"
import { api } from "@/lib/api"

interface FormDetailPageProps {
  params: {
    id: string
  }
}

export default function FormDetailPage({ params }: FormDetailPageProps) {
  const [form, setForm] = useState(null)
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
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchForm()
  }, [params.id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading form details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-foreground mb-2">Error loading form</h3>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  if (!form) {
    notFound()
  }

  const autoScore =
    (form.passedLine ? 2 : 0) +
    (form.l1CoralsAuto || 0) * 3 +
    (form.l2CoralsAuto || 0) * 4 +
    (form.l3CoralsAuto || 0) * 6 +
    (form.l4CoralsAuto || 0) * 7 +
    (form.netAuto || 0) * 4

  const teleopScore =
    (form.l1CoralsTele || 0) * 2 +
    (form.l2CoralsTele || 0) * 3 +
    (form.l3CoralsTele || 0) * 4 +
    (form.l4CoralsTele || 0) * 5 +
    (form.netTele || 0) * 4 +
    (form.processor || 0) * 2

  const endgameScore = (form.highClimb ? 6 : 0) + (form.lowClimb ? 12 : 0)

  const totalScore = autoScore + teleopScore + endgameScore

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="outline" size="sm" asChild className="mb-4 bg-transparent">
          <Link href="/forms">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Forms
          </Link>
        </Button>

        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Team {form.teamNumber} - Match {form.matchNumber}
            </h1>
            <h2 className="text-xl text-muted-foreground">Qualification Match</h2>
          </div>
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-lg px-3 py-1">
            Completed
          </Badge>
        </div>

        <div className="flex items-center space-x-6 text-muted-foreground">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-2" />
            Scout: {form.scouterName}
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-foreground">{totalScore}</div>
            <div className="text-xs text-muted-foreground">Total Score</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="h-5 w-5 mr-2 text-accent" />
              Score Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{autoScore}</div>
                <div className="text-sm text-blue-600 dark:text-blue-400">Auto</div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{teleopScore}</div>
                <div className="text-sm text-green-600 dark:text-green-400">Teleop</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{endgameScore}</div>
                <div className="text-sm text-purple-600 dark:text-purple-400">Endgame</div>
              </div>
              <div className="bg-accent/10 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-accent">{totalScore}</div>
                <div className="text-sm text-accent">Total</div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 flex items-center">
                  <Zap className="h-4 w-4 mr-2" />
                  Autonomous Period
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span>Start Position:</span>
                    <span className={form.startPosition ? "text-green-600" : "text-red-600"}>
                      {form.startPosition ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Passed Line:</span>
                    <span className={form.passedLine ? "text-green-600" : "text-red-600"}>
                      {form.passedLine ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>L1 Corals:</span>
                    <span>{form.l1CoralsAuto || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>L2 Corals:</span>
                    <span>{form.l2CoralsAuto || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>L3 Corals:</span>
                    <span>{form.l3CoralsAuto || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>L4 Corals:</span>
                    <span>{form.l4CoralsAuto || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Net:</span>
                    <span>{form.netAuto || 0}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2 flex items-center">
                  <Target className="h-4 w-4 mr-2" />
                  Teleoperated Period
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span>L1 Corals:</span>
                    <span>{form.l1CoralsTele || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>L2 Corals:</span>
                    <span>{form.l2CoralsTele || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>L3 Corals:</span>
                    <span>{form.l3CoralsTele || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>L4 Corals:</span>
                    <span>{form.l4CoralsTele || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Net:</span>
                    <span>{form.netTele || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Processor:</span>
                    <span>{form.processor || 0}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2 flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Endgame
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span>High Climb:</span>
                    <span className={form.highClimb ? "text-green-600" : "text-red-600"}>
                      {form.highClimb ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex justify-between">
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
          <CardHeader>
            <CardTitle>Scout Notes & Comments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">{form.comments}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
