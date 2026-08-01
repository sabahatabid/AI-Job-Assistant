import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/backend/lib/supabase";

export async function GET() {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return NextResponse.json({ runs: [] });
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ runs: [] });
  }

  const { data, error } = await supabase
    .from("agent_runs")
    .select("id, agent, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    return NextResponse.json({ runs: [] });
  }

  return NextResponse.json({ runs: data ?? [] });
}
