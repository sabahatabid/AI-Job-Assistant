import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/backend/lib/supabase";

export async function GET() {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return NextResponse.json({ profile: null });
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ profile: null });
  }

  const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();

  if (error) {
    return NextResponse.json({ profile: null });
  }

  return NextResponse.json({ profile: data });
}
