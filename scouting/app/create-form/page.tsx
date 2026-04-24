"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileText } from "lucide-react"
import { api } from "@/lib/api"
import { LabelBadge } from "@/components/label-badge"
import { AUTO_LABELS, TELEOP_LABELS } from "@/lib/label-config"

interface FormState {
  scouterName: string
  matchNumber: string
  teamNumber: string
  autoBalls: string
  autoClimb: boolean
  autoLabels: Set<string>
  teleopBalls: string
  teleopClimbLevel: number
  defenceRating: number
  deliveryRating: number
  teleopLabels: Set<string>
  comments: string
}

const INITIAL_FORM_STATE: FormState = {
  scouterName: "",
  matchNumber: "",
  teamNumber: "",
  autoBalls: "0",
  autoClimb: false,
  autoLabels: new Set(),
  teleopBalls: "0",
  teleopClimbLevel: 0,
  defenceRating: 0,
  deliveryRating: 0,
  teleopLabels: new Set(),
  comments: "",
}

export default function CreateFormPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormState>(INITIAL_FORM_STATE)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [customAutoLabel, setCustomAutoLabel] = useState("")
  const [customTeleopLabel, setCustomTeleopLabel] = useState("")

  const validateForm = (): string | null => {
    if (!formData.scouterName.trim()) return "Scouter name is required"
    if (!formData.matchNumber.trim()) return "Match number is required"
    if (!formData.teamNumber.trim()) return "Team number is required"

    const matchNum = Number.parseInt(formData.matchNumber, 10)
    if (isNaN(matchNum) || matchNum < 1) {
      return "Match number must be a valid positive number"
    }
    if (isNaN(Number(formData.autoBalls)) || Number(formData.autoBalls) < 0) {
      return "Auto balls must be a valid non-negative number"
    }
    if (isNaN(Number(formData.teleopBalls)) || Number(formData.teleopBalls) < 0) {
      return "Teleop balls must be a valid non-negative number"
    }

    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const formPayload = {
        scouterName: formData.scouterName.trim(),
        matchNumber: Number.parseInt(formData.matchNumber, 10),
        teamNumber: formData.teamNumber.trim(),
        autoBalls: formData.autoBalls,
        autoClimb: formData.autoClimb,
        autoLabels: Array.from(formData.autoLabels).join(','),
        teleopBalls: formData.teleopBalls,
        teleopClimbLevel: formData.teleopClimbLevel,
        defenceRating: formData.defenceRating,
        deliveryRating: formData.deliveryRating,
        teleopLabels: Array.from(formData.teleopLabels).join(','),
        comments: formData.comments.trim(),
      }

      await api.createForm(formPayload)
      setSuccess(true)
      setFormData({ ...INITIAL_FORM_STATE })

      // Clear success message and redirect after 2 seconds
      setTimeout(() => router.push('/forms'), 2000)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const toggleAutoLabel = (label: string) => {
    setFormData((prev) => {
      const newLabels = new Set(prev.autoLabels)
      if (newLabels.has(label)) {
        newLabels.delete(label)
      } else {
        newLabels.add(label)
      }
      return { ...prev, autoLabels: newLabels }
    })
  }

  const toggleTeleopLabel = (label: string) => {
    setFormData((prev) => {
      const newLabels = new Set(prev.teleopLabels)
      if (newLabels.has(label)) {
        newLabels.delete(label)
      } else {
        newLabels.add(label)
      }
      return { ...prev, teleopLabels: newLabels }
    })
  }

  const addCustomAutoLabel = () => {
    if (customAutoLabel.trim()) {
      toggleAutoLabel(customAutoLabel.trim())
      setCustomAutoLabel('')
    }
  }

  const addCustomTeleopLabel = () => {
    if (customTeleopLabel.trim()) {
      toggleTeleopLabel(customTeleopLabel.trim())
      setCustomTeleopLabel('')
    }
  }

  const handleInputChange = (field: keyof FormState, value: string | boolean | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-4xl">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">New Game</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Fill out the scouting data for a team's match performance
        </p>
      </div>

      {success && (
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-green-800 dark:text-green-200 text-sm sm:text-base">Form submitted successfully! Redirecting...</p>
        </div>
      )}

      {error && (
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-200 text-sm sm:text-base">Error: {error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-4 sm:space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                Scouter Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <Label htmlFor="scouterName" className="text-sm sm:text-base">
                  Scouter Name *
                </Label>
                <Input
                  id="scouterName"
                  value={formData.scouterName}
                  onChange={(e) => handleInputChange("scouterName", e.target.value)}
                  required
                  disabled={loading}
                  className="text-sm sm:text-base"
                />
              </div>
              <div>
                <Label htmlFor="matchNumber" className="text-sm sm:text-base">
                  Match Number *
                </Label>
                <Input
                  id="matchNumber"
                  type="number"
                  min="1"
                  value={formData.matchNumber}
                  onChange={(e) => handleInputChange("matchNumber", e.target.value)}
                  required
                  disabled={loading}
                  className="text-sm sm:text-base"
                />
              </div>
              <div className="sm:col-span-2 lg:col-span-1">
                <Label htmlFor="teamNumber" className="text-sm sm:text-base">
                  Team Number *
                </Label>
                <Input
                  id="teamNumber"
                  value={formData.teamNumber}
                  onChange={(e) => handleInputChange("teamNumber", e.target.value)}
                  required
                  disabled={loading}
                  className="text-sm sm:text-base"
                />
              </div>
            </CardContent>
          </Card>

          {/* Autonomous Period */}
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-base sm:text-lg">Autonomous Period</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Performance during the autonomous period
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              {/* Balls scored in auto */}
              <div>
                <Label htmlFor="autoBalls" className="text-sm sm:text-base font-medium mb-2 block">
                  Balls Scored (Auto)
                </Label>
                <Input
                  id="autoBalls"
                  type="number"
                  min="0"
                  value={formData.autoBalls}
                  onChange={(e) => handleInputChange("autoBalls", e.target.value)}
                  disabled={loading}
                  className="w-32 text-sm sm:text-base"
                  placeholder="0"
                />
              </div>

              {/* Auto climb checkbox */}
              <div>
                <div className="flex items-center space-x-2 p-3 border border-border rounded-md hover:bg-accent/50 transition-colors cursor-pointer">
                  <input
                    id="autoClimb"
                    type="checkbox"
                    checked={formData.autoClimb}
                    onChange={(e) => handleInputChange("autoClimb", e.target.checked)}
                    disabled={loading}
                    className="w-4 h-4 rounded"
                  />
                  <Label htmlFor="autoClimb" className="text-sm sm:text-base cursor-pointer flex-1">
                    Robot climbed in auto
                  </Label>
                </div>
              </div>

              {/* Auto labels */}
              <div>
                <Label className="text-sm sm:text-base font-medium mb-3 block">Autonomous Phase Labels</Label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {AUTO_LABELS.map((labelConfig) => (
                    <button
                      key={labelConfig.label}
                      type="button"
                      onClick={() => toggleAutoLabel(labelConfig.label)}
                      disabled={loading}
                      className={`transition-all ${
                        formData.autoLabels.has(labelConfig.label)
                          ? 'ring-2 ring-offset-2 ring-blue-500 scale-105'
                          : 'opacity-75 hover:opacity-100'
                      }`}
                    >
                      <LabelBadge
                        label={labelConfig.label}
                        phase="auto"
                        showCategory={true}
                        size="sm"
                      />
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 mb-3">
                  <Input
                    value={customAutoLabel}
                    onChange={(e) => setCustomAutoLabel(e.target.value)}
                    placeholder="Add custom label (e.g., 'Smooth movement')..."
                    disabled={loading}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomAutoLabel())}
                    className="text-sm sm:text-base"
                  />
                  <Button
                    type="button"
                    onClick={addCustomAutoLabel}
                    disabled={loading || !customAutoLabel.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Add Custom
                  </Button>
                </div>
                {formData.autoLabels.size > 0 && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-2">Selected labels (click × to remove):</p>
                    <div className="flex flex-wrap gap-2">
                      {Array.from(formData.autoLabels).map((label) => (
                        <div
                          key={label}
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleAutoLabel(label)
                          }}
                        >
                          <LabelBadge
                            label={label}
                            phase="auto"
                            onRemove={() => toggleAutoLabel(label)}
                            size="sm"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>


            </CardContent>
          </Card>

          {/* Teleoperated Period */}
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-base sm:text-lg">Teleoperated Period</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Performance during the teleoperated period
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              {/* Balls scored in teleop */}
              <div>
                <Label htmlFor="teleopBalls" className="text-sm sm:text-base font-medium mb-2 block">
                  Balls Scored (Teleop)
                </Label>
                <Input
                  id="teleopBalls"
                  type="number"
                  min="0"
                  value={formData.teleopBalls}
                  onChange={(e) => handleInputChange("teleopBalls", e.target.value)}
                  disabled={loading}
                  className="w-32 text-sm sm:text-base"
                  placeholder="0"
                />
              </div>

              {/* Climb level */}
              <div>
                <Label className="text-sm sm:text-base font-medium mb-3 block">Climb Level</Label>
                <div className="flex gap-2">
                  {[0, 1, 2, 3].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => handleInputChange("teleopClimbLevel", level)}
                      disabled={loading}
                      className={`px-4 py-2 rounded-lg font-medium transition ${
                        formData.teleopClimbLevel === level
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-200 text-slate-900 hover:bg-slate-300'
                      }`}
                    >
                      Level {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Defence rating */}
              <div>
                <Label className="text-sm sm:text-base font-medium mb-2">
                  Defence Rating: <span className="text-blue-600 font-bold">{formData.defenceRating}</span>
                </Label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  value={formData.defenceRating}
                  onChange={(e) => handleInputChange("defenceRating", parseInt(e.target.value))}
                  disabled={loading}
                  className="w-full"
                />
              </div>

              {/* Delivery rating */}
              <div>
                <Label className="text-sm sm:text-base font-medium mb-2">
                  Delivery Rating: <span className="text-blue-600 font-bold">{formData.deliveryRating}</span>
                </Label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  value={formData.deliveryRating}
                  onChange={(e) => handleInputChange("deliveryRating", parseInt(e.target.value))}
                  disabled={loading}
                  className="w-full"
                />
              </div>

              {/* Teleop labels */}
              <div>
                <Label className="text-sm sm:text-base font-medium mb-3 block">Teleoperated Phase Labels</Label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {TELEOP_LABELS.map((labelConfig) => (
                    <button
                      key={labelConfig.label}
                      type="button"
                      onClick={() => toggleTeleopLabel(labelConfig.label)}
                      disabled={loading}
                      className={`transition-all ${
                        formData.teleopLabels.has(labelConfig.label)
                          ? 'ring-2 ring-offset-2 ring-green-500 scale-105'
                          : 'opacity-75 hover:opacity-100'
                      }`}
                    >
                      <LabelBadge
                        label={labelConfig.label}
                        phase="teleop"
                        showCategory={true}
                        size="sm"
                      />
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 mb-3">
                  <Input
                    value={customTeleopLabel}
                    onChange={(e) => setCustomTeleopLabel(e.target.value)}
                    placeholder="Add custom label (e.g., 'Excellent shooting')..."
                    disabled={loading}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomTeleopLabel())}
                    className="text-sm sm:text-base"
                  />
                  <Button
                    type="button"
                    onClick={addCustomTeleopLabel}
                    disabled={loading || !customTeleopLabel.trim()}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Add Custom
                  </Button>
                </div>
                {formData.teleopLabels.size > 0 && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-2">Selected labels (click × to remove):</p>
                    <div className="flex flex-wrap gap-2">
                      {Array.from(formData.teleopLabels).map((label) => (
                        <div
                          key={label}
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleTeleopLabel(label)
                          }}
                        >
                          <LabelBadge
                            label={label}
                            phase="teleop"
                            onRemove={() => toggleTeleopLabel(label)}
                            size="sm"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>


          {/* Comments */}
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-base sm:text-lg">Additional Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="comments" className="text-sm sm:text-base">
                Comments
              </Label>
              <Textarea
                id="comments"
                placeholder="Any additional observations or notes..."
                value={formData.comments}
                onChange={(e) => handleInputChange("comments", e.target.value)}
                maxLength={300}
                className="mt-2 text-sm sm:text-base"
                disabled={loading}
              />
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">{formData.comments.length}/300 characters</p>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
              className="text-sm sm:text-base"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="lg"
              className="flex items-center gap-2 text-sm sm:text-base"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Game"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
