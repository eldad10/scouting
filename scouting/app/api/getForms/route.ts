import { createClient } from "@supabase/supabase-js";
import { Form } from "@/lib/api";
import dotenv from "dotenv";
import { NextRequest } from "next/server";
export async function GET() {

  if(!process.env.EXPO_PUBLIC_SUPABASE_URL){
    dotenv.config();
  }
  const client = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL!, process.env.EXPO_PUBLIC_SUPABASE_KEY!);

   const {data, error} = await client.from('forms').select("*");

  const transformed = data?.map(row=>{
    return new Form(row)
  })
  return new Response(JSON.stringify(transformed), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}


export async function POST(req: NextRequest) {
  if (!process.env.EXPO_PUBLIC_SUPABASE_URL) {
    dotenv.config()
  }

  const client = createClient(
    process.env.EXPO_PUBLIC_SUPABASE_URL!,
    process.env.EXPO_PUBLIC_SUPABASE_KEY!
  )

  try {
    // read request body as JSON
    const {teamNumber, matchNumber} = await req.json()
    // insert into Supabase
    const { data, error } = await client
  .from("forms")
  .select("*")
  .eq("teamnumber", teamNumber)
  .eq("matchnumber", Number(matchNumber))
    if (error) throw error

    // map response into Form class
    const transformed = data? new Form(data[0]) : {}

    return new Response(JSON.stringify(transformed), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    })
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
      { status: 500 }
    )
  }
}
