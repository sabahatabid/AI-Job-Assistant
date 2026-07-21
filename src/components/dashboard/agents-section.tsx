"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Bot, BrainCircuit, Briefcase, ClipboardCheck, Compass, FileText, GraduationCap, Sparkles, UserRoundSearch, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const agents = [
  {
    key: "resume",
    title: "Resume Agent",
    description: "Optimizes your resume for target roles with ATS-focused phrasing and impact-driven bullets.",
    icon: FileText,
  },
  {
    key: "jobs",
    title: "Job Match Agent",
    description: "Finds the strongest role matches based on skills, goals, and company fit.",
    icon: Briefcase,
  },
  {
    key: "cover-letter",
    title: "Cover Letter Agent",
    description: "Drafts personalized, persuasive cover letters that align with each opportunity.",
    icon: ClipboardCheck,
  },
  {
    key: "interview",
    title: "Interview Coach Agent",
    description: "Prepares mock questions, feedback, and answer frameworks for your next interview.",
    icon: BrainCircuit,
  },
  {
    key: "roadmap",
    title: "Career Roadmap Agent",
    description: "Maps a step-by-step path for promotions, pivots, or skill building.",
    icon: Compass,
  },
  {
    key: "portfolio",
    title: "Portfolio Review Agent",
    description: "Critiques your work samples and improves story structure for hiring teams.",
    icon: UserRoundSearch,
  },
  {
    key: "tracker",
    title: "Application Tracker Agent",
    description: "Keeps your submissions, follow-ups, and outcomes organized in real time.",
    icon: Sparkles,
  },
  {
    key: "supervisor",
    title: "AI Supervisor Agent",
    description: "Coordinates the full system, prioritizes tasks, and ensures every agent works together.",
    icon: GraduationCap,
  },
] as const;

type AgentCard = (typeof agents)[number];

export function AgentsSection() {
  const [activeAgent, setActiveAgent] = useState<AgentCard | null>(null);
  const [loadingAgent, setLoadingAgent] = useState<string | null>(null);
  const [agentResponse, setAgentResponse] = useState<string | null>(null);

  async function handleAgentRun(agent: AgentCard) {
    setActiveAgent(agent);
    setLoadingAgent(agent.key);
    setAgentResponse(null);

    try {
      const res = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agent: agent.key,
          prompt: `Help with ${agent.title}`,
          context: "User wants practical next steps.",
        }),
      });

      const data = await res.json();
      setAgentResponse(data?.reply || `${agent.title} is ready to help with your next move.`);
    } catch (error) {
      console.error(error);
      setAgentResponse(`${agent.title} could not be reached right now.`);
    } finally {
      setLoadingAgent(null);
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
                  <div className="mt-4 flex items-center justify-between gap-2 text-sm text-cyan-200">
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4" />
                      Ready to run
                    </div>
                    <Button size="sm" onClick={() => handleAgentRun(agent)} className="rounded-full bg-cyan-400/10 px-3 text-cyan-200 hover:bg-cyan-400/20">
                      {loadingAgent === agent.key ? "Running" : "Launch"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {activeAgent ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4">
          <div className="w-full max-w-lg rounded-[28px] border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-slate-950/40">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-200">Agent response</p>
                <h3 className="mt-2 text-2xl font-semibold text-white">{activeAgent.title}</h3>
              </div>
              <button onClick={() => setActiveAgent(null)} className="rounded-full border border-white/10 p-2 text-slate-300">
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-5 text-sm leading-7 text-slate-300">
              {loadingAgent === activeAgent.key ? "Working on your request…" : agentResponse || "Your agent response will appear here."}
            </p>
            <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm text-cyan-100">
              Suggested next step: review the output, save it to your notes, and apply it in your next conversation.
            </div>
            <div className="mt-6 flex justify-end">
              <Button onClick={() => setActiveAgent(null)} className="rounded-full bg-white text-slate-900 hover:bg-slate-100">
                Close
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
