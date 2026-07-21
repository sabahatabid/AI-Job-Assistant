"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { SaaSLanding } from "@/components/landing/saas-landing";

export default function Home() {
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    const storedView = window.localStorage.getItem("ai-job-assistant-view");
    if (storedView === "dashboard") {
      setShowDashboard(true);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("ai-job-assistant-view", showDashboard ? "dashboard" : "landing");
  }, [showDashboard]);

  return showDashboard ? (
    <DashboardShell onBackToLanding={() => setShowDashboard(false)} />
  ) : (
    <SaaSLanding onGetStarted={() => setShowDashboard(true)} />
  );
}
