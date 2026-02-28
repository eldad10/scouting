import { createClient } from "@supabase/supabase-js";
import { isDemoMode, insertDemoForm } from "@/lib/demo-data";
import { FormInput } from "@/lib/api";
import dotenv from "dotenv";
import { NextRequest } from "next/server";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const fromInput: FormInput = await req.json();

  if (isDemoMode()) {
    insertDemoForm(fromInput);
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
    // read request body as JSON — already parsed above for demo check
    const fromInput2 = fromInput;

    // insert into Teams
    const { data, error } = await client
      .from("forms")
      .insert([fromInput2])

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
