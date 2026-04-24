import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { isDemoMode } from "@/lib/demo-data"
import dotenv from "dotenv"

export const dynamic = "force-dynamic"

export async function GET(_req: NextRequest) {
  if (isDemoMode()) {
    return NextResponse.json([])
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
    .order("statbotics_rank", { ascending: true, nullsFirst: false })

  if (error || !data) return NextResponse.json([])

  return NextResponse.json(
    data.map((row: any) => ({
      teamNumber:          row.teamnumber,
      shooterType:         row.shooter_type,
      shooterWidth:        row.shooter_width,
      shootingPosition:    row.shooting_position,
      shootingDescription: row.shooting_description,
      deliveryRating:      row.delivery_rating,
      defenceRating:       row.defence_rating,
      speedBalanceRating:  row.speed_balance_rating,
      advantages:          row.advantages,
      disadvantages:       row.disadvantages,
      additionalInfo:      row.additional_info,
      statboticsRank:      row.statbotics_rank ?? null,
    }))
  )
}
