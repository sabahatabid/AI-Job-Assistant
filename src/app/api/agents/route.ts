import { NextResponse } from "next/server";
import { runAgent } from "@/lib/openrouter";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { agent, prompt, context } = await request.json();
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error } = await supabase?.auth.getUser() ?? { data: { user: null }, error: null };

    if (!user && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json({
        ok: false,
        reply: "Authentication and Supabase credentials are required to use the agents.",
      });
    }

    const result = await runAgent(agent, prompt, context);

    if (supabase) {
      await supabase.from("agent_runs").insert({
        agent,
        prompt,
        response: result.reply,
        user_id: user?.id ?? null,
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, reply: "Agent request failed." }, { status: 500 });
  }
}
