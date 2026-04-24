import { Form, FormInput, RankingData, Team, TeamInfo } from "./api"

// ---------------------------------------------------------------------------
// Shared in-memory store so demo inserts persist during the server session
// ---------------------------------------------------------------------------
export const demoStore: {
  teams: { teamnumber: string; teamname: string }[]
  forms: FormInput[]
  teamInfos: Record<string, TeamInfo>
} = {
  teams: [
    { teamnumber: "254",  teamname: "The Cheesy Poofs" },
    { teamnumber: "1114", teamname: "Simbotics" },
    { teamnumber: "2056", teamname: "OP Robotics" },
    { teamnumber: "1678", teamname: "Citrus Circuits" },
    { teamnumber: "3310", teamname: "Black Hawk Robotics" },
    { teamnumber: "6328", teamname: "Mechanical Advantage" },
    { teamnumber: "4414", teamname: "HighTide" },
    { teamnumber: "7407", teamname: "Steel Hawks" },
  ],
  forms: [
    // Team 254 — balls are now exact integers
    { scoutername: "Alice",  matchnumber: 1, teamnumber: "254",  auto_balls: 18, auto_climb: true,  auto_labels: "Crossed to middle of field,Collected from depot",           teleop_balls: 72,  teleop_climb_level: 3, defence_rating: 4, delivery_rating: 5, teleop_labels: "Collects balls very fast,Fast climb",            comments: "Excellent auto performance" },
    { scoutername: "Bob",    matchnumber: 2, teamnumber: "254",  auto_balls: 22, auto_climb: true,  auto_labels: "Crossed to middle of field",                               teleop_balls: 91,  teleop_climb_level: 3, defence_rating: 3, delivery_rating: 4, teleop_labels: "Played very good defence,Fast climb",            comments: "Dominated the field" },
    { scoutername: "Alice",  matchnumber: 3, teamnumber: "254",  auto_balls: 17, auto_climb: false, auto_labels: "",                                                         teleop_balls: 68,  teleop_climb_level: 2, defence_rating: 5, delivery_rating: 5, teleop_labels: "Played very good defence,Experienced in defence", comments: "Great defence game" },
    // Team 1114
    { scoutername: "Carol",  matchnumber: 1, teamnumber: "1114", auto_balls: 12, auto_climb: true,  auto_labels: "Collected from human player,Crossed to middle of field",   teleop_balls: 47,  teleop_climb_level: 3, defence_rating: 2, delivery_rating: 3, teleop_labels: "Fast climb",                                     comments: "Solid auto, good climb" },
    { scoutername: "Carol",  matchnumber: 2, teamnumber: "1114", auto_balls: 16, auto_climb: true,  auto_labels: "Crossed to middle of field",                               teleop_balls: 65,  teleop_climb_level: 3, defence_rating: 3, delivery_rating: 4, teleop_labels: "Collects balls very fast,Fast climb",            comments: "Improving each match" },
    { scoutername: "Dan",    matchnumber: 3, teamnumber: "1114", auto_balls: 11, auto_climb: false, auto_labels: "Robot not working in auto",                                 teleop_balls: 43,  teleop_climb_level: 2, defence_rating: 2, delivery_rating: 3, teleop_labels: "Robot had issues - limited play",                comments: "Auto issues this match" },
    // Team 2056
    { scoutername: "Eve",    matchnumber: 1, teamnumber: "2056", auto_balls: 13, auto_climb: false, auto_labels: "Collected from depot",                                      teleop_balls: 45,  teleop_climb_level: 2, defence_rating: 5, delivery_rating: 2, teleop_labels: "Played very good defence,Experienced in defence", comments: "Defence specialist" },
    { scoutername: "Eve",    matchnumber: 2, teamnumber: "2056", auto_balls:  7, auto_climb: false, auto_labels: "",                                                         teleop_balls: 25,  teleop_climb_level: 1, defence_rating: 5, delivery_rating: 1, teleop_labels: "Played very good defence,Experienced in defence", comments: "Heavy defence robot" },
    { scoutername: "Frank",  matchnumber: 3, teamnumber: "2056", auto_balls: 12, auto_climb: true,  auto_labels: "Crossed to middle of field",                               teleop_balls: 44,  teleop_climb_level: 2, defence_rating: 4, delivery_rating: 2, teleop_labels: "Experienced in defence,Fast climb",              comments: "Good mix this game" },
    // Team 1678
    { scoutername: "Grace",  matchnumber: 1, teamnumber: "1678", auto_balls: 17, auto_climb: true,  auto_labels: "Crossed to middle of field,Collected from human player",   teleop_balls: 88,  teleop_climb_level: 3, defence_rating: 1, delivery_rating: 5, teleop_labels: "Collects balls very fast",                        comments: "Scoring machine" },
    { scoutername: "Grace",  matchnumber: 2, teamnumber: "1678", auto_balls: 21, auto_climb: true,  auto_labels: "Crossed to middle of field",                               teleop_balls: 105, teleop_climb_level: 3, defence_rating: 0, delivery_rating: 5, teleop_labels: "Collects balls very fast,Misses a lot of shots",  comments: "Record-breaking teleop" },
    { scoutername: "Henry",  matchnumber: 3, teamnumber: "1678", auto_balls: 18, auto_climb: true,  auto_labels: "Crossed to middle of field",                               teleop_balls: 86,  teleop_climb_level: 3, defence_rating: 1, delivery_rating: 4, teleop_labels: "Collects balls very fast",                        comments: "Consistent top scorer" },
    // Team 3310
    { scoutername: "Iris",   matchnumber: 1, teamnumber: "3310", auto_balls:  7, auto_climb: false, auto_labels: "",                                                         teleop_balls: 28,  teleop_climb_level: 1, defence_rating: 3, delivery_rating: 2, teleop_labels: "Struggles with defence",                          comments: "Learning curve" },
    { scoutername: "Iris",   matchnumber: 2, teamnumber: "3310", auto_balls: 11, auto_climb: false, auto_labels: "Collected from depot",                                      teleop_balls: 44,  teleop_climb_level: 2, defence_rating: 3, delivery_rating: 3, teleop_labels: "",                                               comments: "Improved significantly" },
    { scoutername: "Jake",   matchnumber: 3, teamnumber: "3310", auto_balls: 12, auto_climb: true,  auto_labels: "Crossed to middle of field",                               teleop_balls: 48,  teleop_climb_level: 2, defence_rating: 4, delivery_rating: 3, teleop_labels: "Interfered with team robot",                      comments: "Good improvement" },
    // Team 6328
    { scoutername: "Kate",   matchnumber: 1, teamnumber: "6328", auto_balls: 13, auto_climb: true,  auto_labels: "Collected from human player",                              teleop_balls: 66,  teleop_climb_level: 3, defence_rating: 2, delivery_rating: 4, teleop_labels: "Collects balls very fast,Fast climb",            comments: "" },
    { scoutername: "Kate",   matchnumber: 2, teamnumber: "6328", auto_balls: 16, auto_climb: true,  auto_labels: "Crossed to middle of field,Collected from human player",   teleop_balls: 84,  teleop_climb_level: 3, defence_rating: 2, delivery_rating: 5, teleop_labels: "Collects balls very fast",                        comments: "Very fast collector" },
    { scoutername: "Leo",    matchnumber: 3, teamnumber: "6328", auto_balls: 12, auto_climb: false, auto_labels: "",                                                         teleop_balls: 63,  teleop_climb_level: 2, defence_rating: 1, delivery_rating: 4, teleop_labels: "",                                               comments: "" },
    // Team 4414
    { scoutername: "Mia",    matchnumber: 1, teamnumber: "4414", auto_balls:  3, auto_climb: false, auto_labels: "Robot not working in auto",                                 teleop_balls: 22,  teleop_climb_level: 0, defence_rating: 4, delivery_rating: 1, teleop_labels: "Played very good defence,Experienced in defence", comments: "Defence-focused robot" },
    { scoutername: "Mia",    matchnumber: 2, teamnumber: "4414", auto_balls:  6, auto_climb: false, auto_labels: "",                                                         teleop_balls: 24,  teleop_climb_level: 1, defence_rating: 5, delivery_rating: 2, teleop_labels: "Played very good defence",                        comments: "" },
    { scoutername: "Noah",   matchnumber: 3, teamnumber: "4414", auto_balls:  2, auto_climb: false, auto_labels: "Robot not working in auto",                                 teleop_balls: 14,  teleop_climb_level: 0, defence_rating: 5, delivery_rating: 1, teleop_labels: "Played very good defence,Experienced in defence", comments: "Pure defence specialist" },
    // Team 7407
    { scoutername: "Olivia", matchnumber: 1, teamnumber: "7407", auto_balls:  6, auto_climb: false, auto_labels: "Interfered with other robot",                              teleop_balls: 16,  teleop_climb_level: 1, defence_rating: 2, delivery_rating: 2, teleop_labels: "Robot had issues - limited play",                 comments: "Struggled with interference" },
    { scoutername: "Olivia", matchnumber: 2, teamnumber: "7407", auto_balls: 11, auto_climb: false, auto_labels: "",                                                         teleop_balls: 27,  teleop_climb_level: 1, defence_rating: 2, delivery_rating: 3, teleop_labels: "",                                               comments: "" },
    { scoutername: "Paul",   matchnumber: 3, teamnumber: "7407", auto_balls: 12, auto_climb: true,  auto_labels: "Collected from depot",                                      teleop_balls: 42,  teleop_climb_level: 2, defence_rating: 3, delivery_rating: 3, teleop_labels: "",                                               comments: "Best match yet" },
  ],
  teamInfos: {
    "254":  { teamNumber: "254",  shooterType: "turret", shooterWidth: "wide",   shootingPosition: "all_around", shootingDescription: "High-speed turret with wide intake. Can shoot from anywhere on the field with exceptional accuracy.",        deliveryRating: 5, defenceRating: 4, speedBalanceRating: 5, advantages: "Incredible accuracy, fast cycle time, strong climb",          disadvantages: "Vulnerable when defence targets the intake",          additionalInfo: "One of the top teams globally. Protect them." },
    "1114": { teamNumber: "1114", shooterType: "fixed",  shooterWidth: "double", shootingPosition: "fixed",      shootingDescription: "Fixed shooter at the substation zone. Double-wide intake allows rapid ball collection.",                    deliveryRating: 4, defenceRating: 3, speedBalanceRating: 4, advantages: "Very consistent scoring, reliable auto, strong climb",        disadvantages: "Struggles when pushed off preferred shooting spot",    additionalInfo: "Strong alliance partner. Reliable in all phases." },
    "2056": { teamNumber: "2056", shooterType: "fixed",  shooterWidth: "single", shootingPosition: "fixed",      shootingDescription: "Primarily a defence robot with a modest fixed shooter for opportunistic scoring.",                          deliveryRating: 2, defenceRating: 5, speedBalanceRating: 5, advantages: "Exceptional defence, fast and very hard to push",            disadvantages: "Low scoring output when not playing defence",          additionalInfo: "Best used as a defence bot. Do not rely on scoring." },
    "1678": { teamNumber: "1678", shooterType: "turret", shooterWidth: "wide",   shootingPosition: "all_around", shootingDescription: "Top-tier turret shooter with wide collection. Highest scoring team in the competition.",                    deliveryRating: 5, defenceRating: 1, speedBalanceRating: 4, advantages: "Highest teleop output, excellent auto, consistent climb",    disadvantages: "Almost no defence capability",                         additionalInfo: "Pure scorer. Pair with a defence partner." },
    "3310": { teamNumber: "3310", shooterType: "fixed",  shooterWidth: "single", shootingPosition: "fixed",      shootingDescription: "Mid-range fixed shooter still developing consistency. Improving match over match.",                         deliveryRating: 3, defenceRating: 4, speedBalanceRating: 3, advantages: "Improving consistency, decent defence",                      disadvantages: "Auto reliability issues, lower ball count",            additionalInfo: "Developing team with upside in later matches." },
    "6328": { teamNumber: "6328", shooterType: "turret", shooterWidth: "double", shootingPosition: "all_around", shootingDescription: "Strong turret with double intake. Second-tier scorer with reliable climb.",                                 deliveryRating: 4, defenceRating: 2, speedBalanceRating: 4, advantages: "Fast intake, good climb, versatile positioning",             disadvantages: "Can be disrupted by heavy defence",                    additionalInfo: "Reliable alliance partner. Good backup scorer." },
    "4414": { teamNumber: "4414", shooterType: "fixed",  shooterWidth: "single", shootingPosition: "fixed",      shootingDescription: "Dedicated defence robot. Rarely shoots, focused entirely on disrupting opponents.",                         deliveryRating: 1, defenceRating: 5, speedBalanceRating: 5, advantages: "Dominant defence, very hard to push, fast",                  disadvantages: "Near-zero scoring contribution",                       additionalInfo: "Use only when you need a full defence robot." },
    "7407": { teamNumber: "7407", shooterType: "fixed",  shooterWidth: "single", shootingPosition: "fixed",      shootingDescription: "Developing team with a basic fixed shooter. Has shown improvement across matches.",                         deliveryRating: 2, defenceRating: 2, speedBalanceRating: 3, advantages: "Improving each match, solid climb by match 3",               disadvantages: "Interference issues early, lower ball count",          additionalInfo: "Monitor progress. May be reliable in later rounds." },
  },
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
  const idx = demoStore.forms.findIndex(
    (f) => f.teamnumber === input.teamnumber && f.matchnumber === input.matchnumber
  )
  if (idx >= 0) demoStore.forms[idx] = input
  else demoStore.forms.push(input)
}

export function getDemoTeams(): Team[] {
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

export function getDemoTeamInfo(teamNumber: string): TeamInfo | null {
  return demoStore.teamInfos[teamNumber] ?? null
}

export function upsertDemoTeamInfo(info: TeamInfo): void {
  demoStore.teamInfos[info.teamNumber] = info
}

export function getDemoRankings(): RankingData[] {
  const byTeam: Record<string, FormInput[]> = {}
  for (const form of demoStore.forms) {
    if (!byTeam[form.teamnumber]) byTeam[form.teamnumber] = []
    byTeam[form.teamnumber].push(form)
  }

  const avg = (arr: number[]) => arr.reduce((s, v) => s + v, 0) / arr.length

  const rows = Object.entries(byTeam).map(([teamnumber, forms]) => {
    const teamEntry = demoStore.teams.find((t) => t.teamnumber === teamnumber)

    const climbPts = (f: FormInput) =>
      (f.auto_climb ? 15 : 0) +
      (f.teleop_climb_level === 1 ? 10 : f.teleop_climb_level === 2 ? 20 : f.teleop_climb_level === 3 ? 30 : 0)

    const autoPoints   = forms.map((f) => Number(f.auto_balls)   + (f.auto_climb ? 15 : 0))
    const teleopPoints = forms.map((f) => Number(f.teleop_balls) + (f.teleop_climb_level === 1 ? 10 : f.teleop_climb_level === 2 ? 20 : f.teleop_climb_level === 3 ? 30 : 0))
    const climbPoints  = forms.map(climbPts)
    const overall      = forms.map((f) => Number(f.auto_balls) + (f.auto_climb ? 15 : 0) + Number(f.teleop_balls) + (f.teleop_climb_level === 1 ? 10 : f.teleop_climb_level === 2 ? 20 : f.teleop_climb_level === 3 ? 30 : 0))

    return {
      teamnumber,
      teamname:      teamEntry?.teamname ?? teamnumber,
      auto_points:   Math.round(avg(autoPoints)   * 1000) / 1000,
      teleop_points: Math.round(avg(teleopPoints) * 1000) / 1000,
      climb_points:  Math.round(avg(climbPoints)  * 1000) / 1000,
      avg_defence:   Math.round(avg(forms.map((f) => f.defence_rating))  * 1000) / 1000,
      avg_delivery:  Math.round(avg(forms.map((f) => f.delivery_rating)) * 1000) / 1000,
      overall_points: Math.round(avg(overall) * 1000) / 1000,
      rank: 0,
    }
  })

  rows.sort((a, b) => b.overall_points - a.overall_points)
  rows.forEach((r, i) => (r.rank = i + 1))

  return rows.map((r) => new RankingData(r))
}
