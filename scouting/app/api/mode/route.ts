import { isDemoMode } from "@/lib/demo-data"
export const dynamic = "force-dynamic"

export async function GET() {
  return new Response(JSON.stringify({ demo: isDemoMode() }), {
    status: 200,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  })
}
