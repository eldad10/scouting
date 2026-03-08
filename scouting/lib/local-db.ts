import Dexie, { type EntityTable } from "dexie"

// Types for local database - mirror the remote schema
export interface LocalTeam {
  id?: number
  teamNumber: string
  teamName: string
  ranking?: number
  syncedAt?: number
  pendingSync?: boolean
}

export interface LocalForm {
  id?: number
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
  autoScore?: number
  teleopScore?: number
  climbScore?: number
  totalScore?: number
  syncedAt?: number
  pendingSync?: boolean
  localId?: string // UUID for tracking before remote ID exists
}

export interface LocalRanking {
  id?: number
  teamNumber: string
  teamName: string
  autoAvg: number
  teleopAvg: number
  climbAvg: number
  endgameAvg: number
  defenceAvg: number
  deliveryAvg: number
  overallAvg: number
  overallRank: number
  syncedAt?: number
}

export interface SyncMeta {
  id?: number
  key: string
  value: string
  updatedAt: number
}

// Dexie database class
class RoboScoutDB extends Dexie {
  teams!: EntityTable<LocalTeam, "id">
  forms!: EntityTable<LocalForm, "id">
  rankings!: EntityTable<LocalRanking, "id">
  syncMeta!: EntityTable<SyncMeta, "id">

  constructor() {
    super("RoboScoutDB")
    
    this.version(1).stores({
      teams: "++id, teamNumber, teamName, syncedAt, pendingSync",
      forms: "++id, [teamNumber+matchNumber], teamNumber, matchNumber, scouterName, syncedAt, pendingSync, localId",
      rankings: "++id, teamNumber, overallRank, syncedAt",
      syncMeta: "++id, key",
    })
  }
}

// Singleton instance
export const localDb = new RoboScoutDB()

// Helper functions
export const localDbHelpers = {
  // Get last sync time for a table
  async getLastSync(table: "teams" | "forms" | "rankings"): Promise<number | null> {
    const meta = await localDb.syncMeta.where("key").equals(`lastSync_${table}`).first()
    return meta ? parseInt(meta.value, 10) : null
  },

  // Set last sync time for a table
  async setLastSync(table: "teams" | "forms" | "rankings"): Promise<void> {
    const key = `lastSync_${table}`
    const now = Date.now()
    const existing = await localDb.syncMeta.where("key").equals(key).first()
    if (existing) {
      await localDb.syncMeta.update(existing.id!, { value: now.toString(), updatedAt: now })
    } else {
      await localDb.syncMeta.add({ key, value: now.toString(), updatedAt: now })
    }
  },

  // Get all pending forms that need to sync
  async getPendingForms(): Promise<LocalForm[]> {
    return localDb.forms.where("pendingSync").equals(1).toArray()
  },

  // Get all pending teams that need to sync
  async getPendingTeams(): Promise<LocalTeam[]> {
    return localDb.teams.where("pendingSync").equals(1).toArray()
  },

  // Mark form as synced
  async markFormSynced(localId: string): Promise<void> {
    const form = await localDb.forms.where("localId").equals(localId).first()
    if (form) {
      await localDb.forms.update(form.id!, { pendingSync: false, syncedAt: Date.now() })
    }
  },

  // Mark team as synced
  async markTeamSynced(teamNumber: string): Promise<void> {
    const team = await localDb.teams.where("teamNumber").equals(teamNumber).first()
    if (team) {
      await localDb.teams.update(team.id!, { pendingSync: false, syncedAt: Date.now() })
    }
  },

  // Clear all data (for testing/reset)
  async clearAll(): Promise<void> {
    await localDb.teams.clear()
    await localDb.forms.clear()
    await localDb.rankings.clear()
    await localDb.syncMeta.clear()
  },

  // Get sync status
  async getSyncStatus(): Promise<{
    pendingForms: number
    pendingTeams: number
    lastTeamsSync: number | null
    lastFormsSync: number | null
    lastRankingsSync: number | null
  }> {
    const [pendingForms, pendingTeams, lastTeamsSync, lastFormsSync, lastRankingsSync] = await Promise.all([
      localDb.forms.where("pendingSync").equals(1).count(),
      localDb.teams.where("pendingSync").equals(1).count(),
      this.getLastSync("teams"),
      this.getLastSync("forms"),
      this.getLastSync("rankings"),
    ])
    return { pendingForms, pendingTeams, lastTeamsSync, lastFormsSync, lastRankingsSync }
  },
}
