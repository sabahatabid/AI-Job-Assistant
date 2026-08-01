import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/backend/lib/supabase";
import { DashboardShell } from "@/frontend/components/dashboard/dashboard-shell";

export const metadata = {
  title: "CareerPilot AI Dashboard",
  description: "Your intelligent career command center.",
};

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    redirect("/auth/login");
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/login");
  }

  // Fetch profile if it exists; create a stub if not
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const displayName =
    profile?.full_name ||
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "there";

  return <DashboardShell user={{ email: user.email ?? "", displayName }} />;
}
