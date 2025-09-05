import { createClient } from "@supabase/supabase-js";
import API from '../postgres/queryGenerator'
import { Team } from "@/lib/api";
import dotenv from "dotenv";
dotenv.config();
export async function GET() {
  
  const client = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL!,process.env.EXPO_PUBLIC_SUPABASE_KEY! );

   const {data, error} = await client.from('teams').select("*");
  const transformed = data?.map(row=>{
    return new Team(row.teamnumber,  row.teamname)
  })
  console.log(transformed)

  return new Response(JSON.stringify(transformed), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}