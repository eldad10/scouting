"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Pencil, Save, X, Bot, Zap, Shield, Gauge, Crosshair, ChevronsUpDown, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import { api, TeamInfo } from "@/lib/api"

interface Props {
  teamNumber: string
  initialInfo: TeamInfo | null
}

const EMPTY_INFO = (teamNumber: string): TeamInfo => ({
  teamNumber,
  shooterType: "fixed",
  shooterWidth: "single",
  shootingPosition: "fixed",
  shootingDescription: "",
  deliveryRating: 0,
  defenceRating: 0,
  speedBalanceRating: 1,
  advantages: "",
  disadvantages: "",
  additionalInfo: "",
})

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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-2 py-2 border-b border-border last:border-0">
      <span className="text-xs text-muted-foreground min-w-[110px] pt-0.5 uppercase tracking-wide font-medium">{label}</span>
      <span className="text-sm font-medium text-foreground capitalize leading-relaxed">{value || "—"}</span>
    </div>
  )
}

export function TeamInfoCard({ teamNumber, initialInfo }: Props) {
  const [info, setInfo] = useState<TeamInfo>(initialInfo ?? EMPTY_INFO(teamNumber))
  const [editing, setEditing] = useState(!initialInfo)
  const [draft, setDraft] = useState<TeamInfo>(info)
  const [saving, setSaving] = useState(false)
  const hasData = !!initialInfo

  const handleEdit = () => {
    setDraft({ ...info })
    setEditing(true)
  }

  const handleCancel = () => {
    setDraft({ ...info })
    setEditing(false)
  }

  const handleSave = async () => {
    setSaving(true)
    const ok = await api.upsertTeamInfo(draft)
    if (ok) {
      setInfo(draft)
      setEditing(false)
    }
    setSaving(false)
  }

  const set = (field: keyof TeamInfo, value: string | number) =>
    setDraft((prev) => ({ ...prev, [field]: value }))

  // ── EDIT MODE ──────────────────────────────────────────────────────────────
  if (editing) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Bot className="w-4 h-4 text-primary" />
            Robot Intel — Team {teamNumber}
          </CardTitle>
          <div className="flex gap-2">
            {hasData && (
              <Button size="sm" variant="outline" onClick={handleCancel} disabled={saving}>
                <X className="w-3 h-3 mr-1" /> Cancel
              </Button>
            )}
            <Button size="sm" onClick={handleSave} disabled={saving}>
              <Save className="w-3 h-3 mr-1" /> {saving ? "Saving…" : "Save"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">Shooter Type</Label>
              <Select value={draft.shooterType} onValueChange={(v) => set("shooterType", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixed</SelectItem>
                  <SelectItem value="turret">Turret</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">Shooter Width</Label>
              <Select value={draft.shooterWidth} onValueChange={(v) => set("shooterWidth", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="double">Double</SelectItem>
                  <SelectItem value="wide">Wide</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">Shooting Position</Label>
              <Select value={draft.shootingPosition} onValueChange={(v) => set("shootingPosition", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixed Spot</SelectItem>
                  <SelectItem value="all_around">All Around</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">Shooting Description</Label>
            <Textarea
              value={draft.shootingDescription}
              onChange={(e) => set("shootingDescription", e.target.value)}
              rows={2}
              maxLength={300}
              placeholder="Describe how and from where this robot shoots…"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(["deliveryRating", "defenceRating", "speedBalanceRating"] as const).map((field) => (
              <div key={field} className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                  {field === "deliveryRating" ? "Delivery" : field === "defenceRating" ? "Defence" : "Speed / Balance"} (0–5)
                </Label>
                <Input
                  type="number"
                  min={0}
                  max={5}
                  value={draft[field]}
                  onChange={(e) => set(field, Math.min(5, Math.max(0, parseInt(e.target.value) || 0)))}
                />
              </div>
            ))}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">Advantages</Label>
            <Textarea value={draft.advantages} onChange={(e) => set("advantages", e.target.value)} rows={2} maxLength={300} placeholder="What does this robot do well?" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">Disadvantages</Label>
            <Textarea value={draft.disadvantages} onChange={(e) => set("disadvantages", e.target.value)} rows={2} maxLength={300} placeholder="Known weaknesses or limitations…" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">Additional Notes</Label>
            <Textarea value={draft.additionalInfo} onChange={(e) => set("additionalInfo", e.target.value)} rows={2} maxLength={300} placeholder="Any other scouting observations…" />
          </div>
        </CardContent>
      </Card>
    )
  }

  // ── READ MODE ──────────────────────────────────────────────────────────────
  return (
    <Card className="overflow-hidden">
      {/* Header strip */}
      <div className="bg-primary/8 border-b border-border px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Bot className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Robot Intelligence</p>
            <p className="text-sm font-bold text-foreground leading-tight">Team {teamNumber}</p>
          </div>
        </div>
        <Button size="sm" variant="outline" onClick={handleEdit} className="h-8">
          <Pencil className="w-3 h-3 mr-1.5" /> Edit
        </Button>
      </div>

      <CardContent className="p-0">
        {/* Shooter profile */}
        <div className="px-5 py-4 border-b border-border">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-1.5">
            <Crosshair className="w-3.5 h-3.5" /> Shooter Profile
          </p>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div className="bg-muted/50 rounded-lg px-3 py-2.5 text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Type</p>
              <Badge variant="secondary" className="text-xs capitalize">{info.shooterType}</Badge>
            </div>
            <div className="bg-muted/50 rounded-lg px-3 py-2.5 text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Width</p>
              <Badge variant="secondary" className="text-xs capitalize">{info.shooterWidth}</Badge>
            </div>
            <div className="bg-muted/50 rounded-lg px-3 py-2.5 text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Position</p>
              <Badge variant="secondary" className="text-xs capitalize">{info.shootingPosition.replace("_", " ")}</Badge>
            </div>
          </div>
          {info.shootingDescription && (
            <p className="text-sm text-muted-foreground leading-relaxed italic">&ldquo;{info.shootingDescription}&rdquo;</p>
          )}
        </div>

        {/* Ratings */}
        <div className="px-5 py-4 border-b border-border">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-1.5">
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
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" /> Analysis
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
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Notes</p>
            <p className="text-sm text-foreground leading-relaxed">{info.additionalInfo}</p>
          </div>
        )}

        {/* Empty state when no data filled in yet */}
        {!info.advantages && !info.disadvantages && !info.additionalInfo && !info.shootingDescription && (
          <div className="px-5 py-4 text-center">
            <p className="text-xs text-muted-foreground">No scouting notes yet. Click Edit to add details about this robot.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
