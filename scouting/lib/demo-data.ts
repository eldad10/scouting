import { Form, FormInput, RankingData, Team } from "./api"

// ---------------------------------------------------------------------------
// Shared in-memory store so demo inserts persist during the server session
// ---------------------------------------------------------------------------
export const demoStore: {
  teams: { teamnumber: string; teamname: string }[]
  forms: FormInput[]
} = {
  teams: [
    { teamnumber: "1114", teamname: "Simbotics" },
    { teamnumber: "254", teamname: "The Cheesy Poofs" },
    { teamnumber: "2056", teamname: "OP Robotics" },
    { teamnumber: "1678", teamname: "Citrus Circuits" },
    { teamnumber: "3310", teamname: "Black Hawk Robotics" },
    { teamnumber: "6328", teamname: "Mechanical Advantage" },
    { teamnumber: "4414", teamname: "HighTide" },
    { teamnumber: "7407", teamname: "Steel Hawks" },
  ],
  forms: [
    // Team 254
    { scoutername: "Alice", matchnumber: 1, teamnumber: "254", auto_balls: "15-20", auto_climb: true,  auto_labels: "Crossed to middle of field,Collected from depot",             teleop_balls: "60-80",  teleop_climb_level: 3, defence_rating: 4, delivery_rating: 5, teleop_labels: "Collects balls very fast,Fast climb",                            comments: "Excellent auto performance" },
    { scoutername: "Bob",   matchnumber: 2, teamnumber: "254", auto_balls: "20+",   auto_climb: true,  auto_labels: "Crossed to middle of field",                               teleop_balls: "80-100", teleop_climb_level: 3, defence_rating: 3, delivery_rating: 4, teleop_labels: "Played very good defence,Fast climb",                          comments: "Dominated the field" },
    { scoutername: "Alice", matchnumber: 3, teamnumber: "254", auto_balls: "15-20", auto_climb: false, auto_labels: "",                                                         teleop_balls: "60-80",  teleop_climb_level: 2, defence_rating: 5, delivery_rating: 5, teleop_labels: "Played very good defence,Experienced in defence",             comments: "Great defence game" },
    // Team 1114
    { scoutername: "Carol", matchnumber: 1, teamnumber: "1114", auto_balls: "10-15", auto_climb: true,  auto_labels: "Collected from human player,Crossed to middle of field",  teleop_balls: "40-60",  teleop_climb_level: 3, defence_rating: 2, delivery_rating: 3, teleop_labels: "Fast climb",                                                  comments: "Solid auto, good climb" },
    { scoutername: "Carol", matchnumber: 2, teamnumber: "1114", auto_balls: "15-20", auto_climb: true,  auto_labels: "Crossed to middle of field",                              teleop_balls: "60-80",  teleop_climb_level: 3, defence_rating: 3, delivery_rating: 4, teleop_labels: "Collects balls very fast,Fast climb",                         comments: "Improving each match" },
    { scoutername: "Dan",   matchnumber: 3, teamnumber: "1114", auto_balls: "10-15", auto_climb: false, auto_labels: "Robot not working in auto",                               teleop_balls: "40-60",  teleop_climb_level: 2, defence_rating: 2, delivery_rating: 3, teleop_labels: "Robot had issues - limited play",                             comments: "Auto issues this match" },
    // Team 2056
    { scoutername: "Eve",   matchnumber: 1, teamnumber: "2056", auto_balls: "10-15", auto_climb: false, auto_labels: "Collected from depot",                                    teleop_balls: "40-60",  teleop_climb_level: 2, defence_rating: 5, delivery_rating: 2, teleop_labels: "Played very good defence,Experienced in defence",             comments: "Defence specialist" },
    { scoutername: "Eve",   matchnumber: 2, teamnumber: "2056", auto_balls: "5-10",  auto_climb: false, auto_labels: "",                                                        teleop_balls: "20-40",  teleop_climb_level: 1, defence_rating: 5, delivery_rating: 1, teleop_labels: "Played very good defence,Experienced in defence",             comments: "Heavy defence robot" },
    { scoutername: "Frank", matchnumber: 3, teamnumber: "2056", auto_balls: "10-15", auto_climb: true,  auto_labels: "Crossed to middle of field",                              teleop_balls: "40-60",  teleop_climb_level: 2, defence_rating: 4, delivery_rating: 2, teleop_labels: "Experienced in defence,Fast climb",                          comments: "Good mix this game" },
    // Team 1678
    { scoutername: "Grace", matchnumber: 1, teamnumber: "1678", auto_balls: "15-20", auto_climb: true,  auto_labels: "Crossed to middle of field,Collected from human player",  teleop_balls: "80-100", teleop_climb_level: 3, defence_rating: 1, delivery_rating: 5, teleop_labels: "Collects balls very fast",                                    comments: "Scoring machine" },
    { scoutername: "Grace", matchnumber: 2, teamnumber: "1678", auto_balls: "20+",   auto_climb: true,  auto_labels: "Crossed to middle of field",                              teleop_balls: "100+",   teleop_climb_level: 3, defence_rating: 0, delivery_rating: 5, teleop_labels: "Collects balls very fast,Misses a lot of shots",              comments: "Record-breaking teleop" },
    { scoutername: "Henry", matchnumber: 3, teamnumber: "1678", auto_balls: "15-20", auto_climb: true,  auto_labels: "Crossed to middle of field",                              teleop_balls: "80-100", teleop_climb_level: 3, defence_rating: 1, delivery_rating: 4, teleop_labels: "Collects balls very fast",                                    comments: "Consistent top scorer" },
    // Team 3310
    { scoutername: "Iris",  matchnumber: 1, teamnumber: "3310", auto_balls: "5-10",  auto_climb: false, auto_labels: "",                                                        teleop_balls: "20-40",  teleop_climb_level: 1, defence_rating: 3, delivery_rating: 2, teleop_labels: "Struggles with defence",                                     comments: "Learning curve" },
    { scoutername: "Iris",  matchnumber: 2, teamnumber: "3310", auto_balls: "10-15", auto_climb: false, auto_labels: "Collected from depot",                                    teleop_balls: "40-60",  teleop_climb_level: 2, defence_rating: 3, delivery_rating: 3, teleop_labels: "",                                                            comments: "Improved significantly" },
    { scoutername: "Jake",  matchnumber: 3, teamnumber: "3310", auto_balls: "10-15", auto_climb: true,  auto_labels: "Crossed to middle of field",                              teleop_balls: "40-60",  teleop_climb_level: 2, defence_rating: 4, delivery_rating: 3, teleop_labels: "Interfered with team robot",                                  comments: "Good improvement" },
    // Team 6328
    { scoutername: "Kate",  matchnumber: 1, teamnumber: "6328", auto_balls: "10-15", auto_climb: true,  auto_labels: "Collected from human player",                             teleop_balls: "60-80",  teleop_climb_level: 3, defence_rating: 2, delivery_rating: 4, teleop_labels: "Collects balls very fast,Fast climb",                         comments: "" },
    { scoutername: "Kate",  matchnumber: 2, teamnumber: "6328", auto_balls: "15-20", auto_climb: true,  auto_labels: "Crossed to middle of field,Collected from human player",  teleop_balls: "80-100", teleop_climb_level: 3, defence_rating: 2, delivery_rating: 5, teleop_labels: "Collects balls very fast",                                    comments: "Very fast collector" },
    { scoutername: "Leo",   matchnumber: 3, teamnumber: "6328", auto_balls: "10-15", auto_climb: false, auto_labels: "",                                                        teleop_balls: "60-80",  teleop_climb_level: 2, defence_rating: 1, delivery_rating: 4, teleop_labels: "",                                                            comments: "" },
    // Team 4414
    { scoutername: "Mia",   matchnumber: 1, teamnumber: "4414", auto_balls: "0-5",   auto_climb: false, auto_labels: "Robot not working in auto",                               teleop_balls: "20-40",  teleop_climb_level: 0, defence_rating: 4, delivery_rating: 1, teleop_labels: "Played very good defence,Experienced in defence",             comments: "Defence-focused robot" },
    { scoutername: "Mia",   matchnumber: 2, teamnumber: "4414", auto_balls: "5-10",  auto_climb: false, auto_labels: "",                                                        teleop_balls: "20-40",  teleop_climb_level: 1, defence_rating: 5, delivery_rating: 2, teleop_labels: "Played very good defence",                                    comments: "" },
    { scoutername: "Noah",  matchnumber: 3, teamnumber: "4414", auto_balls: "0-5",   auto_climb: false, auto_labels: "Robot not working in auto",                               teleop_balls: "10-20",  teleop_climb_level: 0, defence_rating: 5, delivery_rating: 1, teleop_labels: "Played very good defence,Experienced in defence",             comments: "Pure defence specialist" },
    // Team 7407
    { scoutername: "Olivia",matchnumber: 1, teamnumber: "7407", auto_balls: "5-10",  auto_climb: false, auto_labels: "Interfered with other robot",                             teleop_balls: "10-20",  teleop_climb_level: 1, defence_rating: 2, delivery_rating: 2, teleop_labels: "Robot had issues - limited play",                             comments: "Struggled with interference" },
    { scoutername: "Olivia",matchnumber: 2, teamnumber: "7407", auto_balls: "10-15", auto_climb: false, auto_labels: "",                                                        teleop_balls: "20-40",  teleop_climb_level: 1, defence_rating: 2, delivery_rating: 3, teleop_labels: "",                                                            comments: "" },
    { scoutername: "Paul",  matchnumber: 3, teamnumber: "7407", auto_balls: "10-15", auto_climb: true,  auto_labels: "Collected from depot",                                    teleop_balls: "40-60",  teleop_climb_level: 2, defence_rating: 3, delivery_rating: 3, teleop_labels: "",                                                            comments: "Best match yet" },
  ],
}

// ---------------------------------------------------------------------------
// Helper: is demo mode active?
// ---------------------------------------------------------------------------
export function isDemoMode(): boolean {
  return (
    !process.env.EXPO_PUBLIC_SUPABASE_URL ||
    process.env.EXPO_PUBLIC_SUPABASE_URL.trim() === "" ||
    process.env.DEMO_MODE === "true"
  )
}

// ---------------------------------------------------------------------------
// Demo implementations of each API endpoint
// ---------------------------------------------------------------------------

function ballsMidpoint(range: string, isTeleop: boolean): number {
  if (isTeleop) {
    const map: Record<string, number> = { "0-10": 5, "10-20": 15, "20-40": 30, "40-60": 50, "60-80": 70, "80-100": 90, "100+": 110 }
    return map[range] ?? 0
  } else {
    const map: Record<string, number> = { "0-5": 2.5, "5-10": 7.5, "10-15": 12.5, "15-20": 17.5, "20+": 22.5 }
    return map[range] ?? 0
  }
}

export function getDemoForms(): Form[] {
  return demoStore.forms.map((row) => new Form(row))
}

export function getDemoForm(teamNumber: string, matchNumber: number): Form | null {
  const row = demoStore.forms.find(
    (f) => f.teamnumber === teamNumber && f.matchnumber === matchNumber
  )
  return row ? new Form(row) : null
}

export function insertDemoForm(input: FormInput): void {
  // Replace if exists, else push
  const idx = demoStore.forms.findIndex(
    (f) => f.teamnumber === input.teamnumber && f.matchnumber === input.matchnumber
  )
  if (idx >= 0) demoStore.forms[idx] = input
  else demoStore.forms.push(input)
}

export function getDemoTeams(): Team[] {
  // Attach rank from rankings
  const rankings = getDemoRankings()
  return demoStore.teams.map((t) => {
    const rank = rankings.find((r) => r.teamNumber === t.teamnumber)?.overallRank ?? 999
    return new Team(t.teamnumber, t.teamname, rank)
  })
}

export function insertDemoTeam(teamNumber: string, teamName: string): void {
  if (!demoStore.teams.find((t) => t.teamnumber === teamNumber)) {
    demoStore.teams.push({ teamnumber: teamNumber, teamname: teamName })
  }
}

export function getDemoRankings(): RankingData[] {
  // Group forms by team
  const byTeam: Record<string, FormInput[]> = {}
  for (const form of demoStore.forms) {
    if (!byTeam[form.teamnumber]) byTeam[form.teamnumber] = []
    byTeam[form.teamnumber].push(form)
  }

  const rows = Object.entries(byTeam).map(([teamnumber, forms]) => {
    const n = forms.length
    const teamInfo = demoStore.teams.find((t) => t.teamnumber === teamnumber)

    const autoPoints = forms.map((f) =>
      ballsMidpoint(f.auto_balls, false) + (f.auto_climb ? 15 : 0)
    )
    const teleopPoints = forms.map((f) =>
      ballsMidpoint(f.teleop_balls, true)
    )
    const climbPoints = forms.map((f) =>
      (f.auto_climb ? 15 : 0) +
      (f.teleop_climb_level === 1 ? 10 : f.teleop_climb_level === 2 ? 20 : f.teleop_climb_level === 3 ? 30 : 0)
    )
    const overall = autoPoints.map((a, i) => {
      const f = forms[i]
      return a + teleopPoints[i] + (f.auto_climb ? 15 : 0) + (f.teleop_climb_level === 1 ? 10 : f.teleop_climb_level === 2 ? 20 : f.teleop_climb_level === 3 ? 30 : 0)
    })

    const avg = (arr: number[]) => arr.reduce((s, v) => s + v, 0) / arr.length

    return {
      teamnumber,
      teamname: teamInfo?.teamname ?? teamnumber,
      auto_points: Math.round(avg(autoPoints) * 1000) / 1000,
      teleop_points: Math.round(avg(teleopPoints) * 1000) / 1000,
      climb_points: Math.round(avg(climbPoints) * 1000) / 1000,
      avg_defence: Math.round(avg(forms.map((f) => f.defence_rating)) * 1000) / 1000,
      avg_delivery: Math.round(avg(forms.map((f) => f.delivery_rating)) * 1000) / 1000,
      overall_points: Math.round(avg(overall) * 1000) / 1000,
      rank: 0, // filled below
    }
  })

  // Sort by overall desc and assign rank
  rows.sort((a, b) => b.overall_points - a.overall_points)
  rows.forEach((r, i) => (r.rank = i + 1))

  return rows.map((r) => new RankingData(r))
}
