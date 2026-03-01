import { createClient } from "@supabase/supabase-js";
import { Form } from "@/lib/api";
import { isDemoMode, getDemoForms, getDemoForm } from "@/lib/demo-data";
import { logger } from "@/lib/logger";
import dotenv from "dotenv";
import { NextRequest } from "next/server";
export const dynamic = "force-dynamic";
export async function GET() {
  const endTimer = logger.time("api/getForms", "GET /api/getForms");

  if (isDemoMode()) {
    logger.info("api/getForms", "Demo mode: returning mock forms", { count: 24 });
    endTimer();
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

   logger.debug("api/getForms", "Fetching all forms from Supabase");
   const {data, error} = await client.from('forms').select("*");

   if (error) {
     logger.error("api/getForms", "Error fetching forms", { error: error.message, code: error.code });
     endTimer();
     return new Response(JSON.stringify({ error: error.message }), {
       status: 500,
       headers: { "Content-Type": "application/json" },
     });
   }

  const transformed = data?.map(row=>{
    return new Form(row)
  })
  logger.success("api/getForms", "Forms fetched successfully", { count: transformed?.length || 0 });
  endTimer();
  return new Response(JSON.stringify(transformed), {
    status: 200,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store", },
  });
}


export async function POST(req: NextRequest) {
  const endTimer = logger.time("api/getForms", "POST /api/getForms");
  const { teamNumber, matchNumber } = await req.json()

  logger.info("api/getForms", "Get form by team/match", { teamNumber, matchNumber });

  if (isDemoMode()) {
    logger.debug("api/getForms", "Demo mode: returning demo form", { teamNumber, matchNumber });
    const form = getDemoForm(teamNumber, Number(matchNumber))
    endTimer();
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
    logger.debug("api/getForms", "Querying Supabase", { teamNumber, matchNumber });
    const { data, error } = await client
      .from("forms")
      .select("*")
      .eq("teamnumber", teamNumber)
      .eq("matchnumber", Number(matchNumber))
    
    if (error) throw error

    const transformed = data? new Form(data[0]) : {}
    logger.success("api/getForms", "Form retrieved", { teamNumber, matchNumber, found: !!data?.length });
    endTimer();

    return new Response(JSON.stringify(transformed), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    })
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    logger.error("api/getForms", "Error retrieving form", { error: errorMsg, teamNumber, matchNumber });
    endTimer();
    return new Response(
      JSON.stringify({ error: errorMsg }),
      { status: 500 }
    )
  }
}
