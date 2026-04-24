"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Bot, Zap, Shield, Gauge, Crosshair, ChevronsUpDown,
  CheckCircle2, XCircle, Trophy, Target, Pencil, X, Save, Plus,
} from "lucide-react"
import { TeamInfo, Form, api } from "@/lib/api"

interface Props {
  teamNumber: string
  initialInfo: TeamInfo | null
  forms?: Form[]
}

const EMPTY_INFO = (teamNumber: string): TeamInfo => ({
  teamNumber,
  shooterType: "fixed",
  shooterWidth: "single",
  shootingPosition: "fixed",
  shootingDescription: "",
  deliveryRating: 3,
  defenceRating: 3,
  speedBalanceRating: 3,
  advantages: "",
  disadvantages: "",
  additionalInfo: "",
  statboticsRank: null,
})

function RatingBar({ value, max = 5, color }: { value: number; max?: number; color: string }) {
  const pct = Math.round((value / max) * 100)
  return (
    <div className="flex items-center gap-3 w-full">
      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-sm font-bold w-6 text-right tabular-nums">{value}</span>
    </div>
  )
}

function RatingInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`w-8 h-8 rounded text-sm font-bold border transition-colors ${
              value === n
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted border-border hover:border-primary text-muted-foreground"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  )
}

function getBallsMidpoint(range: string, isTeleop: boolean): number {
  if (isTeleop) {
    const map: Record<string, number> = { "0-10": 5, "10-20": 15, "20-40": 30, "40-60": 50, "60-80": 70, "80-100": 90, "100+": 105 }
    return map[range] ?? 0
  } else {
    const map: Record<string, number> = { "0-5": 2.5, "5-10": 7.5, "10-15": 12.5, "15-20": 17.5, "20+": 22 }
    return map[range] ?? 0
  }
}

export function TeamInfoCard({ teamNumber, initialInfo, forms = [] }: Props) {
  const [info, setInfo] = useState<TeamInfo | null>(initialInfo)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<TeamInfo>(initialInfo ?? EMPTY_INFO(teamNumber))
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const avgBallsScored =
    forms.length > 0
      ? (
          forms.reduce(
            (sum, f) => sum + getBallsMidpoint(f.autoBalls, false) + getBallsMidpoint(f.teleopBalls, true),
            0
          ) / forms.length
        ).toFixed(1)
      : null

  const set = (key: keyof TeamInfo, value: any) =>
    setDraft((prev) => ({ ...prev, [key]: value }))

  const handleSave = async () => {
    setSaving(true)
    setSaveError(null)
    try {
      const ok = await api.upsertTeamInfo({ ...draft, teamNumber })
      if (!ok) throw new Error("Server returned an error")
      setInfo({ ...draft, teamNumber })
      setEditing(false)
    } catch (e: any) {
      setSaveError(e.message ?? "Failed to save")
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setDraft(info ?? EMPTY_INFO(teamNumber))
    setEditing(false)
    setSaveError(null)
  }

  // ── EDIT / ADD FORM ──────────────────────────────────────────────────────
  if (editing) {
    return (
      <Card>
        <div className="bg-primary/5 border-b border-border px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-primary" />
            <span className="font-semibold text-sm">{info ? "Edit" : "Add"} Robot Intel — Team {teamNumber}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleCancel} className="h-7 w-7 p-0">
            <X className="w-4 h-4" />
          </Button>
        </div>
        <CardContent className="p-5 space-y-5">
          {/* Statbotics rank */}
          <div className="space-y-1">
            <Label className="text-xs">Statbotics Rank (optional)</Label>
            <Input
              type="number"
              placeholder="e.g. 47"
              value={draft.statboticsRank ?? ""}
              onChange={(e) => set("statboticsRank", e.target.value ? Number(e.target.value) : null)}
              className="w-40"
            />
          </div>

          {/* Shooter */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Shooter Type</Label>
              <Select value={draft.shooterType} onValueChange={(v) => set("shooterType", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixed</SelectItem>
                  <SelectItem value="turret">Turret</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Shooter Width</Label>
              <Select value={draft.shooterWidth} onValueChange={(v) => set("shooterWidth", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="double">Double</SelectItem>
                  <SelectItem value="wide">Wide</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Shooting Position</Label>
              <Select value={draft.shootingPosition} onValueChange={(v) => set("shootingPosition", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixed Spot</SelectItem>
                  <SelectItem value="all_around">All Around</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Shooting Description</Label>
            <Input
              placeholder="Brief description of shooting style..."
              value={draft.shootingDescription}
              onChange={(e) => set("shootingDescription", e.target.value)}
            />
          </div>

          {/* Ratings */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <RatingInput label="Delivery (1-5)" value={draft.deliveryRating} onChange={(v) => set("deliveryRating", v)} />
            <RatingInput label="Defence (1-5)" value={draft.defenceRating} onChange={(v) => set("defenceRating", v)} />
            <RatingInput label="Speed / Balance (1-5)" value={draft.speedBalanceRating} onChange={(v) => set("speedBalanceRating", v)} />
          </div>

          {/* Analysis */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Advantages</Label>
              <Textarea
                placeholder="What this robot does well..."
                value={draft.advantages}
                onChange={(e) => set("advantages", e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Disadvantages</Label>
              <Textarea
                placeholder="Weaknesses or limitations..."
                value={draft.disadvantages}
                onChange={(e) => set("disadvantages", e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Additional Notes</Label>
            <Textarea
              placeholder="Anything else worth noting..."
              value={draft.additionalInfo}
              onChange={(e) => set("additionalInfo", e.target.value)}
              rows={2}
            />
          </div>

          {saveError && (
            <p className="text-sm text-destructive">{saveError}</p>
          )}

          <div className="flex gap-2 pt-1">
            <Button onClick={handleSave} disabled={saving} size="sm">
              <Save className="w-3.5 h-3.5 mr-1.5" />
              {saving ? "Saving..." : "Save"}
            </Button>
            <Button variant="outline" size="sm" onClick={handleCancel}>Cancel</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // ── EMPTY STATE ──────────────────────────────────────────────────────────
  if (!info) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex items-center gap-3 py-5 px-5">
          <Bot className="w-5 h-5 text-muted-foreground shrink-0" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              No robot intel on file for Team {teamNumber}
            </p>
            <p className="text-xs text-muted-foreground/70 mt-0.5">
              Add a profile so scouts can see shooter type, ratings and strategic notes.
            </p>
          </div>
          <div className="ml-auto flex items-center gap-4 shrink-0">
            {avgBallsScored && (
              <div className="text-right">
                <p className="text-lg font-bold tabular-nums text-blue-600 dark:text-blue-400">{avgBallsScored}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Avg balls / match</p>
              </div>
            )}
            <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Add Intel
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // ── READ VIEW ────────────────────────────────────────────────────────────
  return (
    <Card className="overflow-hidden">
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
          <Button size="sm" variant="ghost" onClick={() => { setDraft(info); setEditing(true) }} className="text-muted-foreground hover:text-foreground">
            <Pencil className="w-3.5 h-3.5 mr-1.5" />
            Edit
          </Button>
        </div>
      </div>

      <CardContent className="p-0">
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
            <p className="text-sm text-muted-foreground leading-relaxed italic">&ldquo;{info.shootingDescription}&rdquo;</p>
          )}
        </div>

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

        {(info.advantages || info.disadvantages) && (
          <div className="px-5 py-4 border-b border-border">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">Analysis</p>
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
