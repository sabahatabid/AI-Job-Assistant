"use client";

import { motion } from "framer-motion";
import { ArrowRight, Bot, BrainCircuit, Briefcase, ClipboardCheck, Compass, FileText, GraduationCap, Sparkles, UserRoundSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const agents = [
  {
    title: "Resume Agent",
    description: "Optimizes your resume for target roles with ATS-focused phrasing and impact-driven bullets.",
    icon: FileText,
  },
  {
    title: "Job Match Agent",
    description: "Finds the strongest role matches based on skills, goals, and company fit.",
    icon: Briefcase,
  },
  {
    title: "Cover Letter Agent",
    description: "Drafts personalized, persuasive cover letters that align with each opportunity.",
    icon: ClipboardCheck,
  },
  {
    title: "Interview Coach Agent",
    description: "Prepares mock questions, feedback, and answer frameworks for your next interview.",
    icon: BrainCircuit,
  },
  {
    title: "Career Roadmap Agent",
    description: "Maps a step-by-step path for promotions, pivots, or skill building.",
    icon: Compass,
  },
  {
    title: "Portfolio Review Agent",
    description: "Critiques your work samples and improves story structure for hiring teams.",
    icon: UserRoundSearch,
  },
  {
    title: "Application Tracker Agent",
    description: "Keeps your submissions, follow-ups, and outcomes organized in real time.",
    icon: Sparkles,
  },
  {
    title: "AI Supervisor Agent",
    description: "Coordinates the full system, prioritizes tasks, and ensures every agent works together.",
    icon: GraduationCap,
  },
];

export function AgentsSection() {
  async function handleAgentRun(agentTitle: string) {
    try {
      const response = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agent: agentTitle.toLowerCase().replace(/[^a-z]+/g, "-"),
          prompt: `Help me with ${agentTitle}.`,
          context: "User wants a practical next step for their job search.",
        }),
      });

      const data = await response.json();
      alert(data.reply || "Agent completed successfully.");
    } catch {
      alert("The agent could not be reached right now.");
    }
  }

  return (
    <section className="rounded-[32px] border border-white/10 bg-slate-900/70 p-5 shadow-xl shadow-slate-950/20 sm:p-8">
      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-200">Specialist agents</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">One AI teammate for every part of your job search.</h2>
        </div>
        <Button className="rounded-full bg-white text-slate-900 hover:bg-slate-100">
          Launch all agents <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {agents.map((agent, index) => {
          const Icon = agent.icon;
          return (
            <motion.div
              key={agent.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="h-full border-white/10 bg-slate-950/70 shadow-lg shadow-slate-950/20 transition hover:-translate-y-1 hover:border-cyan-400/30">
                <CardHeader>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-200">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="mt-3 text-lg text-white">{agent.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-7 text-slate-400">{agent.description}</p>
                  <button
                    onClick={() => handleAgentRun(agent.title)}
                    className="mt-4 flex items-center gap-2 text-sm text-cyan-200 transition hover:text-cyan-100"
                  >
                    <Bot className="h-4 w-4" />
                    Run now
                  </button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
