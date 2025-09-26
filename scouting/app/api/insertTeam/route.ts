import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { NextRequest } from "next/server";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
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

  try {
    // read request body as JSON
    const { teamNumber, teamName } = await req.json();

    // insert into Teams
    const { data, error } = await client
      .from("teams")
      .insert([{ teamnumber: teamNumber, teamname: teamName }]) // only teamnumber & teamName

    if (error) throw error;
    return new Response(JSON.stringify(data), {
      status: 201,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store", },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
      { status: 500 }
    );
  }
}
