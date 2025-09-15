import { createClient } from "@supabase/supabase-js";
import { Team } from "@/lib/api";
import dotenv from "dotenv";
export async function GET() {

  if(!process.env.EXPO_PUBLIC_SUPABASE_URL){
    dotenv.config();
  }
  const client = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL!, process.env.EXPO_PUBLIC_SUPABASE_KEY!);

   const {data, error} = await client.rpc("get_teams_with_rank");

  const transformed = data?.map((row: any)=>{
    return new Team(row.teamnumber,  row.teamname, row.rank)
  })
  return new Response(JSON.stringify(transformed), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}