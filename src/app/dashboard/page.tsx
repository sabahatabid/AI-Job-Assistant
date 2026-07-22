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

  return <DashboardShell />;
}
