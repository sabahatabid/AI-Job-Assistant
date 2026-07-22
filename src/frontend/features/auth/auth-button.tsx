"use client";

import { Button } from "@/frontend/components/ui/button";
import { supabase } from "./auth-client";

export function AuthButton() {
  async function handleAuth() {
    if (!supabase) {
      alert("Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable auth.");
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email: "demo@example.com",
      options: { emailRedirectTo: `${window.location.origin}/dashboard` },
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Check your inbox to continue with Supabase auth.");
  }

  return <Button onClick={handleAuth}>Sign in with magic link</Button>;
}
