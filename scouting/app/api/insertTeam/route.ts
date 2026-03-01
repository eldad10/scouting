import { createClient } from "@supabase/supabase-js";
import { isDemoMode, insertDemoTeam } from "@/lib/demo-data";
import { logger } from "@/lib/logger";
import dotenv from "dotenv";
import { NextRequest } from "next/server";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const endTimer = logger.time("api/insertTeam", "POST /api/insertTeam");
  const { teamNumber, teamName } = await req.json();

  logger.info("api/insertTeam", "Insert team request", { teamNumber, teamName });

  if (isDemoMode()) {
    logger.info("api/insertTeam", "Demo mode: inserting demo team", { teamNumber, teamName });
    insertDemoTeam(teamNumber, teamName);
    endTimer();
    return new Response(JSON.stringify({ ok: true }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
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

  try {
    logger.debug("api/insertTeam", "Inserting into Supabase", { teamNumber, teamName });
    const { data, error } = await client
      .from("teams")
      .insert([{ teamnumber: teamNumber, teamname: teamName }])

    if (error) throw error;
    logger.success("api/insertTeam", "Team inserted successfully", { teamNumber });
    endTimer();
    return new Response(JSON.stringify(data), {
      status: 201,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store", },
    });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    logger.error("api/insertTeam", "Failed to insert team", { error: errorMsg, teamNumber });
    endTimer();
    return new Response(
      JSON.stringify({ error: errorMsg }),
      { status: 500 }
    );
  }
}
