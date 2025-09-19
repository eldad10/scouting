import { createClient } from "@supabase/supabase-js";
import { RankingData } from "@/lib/api";
import dotenv from "dotenv";
export async function GET() {

  if(!process.env.EXPO_PUBLIC_SUPABASE_URL){
    dotenv.config();
  }
  const client = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL!, process.env.EXPO_PUBLIC_SUPABASE_KEY!);
  console.log("Entered");
   const {data, error} = await client.from('rankings').select("teamnumber, teamname, auto_points, teleop_points, climb_points, overall_points, rank");

  const transformed = data?.map(row=>{
    return new RankingData(row)
  })
  return new Response(JSON.stringify(transformed), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}