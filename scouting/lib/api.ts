// API service
export class Team {
  teamNumber: string
  teamName: string
  ranking?: number
  constructor(teamNumber: string, teamName: string, ranking?: number){
    this.teamNumber = teamNumber;
    this.teamName = teamName;
    this.ranking = ranking;
  }
}

export interface TeamInfo {
  teamNumber: string
  shooterType: 'fixed' | 'turret'
  shooterWidth: 'single' | 'double' | 'wide'
  shootingPosition: 'fixed' | 'all_around'
  shootingDescription: string
  deliveryRating: number
  defenceRating: number
  speedBalanceRating: number
  advantages: string
  disadvantages: string
  additionalInfo: string
}

export class FormInput {
  scoutername: string
  matchnumber: number
  teamnumber: string
  auto_balls: number
  auto_climb: boolean
  auto_labels: string
  teleop_balls: number
  teleop_climb_level: number
  defence_rating: number
  delivery_rating: number
  teleop_labels: string
  comments: string

  constructor(formInClient: any){
      this.scoutername = formInClient.scouterName
      this.matchnumber = formInClient.matchNumber
      this.teamnumber = formInClient.teamNumber
      this.auto_balls = Number(formInClient.autoBalls) || 0
      this.auto_climb = formInClient.autoClimb
      this.auto_labels = formInClient.autoLabels
      this.teleop_balls = Number(formInClient.teleopBalls) || 0
      this.teleop_climb_level = formInClient.teleopClimbLevel
      this.defence_rating = formInClient.defenceRating
      this.delivery_rating = formInClient.deliveryRating
      this.teleop_labels = formInClient.teleopLabels
      this.comments = formInClient.comments
  }
}

export class Form {
  scouterName: string
  matchNumber: number
  teamNumber: string
  autoBalls: number
  autoClimb: boolean
  autoLabels: string
  teleopBalls: number
  teleopClimbLevel: number
  defenceRating: number
  deliveryRating: number
  teleopLabels: string
  comments: string
  autoScore?: number = 0
  teleopScore?: number = 0
  climbScore?: number = 0
  totalScore?: number = 0

  constructor(input: FormInput) {
    this.scouterName = input.scoutername
    this.matchNumber = input.matchnumber
    this.teamNumber = input.teamnumber
    this.autoBalls = Number(input.auto_balls) || 0
    this.autoClimb = input.auto_climb
    this.autoLabels = input.auto_labels
    this.teleopBalls = Number(input.teleop_balls) || 0
    this.teleopClimbLevel = input.teleop_climb_level
    this.defenceRating = input.defence_rating
    this.deliveryRating = input.delivery_rating
    this.teleopLabels = input.teleop_labels
    this.comments = input.comments

    const autoClimbPts = this.autoClimb ? 15 : 0
    const teleopClimbPts =
      this.teleopClimbLevel === 1 ? 10 :
      this.teleopClimbLevel === 2 ? 20 :
      this.teleopClimbLevel === 3 ? 30 : 0

    this.autoScore   = this.autoBalls + autoClimbPts
    this.teleopScore = this.teleopBalls + teleopClimbPts
    this.climbScore  = autoClimbPts + teleopClimbPts
    this.totalScore  = this.autoBalls + autoClimbPts + this.teleopBalls + teleopClimbPts
  }
}

export interface RankingDataInput {
  teamnumber: string
  teamname: string
  auto_points: number
  teleop_points: number
  climb_points: number
  avg_defence: number
  avg_delivery: number
  overall_points: number
  rank: number
}


export class RankingData {
  teamNumber: string
  teamName: string
  autoAvg: number
  teleopAvg: number
  climbAvg: number
  defenceAvg: number
  deliveryAvg: number
  overallAvg: number
  overallRank: number

  constructor(rankInput: RankingDataInput){
    this.teamNumber = rankInput.teamnumber;
    this.teamName = rankInput.teamname;
    this.autoAvg = rankInput.auto_points;
    this.teleopAvg = rankInput.teleop_points;
    this.climbAvg = rankInput.climb_points;
    this.defenceAvg = rankInput.avg_defence;
    this.deliveryAvg = rankInput.avg_delivery;
    this.overallAvg = rankInput.overall_points;
    this.overallRank = rankInput.rank;
  }
}

// API functions
export const api = {
  // Teams API
  async getTeams(search?: string): Promise<Team[]> {
    const data = fetch("/api/getTeams");
    return <any>(await data).json()
  },

  async createTeam(teamData: Omit<Team, "ranking">): Promise<Team| null> {
    const res = await fetch("/api/insertTeam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(teamData)
      })
    if (res.status !== 201) return null
    return new Team(teamData.teamNumber, teamData.teamName);
  },

  // Forms API
  async getForms(filters?: { matchNumber?: string; teamNumber?: string; scouterName?: string }): Promise<Form[]> {
    let filteredForms: Form[] = await (await fetch("/api/getForms")).json()

    if (filters?.matchNumber) {
      filteredForms = filteredForms.filter((form) => form.matchNumber.toString().includes(filters.matchNumber!))
    }
    if (filters?.teamNumber) {
      filteredForms = filteredForms.filter((form) => form.teamNumber.includes(filters.teamNumber!))
    }
    if (filters?.scouterName) {
      filteredForms = filteredForms.filter((form) =>
        form.scouterName.toLowerCase().includes(filters.scouterName!.toLowerCase()),
      )
    }

    return filteredForms
  },

  async getForm(id: string): Promise<Form | null> {
    const [teamNumber, matchNumber] = id.split("-");
    const body = {teamNumber, matchNumber}
    
    const res: Form| null = await (
  await fetch("/api/getForms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  })
).json();
return res;
  },

  async getFormById(id: string): Promise<Form | null> {
    return await this.getForm(id)
  },

  async createForm(formData: any): Promise<Form| null> {
    const formInput = new FormInput(formData);
    const res = await fetch("/api/insertForm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formInput)
      })
    if (res.status !== 201) return null
    return new Form(formInput);
  },

  // Rankings API
  async getRankings(sortBy: "auto" | "teleop" | "climb" | "overall" = "overall"): Promise<RankingData[]> {
    let rankings: RankingData[] = await (await fetch("/api/getRankings")).json()
    const sorted = [...rankings].sort((a, b) => {
      switch (sortBy) {
        case "auto":
          return b.autoAvg - a.autoAvg
        case "teleop":
          return b.teleopAvg - a.teleopAvg
        case "climb":
          return b.climbAvg - a.climbAvg
        default:
          return b.overallAvg - a.overallAvg
      }
    })
    return sorted
  },

  // Team Info API
  async getTeamInfo(teamNumber: string): Promise<TeamInfo | null> {
    const res = await fetch(`/api/getTeamInfo?team=${encodeURIComponent(teamNumber)}`)
    if (!res.ok) return null
    return res.json()
  },

  async upsertTeamInfo(info: TeamInfo): Promise<boolean> {
    const res = await fetch("/api/upsertTeamInfo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(info),
    })
    return res.ok
  },
}
