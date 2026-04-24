import { NextRequest, NextResponse } from "next/server"
import { isDemoMode } from "@/lib/demo-data"
import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const teamNumber = req.nextUrl.searchParams.get("team")
  if (!teamNumber) {
    return NextResponse.json({ error: "team query param required" }, { status: 400 })
  }

  if (isDemoMode()) {
    return NextResponse.json(null, { status: 404 })
  }

  if (!process.env.EXPO_PUBLIC_SUPABASE_URL) {
    dotenv.config()
  }

  const supabase = createClient(
    process.env.EXPO_PUBLIC_SUPABASE_URL!,
    process.env.EXPO_PUBLIC_SUPABASE_KEY!
  )

  const { data, error } = await supabase
    .from("team_info")
    .select("*")
    .eq("teamnumber", teamNumber)
    .single()

  if (error || !data) return NextResponse.json(null, { status: 404 })

  return NextResponse.json({
    teamNumber:          data.teamnumber,
    shooterType:         data.shooter_type,
    shooterWidth:        data.shooter_width,
    shootingPosition:    data.shooting_position,
    shootingDescription: data.shooting_description,
    deliveryRating:      data.delivery_rating,
    defenceRating:       data.defence_rating,
    speedBalanceRating:  data.speed_balance_rating,
    advantages:          data.advantages,
    disadvantages:       data.disadvantages,
    additionalInfo:      data.additional_info,
    statboticsRank:      data.statbotics_rank ?? null,
  })
}
