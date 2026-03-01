'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LabelBadge } from '@/components/label-badge'
import { api } from '@/lib/api'
import { Trophy, Zap, Target, AlertCircle } from 'lucide-react'

interface ComparisonForm {
  teamNumber: string
  matchNumber: string
}

const ComparisonStats = ({ form, label }: { form: any; label: string }) => {
  if (!form) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>No data for {label}</p>
      </div>
    )
  }

  const autoLabels = form.autoLabels ? form.autoLabels.split(',').filter((l: string) => l.trim()) : []
  const teleopLabels = form.teleopLabels ? form.teleopLabels.split(',').filter((l: string) => l.trim()) : []

  return (
    <div className="space-y-6">
      {/* Score Summary */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 sm:p-4 text-center border-2 border-blue-200 dark:border-blue-800">
          <div className="text-sm text-blue-600 dark:text-blue-400 mb-1">Auto</div>
          <div className="text-2xl sm:text-3xl font-bold text-blue-700 dark:text-blue-300">
            {(form.autoBalls === '0-5' ? 2.5 : form.autoBalls === '5-10' ? 7.5 : form.autoBalls === '10-15' ? 12.5 : form.autoBalls === '15-20' ? 17.5 : form.autoBalls === '20+' ? 22.5 : 0) + (form.autoClimb ? 15 : 0)}
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 sm:p-4 text-center border-2 border-green-200 dark:border-green-800">
          <div className="text-sm text-green-600 dark:text-green-400 mb-1">Teleop</div>
          <div className="text-2xl sm:text-3xl font-bold text-green-700 dark:text-green-300">
            {(form.teleopBalls === '0-10' ? 5 : form.teleopBalls === '10-20' ? 15 : form.teleopBalls === '20-40' ? 30 : form.teleopBalls === '40-60' ? 50 : form.teleopBalls === '60-80' ? 70 : form.teleopBalls === '80-100' ? 90 : form.teleopBalls === '100+' ? 110 : 0)}
          </div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 sm:p-4 text-center border-2 border-purple-200 dark:border-purple-800">
          <div className="text-sm text-purple-600 dark:text-purple-400 mb-1">Climb</div>
          <div className="text-2xl sm:text-3xl font-bold text-purple-700 dark:text-purple-300">
            {(form.autoClimb ? 15 : 0) + (form.teleopClimbLevel === 1 ? 10 : form.teleopClimbLevel === 2 ? 20 : form.teleopClimbLevel === 3 ? 30 : 0)}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-sm mb-2 flex items-center">
            <Zap className="h-4 w-4 mr-2 text-blue-600" />
            Autonomous Period
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between p-2 bg-slate-50 dark:bg-slate-900/30 rounded">
              <span>Balls Scored:</span>
              <span className="font-semibold">{form.autoBalls || '-'}</span>
            </div>
            <div className="flex justify-between p-2 bg-slate-50 dark:bg-slate-900/30 rounded">
              <span>Climbed:</span>
              <span className={`font-semibold ${form.autoClimb ? 'text-green-600' : 'text-red-600'}`}>
                {form.autoClimb ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-2 flex items-center">
            <Target className="h-4 w-4 mr-2 text-green-600" />
            Teleoperated Period
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between p-2 bg-slate-50 dark:bg-slate-900/30 rounded">
              <span>Balls Scored:</span>
              <span className="font-semibold">{form.teleopBalls || '-'}</span>
            </div>
            <div className="flex justify-between p-2 bg-slate-50 dark:bg-slate-900/30 rounded">
              <span>Climb Level:</span>
              <span className="font-semibold">{form.teleopClimbLevel}</span>
            </div>
            <div className="flex justify-between p-2 bg-slate-50 dark:bg-slate-900/30 rounded">
              <span>Defence:</span>
              <span className="font-semibold">{form.defenceRating}/5</span>
            </div>
            <div className="flex justify-between p-2 bg-slate-50 dark:bg-slate-900/30 rounded">
              <span>Delivery:</span>
              <span className="font-semibold">{form.deliveryRating}/5</span>
            </div>
          </div>
        </div>
      </div>

      {/* Labels */}
      {(autoLabels.length > 0 || teleopLabels.length > 0) && (
        <div className="pt-4 border-t border-border">
          {autoLabels.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-semibold text-muted-foreground mb-2">Auto Labels</p>
              <div className="flex flex-wrap gap-1">
                {autoLabels.map((label: string) => (
                  <LabelBadge key={label} label={label} phase="auto" size="sm" />
                ))}
              </div>
            </div>
          )}
          {teleopLabels.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2">Teleop Labels</p>
              <div className="flex flex-wrap gap-1">
                {teleopLabels.map((label: string) => (
                  <LabelBadge key={label} label={label} phase="teleop" size="sm" />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Comments */}
      {form.comments && (
        <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-900/30 rounded border-l-4 border-accent">
          <p className="text-xs font-semibold text-muted-foreground mb-1">Scout Notes</p>
          <p className="text-sm text-foreground">{form.comments}</p>
        </div>
      )}
    </div>
  )
}

export default function ComparePage() {
  const [team1, setTeam1] = useState<ComparisonForm>({ teamNumber: '', matchNumber: '' })
  const [team2, setTeam2] = useState<ComparisonForm>({ teamNumber: '', matchNumber: '' })
  const [form1, setForm1] = useState<any>(null)
  const [form2, setForm2] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [allForms, setAllForms] = useState<any[]>([])

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const forms = await api.getForms()
        setAllForms(forms)
      } catch (err) {
        console.error('Failed to fetch forms')
      }
    }
    fetchForms()
  }, [])

  const handleCompare = async () => {
    if (!team1.teamNumber || !team1.matchNumber || !team2.teamNumber || !team2.matchNumber) {
      return
    }

    setLoading(true)
    try {
      const match1 = allForms.find(
        (f) => f.teamNumber === team1.teamNumber && f.matchNumber === parseInt(team1.matchNumber)
      )
      const match2 = allForms.find(
        (f) => f.teamNumber === team2.teamNumber && f.matchNumber === parseInt(team2.matchNumber)
      )
      setForm1(match1 || null)
      setForm2(match2 || null)
    } finally {
      setLoading(false)
    }
  }

  const teamNumbers = [...new Set(allForms.map((f) => f.teamNumber))].sort()
  const matchNumbers1 = allForms
    .filter((f) => f.teamNumber === team1.teamNumber)
    .map((f) => f.matchNumber)
    .sort((a, b) => a - b)
  const matchNumbers2 = allForms
    .filter((f) => f.teamNumber === team2.teamNumber)
    .map((f) => f.matchNumber)
    .sort((a, b) => a - b)

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-6xl">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Match Comparison</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Compare side-by-side performance of two teams in any match
        </p>
      </div>

      {/* Comparison Selector */}
      <Card className="mb-6 sm:mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Select Teams & Matches to Compare</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Team 1 */}
            <div className="space-y-4 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border-2 border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">Team 1</h3>
              <div>
                <Label className="text-sm">Team Number</Label>
                <Select value={team1.teamNumber} onValueChange={(v) => setTeam1({ ...team1, teamNumber: v, matchNumber: '' })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team..." />
                  </SelectTrigger>
                  <SelectContent>
                    {teamNumbers.map((num) => (
                      <SelectItem key={num} value={num}>
                        Team {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm">Match Number</Label>
                <Select value={team1.matchNumber} onValueChange={(v) => setTeam1({ ...team1, matchNumber: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select match..." />
                  </SelectTrigger>
                  <SelectContent>
                    {matchNumbers1.map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        Match {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Team 2 */}
            <div className="space-y-4 p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border-2 border-green-200 dark:border-green-800">
              <h3 className="font-semibold text-green-900 dark:text-green-100">Team 2</h3>
              <div>
                <Label className="text-sm">Team Number</Label>
                <Select value={team2.teamNumber} onValueChange={(v) => setTeam2({ ...team2, teamNumber: v, matchNumber: '' })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team..." />
                  </SelectTrigger>
                  <SelectContent>
                    {teamNumbers.map((num) => (
                      <SelectItem key={num} value={num}>
                        Team {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm">Match Number</Label>
                <Select value={team2.matchNumber} onValueChange={(v) => setTeam2({ ...team2, matchNumber: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select match..." />
                  </SelectTrigger>
                  <SelectContent>
                    {matchNumbers2.map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        Match {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Button onClick={handleCompare} disabled={loading} className="w-full mt-6">
            {loading ? 'Loading...' : 'Compare'}
          </Button>
        </CardContent>
      </Card>

      {/* Comparison Results */}
      {(form1 || form2) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Team {team1.teamNumber} - Match {team1.matchNumber}
              </CardTitle>
              {form1 && <CardDescription>Scout: {form1.scouterName}</CardDescription>}
            </CardHeader>
            <CardContent>
              <ComparisonStats form={form1} label="Team 1" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Team {team2.teamNumber} - Match {team2.matchNumber}
              </CardTitle>
              {form2 && <CardDescription>Scout: {form2.scouterName}</CardDescription>}
            </CardHeader>
            <CardContent>
              <ComparisonStats form={form2} label="Team 2" />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
