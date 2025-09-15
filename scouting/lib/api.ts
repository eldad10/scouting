
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

export interface FormInput {
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


export interface RankingData {
  teamNumber: string
  teamName: string
  autoAvg: number
  teleopAvg: number
  endgameAvg: number
  overallAvg: number
  ranking: number
}

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Mock data
const mockTeams: Team[] = [
  { teamNumber: "1234", teamName: "Robo Warriors", ranking: 1 },
  { teamNumber: "5678", teamName: "Steel Titans", ranking: 2 },
  { teamNumber: "9012", teamName: "Circuit Breakers", ranking: 3 },
  { teamNumber: "3456", teamName: "Gear Heads", ranking: 4 },
  { teamNumber: "7890", teamName: "Bot Builders", ranking: 5 },
  { teamNumber: "2468", teamName: "Mech Masters", ranking: 6 },
  { teamNumber: "1357", teamName: "Code Crushers", ranking: 7 },
  { teamNumber: "8642", teamName: "Tech Titans", ranking: 8 },
]

const mockForms: Form[] = [
  {
    scouterName: "Alex Johnson",
    matchNumber: 1,
    teamNumber: "1234",
    startPosition: "Side",
    passedLine: true,
    l1CoralsAuto: 3,
    l2CoralsAuto: 2,
    l3CoralsAuto: 1,
    l4CoralsAuto: 0,
    netAuto: 2,
    l1CoralsTele: 8,
    l2CoralsTele: 6,
    l3CoralsTele: 4,
    l4CoralsTele: 2,
    netTele: 5,
    processor: 3,
    highClimb: true,
    lowClimb: false,
    comments: "Strong autonomous performance, excellent climbing ability",
  },
  {
    scouterName: "Sarah Chen",
    matchNumber: 2,
    teamNumber: "5678",
    startPosition: "Middle",
    passedLine: true,
    l1CoralsAuto: 2,
    l2CoralsAuto: 3,
    l3CoralsAuto: 2,
    l4CoralsAuto: 1,
    netAuto: 3,
    l1CoralsTele: 7,
    l2CoralsTele: 5,
    l3CoralsTele: 3,
    l4CoralsTele: 1,
    netTele: 4,
    processor: 2,
    highClimb: false,
    lowClimb: true,
    comments: "Consistent scorer, good teleop control",
  },
  {
    scouterName: "Mike Rodriguez",
    matchNumber: 3,
    teamNumber: "9012",
    startPosition: "Side",
    passedLine: false,
    l1CoralsAuto: 1,
    l2CoralsAuto: 1,
    l3CoralsAuto: 0,
    l4CoralsAuto: 0,
    netAuto: 1,
    l1CoralsTele: 6,
    l2CoralsTele: 4,
    l3CoralsTele: 2,
    l4CoralsTele: 0,
    netTele: 3,
    processor: 1,
    highClimb: false,
    lowClimb: false,
    comments: "Struggled in autonomous, decent teleop performance",
  },
]

const mockRankings: RankingData[] = [
  {
    teamNumber: "1234",
    teamName: "Robo Warriors",
    autoAvg: 24.5,
    teleopAvg: 67.8,
    endgameAvg: 15.2,
    overallAvg: 107.5,
    ranking: 1,
  },
  {
    teamNumber: "5678",
    teamName: "Steel Titans",
    autoAvg: 22.1,
    teleopAvg: 65.3,
    endgameAvg: 12.8,
    overallAvg: 100.2,
    ranking: 2,
  },
  {
    teamNumber: "9012",
    teamName: "Circuit Breakers",
    autoAvg: 18.7,
    teleopAvg: 58.9,
    endgameAvg: 14.1,
    overallAvg: 91.7,
    ranking: 3,
  },
  {
    teamNumber: "3456",
    teamName: "Gear Heads",
    autoAvg: 20.3,
    teleopAvg: 55.2,
    endgameAvg: 11.5,
    overallAvg: 87.0,
    ranking: 4,
  },
  {
    teamNumber: "7890",
    teamName: "Bot Builders",
    autoAvg: 16.8,
    teleopAvg: 52.4,
    endgameAvg: 13.2,
    overallAvg: 82.4,
    ranking: 5,
  },
  {
    teamNumber: "2468",
    teamName: "Mech Masters",
    autoAvg: 15.2,
    teleopAvg: 48.7,
    endgameAvg: 10.8,
    overallAvg: 74.7,
    ranking: 6,
  },
  {
    teamNumber: "1357",
    teamName: "Code Crushers",
    autoAvg: 14.1,
    teleopAvg: 45.3,
    endgameAvg: 9.2,
    overallAvg: 68.6,
    ranking: 7,
  },
  {
    teamNumber: "8642",
    teamName: "Tech Titans",
    autoAvg: 12.5,
    teleopAvg: 42.1,
    endgameAvg: 8.5,
    overallAvg: 63.1,
    ranking: 8,
  },
]

// API functions
export const api = {
  // Teams API
  async getTeams(search?: string): Promise<Team[]> {
    await delay(200)
    const data = fetch("/api/getTeams");
    return <any>(await data).json()
  },

  async getTeam(teamNumber: string): Promise<Team | null> {
    await delay(200)
    return mockTeams.find((team) => team.teamNumber === teamNumber) || null
  },

  async createTeam(teamData: Omit<Team, "ranking">): Promise<Team> {
    await delay(200)
    const newTeam = { ...teamData, ranking: mockTeams.length + 1 }
    mockTeams.push(newTeam)
    return newTeam
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

  async createForm(formData: Omit<Form, "id">): Promise<Form> {
    await delay(200)
    const newForm = { ...formData, id: (mockForms.length + 1).toString() }
    mockForms.push(newForm)
    return newForm
  },

  // Rankings API
  async getRankings(sortBy: "auto" | "teleop" | "endgame" | "overall" = "overall"): Promise<RankingData[]> {
    await delay(200)
    const sorted = [...mockRankings].sort((a, b) => {
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

  // Statistics API
  async getTeamStatistics(teamNumber: string): Promise<any> {
    await delay(200)
    const teamForms = mockForms.filter((form) => form.teamNumber === teamNumber)

    if (teamForms.length === 0) return null

    // Calculate statistics from forms
    const coralData = teamForms.map((form, index) => ({
      match: form.matchNumber,
      L1: form.l1CoralsAuto + form.l1CoralsTele,
      L2: form.l2CoralsAuto + form.l2CoralsTele,
      L3: form.l3CoralsAuto + form.l3CoralsTele,
      L4: form.l4CoralsAuto + form.l4CoralsTele,
    }))

    const autoVsTeleop = teamForms.map((form) => ({
      match: form.matchNumber,
      auto: form.l1CoralsAuto + form.l2CoralsAuto + form.l3CoralsAuto + form.l4CoralsAuto + form.netAuto,
      teleop: form.l1CoralsTele + form.l2CoralsTele + form.l3CoralsTele + form.l4CoralsTele + form.netTele,
    }))

    const climbingData = [
      { type: "High Climb", count: teamForms.filter((f) => f.highClimb).length },
      { type: "Low Climb", count: teamForms.filter((f) => f.lowClimb).length },
      { type: "No Climb", count: teamForms.filter((f) => !f.highClimb && !f.lowClimb).length },
    ]

    return {
      coralData,
      autoVsTeleop,
      climbingData,
      totalMatches: teamForms.length,
      avgProcessor: teamForms.reduce((sum, f) => sum + f.processor, 0) / teamForms.length,
    }
  },
}
