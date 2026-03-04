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

export class FormInput {
  scoutername: string
  matchnumber: number
  teamnumber: string
  auto_balls: string
  auto_climb: boolean
  auto_labels: string
  teleop_balls: string
  teleop_climb_level: number
  defence_rating: number
  delivery_rating: number
  teleop_labels: string
  comments: string

  constructor(formInClient: any){
      this.scoutername = formInClient.scouterName
      this.matchnumber = formInClient.matchNumber
      this.teamnumber = formInClient.teamNumber
      this.auto_balls = formInClient.autoBalls
      this.auto_climb = formInClient.autoClimb
      this.auto_labels = formInClient.autoLabels
      this.teleop_balls = formInClient.teleopBalls
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
  autoBalls: string
  autoClimb: boolean
  autoLabels: string
  teleopBalls: string
  teleopClimbLevel: number
  defenceRating: number
  deliveryRating: number
  teleopLabels: string
  comments: string
  autoScore?: number = 0
  teleopScore?: number = 0
  climbScore?: number = 0
  totalScore?: number = 0

  private getBallsPoints(range: string, isTeleop: boolean): number {
    if (isTeleop) {
      switch(range) {
        case '0-10': return 5
        case '10-20': return 15
        case '20-40': return 30
        case '40-60': return 50
        case '60-80': return 70
        case '80-100': return 90
        case '100+': return 110
        default: return 0
      }
    } else {
      switch(range) {
        case '0-5': return 2.5
        case '5-10': return 7.5
        case '10-15': return 12.5
        case '15-20': return 17.5
        case '20+': return 22.5
        default: return 0
      }
    }
  }

  constructor(input: FormInput) {
    this.scouterName = input.scoutername
    this.matchNumber = input.matchnumber
    this.teamNumber = input.teamnumber
    this.autoBalls = input.auto_balls
    this.autoClimb = input.auto_climb
    this.autoLabels = input.auto_labels
    this.teleopBalls = input.teleop_balls
    this.teleopClimbLevel = input.teleop_climb_level
    this.defenceRating = input.defence_rating
    this.deliveryRating = input.delivery_rating
    this.teleopLabels = input.teleop_labels
    this.comments = input.comments

    this.autoScore = 
      this.getBallsPoints(this.autoBalls, false) +
      (this.autoClimb ? 15 : 0)

    this.teleopScore =
      this.getBallsPoints(this.teleopBalls, true)

    this.climbScore =
      (this.autoClimb ? 15 : 0) +
      (this.teleopClimbLevel === 1 ? 10 : this.teleopClimbLevel === 2 ? 20 : this.teleopClimbLevel === 3 ? 30 : 0)

    this.totalScore = this.autoScore + this.teleopScore + this.climbScore
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
  endgameAvg: number
  defenceAvg: number
  deliveryAvg: number
  overallAvg: number
  overallRank: number
  mobilityCount?: number
  dockedCount?: number
  balancedCount?: number

  constructor(rankInput: RankingDataInput){
    this.teamNumber = rankInput.teamnumber;
    this.teamName = rankInput.teamname;
    this.autoAvg = rankInput.auto_points;
    this.teleopAvg = rankInput.teleop_points;
    this.climbAvg = rankInput.climb_points;
    this.endgameAvg = rankInput.climb_points;
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
}
