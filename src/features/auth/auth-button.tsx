"use client";

import { createClient } from "./auth-client";
import { Button } from "@/components/ui/button";

export function AuthButton() {
  const supabase = createClient();

  async function handleAuth() {
    if (!supabase) {
      alert("Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable auth.");
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email: "demo@example.com",
      options: { emailRedirectTo: `${window.location.origin}/` },
    });

    if (!error) {
      alert("Check your inbox to continue with Supabase auth.");
    }
  }

  return <Button onClick={handleAuth}>Sign in with magic link</Button>;
}
