import { createClient } from "@supabase/supabase-js";
import { Team } from "@/lib/api";
import { isDemoMode, getDemoTeams } from "@/lib/demo-data";
import { logger } from "@/lib/logger";
import dotenv from "dotenv";

export const dynamic = "force-dynamic";

export async function GET() {
  const endTimer = logger.time("api/getTeams", "GET /api/getTeams");

  if (isDemoMode()) {
    logger.info("api/getTeams", "Demo mode enabled, returning mock teams", { count: 8 });
    endTimer();
    return new Response(JSON.stringify(getDemoTeams()), {
      status: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  }

  if (!process.env.EXPO_PUBLIC_SUPABASE_URL) {
    dotenv.config();
  }

  const client = createClient(
    process.env.EXPO_PUBLIC_SUPABASE_URL!,
    process.env.EXPO_PUBLIC_SUPABASE_KEY!,
    {
      global: {
        fetch: (url, options) => fetch(url, { ...options, cache: "no-store" }),
      },
    }
  );

  logger.debug("api/getTeams", "Fetching teams from rankings view");

  // Get all teams from rankings view which includes their rank
  const { data: rankingsData, error: rankingsError } = await client
    .from("rankings")
    .select("teamnumber, teamname, rank")
    .order("rank", { ascending: true });

  if (rankingsError) {
    logger.error("api/getTeams", "Error fetching rankings", { error: rankingsError.message, code: rankingsError.code });
    endTimer();
    return new Response(JSON.stringify({ error: rankingsError.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  logger.info("api/getTeams", "Teams with rankings fetched successfully", { count: rankingsData?.length || 0 });

  // Transform rankings data to Team objects with rank
  const transformed = rankingsData?.map((row: any) => {
    return new Team(row.teamnumber, row.teamname, row.rank);
  }) || [];

  logger.success("api/getTeams", "Teams with rankings returned", { count: transformed.length });
  endTimer();

  return new Response(JSON.stringify(transformed), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store", 
    },
  });
}
