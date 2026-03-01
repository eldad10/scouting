import { createClient } from "@supabase/supabase-js";
import { isDemoMode, insertDemoForm } from "@/lib/demo-data";
import { logger } from "@/lib/logger";
import { FormInput } from "@/lib/api";
import dotenv from "dotenv";
import { NextRequest } from "next/server";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const endTimer = logger.time("api/insertForm", "POST /api/insertForm");
  const fromInput: FormInput = await req.json();

  logger.info("api/insertForm", "Insert form request", { 
    teamNumber: fromInput.teamNumber, 
    matchNumber: fromInput.matchNumber,
    scout: fromInput.scoutName 
  });

  if (isDemoMode()) {
    logger.info("api/insertForm", "Demo mode: inserting demo form", { 
      teamNumber: fromInput.teamNumber, 
      matchNumber: fromInput.matchNumber
    });
    insertDemoForm(fromInput);
    endTimer();
    return new Response(JSON.stringify({ ok: true }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  }

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
    logger.debug("api/insertForm", "Inserting form into Supabase", { 
      teamNumber: fromInput.teamNumber, 
      matchNumber: fromInput.matchNumber
    });

    const { data, error } = await client
      .from("forms")
      .insert([fromInput])

    if (error) throw error;
    logger.success("api/insertForm", "Form inserted successfully", { 
      teamNumber: fromInput.teamNumber, 
      matchNumber: fromInput.matchNumber
    });
    endTimer();
    return new Response(JSON.stringify(data), {
      status: 201,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store", },
    });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    logger.error("api/insertForm", "Error inserting form", { 
      error: errorMsg, 
      teamNumber: fromInput.teamNumber,
      matchNumber: fromInput.matchNumber
    });
    endTimer();
    return new Response(
      JSON.stringify({ error: errorMsg }),
      { status: 500 }
    );
  }
}
