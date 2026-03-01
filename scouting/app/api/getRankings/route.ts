import { createClient } from "@supabase/supabase-js";
import { RankingData } from "@/lib/api";
import { isDemoMode, getDemoRankings } from "@/lib/demo-data";
import { logger } from "@/lib/logger";
import dotenv from "dotenv";
export const dynamic = "force-dynamic";
export async function GET() {
  const endTimer = logger.time("api/getRankings", "GET /api/getRankings");

  if (isDemoMode()) {
    logger.info("api/getRankings", "Demo mode: returning mock rankings");
    endTimer();
    return new Response(JSON.stringify(getDemoRankings()), {
      status: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  }

  if(!process.env.EXPO_PUBLIC_SUPABASE_URL){
    dotenv.config();
  }
  const client = createClient(
    process.env.EXPO_PUBLIC_SUPABASE_URL!,
    process.env.EXPO_PUBLIC_SUPABASE_KEY!,
     {
      global: {
        fetch: (url, options) => fetch(url, { ...options, cache: "no-store" }),
      },
    });

  logger.debug("api/getRankings", "Fetching rankings from Supabase");
  const {data, error} = await client.from('rankings').select("teamnumber, teamname, auto_points, teleop_points, climb_points, overall_points, rank");

  if (error) {
    logger.error("api/getRankings", "Error fetching rankings", { error: error.message, code: error.code });
    endTimer();
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const transformed = data?.map(row=>{
    return new RankingData(row)
  })
  logger.success("api/getRankings", "Rankings fetched successfully", { count: transformed?.length || 0 });
  endTimer();
  return new Response(JSON.stringify(transformed), {
    status: 200,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store", },
  });
}
