"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Briefcase,
  ChevronRight,
  CircleDollarSign,
  LayoutDashboard,
  MessageSquareText,
  Search,
  Settings,
  Sparkles,
  UserCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AgentsSection } from "./agents-section";

const stats = [
  { label: "Applications", value: "84", detail: "+12% this month" },
  { label: "Interviews", value: "18", detail: "3 upcoming" },
  { label: "Offers", value: "4", detail: "1 strong fit" },
  { label: "Resume score", value: "92/100", detail: "Excellent" },
];

const recentActivity = [
  { title: "Applied to Senior Product Designer", time: "12 min ago" },
  { title: "Interview invite from Northstar AI", time: "1 hr ago" },
  { title: "Resume optimized for Frontend roles", time: "3 hrs ago" },
];

const notifications = [
  "New interview prep plan ready",
  "Three new roles match your profile",
  "Your cover letter was just polished",
];

export function DashboardShell() {
  const [activeView, setActiveView] = useState("Overview");
  const [agentResponse, setAgentResponse] = useState("Select an agent or section to see its live guidance.");
  const [loading, setLoading] = useState(false);

  const navItems = useMemo(
    () => [
      { label: "Overview", icon: LayoutDashboard },
      { label: "Applications", icon: Briefcase },
      { label: "Interviews", icon: MessageSquareText },
      { label: "Offers", icon: CircleDollarSign },
      { label: "Settings", icon: Settings },
    ],
    []
  );

  async function handleAgentRun(agent: string) {
    setLoading(true);
    setAgentResponse(`Running ${agent}...`);

    try {
      const response = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agent: agent.toLowerCase().replace(/[^a-z]+/g, "-"),
          prompt: `Help me with ${agent} for my job search.`,
          context: "User is preparing for a high-impact role search and wants practical next actions.",
        }),
      });

      const data = await response.json();
      setAgentResponse(data.reply || "The agent is ready to help.");
    } catch {
      setAgentResponse("The agent could not be reached right now. Please try again shortly.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.13),_transparent_30%),#020617] text-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-3 py-3 lg:flex-row lg:px-6 lg:py-6">
        <aside className="w-full rounded-[28px] border border-white/10 bg-slate-950/70 p-4 shadow-2xl shadow-slate-950/40 lg:w-72 lg:p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-200">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-semibold text-white">Northstar AI</p>
              <p className="text-sm text-slate-400">Career OS</p>
            </div>
          </div>

          <nav className="mt-8 space-y-2">
            {navItems.map(({ label, icon: Icon }) => (
              <button
                key={label}
                onClick={() => {
                  setActiveView(label);
                  setAgentResponse(`Viewing ${label.toLowerCase()} workspace.`);
                }}
                className={`flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left text-sm transition ${
                  activeView === label ? "bg-cyan-400/15 text-white" : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-4 w-4" />
                  {label}
                </span>
                <ChevronRight className="h-4 w-4" />
              </button>
            ))}
          </nav>

          <div className="mt-8 rounded-[24px] border border-cyan-400/20 bg-cyan-400/10 p-4">
            <p className="text-sm font-medium text-cyan-200">Profile completion</p>
            <div className="mt-3 h-2 rounded-full bg-slate-800">
              <div className="h-2 w-[82%] rounded-full bg-cyan-400" />
            </div>
            <p className="mt-2 text-sm text-slate-300">82% complete · Add portfolio links</p>
          </div>
        </aside>

        <main className="flex-1 space-y-4">
          <header className="rounded-[28px] border border-white/10 bg-slate-950/70 p-4 shadow-xl shadow-slate-950/30 lg:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm text-cyan-200">Good morning, Maya</p>
                <h1 className="text-2xl font-semibold text-white">Your job search is accelerating.</h1>
                <p className="mt-2 text-sm text-slate-400">Active workspace: {activeView}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300">
                  <Search className="h-4 w-4" />
                  Search roles
                </div>
                <button className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-300">
                  <Bell className="h-4 w-4" />
                </button>
                <button className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-300">
                  <UserCircle2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </header>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
              >
                <Card className="border-white/10 bg-slate-900/70 shadow-lg shadow-slate-950/20">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-slate-400">{stat.label}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-semibold text-white">{stat.value}</div>
                    <p className="mt-2 text-sm text-cyan-200">{stat.detail}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </section>

          <section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
            <Card className="border-white/10 bg-slate-900/70 shadow-lg shadow-slate-950/20">
              <CardHeader>
                <CardTitle className="text-white">Pipeline momentum</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex h-56 items-end gap-3 rounded-[24px] border border-white/10 bg-gradient-to-t from-cyan-400/20 to-slate-950/60 p-4">
                  {[42, 74, 58, 88, 96, 70, 81].map((height, index) => (
                    <div key={index} className="flex-1 rounded-t-2xl bg-gradient-to-t from-cyan-400 to-indigo-400" style={{ height: `${height}%` }} />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-slate-900/70 shadow-lg shadow-slate-950/20">
              <CardHeader>
                <CardTitle className="text-white">Live agent guidance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-3 text-sm text-cyan-100">
                  {loading ? "Working on your request..." : agentResponse}
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Resume Agent",
                    "Job Match Agent",
                    "Interview Coach Agent",
                  ].map((agent) => (
                    <Button
                      key={agent}
                      variant="outline"
                      className="border-white/10 bg-transparent text-slate-200 hover:bg-white/10"
                      onClick={() => handleAgentRun(agent)}
                    >
                      {agent}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
            <Card className="border-white/10 bg-slate-900/70 shadow-lg shadow-slate-950/20">
              <CardHeader>
                <CardTitle className="text-white">Recent activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentActivity.map((item) => (
                  <div key={item.title} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/70 p-3">
                    <div>
                      <p className="text-sm font-medium text-white">{item.title}</p>
                      <p className="text-sm text-slate-400">{item.time}</p>
                    </div>
                    <Button variant="outline" className="border-white/10 bg-transparent text-slate-200 hover:bg-white/10">
                      View
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-slate-900/70 shadow-lg shadow-slate-950/20">
              <CardHeader>
                <CardTitle className="text-white">Resume health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-[24px] border border-cyan-400/20 bg-cyan-400/10 p-4">
                  <p className="text-sm text-cyan-200">Resume score</p>
                  <p className="mt-2 text-4xl font-semibold text-white">92</p>
                </div>
                <div className="space-y-2 text-sm text-slate-300">
                  <p>• Tailored for product and design roles</p>
                  <p>• Strong keyword alignment</p>
                  <p>• Add metrics to improve impact</p>
                </div>
              </CardContent>
            </Card>
          </section>

          <AgentsSection />
        </main>
      </div>
    </div>
  );
}
