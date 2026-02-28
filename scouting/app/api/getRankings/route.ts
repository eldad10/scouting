import { createClient } from "@supabase/supabase-js";
import { RankingData } from "@/lib/api";
import { isDemoMode, getDemoRankings } from "@/lib/demo-data";
import dotenv from "dotenv";
export const dynamic = "force-dynamic";
export async function GET() {
  if (isDemoMode()) {
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
   const {data, error} = await client.from('rankings').select("teamnumber, teamname, auto_points, teleop_points, climb_points, overall_points, rank");

  const transformed = data?.map(row=>{
    return new RankingData(row)
  })
  return new Response(JSON.stringify(transformed), {
    status: 200,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store", },
  });
}
