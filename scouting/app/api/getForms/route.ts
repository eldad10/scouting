import { createClient } from "@supabase/supabase-js";
import { Form } from "@/lib/api";
import { isDemoMode, getDemoForms, getDemoForm } from "@/lib/demo-data";
import dotenv from "dotenv";
import { NextRequest } from "next/server";
export const dynamic = "force-dynamic";
export async function GET() {
  if (isDemoMode()) {
    return new Response(JSON.stringify(getDemoForms()), {
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

   const {data, error} = await client.from('forms').select("*");

  const transformed = data?.map(row=>{
    return new Form(row)
  })
  return new Response(JSON.stringify(transformed), {
    status: 200,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store", },
  });
}


export async function POST(req: NextRequest) {
  const { teamNumber, matchNumber } = await req.json()

  if (isDemoMode()) {
    const form = getDemoForm(teamNumber, Number(matchNumber))
    return new Response(JSON.stringify(form), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!process.env.EXPO_PUBLIC_SUPABASE_URL) {
    dotenv.config()
  }

  const client = createClient(
    process.env.EXPO_PUBLIC_SUPABASE_URL!,
    process.env.EXPO_PUBLIC_SUPABASE_KEY!,
       {
      global: {
        fetch: (url, options) => fetch(url, { ...options, cache: "no-store" }),
      },
    }
  )

  try {
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
