import { createClient } from "@supabase/supabase-js";
import { Team } from "@/lib/api";
import dotenv from "dotenv";

export const dynamic = "force-dynamic";

export async function GET() {
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

  const { data, error } = await client.rpc("get_teams_with_rank1")
    

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const transformed = data?.map(
    (row: any) => new Team(row.teamnumber, row.teamname, row.rank)
  );

  return new Response(JSON.stringify(transformed), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store", 
    },
  });
}