import { localDb, localDbHelpers, type LocalForm, type LocalTeam } from "./local-db"
import { Form, FormInput, Team, RankingData } from "./api"

export interface SyncResult {
  success: boolean
  pushed: { forms: number; teams: number }
  pulled: { forms: number; teams: number; rankings: number }
  errors: string[]
}

export const syncEngine = {
  /**
   * Full sync: push local changes, then pull remote data
   */
  async fullSync(): Promise<SyncResult> {
    const result: SyncResult = {
      success: true,
      pushed: { forms: 0, teams: 0 },
      pulled: { forms: 0, teams: 0, rankings: 0 },
      errors: [],
    }

    try {
      // 1. Push pending local changes to remote
      const pushResult = await this.pushToRemote()
      result.pushed = pushResult.pushed
      result.errors.push(...pushResult.errors)

      // 2. Pull latest data from remote
      const pullResult = await this.pullFromRemote()
      result.pulled = pullResult.pulled
      result.errors.push(...pullResult.errors)

      result.success = result.errors.length === 0
    } catch (error) {
      result.success = false
      result.errors.push(error instanceof Error ? error.message : "Unknown sync error")
    }

    return result
  },

  /**
   * Push all pending local changes to the remote database
   */
  async pushToRemote(): Promise<{ pushed: { forms: number; teams: number }; errors: string[] }> {
    const errors: string[] = []
    let formsPushed = 0
    let teamsPushed = 0

    // Push pending teams
    const pendingTeams = await localDbHelpers.getPendingTeams()
    for (const team of pendingTeams) {
      try {
        const res = await fetch("/api/insertTeam", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ teamNumber: team.teamNumber, teamName: team.teamName }),
        })
        if (res.ok || res.status === 201) {
          await localDbHelpers.markTeamSynced(team.teamNumber)
          teamsPushed++
        } else {
          const text = await res.text()
          errors.push(`Failed to sync team ${team.teamNumber}: ${text}`)
        }
      } catch (err) {
        errors.push(`Network error syncing team ${team.teamNumber}`)
      }
    }

    // Push pending forms
    const pendingForms = await localDbHelpers.getPendingForms()
    for (const form of pendingForms) {
      try {
        const payload = {
          scoutername: form.scouterName,
          matchnumber: form.matchNumber,
          teamnumber: form.teamNumber,
          auto_balls: form.autoBalls,
          auto_climb: form.autoClimb,
          auto_labels: form.autoLabels,
          teleop_balls: form.teleopBalls,
          teleop_climb_level: form.teleopClimbLevel,
          defence_rating: form.defenceRating,
          delivery_rating: form.deliveryRating,
          teleop_labels: form.teleopLabels,
          comments: form.comments,
        }
        const res = await fetch("/api/insertForm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        if (res.ok || res.status === 201) {
          if (form.localId) {
            await localDbHelpers.markFormSynced(form.localId)
          }
          formsPushed++
        } else {
          const text = await res.text()
          errors.push(`Failed to sync form (Team ${form.teamNumber}, Match ${form.matchNumber}): ${text}`)
        }
      } catch (err) {
        errors.push(`Network error syncing form (Team ${form.teamNumber}, Match ${form.matchNumber})`)
      }
    }

    return { pushed: { forms: formsPushed, teams: teamsPushed }, errors }
  },

  /**
   * Pull all data from remote and update local database
   */
  async pullFromRemote(): Promise<{ pulled: { forms: number; teams: number; rankings: number }; errors: string[] }> {
    const errors: string[] = []
    let formsPulled = 0
    let teamsPulled = 0
    let rankingsPulled = 0

    // Pull teams
    try {
      const res = await fetch("/api/getTeams")
      if (res.ok) {
        const teams: Team[] = await res.json()
        for (const team of teams) {
          const existing = await localDb.teams.where("teamNumber").equals(team.teamNumber).first()
          if (existing) {
            await localDb.teams.update(existing.id!, {
              teamName: team.teamName,
              ranking: team.ranking,
              syncedAt: Date.now(),
              pendingSync: false,
            })
          } else {
            await localDb.teams.add({
              teamNumber: team.teamNumber,
              teamName: team.teamName,
              ranking: team.ranking,
              syncedAt: Date.now(),
              pendingSync: false,
            })
          }
          teamsPulled++
        }
        await localDbHelpers.setLastSync("teams")
      } else {
        errors.push("Failed to fetch teams from remote")
      }
    } catch (err) {
      errors.push("Network error fetching teams")
    }

    // Pull forms
    try {
      const res = await fetch("/api/getForms")
      if (res.ok) {
        const forms: Form[] = await res.json()
        for (const form of forms) {
          const existing = await localDb.forms
            .where("[teamNumber+matchNumber]")
            .equals([form.teamNumber, form.matchNumber])
            .first()
          if (existing) {
            // Only update if not pending sync (don't overwrite local changes)
            if (!existing.pendingSync) {
              await localDb.forms.update(existing.id!, {
                scouterName: form.scouterName,
                autoBalls: form.autoBalls,
                autoClimb: form.autoClimb,
                autoLabels: form.autoLabels,
                teleopBalls: form.teleopBalls,
                teleopClimbLevel: form.teleopClimbLevel,
                defenceRating: form.defenceRating,
                deliveryRating: form.deliveryRating,
                teleopLabels: form.teleopLabels,
                comments: form.comments,
                autoScore: form.autoScore,
                teleopScore: form.teleopScore,
                climbScore: form.climbScore,
                totalScore: form.totalScore,
                syncedAt: Date.now(),
              })
            }
          } else {
            await localDb.forms.add({
              scouterName: form.scouterName,
              matchNumber: form.matchNumber,
              teamNumber: form.teamNumber,
              autoBalls: form.autoBalls,
              autoClimb: form.autoClimb,
              autoLabels: form.autoLabels,
              teleopBalls: form.teleopBalls,
              teleopClimbLevel: form.teleopClimbLevel,
              defenceRating: form.defenceRating,
              deliveryRating: form.deliveryRating,
              teleopLabels: form.teleopLabels,
              comments: form.comments,
              autoScore: form.autoScore,
              teleopScore: form.teleopScore,
              climbScore: form.climbScore,
              totalScore: form.totalScore,
              syncedAt: Date.now(),
              pendingSync: false,
            })
          }
          formsPulled++
        }
        await localDbHelpers.setLastSync("forms")
      } else {
        errors.push("Failed to fetch forms from remote")
      }
    } catch (err) {
      errors.push("Network error fetching forms")
    }

    // Pull rankings
    try {
      const res = await fetch("/api/getRankings")
      if (res.ok) {
        const rankings: RankingData[] = await res.json()
        // Clear and replace rankings (they're computed server-side)
        await localDb.rankings.clear()
        for (const ranking of rankings) {
          await localDb.rankings.add({
            teamNumber: ranking.teamNumber,
            teamName: ranking.teamName,
            autoAvg: ranking.autoAvg,
            teleopAvg: ranking.teleopAvg,
            climbAvg: ranking.climbAvg,
            endgameAvg: ranking.endgameAvg,
            defenceAvg: ranking.defenceAvg,
            deliveryAvg: ranking.deliveryAvg,
            overallAvg: ranking.overallAvg,
            overallRank: ranking.overallRank,
            syncedAt: Date.now(),
          })
          rankingsPulled++
        }
        await localDbHelpers.setLastSync("rankings")
      } else {
        errors.push("Failed to fetch rankings from remote")
      }
    } catch (err) {
      errors.push("Network error fetching rankings")
    }

    return { pulled: { forms: formsPulled, teams: teamsPulled, rankings: rankingsPulled }, errors }
  },

  /**
   * Save a form locally (for offline use)
   */
  async saveFormLocally(formData: {
    scouterName: string
    matchNumber: number
    teamNumber: string
    autoBalls: string
    autoClimb: boolean
    autoLabels: string
    teleopBalls: string
    teleopClimbLevel: number
    defenceRating: number
    deliveryRating: number
    teleopLabels: string
    comments: string
  }): Promise<LocalForm> {
    const localId = crypto.randomUUID()
    
    // Calculate scores locally
    const autoScore = getBallsPoints(formData.autoBalls, false) + (formData.autoClimb ? 15 : 0)
    const teleopScore = getBallsPoints(formData.teleopBalls, true)
    const climbScore = (formData.autoClimb ? 15 : 0) + 
      (formData.teleopClimbLevel === 1 ? 10 : formData.teleopClimbLevel === 2 ? 20 : formData.teleopClimbLevel === 3 ? 30 : 0)
    const totalScore = autoScore + teleopScore + climbScore

    const form: LocalForm = {
      ...formData,
      autoScore,
      teleopScore,
      climbScore,
      totalScore,
      localId,
      pendingSync: true,
      syncedAt: undefined,
    }

    await localDb.forms.add(form)
    return form
  },

  /**
   * Save a team locally (for offline use)
   */
  async saveTeamLocally(teamData: { teamNumber: string; teamName: string }): Promise<LocalTeam> {
    const existing = await localDb.teams.where("teamNumber").equals(teamData.teamNumber).first()
    if (existing) {
      await localDb.teams.update(existing.id!, { ...teamData, pendingSync: true })
      return { ...existing, ...teamData, pendingSync: true }
    }
    
    const team: LocalTeam = {
      ...teamData,
      pendingSync: true,
      syncedAt: undefined,
    }
    await localDb.teams.add(team)
    return team
  },

  /**
   * Get all local teams
   */
  async getLocalTeams(): Promise<LocalTeam[]> {
    return localDb.teams.toArray()
  },

  /**
   * Get all local forms
   */
  async getLocalForms(): Promise<LocalForm[]> {
    return localDb.forms.toArray()
  },

  /**
   * Get all local rankings
   */
  async getLocalRankings(): Promise<LocalForm[]> {
    return localDb.rankings.toArray() as any
  },
}

// Helper function to calculate points
function getBallsPoints(range: string, isTeleop: boolean): number {
  if (isTeleop) {
    switch (range) {
      case "0-10": return 5
      case "10-20": return 15
      case "20-40": return 30
      case "40-60": return 50
      case "60-80": return 70
      case "80-100": return 90
      case "100+": return 110
      default: return 0
    }
  } else {
    switch (range) {
      case "0-5": return 2.5
      case "5-10": return 7.5
      case "10-15": return 12.5
      case "15-20": return 17.5
      case "20+": return 22.5
      default: return 0
    }
  }
}
