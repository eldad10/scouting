import { te } from "date-fns/locale";

// Mock API service with simulated delays
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
  startposition: boolean
  passedline: boolean
  l1coralsauto: number
  l2coralsauto: number
  l3coralsauto: number
  l4coralsauto: number
  netauto: number
  l1coralstele: number
  l2coralstele: number
  l3coralstele: number
  l4coralstele: number
  nettele: number
  processor: number
  highclimb: boolean
  lowclimb: boolean
  comments: string

  constructor(formInClient: any){
      this.scoutername = formInClient.scouterName
      this.matchnumber = formInClient.matchNumber
      this.teamnumber  = formInClient.teamNumber
      this.startposition = formInClient.startPosition === "Side"
      this.passedline = formInClient.passedLine
      this.l1coralsauto = formInClient.l1CoralsAuto
      this.l2coralsauto = formInClient.l2CoralsAuto
      this.l3coralsauto = formInClient.l3CoralsAuto
      this.l4coralsauto = formInClient.l4CoralsAuto
      this.netauto = formInClient.netAuto
      this.l1coralstele = formInClient.l1CoralsTele
      this.l2coralstele = formInClient.l2CoralsTele
      this.l3coralstele = formInClient.l3CoralsTele
      this.l4coralstele = formInClient.l4CoralsTele
      this.nettele = formInClient.netTele
      this.processor = formInClient.processor
      this.highclimb = formInClient.highClimb
      this.lowclimb = formInClient.lowClimb
      this.comments = formInClient.comments
  }
}

export class Form {
  scouterName: string
  matchNumber: number
  teamNumber: string
  startPosition: "Side" | "Middle"
  passedLine: boolean
  l1CoralsAuto: number
  l2CoralsAuto: number
  l3CoralsAuto: number
  l4CoralsAuto: number
  netAuto: number
  l1CoralsTele: number
  l2CoralsTele: number
  l3CoralsTele: number
  l4CoralsTele: number
  netTele: number
  processor: number
  highClimb: boolean
  lowClimb: boolean
  comments: string
  autoScore?: number = 0
  teleopScore?: number = 0
  endgameScore?: number = 0
  totalScore?: number = 0

  constructor(input: FormInput) {
    this.scouterName = input.scoutername
    this.matchNumber = input.matchnumber
    this.teamNumber = input.teamnumber
    this.startPosition = input.startposition? "Side": "Middle"
    this.passedLine = input.passedline
    this.l1CoralsAuto = input.l1coralsauto
    this.l2CoralsAuto = input.l2coralsauto
    this.l3CoralsAuto = input.l3coralsauto
    this.l4CoralsAuto = input.l4coralsauto
    this.netAuto = input.netauto
    this.l1CoralsTele = input.l1coralstele
    this.l2CoralsTele = input.l2coralstele
    this.l3CoralsTele = input.l3coralstele
    this.l4CoralsTele = input.l4coralstele
    this.netTele = input.nettele
    this.processor = input.processor
    this.highClimb = input.highclimb
    this.lowClimb = input.lowclimb
    this.comments = input.comments
    this.autoScore = 
    (this.passedLine ? 2 : 0) +
    (this.l1CoralsAuto || 0) * 3 +
    (this.l2CoralsAuto || 0) * 4 +
    (this.l3CoralsAuto || 0) * 6 +
    (this.l4CoralsAuto || 0) * 7 +
    (this.netAuto || 0) * 4

    this.teleopScore =
    (this.l1CoralsTele || 0) * 2 +
    (this.l2CoralsTele || 0) * 3 +
    (this.l3CoralsTele || 0) * 4 +
    (this.l4CoralsTele || 0) * 5 +
    (this.netTele || 0) * 4 +
    (this.processor || 0) * 2

    this.endgameScore = (this.highClimb ? 6 : 0) + (this.lowClimb ? 12 : 0)

    this.totalScore = this.autoScore + this.teleopScore + this.endgameScore
  }
}

export interface RankingDataInput {
  teamnumber: string
  teamname: string
  auto_points: number
  teleop_points: number
  climb_points: number
  overall_points: number
  rank: number
}


export class RankingData {
  teamNumber: string
  teamName: string
  autoAvg: number
  teleopAvg: number
  endgameAvg: number
  overallAvg: number
  overallRank: number

  constructor(rankInput: RankingDataInput){
    this.teamNumber = rankInput.teamnumber;
    this.teamName = rankInput.teamname;
    this.autoAvg = rankInput.auto_points;
    this.teleopAvg = rankInput.teleop_points;
    this.endgameAvg = rankInput.climb_points;
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
  async getRankings(sortBy: "auto" | "teleop" | "endgame" | "overall" = "overall"): Promise<RankingData[]> {
    let rankings: RankingData[] = await (await fetch("/api/getRankings")).json()
    const sorted = [...rankings].sort((a, b) => {
      switch (sortBy) {
        case "auto":
          return b.autoAvg - a.autoAvg
        case "teleop":
          return b.teleopAvg - a.teleopAvg
        case "endgame":
          return b.endgameAvg - a.endgameAvg
        default:
          return b.overallAvg - a.overallAvg
      }
    })
    return sorted
  },
}
