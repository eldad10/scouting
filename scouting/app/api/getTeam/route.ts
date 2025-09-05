import { Client } from "pg";
import API from '../postgres/queryGenerator'
import { Team } from "@/lib/api";
import dotenv from "dotenv";
dotenv.config();
export async function GET() {
  
  const client = new Client({ connectionString: "postgres://postgres:adspostgres@db.kpsaecoauyhpzpfasdly.supabase.co:5432/postgres" });
  await client.connect();

  const result = await client.query(API.getTeams());
  const transformed = result.rows.map(row=>{
    return new Team(row.teamnumber,  row.teamname)
  })
  await client.end();

  return new Response(JSON.stringify(transformed), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}