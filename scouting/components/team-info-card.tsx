"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pencil, Save, X, Bot, Zap, Shield, Gauge } from "lucide-react"
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

function RatingDots({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <span className="flex gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={`w-2.5 h-2.5 rounded-full ${i < value ? "bg-primary" : "bg-muted"}`}
        />
      ))}
    </span>
  )
}

export function TeamInfoCard({ teamNumber, initialInfo }: Props) {
  const [info, setInfo] = useState<TeamInfo>(initialInfo ?? EMPTY_INFO(teamNumber))
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<TeamInfo>(info)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)

  // Re-fetch the robot info from the DB whenever the selected team changes.
  // Without this the card keeps showing the first team's data because
  // useState only reads its initial argument on the first mount.
  useEffect(() => {
    let cancelled = false
    setEditing(false)
    setLoading(true)
    api
      .getTeamInfo(teamNumber)
      .then((fresh) => {
        if (cancelled) return
        const next = fresh ?? EMPTY_INFO(teamNumber)
        setInfo(next)
        setDraft(next)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [teamNumber])

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

  if (editing) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Bot className="w-4 h-4" />
            Robot Info — Team {teamNumber}
          </CardTitle>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleCancel} disabled={saving}>
              <X className="w-3 h-3 mr-1" /> Cancel
            </Button>
            <Button size="sm" onClick={handleSave} disabled={saving}>
              <Save className="w-3 h-3 mr-1" /> {saving ? "Saving…" : "Save"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label>Shooter Type</Label>
              <Select value={draft.shooterType} onValueChange={(v) => set("shooterType", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixed</SelectItem>
                  <SelectItem value="turret">Turret</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Shooter Width</Label>
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
              <Label>Shooting Position</Label>
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
            <Label>Shooting Description</Label>
            <Textarea
              value={draft.shootingDescription}
              onChange={(e) => set("shootingDescription", e.target.value)}
              rows={2}
              maxLength={300}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(["deliveryRating", "defenceRating", "speedBalanceRating"] as const).map((field) => (
              <div key={field} className="space-y-1">
                <Label>
                  {field === "deliveryRating" ? "Delivery" : field === "defenceRating" ? "Defence" : "Speed/Balance"} Rating (0-5)
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

          <div className="space-y-1">
            <Label>Advantages</Label>
            <Textarea value={draft.advantages} onChange={(e) => set("advantages", e.target.value)} rows={2} maxLength={300} />
          </div>
          <div className="space-y-1">
            <Label>Disadvantages</Label>
            <Textarea value={draft.disadvantages} onChange={(e) => set("disadvantages", e.target.value)} rows={2} maxLength={300} />
          </div>
          <div className="space-y-1">
            <Label>Additional Info</Label>
            <Textarea value={draft.additionalInfo} onChange={(e) => set("additionalInfo", e.target.value)} rows={2} maxLength={300} />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Bot className="w-4 h-4" />
          Robot Info — Team {teamNumber}
        </CardTitle>
        <Button size="sm" variant="outline" onClick={handleEdit} disabled={loading}>
          <Pencil className="w-3 h-3 mr-1" /> {loading ? "Loading…" : "Edit"}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
          <div>
            <span className="text-muted-foreground block text-xs">Shooter Type</span>
            <span className="font-medium capitalize">{info.shooterType}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-xs">Shooter Width</span>
            <span className="font-medium capitalize">{info.shooterWidth}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-xs">Shooting Position</span>
            <span className="font-medium capitalize">{info.shootingPosition.replace("_", " ")}</span>
          </div>
        </div>

        {info.shootingDescription && (
          <p className="text-sm text-muted-foreground">{info.shootingDescription}</p>
        )}

        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground flex items-center gap-1"><Zap className="w-3 h-3" /> Delivery</span>
            <RatingDots value={info.deliveryRating} />
          </div>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground flex items-center gap-1"><Shield className="w-3 h-3" /> Defence</span>
            <RatingDots value={info.defenceRating} />
          </div>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground flex items-center gap-1"><Gauge className="w-3 h-3" /> Speed</span>
            <RatingDots value={info.speedBalanceRating} />
          </div>
        </div>

        {info.advantages && (
          <div>
            <span className="text-xs font-medium text-green-600 dark:text-green-400 block mb-0.5">Advantages</span>
            <p className="text-sm">{info.advantages}</p>
          </div>
        )}
        {info.disadvantages && (
          <div>
            <span className="text-xs font-medium text-red-600 dark:text-red-400 block mb-0.5">Disadvantages</span>
            <p className="text-sm">{info.disadvantages}</p>
          </div>
        )}
        {info.additionalInfo && (
          <div>
            <span className="text-xs font-medium text-muted-foreground block mb-0.5">Additional Info</span>
            <p className="text-sm">{info.additionalInfo}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
