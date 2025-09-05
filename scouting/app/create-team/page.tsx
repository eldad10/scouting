"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Users, Save } from "lucide-react"
import { api } from "@/lib/api"

export default function CreateTeamPage() {
  const [teamData, setTeamData] = useState({
    teamNumber: "",
    teamName: "",
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError(null)

      await api.createTeam({
        teamNumber: teamData.teamNumber,
        teamName: teamData.teamName,
      })

      setSuccess(true)
      setTeamData({ teamNumber: "", teamName: "" })

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-2xl">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Create New Team</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Add a new team to the competition database</p>
      </div>

      {success && (
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-green-800 dark:text-green-200 text-sm sm:text-base">Team created successfully!</p>
        </div>
      )}

      {error && (
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-200 text-sm sm:text-base">Error: {error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Users className="h-4 w-4 sm:h-5 sm:w-5" />
              Team Information
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Enter the basic information for the new team
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div>
              <Label htmlFor="teamNumber" className="text-sm sm:text-base">
                Team Number
              </Label>
              <Input
                id="teamNumber"
                value={teamData.teamNumber}
                onChange={(e) => setTeamData((prev) => ({ ...prev, teamNumber: e.target.value }))}
                placeholder="e.g., 254"
                required
                disabled={loading}
                className="text-sm sm:text-base"
              />
            </div>

            <div>
              <Label htmlFor="teamName" className="text-sm sm:text-base">
                Team Name
              </Label>
              <Input
                id="teamName"
                value={teamData.teamName}
                onChange={(e) => setTeamData((prev) => ({ ...prev, teamName: e.target.value }))}
                placeholder="e.g., The Cheesy Poofs"
                required
                disabled={loading}
                className="text-sm sm:text-base"
              />
            </div>

            <div className="flex justify-end pt-3 sm:pt-4">
              <Button
                type="submit"
                className="flex items-center gap-2 w-full sm:w-auto text-sm sm:text-base"
                disabled={loading}
              >
                <Save className="h-3 w-3 sm:h-4 sm:w-4" />
                {loading ? "Creating..." : "Create Team"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
