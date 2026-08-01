"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Bell,
  Briefcase,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  Search,
  Sparkles,
  UserCircle2,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/frontend/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card";
import { AssistantClient } from "@/frontend/features/assistant/assistant-client";
import { JobBoard } from "@/frontend/features/jobs/job-board";
import { AgentsSection } from "./agents-section";
import { supabase } from "@/frontend/features/auth/auth-client";

// ─── Types ───────────────────────────────────────────────────────────────────

interface DashboardUser {
  email: string;
  displayName: string;
}

interface StatsData {
  applications: number;
  interviews: number;
  offers: number;
  resumeScore: number;
}

interface ActivityItem {
  title: string;
  time: string;
  id: string;
}

// ─── Static chart data (illustrative; replaced by real data when available) ──

const placeholderChartData = [
  { week: "Week 1", applications: 0, interviews: 0 },
  { week: "Week 2", applications: 0, interviews: 0 },
  { week: "Week 3", applications: 0, interviews: 0 },
  { week: "Week 4", applications: 0, interviews: 0 },
];

const tabs = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "jobs", label: "Applications", icon: Briefcase },
  { key: "chat", label: "Chat", icon: MessageSquareText },
  { key: "agents", label: "Agents", icon: Sparkles },
] as const;

type TabKey = (typeof tabs)[number]["key"];

// ─── Component ────────────────────────────────────────────────────────────────

export function DashboardShell({
  user,
  onBackToLanding,
}: {
  user?: DashboardUser;
  onBackToLanding?: () => void;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [statsLoading, setStatsLoading] = useState(false);
  const [stats, setStats] = useState<StatsData>({
    applications: 0,
    interviews: 0,
    offers: 0,
    resumeScore: 0,
  });
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [signingOut, setSigningOut] = useState(false);

  // Load dashboard data from API / Supabase
  useEffect(() => {
    let cancelled = false;

    async function loadDashboardData() {
      setStatsLoading(true);
      try {
        const profileRes = await fetch("/api/profile");
        if (!profileRes.ok) return;
        const { profile } = await profileRes.json();

        if (cancelled) return;

        if (profile) {
          setStats({
            applications: profile.applications_count ?? 0,
            interviews: profile.interviews_count ?? 0,
            offers: profile.offers_count ?? 0,
            resumeScore: profile.resume_score ?? 0,
          });
          setProfileCompletion(profile.completion_pct ?? 0);
        }

        // Load recent agent runs as activity items
        const runsRes = await fetch("/api/activity");
        if (!runsRes.ok) return;
        const { runs } = await runsRes.json();

        if (cancelled) return;

        if (Array.isArray(runs)) {
          setRecentActivity(
            runs.slice(0, 5).map(
              (r: { agent: string; created_at: string; id: string }) => ({
                id: r.id,
                title: `${r.agent} agent completed`,
                time: new Date(r.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              })
            )
          );

          if (runs.length > 0) {
            setNotifications([
              `Your last ${runs[0]?.agent} run is ready to review`,
              "Run an agent to see personalized next steps",
              "Keep building — consistency is the key to landing offers",
            ]);
          } else {
            setNotifications([
              "Run your first agent to get started",
              "Upload your resume in the Chat tab",
              "Explore the Agents tab for career AI tools",
            ]);
          }
        }
      } catch {
        // Network/parse errors — silently degrade
      } finally {
        if (!cancelled) setStatsLoading(false);
      }
    }

    loadDashboardData();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSignOut = useCallback(async () => {
    if (signingOut) return;
    setSigningOut(true);
    try {
      if (supabase) {
        await supabase.auth.signOut();
      }
    } finally {
      router.push("/auth/login");
    }
  }, [router, signingOut]);

  const statCards = [
    {
      label: "Applications",
      value: statsLoading ? "…" : String(stats.applications),
      detail: "tracked in your pipeline",
    },
    {
      label: "Interviews",
      value: statsLoading ? "…" : String(stats.interviews),
      detail: "secured from applications",
    },
    {
      label: "Offers",
      value: statsLoading ? "…" : String(stats.offers),
      detail: "received",
    },
    {
      label: "Resume score",
      value:
        statsLoading
          ? "…"
          : stats.resumeScore > 0
          ? `${stats.resumeScore}/100`
          : "—",
      detail:
        stats.resumeScore > 0
          ? stats.resumeScore >= 80
            ? "Excellent"
            : "Needs improvement"
          : "Run Resume Agent to score",
    },
  ];

  function renderTabContent() {
    switch (activeTab) {
      case "jobs":
        return (
          <div className="space-y-4 rounded-[32px] border border-white/10 bg-slate-900/70 p-5 shadow-xl shadow-slate-950/20 sm:p-8">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-200">
                  Role matching
                </p>
                <h2 className="mt-2 text-3xl font-semibold text-white">
                  High-fit opportunities, ready to pursue.
                </h2>
              </div>
              <p className="max-w-xl text-sm text-slate-400">
                Your assistant has ranked these roles by alignment with your
                background and goals.
              </p>
            </div>
            <JobBoard />
          </div>
        );
      case "chat":
        return (
          <div className="rounded-[32px] border border-white/10 bg-slate-900/70 p-5 shadow-xl shadow-slate-950/20 sm:p-8">
            <AssistantClient />
          </div>
        );
      case "agents":
        return <AgentsSection />;
      case "overview":
      default:
        return (
          <div className="space-y-4">
            {/* Stats */}
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {statCards.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                >
                  <Card className="border-white/10 bg-slate-900/70 shadow-lg shadow-slate-950/20">
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-slate-400">
                        {stat.label}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-semibold text-white">
                        {stat.value}
                      </div>
                      <p className="mt-2 text-sm text-cyan-200">{stat.detail}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </section>

            {/* Chart + Notifications */}
            <section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
              <Card className="border-white/10 bg-slate-900/70 shadow-lg shadow-slate-950/20">
                <CardHeader>
                  <CardTitle className="text-white">Pipeline momentum</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={placeholderChartData}
                        margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient
                            id="lineGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#22d3ee"
                              stopOpacity={0.75}
                            />
                            <stop
                              offset="100%"
                              stopColor="#22d3ee"
                              stopOpacity={0.05}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          stroke="rgba(148,163,184,0.12)"
                          strokeDasharray="3 3"
                        />
                        <XAxis
                          dataKey="week"
                          tick={{ fill: "#94a3b8", fontSize: 12 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fill: "#94a3b8", fontSize: 12 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#0f172a",
                            borderColor: "#334155",
                          }}
                          itemStyle={{ color: "#fff" }}
                        />
                        <Area
                          type="monotone"
                          dataKey="applications"
                          stroke="#06b6d4"
                          strokeWidth={3}
                          fill="url(#lineGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  {stats.applications === 0 && !statsLoading && (
                    <p className="mt-2 text-center text-sm text-slate-500">
                      Start tracking applications to see your pipeline chart.
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-slate-900/70 shadow-lg shadow-slate-950/20">
                <CardHeader>
                  <CardTitle className="text-white">Notifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {notifications.length > 0 ? (
                    notifications.map((note, i) => (
                      <div
                        key={i}
                        className="rounded-2xl border border-white/10 bg-slate-950/70 p-3 text-sm text-slate-300"
                      >
                        {note}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">No notifications yet.</p>
                  )}
                </CardContent>
              </Card>
            </section>

            {/* Activity + Resume Health */}
            <section className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
              <Card className="border-white/10 bg-slate-900/70 shadow-lg shadow-slate-950/20">
                <CardHeader>
                  <CardTitle className="text-white">Recent activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentActivity.length > 0 ? (
                    recentActivity.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/70 p-3"
                      >
                        <div>
                          <p className="text-sm font-medium text-white">
                            {item.title}
                          </p>
                          <p className="text-sm text-slate-400">{item.time}</p>
                        </div>
                        <Button
                          variant="outline"
                          className="border-white/10 bg-transparent text-slate-200 hover:bg-white/10"
                          onClick={() => setActiveTab("agents")}
                        >
                          View
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-400">
                      No activity yet. Run an agent or use the chat to get started.
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-slate-900/70 shadow-lg shadow-slate-950/20">
                <CardHeader>
                  <CardTitle className="text-white">Resume health</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-[24px] border border-cyan-400/20 bg-cyan-400/10 p-4">
                    <p className="text-sm text-cyan-200">Resume score</p>
                    <p className="mt-2 text-4xl font-semibold text-white">
                      {stats.resumeScore > 0 ? stats.resumeScore : "—"}
                    </p>
                  </div>
                  {stats.resumeScore > 0 ? (
                    <div className="space-y-2 text-sm text-slate-300">
                      <p>
                        {stats.resumeScore >= 80
                          ? "• Strong overall resume"
                          : "• Resume has room for improvement"}
                      </p>
                      <p>• Run the Resume Agent for detailed feedback</p>
                    </div>
                  ) : (
                    <div className="space-y-2 text-sm text-slate-400">
                      <p>Use the Resume Agent to get an AI-powered score and improvement suggestions.</p>
                      <Button
                        size="sm"
                        onClick={() => setActiveTab("agents")}
                        className="mt-2 rounded-full bg-cyan-400/10 px-3 text-cyan-200 hover:bg-cyan-400/20"
                      >
                        Go to Agents
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>
          </div>
        );
    }
  }

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.13),_transparent_30%),#020617] text-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-3 py-3 lg:flex-row lg:px-6 lg:py-6">
        {/* Sidebar */}
        <aside className="w-full rounded-[28px] border border-white/10 bg-slate-950/70 p-4 shadow-2xl shadow-slate-950/40 lg:w-72 lg:p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-200">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-semibold text-white">CareerPilot AI</p>
              <p className="text-sm text-slate-400">Career OS</p>
            </div>
          </div>

          <nav className="mt-8 space-y-2">
            {tabs.map(({ key, label, icon: Icon }) => {
              const isActive = activeTab === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left text-sm transition ${
                    isActive
                      ? "bg-cyan-400/15 text-white"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    {label}
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              );
            })}
          </nav>

          {/* Profile completion */}
          <div className="mt-8 rounded-[24px] border border-cyan-400/20 bg-cyan-400/10 p-4">
            <p className="text-sm font-medium text-cyan-200">Profile completion</p>
            <div className="mt-3 h-2 rounded-full bg-slate-800">
              <div
                className="h-2 rounded-full bg-cyan-400 transition-all duration-700"
                style={{ width: `${profileCompletion}%` }}
              />
            </div>
            <p className="mt-2 text-sm text-slate-300">
              {profileCompletion}% complete
              {profileCompletion < 100 ? " · Run agents to improve" : " · All done!"}
            </p>
          </div>

          {/* Sign out */}
          <div className="mt-4">
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm text-slate-400 transition hover:bg-white/5 hover:text-slate-200 disabled:opacity-50"
            >
              <LogOut className="h-4 w-4" />
              {signingOut ? "Signing out…" : "Sign out"}
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 space-y-4">
          <header className="rounded-[28px] border border-white/10 bg-slate-950/70 p-4 shadow-xl shadow-slate-950/30 lg:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm text-cyan-200">
                  {greeting},{" "}
                  {user?.displayName ?? "there"}
                </p>
                <h1 className="text-2xl font-semibold text-white">
                  Your job search is accelerating.
                </h1>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setActiveTab("jobs")}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10"
                >
                  <Search className="h-4 w-4" />
                  Search roles
                </button>
                <button
                  onClick={() => setActiveTab("overview")}
                  className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:bg-white/10"
                  aria-label="Notifications"
                >
                  <Bell className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setActiveTab("overview")}
                  className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:bg-white/10"
                  aria-label="Profile"
                >
                  <UserCircle2 className="h-4 w-4" />
                </button>
                {onBackToLanding ? (
                  <Button
                    variant="outline"
                    onClick={onBackToLanding}
                    className="border-white/10 bg-transparent text-slate-200 hover:bg-white/10"
                  >
                    Back to landing
                  </Button>
                ) : null}
              </div>
            </div>
          </header>

          {renderTabContent()}
        </main>
      </div>
    </div>
  );
}
