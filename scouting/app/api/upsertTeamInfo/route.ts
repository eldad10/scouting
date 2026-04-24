import { NextRequest, NextResponse } from "next/server"
import { isDemoMode, upsertDemoTeamInfo } from "@/lib/demo-data"
import { TeamInfo } from "@/lib/api"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: NextRequest) {
  const body: TeamInfo = await req.json()

  if (!body.teamNumber) {
    return NextResponse.json({ error: "teamNumber is required" }, { status: 400 })
  }

  if (isDemoMode()) {
    upsertDemoTeamInfo(body)
    return NextResponse.json({ ok: true }, { status: 200 })
  }

  const supabase = createClient(
    process.env.EXPO_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { error } = await supabase.from("team_info").upsert({
    teamnumber:           body.teamNumber,
    shooter_type:         body.shooterType,
    shooter_width:        body.shooterWidth,
    shooting_position:    body.shootingPosition,
    shooting_description: body.shootingDescription,
    delivery_rating:      body.deliveryRating,
    defence_rating:       body.defenceRating,
    speed_balance_rating: body.speedBalanceRating,
    advantages:           body.advantages,
    disadvantages:        body.disadvantages,
    additional_info:      body.additionalInfo,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true }, { status: 200 })
}
