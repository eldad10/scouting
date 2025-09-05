"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { FileText, Save } from "lucide-react"
import { api } from "@/lib/api"

export default function CreateFormPage() {
  const [formData, setFormData] = useState({
    scouterName: "",
    matchNumber: "",
    teamNumber: "",
    startPosition: "",
    passedLine: false,
    l1CoralsAuto: 0,
    l2CoralsAuto: 0,
    l3CoralsAuto: 0,
    l4CoralsAuto: 0,
    netAuto: 0,
    l1CoralsTele: 0,
    l2CoralsTele: 0,
    l3CoralsTele: 0,
    l4CoralsTele: 0,
    netTele: 0,
    processor: 0,
    climbType: "",
    comments: "",
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError(null)

      const formPayload = {
        scouterName: formData.scouterName,
        matchNumber: Number.parseInt(formData.matchNumber),
        teamNumber: formData.teamNumber,
        startPosition: formData.startPosition === "side",
        passedLine: formData.passedLine,
        l1CoralsAuto: formData.l1CoralsAuto,
        l2CoralsAuto: formData.l2CoralsAuto,
        l3CoralsAuto: formData.l3CoralsAuto,
        l4CoralsAuto: formData.l4CoralsAuto,
        netAuto: formData.netAuto,
        l1CoralsTele: formData.l1CoralsTele,
        l2CoralsTele: formData.l2CoralsTele,
        l3CoralsTele: formData.l3CoralsTele,
        l4CoralsTele: formData.l4CoralsTele,
        netTele: formData.netTele,
        processor: formData.processor,
        highClimb: formData.climbType === "high",
        lowClimb: formData.climbType === "low",
        comments: formData.comments,
      }

      await api.createForm(formPayload)
      setSuccess(true)

      // Reset form after successful submission
      setFormData({
        scouterName: "",
        matchNumber: "",
        teamNumber: "",
        startPosition: "",
        passedLine: false,
        l1CoralsAuto: 0,
        l2CoralsAuto: 0,
        l3CoralsAuto: 0,
        l4CoralsAuto: 0,
        netAuto: 0,
        l1CoralsTele: 0,
        l2CoralsTele: 0,
        l3CoralsTele: 0,
        l4CoralsTele: 0,
        netTele: 0,
        processor: 0,
        climbType: "",
        comments: "",
      })

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleNumberChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: Math.max(0, Number.parseInt(value) || 0),
    }))
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-4xl">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Create Scouting Form</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Fill out the scouting data for a team's match performance
        </p>
      </div>

      {success && (
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-green-800 dark:text-green-200 text-sm sm:text-base">Form submitted successfully!</p>
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
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <Label htmlFor="scouterName" className="text-sm sm:text-base">
                  Scouter Name
                </Label>
                <Input
                  id="scouterName"
                  value={formData.scouterName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, scouterName: e.target.value }))}
                  required
                  disabled={loading}
                  className="text-sm sm:text-base"
                />
              </div>
              <div>
                <Label htmlFor="matchNumber" className="text-sm sm:text-base">
                  Match Number
                </Label>
                <Input
                  id="matchNumber"
                  type="number"
                  value={formData.matchNumber}
                  onChange={(e) => setFormData((prev) => ({ ...prev, matchNumber: e.target.value }))}
                  required
                  disabled={loading}
                  className="text-sm sm:text-base"
                />
              </div>
              <div className="sm:col-span-2 lg:col-span-1">
                <Label htmlFor="teamNumber" className="text-sm sm:text-base">
                  Team Number
                </Label>
                <Input
                  id="teamNumber"
                  value={formData.teamNumber}
                  onChange={(e) => setFormData((prev) => ({ ...prev, teamNumber: e.target.value }))}
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
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div className="space-y-2">
                  <Label className="text-sm sm:text-base">Start Position</Label>
                  <div className="flex gap-3 sm:gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="startSide"
                        name="startPosition"
                        value="side"
                        checked={formData.startPosition === "side"}
                        onChange={(e) => setFormData((prev) => ({ ...prev, startPosition: e.target.value }))}
                        className="w-4 h-4"
                        disabled={loading}
                      />
                      <Label htmlFor="startSide" className="text-sm sm:text-base">
                        Side
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="startMiddle"
                        name="startPosition"
                        value="middle"
                        checked={formData.startPosition === "middle"}
                        onChange={(e) => setFormData((prev) => ({ ...prev, startPosition: e.target.value }))}
                        className="w-4 h-4"
                        disabled={loading}
                      />
                      <Label htmlFor="startMiddle" className="text-sm sm:text-base">
                        Middle
                      </Label>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="passedLine"
                    checked={formData.passedLine}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, passedLine: !!checked }))}
                    disabled={loading}
                  />
                  <Label htmlFor="passedLine" className="text-sm sm:text-base">
                    Passed Line
                  </Label>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4">
                <div>
                  <Label htmlFor="l1CoralsAuto" className="text-xs sm:text-sm">
                    L1 Corals
                  </Label>
                  <Input
                    id="l1CoralsAuto"
                    type="number"
                    min="0"
                    value={formData.l1CoralsAuto}
                    onChange={(e) => handleNumberChange("l1CoralsAuto", e.target.value)}
                    disabled={loading}
                    className="text-sm sm:text-base"
                  />
                </div>
                <div>
                  <Label htmlFor="l2CoralsAuto" className="text-xs sm:text-sm">
                    L2 Corals
                  </Label>
                  <Input
                    id="l2CoralsAuto"
                    type="number"
                    min="0"
                    value={formData.l2CoralsAuto}
                    onChange={(e) => handleNumberChange("l2CoralsAuto", e.target.value)}
                    disabled={loading}
                    className="text-sm sm:text-base"
                  />
                </div>
                <div>
                  <Label htmlFor="l3CoralsAuto" className="text-xs sm:text-sm">
                    L3 Corals
                  </Label>
                  <Input
                    id="l3CoralsAuto"
                    type="number"
                    min="0"
                    value={formData.l3CoralsAuto}
                    onChange={(e) => handleNumberChange("l3CoralsAuto", e.target.value)}
                    disabled={loading}
                    className="text-sm sm:text-base"
                  />
                </div>
                <div>
                  <Label htmlFor="l4CoralsAuto" className="text-xs sm:text-sm">
                    L4 Corals
                  </Label>
                  <Input
                    id="l4CoralsAuto"
                    type="number"
                    min="0"
                    value={formData.l4CoralsAuto}
                    onChange={(e) => handleNumberChange("l4CoralsAuto", e.target.value)}
                    disabled={loading}
                    className="text-sm sm:text-base"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <Label htmlFor="netAuto" className="text-xs sm:text-sm">
                    Net Auto
                  </Label>
                  <Input
                    id="netAuto"
                    type="number"
                    min="0"
                    value={formData.netAuto}
                    onChange={(e) => handleNumberChange("netAuto", e.target.value)}
                    disabled={loading}
                    className="text-sm sm:text-base"
                  />
                </div>
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
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
                <div>
                  <Label htmlFor="l1CoralsTele" className="text-xs sm:text-sm">
                    L1 Corals
                  </Label>
                  <Input
                    id="l1CoralsTele"
                    type="number"
                    min="0"
                    value={formData.l1CoralsTele}
                    onChange={(e) => handleNumberChange("l1CoralsTele", e.target.value)}
                    disabled={loading}
                    className="text-sm sm:text-base"
                  />
                </div>
                <div>
                  <Label htmlFor="l2CoralsTele" className="text-xs sm:text-sm">
                    L2 Corals
                  </Label>
                  <Input
                    id="l2CoralsTele"
                    type="number"
                    min="0"
                    value={formData.l2CoralsTele}
                    onChange={(e) => handleNumberChange("l2CoralsTele", e.target.value)}
                    disabled={loading}
                    className="text-sm sm:text-base"
                  />
                </div>
                <div>
                  <Label htmlFor="l3CoralsTele" className="text-xs sm:text-sm">
                    L3 Corals
                  </Label>
                  <Input
                    id="l3CoralsTele"
                    type="number"
                    min="0"
                    value={formData.l3CoralsTele}
                    onChange={(e) => handleNumberChange("l3CoralsTele", e.target.value)}
                    disabled={loading}
                    className="text-sm sm:text-base"
                  />
                </div>
                <div>
                  <Label htmlFor="l4CoralsTele" className="text-xs sm:text-sm">
                    L4 Corals
                  </Label>
                  <Input
                    id="l4CoralsTele"
                    type="number"
                    min="0"
                    value={formData.l4CoralsTele}
                    onChange={(e) => handleNumberChange("l4CoralsTele", e.target.value)}
                    disabled={loading}
                    className="text-sm sm:text-base"
                  />
                </div>
                <div>
                  <Label htmlFor="netTele" className="text-xs sm:text-sm">
                    Net Tele
                  </Label>
                  <Input
                    id="netTele"
                    type="number"
                    min="0"
                    value={formData.netTele}
                    onChange={(e) => handleNumberChange("netTele", e.target.value)}
                    disabled={loading}
                    className="text-sm sm:text-base"
                  />
                </div>
                <div>
                  <Label htmlFor="processor" className="text-xs sm:text-sm">
                    Processor
                  </Label>
                  <Input
                    id="processor"
                    type="number"
                    min="0"
                    value={formData.processor}
                    onChange={(e) => handleNumberChange("processor", e.target.value)}
                    disabled={loading}
                    className="text-sm sm:text-base"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Endgame */}
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-base sm:text-lg">Endgame</CardTitle>
              <CardDescription className="text-sm sm:text-base">Endgame performance and climbing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="space-y-2">
                <Label className="text-sm sm:text-base">Climb Type</Label>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="noClimb"
                      name="climbType"
                      value="none"
                      checked={formData.climbType === "none"}
                      onChange={(e) => setFormData((prev) => ({ ...prev, climbType: e.target.value }))}
                      className="w-4 h-4"
                      disabled={loading}
                    />
                    <Label htmlFor="noClimb" className="text-sm sm:text-base">
                      No Climb
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="lowClimb"
                      name="climbType"
                      value="low"
                      checked={formData.climbType === "low"}
                      onChange={(e) => setFormData((prev) => ({ ...prev, climbType: e.target.value }))}
                      className="w-4 h-4"
                      disabled={loading}
                    />
                    <Label htmlFor="lowClimb" className="text-sm sm:text-base">
                      Low Climb
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="highClimb"
                      name="climbType"
                      value="high"
                      checked={formData.climbType === "high"}
                      onChange={(e) => setFormData((prev) => ({ ...prev, climbType: e.target.value }))}
                      className="w-4 h-4"
                      disabled={loading}
                    />
                    <Label htmlFor="highClimb" className="text-sm sm:text-base">
                      High Climb
                    </Label>
                  </div>
                </div>
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
                onChange={(e) => setFormData((prev) => ({ ...prev, comments: e.target.value }))}
                maxLength={150}
                className="mt-2 text-sm sm:text-base"
                disabled={loading}
              />
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">{formData.comments.length}/150 characters</p>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              size="lg"
              className="flex items-center gap-2 w-full sm:w-auto text-sm sm:text-base"
              disabled={loading}
            >
              <Save className="h-3 w-3 sm:h-4 sm:w-4" />
              {loading ? "Saving..." : "Save Form"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
