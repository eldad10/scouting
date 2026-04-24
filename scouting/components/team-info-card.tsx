"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bot, Zap, Shield, Gauge, Crosshair, ChevronsUpDown, CheckCircle2, XCircle, Trophy, Target } from "lucide-react"
import { TeamInfo, Form } from "@/lib/api"

interface Props {
  teamNumber: string
  initialInfo: TeamInfo | null
  forms?: Form[]
}

function RatingBar({ value, max = 5, color }: { value: number; max?: number; color: string }) {
  const pct = Math.round((value / max) * 100)
  return (
    <div className="flex items-center gap-3 w-full">
      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-sm font-bold w-6 text-right tabular-nums">{value}</span>
    </div>
  )
}

function getBallsMidpoint(range: string, isTeleop: boolean): number {
  if (isTeleop) {
    switch (range) {
      case "0-10":   return 5
      case "10-20":  return 15
      case "20-40":  return 30
      case "40-60":  return 50
      case "60-80":  return 70
      case "80-100": return 90
      case "100+":   return 105
      default:       return 0
    }
  } else {
    switch (range) {
      case "0-5":   return 2.5
      case "5-10":  return 7.5
      case "10-15": return 12.5
      case "15-20": return 17.5
      case "20+":   return 22
      default:      return 0
    }
  }
}

export function TeamInfoCard({ teamNumber, initialInfo, forms = [] }: Props) {
  // Compute avg total balls scored per match from scouting forms
  const avgBallsScored =
    forms.length > 0
      ? (
          forms.reduce(
            (sum, f) => sum + getBallsMidpoint(f.autoBalls, false) + getBallsMidpoint(f.teleopBalls, true),
            0
          ) / forms.length
        ).toFixed(1)
      : null

  // ── EMPTY STATE — no DB record yet ─────────────────────────────────────────
  if (!initialInfo) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex items-center gap-3 py-5 px-5">
          <Bot className="w-5 h-5 text-muted-foreground shrink-0" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              No robot intel on file for Team {teamNumber}
            </p>
            <p className="text-xs text-muted-foreground/70 mt-0.5">
              Add a row to the <code className="text-xs bg-muted px-1 rounded">team_info</code> table to see the full scouting profile here.
            </p>
          </div>
          {avgBallsScored && (
            <div className="ml-auto text-right shrink-0">
              <p className="text-lg font-bold tabular-nums">{avgBallsScored}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Avg balls / match</p>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  const info = initialInfo

  // ── READ MODE ──────────────────────────────────────────────────────────────
  return (
    <Card className="overflow-hidden">
      {/* Header strip */}
      <div className="bg-primary/5 border-b border-border px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Bot className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Robot Intelligence</p>
            <p className="text-base font-bold text-foreground leading-tight">Team {teamNumber}</p>
          </div>
        </div>

        {/* Key stats row in header */}
        <div className="flex items-center gap-4 sm:gap-6">
          {info.statboticsRank != null && (
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-lg font-bold tabular-nums text-amber-600 dark:text-amber-400">
                  #{info.statboticsRank}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Statbotics</p>
            </div>
          )}
          {avgBallsScored && (
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1">
                <Target className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-lg font-bold tabular-nums text-blue-600 dark:text-blue-400">
                  {avgBallsScored}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Avg balls / match</p>
            </div>
          )}
        </div>
      </div>

      <CardContent className="p-0">
        {/* Shooter profile */}
        <div className="px-5 py-4 border-b border-border">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-1.5">
            <Crosshair className="w-3.5 h-3.5" /> Shooter Profile
          </p>
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3">
            <div className="bg-muted/40 rounded-lg px-3 py-2.5 text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Type</p>
              <Badge variant="secondary" className="text-xs capitalize">{info.shooterType}</Badge>
            </div>
            <div className="bg-muted/40 rounded-lg px-3 py-2.5 text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Width</p>
              <Badge variant="secondary" className="text-xs capitalize">{info.shooterWidth}</Badge>
            </div>
            <div className="bg-muted/40 rounded-lg px-3 py-2.5 text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Position</p>
              <Badge variant="secondary" className="text-xs capitalize">{info.shootingPosition.replace("_", " ")}</Badge>
            </div>
          </div>
          {info.shootingDescription && (
            <p className="text-sm text-muted-foreground leading-relaxed italic">
              &ldquo;{info.shootingDescription}&rdquo;
            </p>
          )}
        </div>

        {/* Performance ratings */}
        <div className="px-5 py-4 border-b border-border">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5" /> Performance Ratings
          </p>
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Zap className="w-3 h-3 text-cyan-500" />
                <span className="text-xs text-muted-foreground font-medium">Delivery</span>
              </div>
              <RatingBar value={info.deliveryRating} color="bg-cyan-500" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Shield className="w-3 h-3 text-red-500" />
                <span className="text-xs text-muted-foreground font-medium">Defence</span>
              </div>
              <RatingBar value={info.defenceRating} color="bg-red-500" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <ChevronsUpDown className="w-3 h-3 text-violet-500" />
                <span className="text-xs text-muted-foreground font-medium">Speed / Balance</span>
              </div>
              <RatingBar value={info.speedBalanceRating} color="bg-violet-500" />
            </div>
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        {(info.advantages || info.disadvantages) && (
          <div className="px-5 py-4 border-b border-border">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Analysis
            </p>
            <div className="space-y-3">
              {info.advantages && (
                <div className="flex gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-0.5">Advantages</p>
                    <p className="text-sm text-foreground leading-relaxed">{info.advantages}</p>
                  </div>
                </div>
              )}
              {info.disadvantages && (
                <div className="flex gap-2.5">
                  <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-0.5">Disadvantages</p>
                    <p className="text-sm text-foreground leading-relaxed">{info.disadvantages}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Additional notes */}
        {info.additionalInfo && (
          <div className="px-5 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Notes</p>
            <p className="text-sm text-foreground leading-relaxed">{info.additionalInfo}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
