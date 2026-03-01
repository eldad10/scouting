import { createClient } from "@supabase/supabase-js";
import { Team } from "@/lib/api";
import { isDemoMode, getDemoTeams } from "@/lib/demo-data";
import dotenv from "dotenv";

export const dynamic = "force-dynamic";

export async function GET() {
  if (isDemoMode()) {
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

  // Get all teams from Teams table and join with rankings
  const { data: teamsData, error: teamsError } = await client
    .from("Teams")
    .select("*")
    .order("TeamNumber", { ascending: true });

  if (teamsError) {
    return new Response(JSON.stringify({ error: teamsError.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Get rankings
  const { data: rankingsData, error: rankingsError } = await client
    .from("rankings")
    .select("*");

  if (rankingsError && rankingsError.code !== "PGRST116") {
    // PGRST116 = no rows returned, which is fine if no forms exist yet
    return new Response(JSON.stringify({ error: rankingsError.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Create a map of team rankings for quick lookup
  const rankingMap = new Map();
  rankingsData?.forEach((ranking: any) => {
    rankingMap.set(ranking.teamnumber, ranking.overall_points || 0);
  });

  // Transform teams data with rankings
  const transformed = teamsData?.map((team: any) => {
    const rank = rankingMap.get(team.TeamNumber) || 0;
    return new Team(team.TeamNumber, team.TeamName, rank);
  }) || [];

  return new Response(JSON.stringify(transformed), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store", 
    },
  });
}
