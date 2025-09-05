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
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Create New Team</h1>
        <p className="text-muted-foreground">Add a new team to the competition database</p>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-green-800 dark:text-green-200">Team created successfully!</p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-200">Error: {error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team Information
            </CardTitle>
            <CardDescription>Enter the basic information for the new team</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="teamNumber">Team Number</Label>
              <Input
                id="teamNumber"
                value={teamData.teamNumber}
                onChange={(e) => setTeamData((prev) => ({ ...prev, teamNumber: e.target.value }))}
                placeholder="e.g., 254"
                required
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="teamName">Team Name</Label>
              <Input
                id="teamName"
                value={teamData.teamName}
                onChange={(e) => setTeamData((prev) => ({ ...prev, teamName: e.target.value }))}
                placeholder="e.g., The Cheesy Poofs"
                required
                disabled={loading}
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" className="flex items-center gap-2" disabled={loading}>
                <Save className="h-4 w-4" />
                {loading ? "Creating..." : "Create Team"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
