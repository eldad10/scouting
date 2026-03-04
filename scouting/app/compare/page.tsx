'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { api } from '@/lib/api'
import { ChevronRight } from 'lucide-react'

interface ComparisonForm {
  teamNumber: string
  matchNumber: string
}

interface StatRowProps {
  label: string
  val1: number
  val2: number
  max?: number
  isRating?: boolean
  higherIsBetter?: boolean
}

const StatRow = ({ label, val1, val2, max, isRating, higherIsBetter = true }: StatRowProps) => {
  const effectiveMax = max ?? Math.max(val1, val2, 1)
  const pct1 = effectiveMax > 0 ? Math.round((val1 / effectiveMax) * 100) : 0
  const pct2 = effectiveMax > 0 ? Math.round((val2 / effectiveMax) * 100) : 0

  const team1Better = higherIsBetter ? val1 > val2 : val1 < val2
  const team2Better = higherIsBetter ? val2 > val1 : val2 < val1
  const tied = val1 === val2

  return (
    <div className="py-3 border-b border-border last:border-0">
      {/* Stat label centered */}
      <div className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
        {label}
      </div>

      {/* Values + bars */}
      <div className="flex items-center gap-2">
        {/* Team 1 value */}
        <div className={`w-12 text-right text-base font-bold shrink-0 ${team1Better ? 'text-blue-600 dark:text-blue-400' : tied ? 'text-foreground' : 'text-muted-foreground'}`}>
          {isRating ? val1.toFixed(1) : val1}
        </div>

        {/* Dual bar */}
        <div className="flex-1 flex items-center gap-0.5 h-5">
          {/* Team 1 bar (fills from center to left) */}
          <div className="flex-1 flex justify-end h-full">
            <div
              className={`h-full rounded-l-full transition-all ${team1Better ? 'bg-blue-500' : 'bg-blue-300 dark:bg-blue-800'}`}
              style={{ width: `${pct1}%` }}
            />
          </div>
          {/* Center divider */}
          <div className="w-0.5 h-5 bg-border shrink-0" />
          {/* Team 2 bar (fills from center to right) */}
          <div className="flex-1 flex justify-start h-full">
            <div
              className={`h-full rounded-r-full transition-all ${team2Better ? 'bg-green-500' : 'bg-green-300 dark:bg-green-800'}`}
              style={{ width: `${pct2}%` }}
            />
          </div>
        </div>

        {/* Team 2 value */}
        <div className={`w-12 text-left text-base font-bold shrink-0 ${team2Better ? 'text-green-600 dark:text-green-400' : tied ? 'text-foreground' : 'text-muted-foreground'}`}>
          {isRating ? val2.toFixed(1) : val2}
        </div>
      </div>
    </div>
  )
}

const BoolStatRow = ({ label, val1, val2 }: { label: string; val1: boolean; val2: boolean }) => {
  return (
    <div className="py-3 border-b border-border last:border-0">
      <div className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
        {label}
      </div>
      <div className="flex items-center justify-between px-4">
        <span className={`text-sm font-bold px-3 py-1 rounded-full ${val1 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' : 'bg-muted text-muted-foreground'}`}>
          {val1 ? 'Yes' : 'No'}
        </span>
        <div className="w-0.5 h-5 bg-border" />
        <span className={`text-sm font-bold px-3 py-1 rounded-full ${val2 ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' : 'bg-muted text-muted-foreground'}`}>
          {val2 ? 'Yes' : 'No'}
        </span>
      </div>
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

  const getBallPoints = (range: string, isTeleop: boolean): number => {
    if (isTeleop) {
      switch (range) {
        case '0-10': return 5
        case '10-20': return 15
        case '20-40': return 30
        case '40-60': return 50
        case '60-80': return 70
        case '80-100': return 90
        case '100+': return 110
        default: return 0
      }
    } else {
      switch (range) {
        case '0-5': return 2.5
        case '5-10': return 7.5
        case '10-15': return 12.5
        case '15-20': return 17.5
        case '20+': return 22.5
        default: return 0
      }
    }
  }

  const getClimbPoints = (autoClimb: boolean, teleopClimbLevel: number): number => {
    return (autoClimb ? 15 : 0) + (teleopClimbLevel === 1 ? 10 : teleopClimbLevel === 2 ? 20 : teleopClimbLevel === 3 ? 30 : 0)
  }

  const createAverageForm = (forms: any[], teamNumber: string) => {
    const avgAuto = forms.reduce((sum, f) => sum + getBallPoints(f.autoBalls, false) + (f.autoClimb ? 15 : 0), 0) / forms.length
    const avgTeleop = forms.reduce((sum, f) => sum + getBallPoints(f.teleopBalls, true), 0) / forms.length
    const avgClimb = forms.reduce((sum, f) => sum + getClimbPoints(f.autoClimb, f.teleopClimbLevel), 0) / forms.length
    const avgDefence = forms.reduce((sum, f) => sum + f.defenceRating, 0) / forms.length
    const avgDelivery = forms.reduce((sum, f) => sum + f.deliveryRating, 0) / forms.length
    const autoClimbRate = forms.filter((f) => f.autoClimb).length / forms.length
    const avgTeleopClimb = forms.reduce((sum, f) => sum + f.teleopClimbLevel, 0) / forms.length

    return {
      teamNumber,
      isAverage: true,
      matchCount: forms.length,
      autoScore: Math.round(avgAuto * 10) / 10,
      teleopScore: Math.round(avgTeleop * 10) / 10,
      climbScore: Math.round(avgClimb * 10) / 10,
      totalScore: Math.round((avgAuto + avgTeleop + avgClimb) * 10) / 10,
      defenceRating: Math.round(avgDefence * 10) / 10,
      deliveryRating: Math.round(avgDelivery * 10) / 10,
      autoClimb: autoClimbRate > 0.5,
      autoClimbRate: Math.round(autoClimbRate * 100),
      teleopClimbLevel: Math.round(avgTeleopClimb),
    }
  }

  const buildFormStats = (raw: any) => {
    const autoScore = getBallPoints(raw.autoBalls, false) + (raw.autoClimb ? 15 : 0)
    const teleopScore = getBallPoints(raw.teleopBalls, true)
    const climbScore = getClimbPoints(raw.autoClimb, raw.teleopClimbLevel)
    return {
      teamNumber: raw.teamNumber,
      matchNumber: raw.matchNumber,
      isAverage: false,
      autoScore,
      teleopScore,
      climbScore,
      totalScore: autoScore + teleopScore + climbScore,
      defenceRating: raw.defenceRating,
      deliveryRating: raw.deliveryRating,
      autoClimb: raw.autoClimb,
      autoClimbRate: raw.autoClimb ? 100 : 0,
      teleopClimbLevel: raw.teleopClimbLevel,
      comments: raw.comments,
    }
  }

  const handleCompare = async () => {
    if (!team1.teamNumber || !team2.teamNumber) return
    setLoading(true)
    try {
      let match1, match2

      if (team1.matchNumber) {
        const raw = allForms.find((f) => f.teamNumber === team1.teamNumber && f.matchNumber === parseInt(team1.matchNumber))
        match1 = raw ? buildFormStats(raw) : null
      } else {
        const t1Forms = allForms.filter((f) => f.teamNumber === team1.teamNumber)
        match1 = t1Forms.length > 0 ? createAverageForm(t1Forms, team1.teamNumber) : null
      }

      if (team2.matchNumber) {
        const raw = allForms.find((f) => f.teamNumber === team2.teamNumber && f.matchNumber === parseInt(team2.matchNumber))
        match2 = raw ? buildFormStats(raw) : null
      } else {
        const t2Forms = allForms.filter((f) => f.teamNumber === team2.teamNumber)
        match2 = t2Forms.length > 0 ? createAverageForm(t2Forms, team2.teamNumber) : null
      }

      setForm1(match1 || null)
      setForm2(match2 || null)
    } finally {
      setLoading(false)
    }
  }

  const teamNumbers = [...new Set(allForms.map((f) => f.teamNumber))].sort()
  const matchNumbers1 = allForms.filter((f) => f.teamNumber === team1.teamNumber).map((f) => f.matchNumber).sort((a, b) => a - b)
  const matchNumbers2 = allForms.filter((f) => f.teamNumber === team2.teamNumber).map((f) => f.matchNumber).sort((a, b) => a - b)

  const label1 = form1
    ? form1.isAverage
      ? `Team ${form1.teamNumber} (Avg)`
      : `Team ${form1.teamNumber} · M${form1.matchNumber}`
    : team1.teamNumber
      ? `Team ${team1.teamNumber}`
      : 'Team 1'

  const label2 = form2
    ? form2.isAverage
      ? `Team ${form2.teamNumber} (Avg)`
      : `Team ${form2.teamNumber} · M${form2.matchNumber}`
    : team2.teamNumber
      ? `Team ${team2.teamNumber}`
      : 'Team 2'

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">Compare</h1>
        <p className="text-sm text-muted-foreground">
          Compare two teams or specific match performances side by side.
        </p>
      </div>

      {/* Selector Card */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Select Teams</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Team 1 row */}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500 shrink-0" />
            <div className="flex-1 grid grid-cols-2 gap-2">
              <Select value={team1.teamNumber} onValueChange={(v) => setTeam1({ teamNumber: v, matchNumber: '' })}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Team 1..." />
                </SelectTrigger>
                <SelectContent>
                  {teamNumbers.map((num) => (
                    <SelectItem key={num} value={num}>Team {num}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={team1.matchNumber}
                onValueChange={(v) => setTeam1({ ...team1, matchNumber: v === '__all__' ? '' : v })}
                disabled={!team1.teamNumber}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="All matches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All matches (avg)</SelectItem>
                  {matchNumbers1.map((num) => (
                    <SelectItem key={num} value={num.toString()}>Match {num}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Team 2 row */}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500 shrink-0" />
            <div className="flex-1 grid grid-cols-2 gap-2">
              <Select value={team2.teamNumber} onValueChange={(v) => setTeam2({ teamNumber: v, matchNumber: '' })}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Team 2..." />
                </SelectTrigger>
                <SelectContent>
                  {teamNumbers.map((num) => (
                    <SelectItem key={num} value={num}>Team {num}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={team2.matchNumber}
                onValueChange={(v) => setTeam2({ ...team2, matchNumber: v === '__all__' ? '' : v })}
                disabled={!team2.teamNumber}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="All matches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All matches (avg)</SelectItem>
                  {matchNumbers2.map((num) => (
                    <SelectItem key={num} value={num.toString()}>Match {num}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={handleCompare} disabled={loading || !team1.teamNumber || !team2.teamNumber} className="w-full h-10">
            {loading ? 'Loading...' : 'Compare'}
          </Button>
        </CardContent>
      </Card>

      {/* Results - Football stats style */}
      {(form1 || form2) && (
        <Card>
          {/* Header: team labels */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30 rounded-t-lg">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span className="font-bold text-sm text-blue-700 dark:text-blue-300">{label1}</span>
              {form1?.isAverage && (
                <Badge variant="secondary" className="text-xs px-1.5 py-0">{form1.matchCount}m</Badge>
              )}
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <div className="flex items-center gap-2">
              {form2?.isAverage && (
                <Badge variant="secondary" className="text-xs px-1.5 py-0">{form2.matchCount}m</Badge>
              )}
              <span className="font-bold text-sm text-green-700 dark:text-green-300">{label2}</span>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
            </div>
          </div>

          <CardContent className="px-4 py-2">
            <StatRow
              label="Total Score"
              val1={form1?.totalScore ?? 0}
              val2={form2?.totalScore ?? 0}
            />
            <StatRow
              label="Auto Score"
              val1={form1?.autoScore ?? 0}
              val2={form2?.autoScore ?? 0}
            />
            <StatRow
              label="Teleop Score"
              val1={form1?.teleopScore ?? 0}
              val2={form2?.teleopScore ?? 0}
            />
            <StatRow
              label="Climb Score"
              val1={form1?.climbScore ?? 0}
              val2={form2?.climbScore ?? 0}
            />
            <StatRow
              label="Defence Rating"
              val1={form1?.defenceRating ?? 0}
              val2={form2?.defenceRating ?? 0}
              max={5}
              isRating
            />
            <StatRow
              label="Delivery Rating"
              val1={form1?.deliveryRating ?? 0}
              val2={form2?.deliveryRating ?? 0}
              max={5}
              isRating
            />
            <StatRow
              label="Teleop Climb Level"
              val1={form1?.teleopClimbLevel ?? 0}
              val2={form2?.teleopClimbLevel ?? 0}
              max={3}
            />
            <BoolStatRow
              label="Auto Climb"
              val1={form1?.autoClimb ?? false}
              val2={form2?.autoClimb ?? false}
            />

            {/* Legend */}
            <div className="flex justify-center gap-6 pt-3 mt-1 border-t border-border text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                {label1}
              </span>
              <span className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                {label2}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
