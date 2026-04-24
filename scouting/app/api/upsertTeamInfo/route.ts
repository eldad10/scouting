import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  const body = await req.json()

  if (!process.env.EXPO_PUBLIC_SUPABASE_URL) {
    dotenv.config()
  }

  const supabase = createClient(
    process.env.EXPO_PUBLIC_SUPABASE_URL!,
    process.env.EXPO_PUBLIC_SUPABASE_KEY!
  )

  const { error } = await supabase
    .from("team_info")
    .upsert({
      teamnumber:          body.teamNumber,
      shooter_type:        body.shooterType,
      shooter_width:       body.shooterWidth,
      shooting_position:   body.shootingPosition,
      shooting_description: body.shootingDescription,
      delivery_rating:     body.deliveryRating,
      defence_rating:      body.defenceRating,
      speed_balance_rating: body.speedBalanceRating,
      advantages:          body.advantages,
      disadvantages:       body.disadvantages,
      additional_info:     body.additionalInfo,
      statbotics_rank:     body.statboticsRank ?? null,
    }, { onConflict: "teamnumber" })

  if (error) {
    console.error("[upsertTeamInfo]", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true }, { status: 200 })
}
