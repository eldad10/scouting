import { createClient } from "@supabase/supabase-js";
import { Team } from "@/lib/api";
import dotenv from "dotenv";
export async function GET() {

  if(!process.env.EXPO_PUBLIC_SUPABASE_URL){
    dotenv.config();
  }
  console.log(`ENV: ${process.env.EXPO_PUBLIC_SUPABASE_URL}`)
  const client = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL!, process.env.EXPO_PUBLIC_SUPABASE_KEY!);

   const {data, error} = await client.from('teams').select("*");

  const transformed = data?.map(row=>{
    return new Team(row.teamnumber,  row.teamname)
  })
  return new Response(JSON.stringify(transformed), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}