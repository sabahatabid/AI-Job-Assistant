import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/backend/lib/supabase";

export async function GET() {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return NextResponse.json({ profile: null });
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ profile: null }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 = row not found — that's fine for new users
    console.error("Profile fetch error:", error.message);
    return NextResponse.json({ profile: null });
  }

  return NextResponse.json({ profile: data ?? null });
}

export async function PATCH(request: Request) {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured." }, { status: 503 });
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  // Prevent overwriting id
  delete body.id;

  const { data, error } = await supabase
    .from("profiles")
    .upsert({ id: user.id, ...body, updated_at: new Date().toISOString() })
    .select()
    .single();

  if (error) {
    console.error("Profile upsert error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ profile: data });
}
