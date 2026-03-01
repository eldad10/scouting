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

  logger.debug("api/getTeams", "Fetching teams from Supabase");

  // Get all teams from teams table (lowercase) and join with rankings
  const { data: teamsData, error: teamsError } = await client
    .from("teams")
    .select("*")
    .order("teamnumber", { ascending: true });

  if (teamsError) {
    logger.error("api/getTeams", "Error fetching teams", { error: teamsError.message, code: teamsError.code });
    endTimer();
    return new Response(JSON.stringify({ error: teamsError.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  logger.info("api/getTeams", "Teams fetched successfully", { count: teamsData?.length || 0 });

  // Get rankings
  const { data: rankingsData, error: rankingsError } = await client
    .from("rankings")
    .select("*");

  if (rankingsError && rankingsError.code !== "PGRST116") {
    // PGRST116 = no rows returned, which is fine if no forms exist yet
    logger.warn("api/getTeams", "Error fetching rankings", { error: rankingsError.message, code: rankingsError.code });
    endTimer();
    return new Response(JSON.stringify({ error: rankingsError.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  logger.debug("api/getTeams", "Rankings fetched", { count: rankingsData?.length || 0 });

  // Create a map of team rankings for quick lookup
  const rankingMap = new Map();
  rankingsData?.forEach((ranking: any) => {
    rankingMap.set(ranking.teamnumber, ranking.overall_points || 0);
  });

  // Transform teams data with rankings
  const transformed = teamsData?.map((team: any) => {
    const rank = rankingMap.get(team.teamnumber) || 0;
    return new Team(team.teamnumber, team.teamname, rank);
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
