import { Client } from "pg";
import API from '../postgres/queryGenerator'
import { Team } from "@/lib/api";
import dotenv from "dotenv";
dotenv.config();
export async function GET() {
  
  const client = new Client({ connectionString: process.env.CONNECTION_STRING });
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